import React, { useState } from "react";
import { useMaterialTailwindController, setOpenRightSidebar } from "@/contexts/MaterialTailwindContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
} from "lucide-react";

interface RecentActivity {
  id: string;
  type: "create" | "update" | "delete" | "payment";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

const recentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "create",
    title: "New Client",
    description: "Acme Corporation added",
    timestamp: "2 hours ago",
    icon: <Users className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    description: "Invoice INV-2024-001 paid",
    timestamp: "4 hours ago",
    icon: <DollarSign className="w-4 h-4" />,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "3",
    type: "create",
    title: "New Project",
    description: "Website Redesign started",
    timestamp: "1 day ago",
    icon: <FileText className="w-4 h-4" />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "4",
    type: "update",
    title: "Invoice Updated",
    description: "INV-2024-002 status changed",
    timestamp: "2 days ago",
    icon: <AlertCircle className="w-4 h-4" />,
    color: "bg-yellow-100 text-yellow-600",
  },
];

const quickStats = [
  {
    label: "Total Revenue",
    value: "KES 2.4M",
    change: "+12.5%",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: "Active Projects",
    value: "8",
    change: "+2",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Total Clients",
    value: "24",
    change: "+3",
    icon: <Users className="w-5 h-5" />,
  },
];

export function RightSidebar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openRightSidebar } = controller;

  return (
    <>
      {openRightSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpenRightSidebar(dispatch, false)}
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-screen w-80 transition-transform duration-300",
          "border-l border-slate-200 bg-white shadow-lg",
          openRightSidebar ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
            <button
              onClick={() => setOpenRightSidebar(dispatch, false)}
              className="p-1 hover:bg-slate-100 rounded transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Today's Stats</h3>
                {quickStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600 font-medium">{stat.label}</p>
                        <p className="text-lg font-bold text-slate-900 mt-1">{stat.value}</p>
                      </div>
                      <div className="text-slate-400">{stat.icon}</div>
                    </div>
                    <p className="text-xs text-green-600 font-medium mt-2">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
                <Button className="w-full justify-start transition-all duration-200 hover:scale-105 hover:shadow-md" variant="outline">
                  <Plus className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
                  New Invoice
                </Button>
                <Button className="w-full justify-start transition-all duration-200 hover:scale-105 hover:shadow-md" variant="outline">
                  <Plus className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
                  New Client
                </Button>
                <Button className="w-full justify-start transition-all duration-200 hover:scale-105 hover:shadow-md" variant="outline">
                  <Plus className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
                  New Project
                </Button>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
                <div className="space-y-2">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("p-2 rounded-lg", activity.color)}>
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-slate-600 truncate">
                            {activity.description}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}

