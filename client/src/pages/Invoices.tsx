import { useState } from "react";
import { useLocation } from "wouter";
import { ModuleLayout } from "@/components/ModuleLayout";
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
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";

interface InvoiceDisplay {
  id: string;
  invoiceNumber: string;
  client: string;
  clientEmail?: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  issueDate: string;
  dueDate: string;
  project?: string;
}

export default function Invoices() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch real data from backend
  const { data: invoicesData = [], isLoading } = trpc.invoices.list.useQuery();
  const { data: clientsData = [] } = trpc.clients.list.useQuery();
  const utils = trpc.useUtils();
  
  // Delete mutation - moved to component level
  const deleteInvoiceMutation = trpc.invoices.delete.useMutation({
    onSuccess: () => {
      utils.invoices.list.invalidate();
      toast.success("Invoice deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete invoice");
    },
  });

  // Transform backend data to display format
  const invoices: InvoiceDisplay[] = (invoicesData as any[]).map((inv: any) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber || `INV-${inv.id.slice(0, 8)}`,
    client: (clientsData as any[]).find((c: any) => c.id === inv.clientId)?.companyName || "Unknown Client",
    clientEmail: (clientsData as any[]).find((c: any) => c.id === inv.clientId)?.email,
    amount: (inv.totalAmount || 0) / 100,
    status: inv.status || "draft",
    issueDate: inv.issueDate ? format(new Date(inv.issueDate), "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
    dueDate: inv.dueDate ? format(new Date(inv.dueDate), "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
    project: inv.projectId ? "Project" : undefined,
  }));

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.project?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "overdue":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const stats = [
    {
      title: "Total Invoiced",
      value: `Ksh ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}`,
      description: "All time",
      icon: DollarSign,
    },
    {
      title: "Paid",
      value: `Ksh ${invoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + inv.amount, 0)
        .toLocaleString()}`,
      description: `${invoices.filter((inv) => inv.status === "paid").length} invoices`,
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      value: `Ksh ${invoices
        .filter((inv) => inv.status === "pending")
        .reduce((sum, inv) => sum + inv.amount, 0)
        .toLocaleString()}`,
      description: `${invoices.filter((inv) => inv.status === "pending").length} invoices`,
      icon: Clock,
    },
    {
      title: "Overdue",
      value: `Ksh ${invoices
        .filter((inv) => inv.status === "overdue")
        .reduce((sum, inv) => sum + inv.amount, 0)
        .toLocaleString()}`,
      description: `${invoices.filter((inv) => inv.status === "overdue").length} invoices`,
      icon: AlertCircle,
    },
  ];

  // Action handlers
  const handleView = (id: string) => {
    navigate(`/invoices/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/invoices/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoiceMutation.mutate(id);
    }
  };

  return (
    <ModuleLayout
      title="Invoices"
      description="Create and manage invoices"
      icon={<FileText className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Accounting", href: "/accounting" },
        { label: "Invoices", href: "/invoices" },
      ]}
      actions={
        <Button onClick={() => navigate("/invoices/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>Manage and track all your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading invoices...</div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No invoices found. Create your first invoice to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>Ksh {invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>{invoice.issueDate}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1">{invoice.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(invoice.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(invoice.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(invoice.id)}
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

