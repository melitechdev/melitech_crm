import { useState } from "react";
import { useLocation } from "wouter";
import { ModuleLayout } from "@/components/ModuleLayout";
import ActionButtons from "@/components/ActionButtons";
import { DeleteModal, EmailModal } from "@/components/ActionModals";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { DatePicker } from "@/components/DatePicker";
import {
  Receipt,
  Search,
  Plus,
  DollarSign,
  CheckCircle2,
  Calendar,
  CreditCard,
  Smartphone,
  Banknote,
  Building2,
  FileText,
  Download,
  Mail,
  Printer,
  Filter,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";

interface ReceiptRecord {
  id: string;
  receiptNumber: string;
  client: string;
  clientEmail?: string;
  amount: number;
  paymentMethod: "cash" | "bank-transfer" | "mpesa" | "cheque" | "card";
  date: string;
  invoice: string;
  status: "issued" | "void";
}

const COLORS = {
  cash: "#10b981",
  "bank-transfer": "#3b82f6",
  mpesa: "#059669",
  cheque: "#8b5cf6",
  card: "#f97316",
};

export default function Receipts() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [amountRange, setAmountRange] = useState("all");
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "client">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptRecord | null>(null);



  // Fetch real data from backend
  const { data: receiptsData = [], isLoading } = trpc.receipts.list.useQuery();
  const { data: clientsData = [] } = trpc.clients.list.useQuery();
  const utils = trpc.useUtils();
  
  // Delete mutation
  const deleteReceiptMutation = trpc.receipts.delete.useMutation({
    onSuccess: () => {
      toast.success("Receipt deleted successfully");
      utils.receipts.list.invalidate();
      setDeleteModalOpen(false);
      setSelectedReceipt(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete receipt");
    },
  });

  // Transform backend data to display format
  const receipts: ReceiptRecord[] = (receiptsData as any[]).map((rec: any) => ({
    id: rec.id,
    receiptNumber: rec.receiptNumber || `REC-${rec.id.slice(0, 8)}`,
    client: (clientsData as any[]).find((c: any) => c.id === rec.clientId)?.companyName || "Unknown Client",
    clientEmail: (clientsData as any[]).find((c: any) => c.id === rec.clientId)?.email,
    amount: (rec.amount || 0) / 100,
    paymentMethod: rec.paymentMethod || "cash",
    date: rec.date ? format(new Date(rec.date), "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
    invoice: rec.invoiceId ? "INV" : "N/A",
    status: rec.status || "issued",
  }));

  // Action handlers
  const handleView = (id: string | number) => {
    navigate(`/receipts/${id}`);
  };

  const handleEdit = (id: string | number) => {
    navigate(`/receipts/${id}/edit`);
  };

  const handleDeleteClick = (id: string | number) => {
    const receipt = receipts.find((rec) => rec.id === String(id));
    if (receipt) {
      setSelectedReceipt(receipt);
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedReceipt) {
      await deleteReceiptMutation.mutateAsync(selectedReceipt.id);
    }
  };

  const handleDownload = async (id: string | number) => {
    const receipt = receipts.find((rec) => rec.id === String(id));
    if (!receipt) return;

    const toastId = toast.loading(`Generating receipt ${receipt.receiptNumber}...`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const content = `
OFFICIAL RECEIPT
${receipt.receiptNumber}
Generated: ${new Date().toLocaleString()}

MELITECH SOLUTIONS
P.O. Box 12345, Nairobi, Kenya
Email: info@melitechsolutions.co.ke
Phone: +254 700 000 000
Website: www.melitechsolutions.co.ke

RECEIVED FROM:
${receipt.client}
${receipt.clientEmail || ""}

Receipt Date: ${new Date(receipt.date).toLocaleDateString()}
Invoice Reference: ${receipt.invoice}
Payment Method: ${receipt.paymentMethod.toUpperCase().replace("-", " ")}

AMOUNT RECEIVED: Ksh ${receipt.amount.toLocaleString()}

Status: ${receipt.status.toUpperCase()}

This is an official receipt for payment received.
For any inquiries, please contact us at info@melitechsolutions.co.ke

Thank you for your business!
      `.trim();

      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${receipt.receiptNumber}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${receipt.receiptNumber} downloaded successfully`, { id: toastId });
    } catch (error) {
      toast.error(`Failed to download receipt`, { id: toastId });
    }
  };

  const handleEmailClick = (id: string | number) => {
    const receipt = receipts.find((rec) => rec.id === String(id));
    if (receipt) {
      setSelectedReceipt(receipt);
      setEmailModalOpen(true);
    }
  };

  const handleEmailSend = async (email: string, subject: string, message: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const filteredReceipts = receipts
    .filter((receipt) => {
      const matchesSearch =
        receipt.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.invoice.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMethod = methodFilter === "all" || receipt.paymentMethod === methodFilter;
      const matchesStatus = statusFilter === "all" || receipt.status === statusFilter;

      const receiptDate = new Date(receipt.date);
      const matchesDateRange =
        (!dateRange.from || receiptDate >= dateRange.from) &&
        (!dateRange.to || receiptDate <= dateRange.to);

      let matchesAmount = true;
      if (amountRange === "0-100k") matchesAmount = receipt.amount < 100000;
      else if (amountRange === "100k-500k")
        matchesAmount = receipt.amount >= 100000 && receipt.amount < 500000;
      else if (amountRange === "500k-1m")
        matchesAmount = receipt.amount >= 500000 && receipt.amount < 1000000;
      else if (amountRange === "1m+") matchesAmount = receipt.amount >= 1000000;

      return matchesSearch && matchesMethod && matchesStatus && matchesDateRange && matchesAmount;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortBy === "client") {
        comparison = a.client.localeCompare(b.client);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4" />;
      case "bank-transfer":
        return <Building2 className="h-4 w-4" />;
      case "mpesa":
        return <Smartphone className="h-4 w-4" />;
      case "cheque":
        return <FileText className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      cash: "bg-green-500/10 text-green-500 border-green-500/20",
      "bank-transfer": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      mpesa: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      cheque: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      card: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    };
    return colors[method] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  const totalAmount = filteredReceipts.reduce((sum, r) => sum + r.amount, 0);
  const avgAmount = filteredReceipts.length > 0 ? totalAmount / filteredReceipts.length : 0;

  // Payment method distribution for pie chart
  const methodDistribution = Object.entries(
    receipts.reduce((acc, r) => {
      acc[r.paymentMethod] = (acc[r.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace("-", " "), value }));

  // Monthly trends for bar chart
  const monthlyData = receipts.reduce((acc, r) => {
    const month = new Date(r.date).toLocaleDateString("en-US", { month: "short" });
    acc[month] = (acc[month] || 0) + r.amount;
    return acc;
  }, {} as Record<string, number>);

  const monthlyTrends = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }));

  const toggleSort = (field: "date" | "amount" | "client") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const toggleSelectAll = () => {
    if (selectedReceipts.length === filteredReceipts.length) {
      setSelectedReceipts([]);
    } else {
      setSelectedReceipts(filteredReceipts.map((r) => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedReceipts((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDownload = () => {
    alert(`Downloading ${selectedReceipts.length} receipts as PDF...`);
  };

  const handleBulkEmail = () => {
    alert(`Sending ${selectedReceipts.length} receipts via email...`);
  };

  const handleBulkPrint = () => {
    alert(`Printing ${selectedReceipts.length} receipts...`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setMethodFilter("all");
    setStatusFilter("all");
    setDateRange({});
    setAmountRange("all");
  };

  return (
    <ModuleLayout
      title="Receipts"
      description="Manage payment receipts and records"
      icon={<Receipt className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Sales", href: "/sales" },
        { label: "Receipts" },
      ]}
      actions={
        <div className="flex gap-2">
            {selectedReceipts.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions ({selectedReceipts.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleBulkDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBulkEmail}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBulkPrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button onClick={() => navigate("/receipts/create")}>
              <Plus className="mr-2 h-4 w-4" />
              New Receipt
            </Button>
          </div>
      }
    >
      <div className="space-y-6">

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
              <Receipt className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredReceipts.length}</div>
              <p className="text-xs text-muted-foreground">
                {filteredReceipts.length === receipts.length ? "All time" : "Filtered"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Received</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {Math.round(avgAmount).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Per receipt</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  receipts.filter(
                    (r) => new Date(r.date).getMonth() === new Date().getMonth()
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">New receipts</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Distribution</CardTitle>
              <CardDescription>Breakdown by payment type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={methodDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {methodDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name.replace(" ", "-") as keyof typeof COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Receipt amounts by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `Ksh ${Number(value).toLocaleString()}`} />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Receipts List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Receipts</CardTitle>
                <CardDescription>Payment receipts and transaction records</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search receipts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <DatePicker
                  date={dateRange.from}
                  onDateChange={(date: Date | undefined) => setDateRange({ ...dateRange, from: date })}
                  placeholder="From date"
                />
                <DatePicker
                  date={dateRange.to}
                  onDateChange={(date: Date | undefined) => setDateRange({ ...dateRange, to: date })}
                  placeholder="To date"
                />
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={amountRange} onValueChange={setAmountRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Amounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Amounts</SelectItem>
                    <SelectItem value="0-100k">0 - 100K</SelectItem>
                    <SelectItem value="100k-500k">100K - 500K</SelectItem>
                    <SelectItem value="500k-1m">500K - 1M</SelectItem>
                    <SelectItem value="1m+">1M+</SelectItem>
                  </SelectContent>
                </Select>
                {(searchQuery ||
                  methodFilter !== "all" ||
                  statusFilter !== "all" ||
                  dateRange.from ||
                  dateRange.to ||
                  amountRange !== "all") && (
                  <Button variant="outline" onClick={clearFilters}>
                    <Filter className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedReceipts.length === filteredReceipts.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Receipt #</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort("client")}
                  >
                    <div className="flex items-center gap-1">
                      Client
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort("amount")}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No receipts found</p>
                        {(searchQuery || methodFilter !== "all" || amountRange !== "all") && (
                          <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReceipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedReceipts.includes(receipt.id)}
                          onCheckedChange={() => toggleSelect(receipt.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                      <TableCell>{receipt.client}</TableCell>
                      <TableCell className="text-muted-foreground">{receipt.invoice}</TableCell>
                      <TableCell className="font-medium">
                        Ksh {receipt.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getMethodBadge(receipt.paymentMethod)} variant="outline">
                          <span className="mr-1">{getMethodIcon(receipt.paymentMethod)}</span>
                          {receipt.paymentMethod.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(receipt.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={receipt.status === "issued" ? "default" : "secondary"}>
                          {receipt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionButtons
                          id={receipt.id}
                          handlers={{
                            onView: handleView,
                            onEdit: handleEdit,
                            onDelete: handleDeleteClick,
                            onDownload: handleDownload,
                            onEmail: handleEmailClick,
                          }}
                          showView={true}
                          showEdit={true}
                          showDelete={true}
                          showDownload={true}
                          showEmail={true}
                          variant="dropdown"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        itemType="Receipt"
        itemName={selectedReceipt?.receiptNumber}
      />

      {/* Email Send Modal */}
      {selectedReceipt && (
        <EmailModal
          open={emailModalOpen}
          onOpenChange={setEmailModalOpen}
          onSend={handleEmailSend}
          itemType="Receipt"
          itemNumber={selectedReceipt.receiptNumber}
          defaultEmail={selectedReceipt.clientEmail}
        />
      )}
    </ModuleLayout>
  );
}

