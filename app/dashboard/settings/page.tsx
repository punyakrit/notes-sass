import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/SubmitButton";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

async function getData({id}: {id: string}) {
  noStore();
  const respsone = await prisma.user.findUnique({
    where:{
      id : id
    },
    select:{
      name:true,
      email:true,
      colorScheme:true
    }
  })
  return respsone;
}


async function page() {

  const { getUser } = getKindeServerSession()
  const user = await getUser();
  const data = await getData({id: user?.id as string});

  async function postData(fromData: FormData) {
    "use server";
    await prisma.user.update({
      where:{
        id: user?.id as string
      },
      data: {
        name: fromData.get("name") as string || '',
        colorScheme: fromData.get("color") as string || '',
      }
    })
    revalidatePath('/', "layout")
  }

  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl font-semibold">Settings</h1>
          <p className="text-lg text-muted-foreground">Your Profile Settings</p>
        </div>
      </div>
      <Card>
        <form action={postData}>
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>
              Update your profile information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mt-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Your Name</Label>
                <Input
                  className=""
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name"
                  defaultValue={data?.name ?? ''}
                ></Input>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Your Email</Label>
                <Input
                  className=""
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Your email"
                  disabled
                  defaultValue={data?.email ?? ''}
                ></Input>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Colour Scheme</Label>
                <Select name="color" defaultValue={data?.colorScheme ?? ''}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Color</SelectLabel>
                      <SelectItem value="theme-green">Green</SelectItem>
                      <SelectItem value="theme-blue">Blue</SelectItem>
                      <SelectItem value="theme-oragne">Orange</SelectItem>
                      <SelectItem value="theme-red">Red</SelectItem>
                      <SelectItem value="theme-rose">Rose</SelectItem>
                      <SelectItem value="theme-purple">Purple</SelectItem>
                      <SelectItem value="theme-yellow">Yellow</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-8">
            <SubmitButton/>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default page;
