import DashboardNav from "@/components/DashboardNav";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
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
