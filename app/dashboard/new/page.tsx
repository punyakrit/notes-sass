import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import {  unstable_noStore as noStore } from "next/cache";


async function page() {
  noStore();
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  async function postData(formData: FormData) {
    "use server";
    if (!user) {
      redirect("/dashboard");
    }
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.notes.create({
      data: {
        title,
        description,
        userId: user?.id as string,
      },
    });
    return redirect("/dashboard");
  }

  return (
    <div>
      <Card>
        <form action={postData}>
          <CardHeader>
            <CardTitle>New Note</CardTitle>
            <CardDescription>
              Right here you can create a new note
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 mt-4">
            <div className="gap-y-2 flex flex-col ">
              <Label>Title</Label>
              <Input
                required
                type="text"
                name="title"
                placeholder="Title for your note"
              ></Input>
            </div>

            <div className="gap-y-2 flex flex-col ">
              <Label>Description</Label>
              <Textarea
                required
                name="description"
                className="resize-none"
                placeholder="Description for your note"
              ></Textarea>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-6">
            <Button asChild variant={"destructive"}>
              <Link href={"/dashboard"}>Cancel</Link>
            </Button>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default page;
