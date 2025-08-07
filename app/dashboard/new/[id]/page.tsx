import SubmitButton from '@/components/SubmitButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { prisma } from '@/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {  unstable_noStore as noStore } from "next/cache";

import React from 'react'

async function getData({userId, noteId}: {userId: string, noteId: string}) {
  noStore();
    const data = await prisma.notes.findUnique({
        where: {
            id:noteId,
            userId: userId 
        },
        select:{
            title: true,
            description: true,
            id: true
        }
    })
    return data;
}

async function page({params}: any) {
    const { getUser } = await getKindeServerSession();
    const user = await getUser();

    const param = await params
    const data = await getData({userId: user?.id as string, noteId: await(param.id)}); 

    async function saveData(formData: FormData) {
        "use server";
        if (!user) {
            redirect("/dashboard");
        }
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;

        await prisma.notes.update({
            where: {
                id: await(param.id),
                userId: user?.id as string,
            },
            data: {
                title,
                description,
            },
        });
        revalidatePath("/dashboard");
        return redirect("/dashboard");
    }

  return (
    <div>
      <Card>
        <form action={saveData}>
          <CardHeader>
            <CardTitle>Edit Note</CardTitle>
            <CardDescription>
              Right here you can edit your note
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
                defaultValue={data?.title}
              ></Input>
            </div>

            <div className="gap-y-2 flex flex-col ">
              <Label>Description</Label>
              <Textarea
                required
                name="description"
                className="resize-none"
                placeholder="Description for your note"
                defaultValue={data?.description}
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
  )
}

export default page
