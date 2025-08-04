import DashboardNav from "@/components/DashboardNav";
import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import {prisma} from "@/lib/db";

async function getData({
  email,
  id,
  firstName,
  lastName,
  profileImage,
}: {
  email: string;
  id: string;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  profileImage: string | undefined | null;
}) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    const name = `${firstName ?? ""} ${lastName ?? ""}`;
    await prisma.user.create({
      data: {
        id,
        email,
        name: name,
      },
    });
  }
}

async function layout({ children }: { children: React.ReactNode }) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) {
    return redirect("/");
  }
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }
  await getData({
    email: user.email as string,
    id: user.id as string,
    firstName: user.given_name,
    lastName: user.family_name,
    profileImage: user.picture,
  });
  return (
    <div className="flex flex-col space-y-6 mt-10">
      <div className="grid container mx-auto flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden md:flex w-[200px] flex-col ">
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default layout;
