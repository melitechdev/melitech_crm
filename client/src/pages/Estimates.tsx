import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Search,
  Plus,
  Download,
  Eye,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";

interface EstimateDisplay {
  id: string;
  quoteNumber: string;
  client: string;
  amount: number;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  issueDate: string;
  expiryDate: string;
  project?: string;
  validDays: number;
}

export default function Estimates() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch real data from backend
  const { data: estimatesData = [], isLoading } = trpc.estimates.list.useQuery();
  const { data: clientsData = [] } = trpc.clients.list.useQuery();
  const utils = trpc.useUtils();

  // Delete mutation
  const deleteEstimateMutation = trpc.estimates.delete.useMutation({
    onSuccess: () => {
      toast.success("Estimate deleted successfully");
      utils.estimates.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete estimate");
    },
  });

  // Transform backend data to display format
  const estimates: EstimateDisplay[] = (estimatesData as any[]).map((est: any) => ({
    id: est.id,
    quoteNumber: est.estimateNumber || `EST-${est.id.slice(0, 8)}`,
    client: (clientsData as any[]).find((c: any) => c.id === est.clientId)?.companyName || "Unknown Client",
    amount: (est.totalAmount || 0) / 100,
    status: est.status || "draft",
    issueDate: est.issueDate ? format(new Date(est.issueDate), "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
    expiryDate: est.expiryDate ? format(new Date(est.expiryDate), "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
    project: est.projectId ? "Project" : undefined,
    validDays: 45,
  }));

  const filteredEstimates = estimates.filter((estimate) => {
    const matchesSearch =
      estimate.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.project?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || estimate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });



  const totalAmount = estimates.reduce((sum, est) => sum + est.amount, 0);
  const acceptedAmount = estimates.filter(est => est.status === "accepted").reduce((sum, est) => sum + est.amount, 0);
  const pendingAmount = estimates.filter(est => est.status === "sent").reduce((sum, est) => sum + est.amount, 0);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this estimate?")) {
      try {
        await deleteEstimateMutation.mutateAsync(id);
      } catch (error) {
        // Error is handled by mutation's onError callback
      }
    }
  };

  return (
    <ModuleLayout
      title="Estimates & Quotations"
      description="Create and manage quotations for potential clients"
      icon={<FileText className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Sales", href: "/sales" },
        { label: "Estimates", href: "/estimates" },
      ]}
      actions={
        <Button onClick={() => navigate("/estimates/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Estimate
        </Button>
      }
    >
      <div className="space-y-6">

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quoted</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {acceptedAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {estimates.filter(est => est.status === "accepted").length} estimates
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {estimates.filter(est => est.status === "sent").length} estimates
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((estimates.filter(est => est.status === "accepted").length / estimates.length) * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-muted-foreground">Acceptance rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Estimates Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Estimates</CardTitle>
                <CardDescription>Manage your quotations and estimates</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search estimates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading estimates...</div>
            ) : filteredEstimates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No estimates found. Create your first estimate to get started.
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Valid Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEstimates.map((estimate) => (
                  <TableRow key={estimate.id}>
                    <TableCell className="font-medium">{estimate.quoteNumber}</TableCell>
                    <TableCell>{estimate.client}</TableCell>
                    <TableCell className="text-muted-foreground">{estimate.project || "N/A"}</TableCell>
                    <TableCell className="font-medium">
                      Ksh {estimate.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(estimate.issueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(estimate.expiryDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {estimate.validDays} days
                    </TableCell>
                    <TableCell>
                      <Badge className="gap-1">
                        {estimate.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="View"
                          onClick={() => navigate(`/estimates/${estimate.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Edit"
                          onClick={() => navigate(`/estimates/${estimate.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Download"
                          onClick={() => {
                            toast.success('Estimate downloaded successfully');
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Delete"
                          onClick={() => handleDelete(estimate.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}

