
import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ThemeToggle";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import LoginButtons from "./LoginButtons";
import { Button } from "./ui/button";
import Logout from "./Logout";

async function Navbar() {
  const {isAuthenticated} = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();


  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold">
          Notes App
        </Link>
        <div className="flex items-center gap-x-5">
          <ModeToggle />
          {isUserAuthenticated ? (
            <Logout/>
          ) : (
            <LoginButtons/>
          )}
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
