import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ThemeToggle";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import LoginButtons from "./LoginButtons";
import { Button } from "./ui/button";
import Logout from "./Logout";
import UserNav from "./UserNav";

async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold ">
          <span className="text-primary">Notes</span>
          App
        </Link>
        <div className="flex items-center gap-x-5">
          <ModeToggle />
          {isUserAuthenticated ? (
            <UserNav
              name={user?.given_name as string}
              email={user?.email as string}
              image={user?.picture as string}
            />
          ) : (
            <LoginButtons />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
