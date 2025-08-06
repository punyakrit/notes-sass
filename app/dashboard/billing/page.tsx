import { SubmitButtonWithState } from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getStripeSession } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const featureItem = [
  {
    title: "Unlimited Notes",
  },
  {
    title: "Customizable Themes",
  },
  {
    title: "Priority Support",
  },
  {
    title: "Offline Access",
  },
  {
    title: "Cross-Device Sync",
  },
  {
    title: "Advanced Search",
  },
];

async function getData(userId: string) {
  const response = await prisma.subscription.findUnique({
    where:{
      userId: userId
    },
    select:{
      status: true,
      user:{
        select:{
          stripeCustomerId: true,

        }
      }
    }
  })
  return response
}


async function page() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();
  const userId = user?.id as string;

   if (!user || !user.id) {
    return redirect("/");
  }
  const data = await getData(userId);


  async function buyNow() {
    "use server"

    const dbUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new Error("User not found");
    }

    const subscriptionUrl = await getStripeSession({
      customerId : dbUser.stripeCustomerId as string,
      priceId: process.env.STRIPE_PRICE_ID as string,
      domainUrl: "http://localhost:3000"
    })
    return redirect(subscriptionUrl);
  }


  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="flex flex-col">
        <CardContent className="py-8">
          <div>
            <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary">
              Monthly
            </h3>
          </div>
          <div className="mt-4 flex items-baseline text-6xl font-extrabold">
            $30 <span className="ml-1 text-2xl text-muted-foreground">/mo</span>
          </div>

          <p className="text-lg mt-5 text-muted-foreground">
            Write unlimited notes for 30$ per moneth
          </p>
        </CardContent>
        <div className="flex-1 flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6">
          <ul className="space-y-4">
            {featureItem.map((item, index) => (
              <li key={index} className="flex items-center ">
                <div className="flex shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <p className="ml-3 text-base">{item.title}</p>
              </li>
            ))}
          </ul>
          <form action={buyNow}>
            <SubmitButtonWithState />
          </form>
        </div>
      </Card>
    </div>
  );
}

export default page;
