import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { prisma } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Edit, EditIcon, FileIcon, Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import {  unstable_noStore as noStore } from "next/cache";

async function getData(userId: string) {
  noStore();
  // const data = await prisma.notes.findMany({
  //   where: {
  //     userId: userId,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });
  // return data;

  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      notes: true,
      subscription: {
        select: {
          status: true,
        },
      },
    },
  });
  return data;
}

async function page() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  const data = await getData(user?.id as string);

  async function deleteNote(formData: FormData) {
    "use server";
    if (!user) {
      redirect("/dashboard");
    }
    const noteId = formData.get("noteId") as string;

    await prisma.notes.delete({
      where: {
        id: noteId,
        userId: user.id,
      },
    });
    revalidatePath("/dashboard");
  }

  return (
    <div className="grid gap-8 items-start ">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl font-semibold">Your Notes</h1>
          <p className="text-lg text-muted-foreground">
            Here you can create and see new notes{" "}
          </p>
        </div>
        {data?.subscription?.status === "active" ? (
          <Button asChild>
            <Link href={"/dashboard/new"}>Create a new note</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href={"/dashboard/billing"}>Create a new note</Link>
          </Button>
        )}
      </div>
      {data?.notes.length == 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center  rounded-md border border-dashed  p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <FileIcon className="w-10 h-10 text-primary" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">
            You dont have any notes created
          </h2>
          <p className="text-muted-foreground mb-8 mt-2 text-center text-sm leading-6 max-w-sm mx-auto">
            You currently dont have any notes please create some notes to see
            them here
          </p>
          {data?.subscription?.status === "active" ? (
            <Button asChild>
              <Link href={"/dashboard/new"}>Create a new note</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={"/dashboard/billing"}>Create a new note</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data?.notes.map((note) => (
            <Card
              key={note.id}
              className="flex flex-row justify-between items-center p-4"
            >
              <div className="flex flex-col">
                <h2 className="font-semibold text-xl text-primary">
                  {note.title}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                  }).format(new Date(note.createdAt))}
                </p>
              </div>
              <div className="flex gap-4">
                <Link href={`/dashboard/new/${note.id}`}>
                  <Button variant={"outline"} size={"icon"}>
                    <EditIcon className="w-4 h-4" />
                  </Button>
                </Link>

                <form action={deleteNote}>
                  <input type="hidden" name="noteId" value={note.id} />
                  <Button variant={"destructive"} size={"icon"} type="submit">
                    <Trash className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default page;
