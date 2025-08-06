import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const body = await req.text();

    const signature = req.headers.get("Stripe-Signature") || "";

    let event : Stripe.Event;

    try{
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    }catch (error) {   
        return new Response("Webhook Error", {
            status: 400,
        });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if(event.type === "checkout.session.completed"){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );
        const customerId  = session.customer as string;

        const user = await prisma.user.findUnique({
            where: {
                stripeCustomerId: customerId,
            },
            select: {
                id: true,
            },
        });

        if(!user) {
            return new Response("User not found", {
                status: 404,
            });
        }

        await prisma.subscription.create({
            data: {
                stripeSubscriptionId: subscription.id,
                userId: user.id,
                currentPeriodStart: subscription.items.data[0].current_period_start ,
                currentPeriodEnd: subscription.items.data[0].current_period_end,    
                status: subscription.status,
                planId: subscription.items.data[0].price.id,
                interval: subscription.items.data[0].plan.interval as string,
            }
        })
    }

    if(event.type === "invoice.payment_succeeded"){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        await prisma.subscription.update({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                planId: subscription.items.data[0].price.id,
                currentPeriodStart: subscription.items.data[0].current_period_start,
                currentPeriodEnd: subscription.items.data[0].current_period_end,
                status: subscription.status,
            }
        })
            
    }

    return new Response( null, {
        status: 200,
    });
}