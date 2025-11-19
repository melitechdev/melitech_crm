import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Users,
  FolderKanban,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Clock,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";

export default function Dashboard() {
  const [, navigate] = useLocation();

  const stats = [
    {
      title: "Total Revenue",
      value: "Ksh 4,350,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "This month",
    },
    {
      title: "Active Projects",
      value: "2",
      change: "+2",
      trend: "up",
      icon: FolderKanban,
      description: "In progress",
    },
    {
      title: "Total Clients",
      value: "3",
      change: "+1",
      trend: "up",
      icon: Users,
      description: "Active clients",
    },
    {
      title: "Pending Invoices",
      value: "0",
      change: "0",
      trend: "neutral",
      icon: FileText,
      description: "Awaiting payment",
    },
  ];

  const recentProjects = [
    {
      name: "Website Redesign",
      client: "Acme Corporation",
      progress: 65,
      status: "active",
      dueDate: "Apr 30, 2024",
    },
    {
      name: "Mobile App Development",
      client: "TechStart Solutions",
      progress: 40,
      status: "active",
      dueDate: "Jun 30, 2024",
    },
    {
      name: "CRM System Implementation",
      client: "Global Enterprises Ltd",
      progress: 0,
      status: "planning",
      dueDate: "Aug 31, 2024",
    },
  ];

  const recentActivity = [
    {
      action: "Project created",
      details: "Website Redesign for Acme Corporation",
      time: "2 hours ago",
      icon: FolderKanban,
    },
    {
      action: "Client added",
      details: "TechStart Solutions",
      time: "5 hours ago",
      icon: Users,
    },
    {
      action: "Invoice sent",
      details: "INV-2024-001 to Acme Corporation",
      time: "1 day ago",
      icon: FileText,
    },
    {
      action: "Payment received",
      details: "Ksh 500,000 from TechStart Solutions",
      time: "2 days ago",
      icon: DollarSign,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your business.
            </p>
          </div>
          <Button onClick={() => navigate("/projects")}>
            <FolderKanban className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={`flex items-center ${
                      stat.trend === "up" ? "text-green-500" :
                      stat.trend === "down" ? "text-red-500" :
                      ""
                    }`}>
                      {stat.trend === "up" && <TrendingUp className="mr-1 h-3 w-3" />}
                      {stat.trend === "down" && <TrendingDown className="mr-1 h-3 w-3" />}
                      {stat.change}
                    </span>
                    <span>{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Your active and upcoming projects</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.name} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.client}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {project.dueDate}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/clients")}>
                <Users className="h-6 w-6" />
                <span>Add Client</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/projects")}>
                <FolderKanban className="h-6 w-6" />
                <span>New Project</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/invoices")}>
                <FileText className="h-6 w-6" />
                <span>Create Invoice</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/estimates")}>
                <FileSpreadsheet className="h-6 w-6" />
                <span>New Estimate</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => navigate("/receipts")}>
                <Receipt className="h-6 w-6" />
                <span>New Receipt</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

