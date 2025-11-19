import React from "react";
import { MaterialTailwindControllerProvider } from "@/contexts/MaterialTailwindContext";
import { Sidenav } from "./Sidenav";
import { DashboardNavbar } from "./DashboardNavbar";
import { RightSidebar } from "./RightSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <MaterialTailwindControllerProvider>
      <div className="flex h-screen bg-slate-50">
        {/* Left Sidebar */}
        <Sidenav />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden xl:ml-72">
          {/* Top Navbar */}
          <DashboardNavbar />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </MaterialTailwindControllerProvider>
  );
}

