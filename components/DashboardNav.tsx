"use client";
import { CreditCard, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { navItems } from "./UserNav";



function DashboardNav() {
  const pathName = usePathname();

  return (
    <nav className="grid itemstart gap-2">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <span
            className={`flex items-center group rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition duration-300 ${
              pathName === item.href ? "bg-accent" : "bg-transparent"
            }`}
          >
            <item.icon className="mr-2 h-4 w-4 text-primary" />
            {item.name}
          </span>
        </Link>
      ))}
    </nav>
  );
}

export default DashboardNav;
