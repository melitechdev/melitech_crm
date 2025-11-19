import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Receipt,
  DollarSign,
  Package,
  Briefcase,
  CreditCard,
  BarChart3,
  UserCog,
  TrendingUp,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  stats?: {
    label: string;
    value: string | number;
  };
}

export default function DashboardHome() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    activeClients: 0,
    pendingInvoices: 0,
    monthlyRevenue: 0,
    totalProducts: 0,
    totalServices: 0,
    totalEmployees: 0,
  });

  // Fetch dashboard metrics
  const { data: dashboardMetrics } = trpc.dashboard.metrics.useQuery();

  // Update metrics when data loads
  useEffect(() => {
    if (dashboardMetrics) {
      setMetrics({
        totalProjects: dashboardMetrics.totalProjects || 0,
        activeClients: dashboardMetrics.activeClients || 0,
        pendingInvoices: dashboardMetrics.pendingInvoices || 0,
        monthlyRevenue: dashboardMetrics.monthlyRevenue || 0,
        totalProducts: dashboardMetrics.totalProducts || 0,
        totalServices: dashboardMetrics.totalServices || 0,
        totalEmployees: dashboardMetrics.totalEmployees || 0,
      });
    }
  }, [dashboardMetrics]);

  const handleCardClick = (href: string) => {
    navigate(href);
  };

  // Define quick actions with dynamic metrics
  const quickActions: QuickActionCard[] = [
    {
      id: "projects",
      title: "Projects",
      description: "Manage and track all your projects",
      icon: <FolderKanban className="w-8 h-8" />,
      href: "/projects",
      color: "from-blue-500 to-blue-600",
      stats: { label: "Total Projects", value: metrics.totalProjects },
    },
    {
      id: "clients",
      title: "Clients",
      description: "Client relationship management",
      icon: <Users className="w-8 h-8" />,
      href: "/clients",
      color: "from-green-500 to-green-600",
      stats: { label: "Active Clients", value: metrics.activeClients },
    },
    {
      id: "invoices",
      title: "Invoices",
      description: "Create and manage invoices",
      icon: <FileText className="w-8 h-8" />,
      href: "/invoices",
      color: "from-purple-500 to-purple-600",
      stats: { label: "Pending Invoices", value: metrics.pendingInvoices },
    },
    {
      id: "estimates",
      title: "Estimates",
      description: "Generate quotations and estimates",
      icon: <Receipt className="w-8 h-8" />,
      href: "/estimates",
      color: "from-orange-500 to-orange-600",
      stats: { label: "Pending Estimates", value: 0 },
    },
    {
      id: "payments",
      title: "Payments",
      description: "Track payments and transactions",
      icon: <DollarSign className="w-8 h-8" />,
      href: "/payments",
      color: "from-green-500 to-emerald-600",
      stats: { label: "This Month", value: `KES ${metrics.monthlyRevenue.toLocaleString()}` },
    },
    {
      id: "products",
      title: "Products",
      description: "Product catalog management",
      icon: <Package className="w-8 h-8" />,
      href: "/products",
      color: "from-cyan-500 to-cyan-600",
      stats: { label: "Total Products", value: metrics.totalProducts },
    },
    {
      id: "services",
      title: "Services",
      description: "Service offerings catalog",
      icon: <Briefcase className="w-8 h-8" />,
      href: "/services",
      color: "from-indigo-500 to-indigo-600",
      stats: { label: "Total Services", value: metrics.totalServices },
    },
    {
      id: "accounting",
      title: "Accounting",
      description: "Financial management and reports",
      icon: <CreditCard className="w-8 h-8" />,
      href: "/accounting",
      color: "from-pink-500 to-pink-600",
      stats: { label: "Accounts", value: 0 },
    },
    {
      id: "reports",
      title: "Reports",
      description: "Analytics and insights",
      icon: <BarChart3 className="w-8 h-8" />,
      href: "/reports",
      color: "from-amber-500 to-amber-600",
      stats: { label: "Reports", value: 0 },
    },
    {
      id: "hr",
      title: "HR",
      description: "Human resources management",
      icon: <UserCog className="w-8 h-8" />,
      href: "/hr",
      color: "from-red-500 to-red-600",
      stats: { label: "Employees", value: metrics.totalEmployees },
    },
  ];

  const overviewMetrics = [
    {
      title: "Total Projects",
      value: metrics.totalProjects.toString(),
      description: "Get started by creating your first project",
      icon: <FolderKanban className="w-5 h-5" />,
      color: "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-l-blue-400",
      href: "/projects",
    },
    {
      title: "Active Clients",
      value: metrics.activeClients.toString(),
      description: "Add your first client",
      icon: <Users className="w-5 h-5" />,
      color: "border-l-green-500 bg-green-50 dark:bg-green-900/20 dark:border-l-green-400",
      href: "/clients",
    },
    {
      title: "Pending Invoices",
      value: metrics.pendingInvoices.toString(),
      description: "No pending invoices",
      icon: <FileText className="w-5 h-5" />,
      color: "border-l-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-l-purple-400",
      href: "/invoices",
    },
    {
      title: "Revenue",
      value: `KES ${metrics.monthlyRevenue.toLocaleString()}`,
      description: "This month",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "border-l-green-500 bg-green-50 dark:bg-green-900/20 dark:border-l-green-400",
      href: "/accounting",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Your CRM Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Manage your clients, projects, invoices, and more from one powerful platform
          </p>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleCardClick(action.href)}
              className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-left transition-all hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600"
            >
              {/* Background gradient on hover */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-5",
                  `bg-gradient-to-br ${action.color}`
                )}
              />

              {/* Content */}
              <div className="relative space-y-4">
                {/* Icon */}
                <div
                  className={cn(
                    "inline-flex p-3 rounded-lg text-white",
                    `bg-gradient-to-br ${action.color}`
                  )}
                >
                  {action.icon}
                </div>

                {/* Title and Description */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{action.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{action.description}</p>
                </div>

                {/* Stats if available */}
                {action.stats && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{action.stats.label}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {action.stats.value}
                    </p>
                  </div>
                )}

                {/* Arrow Icon */}
                <div className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Overview Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewMetrics.map((metric, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(metric.href)}
                className={cn(
                  "group relative overflow-hidden rounded-lg border-l-4 p-6 text-left transition-all hover:shadow-lg cursor-pointer",
                  metric.color
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {metric.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {metric.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{metric.description}</p>
                  </div>
                  <div className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    {metric.icon}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Latest Updates</CardTitle>
              <CardDescription>
                Recent changes and activities in your CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      No recent activity
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Start by creating your first project or client
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Tips */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Your First Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Start building your client database by adding new clients to your CRM.
                </p>
                <Button
                  onClick={() => handleCardClick("/clients")}
                  className="w-full"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Your First Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Organize your work by creating projects and assigning tasks to your team.
                </p>
                <Button
                  onClick={() => handleCardClick("/projects/create")}
                  className="w-full"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generate Your First Invoice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Create professional invoices and track payments from your clients.
                </p>
                <Button
                  onClick={() => handleCardClick("/invoices")}
                  className="w-full"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

