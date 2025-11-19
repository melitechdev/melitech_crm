import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  FileText,
  FolderOpen,
  Download,
  Eye,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useLocation } from "wouter";

export default function ClientPortal() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock client data
  const clientData = {
    name: "Acme Corporation",
    email: "john@acmecorp.com",
    phone: "+254 712 345 678",
    accountManager: "Sarah Johnson",
  };

  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      status: "active",
      progress: 65,
      startDate: "Jan 15, 2024",
      endDate: "Apr 30, 2024",
      budget: 500000,
      spent: 325000,
    },
    {
      id: 2,
      name: "Data Migration",
      status: "on-hold",
      progress: 30,
      startDate: "Mar 01, 2024",
      endDate: "May 31, 2024",
      budget: 350000,
      spent: 105000,
    },
  ];

  const invoices = [
    {
      id: "INV-2024-001",
      date: "Feb 15, 2024",
      amount: 250000,
      status: "paid",
      dueDate: "Mar 15, 2024",
    },
    {
      id: "INV-2024-002",
      date: "Mar 10, 2024",
      amount: 175000,
      status: "pending",
      dueDate: "Apr 10, 2024",
    },
  ];

  const documents = [
    {
      id: 1,
      name: "Project Proposal - Website Redesign.pdf",
      type: "Proposal",
      date: "Jan 10, 2024",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Contract Agreement.pdf",
      type: "Contract",
      date: "Jan 12, 2024",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Invoice INV-2024-001.pdf",
      type: "Invoice",
      date: "Feb 15, 2024",
      size: "856 KB",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-auto" />}
            <div>
              <h1 className="text-xl font-bold">{APP_TITLE}</h1>
              <p className="text-sm text-muted-foreground">Client Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                AC
              </div>
              <div className="text-sm">
                <p className="font-medium">{clientData.name}</p>
                <p className="text-muted-foreground">{clientData.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {clientData.name}!</h2>
          <p className="text-muted-foreground">
            Track your projects, view invoices, and manage documents all in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh 430,000</div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Ksh 175,000 due</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Available to download</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>
                        {project.startDate} - {project.endDate}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        project.status === "active"
                          ? "default"
                          : project.status === "on-hold"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {project.status === "active" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {project.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-lg font-semibold">
                        Ksh {project.budget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Spent</p>
                      <p className="text-lg font-semibold">
                        Ksh {project.spent.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Project Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Your Invoices</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-3">
              {invoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Issued: {invoice.date} • Due: {invoice.dueDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          Ksh {invoice.amount.toLocaleString()}
                        </p>
                        <Badge
                          variant={invoice.status === "paid" ? "default" : "secondary"}
                        >
                          {invoice.status === "paid" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {invoice.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status === "pending" && (
                          <Button size="sm">Pay Now</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Your Documents</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-3">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.date} • {doc.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Your account details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                    <p className="text-lg">{clientData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-lg">{clientData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-lg">{clientData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Manager</p>
                    <p className="text-lg">{clientData.accountManager}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

