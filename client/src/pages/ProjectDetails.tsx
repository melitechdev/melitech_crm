import { useParams, useLocation } from "wouter";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Building2,
  FileText,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { logDelete } from "@/lib/activityLog";

export default function ProjectDetails() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const projectId = params.id!;

  const { data: project, isLoading } = trpc.projects.getById.useQuery(projectId);
  const { data: client } = trpc.clients.getById.useQuery(
    project?.clientId || "",
    { enabled: !!project?.clientId }
  );
  const { data: tasks = [] } = trpc.projects.tasks.list.useQuery({ projectId });
  const { data: invoices = [] } = trpc.invoices.byClient.useQuery(
    { clientId: project?.clientId || "" },
    { enabled: !!project?.clientId }
  );
  const { data: estimates = [] } = trpc.estimates.byClient.useQuery(
    { clientId: project?.clientId || "" },
    { enabled: !!project?.clientId }
  );
  const utils = trpc.useUtils();
  const deleteProjectMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
      toast.success(`Project "${project?.name}" has been deleted`);
      logDelete("Projects", projectId, project?.name || "Unknown");
      navigate("/projects");
    },
    onError: (error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    },
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProjectMutation.mutateAsync(projectId);
      setIsDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading project...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Project not found</p>
          <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "planning":
        return "bg-blue-500";
      case "on_hold":
        return "bg-yellow-500";
      case "completed":
        return "bg-gray-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount / 100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground">{project.projectNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace("_", " ").toUpperCase()}
            </Badge>
            <Badge variant={getPriorityColor(project.priority)}>
              {project.priority.toUpperCase()}
            </Badge>
            <Button onClick={() => navigate(`/projects/${projectId}/edit`)} size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteOpen(true)} size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{client?.companyName || "N/A"}</div>
              <p className="text-xs text-muted-foreground">{client?.contactPerson}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {project.budget ? formatCurrency(project.budget) : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                Spent: {formatCurrency(project.actualCost || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.progress}%</div>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {project.startDate
                  ? format(new Date(project.startDate), "MMM dd, yyyy")
                  : "Not started"}
              </div>
              <p className="text-xs text-muted-foreground">
                {project.endDate
                  ? `Due: ${format(new Date(project.endDate), "MMM dd, yyyy")}`
                  : "No deadline"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
            <TabsTrigger value="estimates">Estimates ({estimates.length})</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {project.description || "No description provided"}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Project Manager</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.projectManager || "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Assigned To</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.assignedTo || "Not assigned"}
                    </p>
                  </div>
                </div>

                {project.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{project.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Tasks</CardTitle>
                <CardDescription>Manage and track project tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No tasks yet. Create your first task to get started.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((task: any) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {task.status === "completed" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : task.status === "blocked" ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-blue-500" />
                          )}
                          <div>
                            <p className="font-medium">{task.title}</p>
                            {task.description && (
                              <p className="text-sm text-muted-foreground">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">{task.status.replace("_", " ")}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>Client invoices related to this project</CardDescription>
                  </div>
                  <Button onClick={() => navigate("/invoices")}>
                    <FileText className="h-4 w-4 mr-2" />
                    View All Invoices
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No invoices yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {invoices.map((invoice: any) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent"
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                      >
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">{invoice.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(invoice.total)}</p>
                          <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estimates" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Estimates</CardTitle>
                    <CardDescription>Quotations for this project</CardDescription>
                  </div>
                  <Button onClick={() => navigate("/estimates")}>
                    <Receipt className="h-4 w-4 mr-2" />
                    View All Estimates
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {estimates.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No estimates yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {estimates.map((estimate: any) => (
                      <div
                        key={estimate.id}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent"
                        onClick={() => navigate(`/estimates/${estimate.id}`)}
                      >
                        <div>
                          <p className="font-medium">{estimate.estimateNumber}</p>
                          <p className="text-sm text-muted-foreground">{estimate.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(estimate.total)}</p>
                          <Badge
                            variant={estimate.status === "accepted" ? "default" : "secondary"}
                          >
                            {estimate.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Files</CardTitle>
                <CardDescription>Documents and attachments</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  File management coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone. All associated tasks, invoices, and estimates will be marked as deleted."
        itemName={project?.name}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isDangerous={true}
      />
    </DashboardLayout>
  );
}

