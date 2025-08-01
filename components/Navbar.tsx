"use client"
import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

function Navbar() {
  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold">
          Notes App
        </Link>
        <div className="flex items-center gap-x-5">
          <ModeToggle />
          <div className="flex items-center gap-x-5">
            <LoginLink>
              <Button className=""> Sign In</Button>
            </LoginLink>
            <RegisterLink>
              <Button variant={"secondary"} className="">
                Sign Up
              </Button>
            </RegisterLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
