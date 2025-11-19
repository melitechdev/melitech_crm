import { ModuleLayout } from "@/components/ModuleLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileText, Briefcase, Receipt, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function Sales() {
  const [, navigate] = useLocation();

  const salesModules = [
    {
      title: "Estimates",
      description: "Create and manage quotations for clients",
      icon: FileText,
      href: "/estimates",
      stats: { label: "Total Estimates", value: "0" },
    },
    {
      title: "Opportunities",
      description: "Track and manage sales opportunities",
      icon: Briefcase,
      href: "/opportunities",
      stats: { label: "Active Opportunities", value: "0" },
    },
    {
      title: "Receipts",
      description: "Manage payment receipts and confirmations",
      icon: Receipt,
      href: "/receipts",
      stats: { label: "Total Receipts", value: "0" },
    },
  ];

  return (
    <ModuleLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Sales", href: "/sales" },
      ]}
      title="Sales"
      description="Manage estimates, opportunities, and receipts"
      icon={<TrendingUp className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button onClick={() => navigate("/estimates/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            New Estimate
          </Button>
          <Button onClick={() => navigate("/opportunities/create")} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Opportunity
          </Button>
          <Button onClick={() => navigate("/receipts/create")} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Receipt
          </Button>
        </div>

        {/* Sales Modules Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {salesModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.title}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(module.href)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription className="mt-1">{module.description}</CardDescription>
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{module.stats.value}</span>
                    <span className="text-sm text-muted-foreground">{module.stats.label}</span>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(module.href);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    View {module.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Activity</CardTitle>
            <CardDescription>Latest estimates, opportunities, and receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity yet. Start by creating an estimate or opportunity.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}

