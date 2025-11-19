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
  DollarSign,
  Search,
  Plus,
  Download,
  Eye,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Banknote,
  Trash2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Payment {
  id: string;
  receiptNumber: string;
  client: string;
  amount: number;
  method: "cash" | "mpesa" | "bank_transfer" | "cheque" | "card";
  status: "completed" | "pending" | "failed";
  date: string;
  invoice: string;
  reference: string;
}

export default function Payments() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

  // Fetch real data from backend
  const { data: paymentsData = [], isLoading } = trpc.payments.list.useQuery();
  const { data: clientsData = [] } = trpc.clients.list.useQuery();
  const utils = trpc.useUtils();
  
  // Delete mutation
  const deletePaymentMutation = trpc.payments.delete.useMutation({
    onSuccess: () => {
      toast.success("Payment deleted successfully");
      utils.payments.list.invalidate();
      setDeleteDialogOpen(false);
      setSelectedPaymentId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete payment");
    },
  });

  // Transform backend data to display format
  const payments: Payment[] = (paymentsData as any[]).map((payment: any) => ({
    id: payment.id,
    receiptNumber: payment.receiptNumber || `REC-${payment.id.slice(0, 8)}`,
    client: (clientsData as any[]).find((c: any) => c.id === payment.clientId)?.companyName || "Unknown Client",
    amount: (payment.amount || 0) / 100,
    method: payment.paymentMethod || "cash",
    status: payment.status || "pending",
    date: payment.date ? format(new Date(payment.date), "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
    invoice: payment.invoiceId ? "INV" : "N/A",
    reference: payment.reference || "",
  }));

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <ModuleLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Payments", href: "/payments" },
      ]}
      title="Payments"
      description="Track and manage all payment transactions"
      icon={<DollarSign className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {payments.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {completedAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {payments.filter((p) => p.status === "completed").length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {payments.filter((p) => p.status === "pending").length} pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client or receipt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="mpesa">M-Pesa</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => navigate("/payments/create")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Record Payment
          </Button>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Transactions</CardTitle>
            <CardDescription>
              {filteredPayments.length} of {payments.length} payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading payments...
                      </TableCell>
                    </TableRow>
                  ) : filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                        <TableCell>{payment.client}</TableCell>
                        <TableCell>Ksh {payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.method.replace("_", " ").toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === "completed"
                                ? "default"
                                : payment.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className="gap-1"
                          >
                            {payment.status === "completed" && (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            {payment.status === "pending" && (
                              <Clock className="h-3 w-3" />
                            )}
                            {payment.status.charAt(0).toUpperCase() +
                              payment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/payments/${payment.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPaymentId(payment.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogTitle>Delete Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment? This action cannot be undone.
            </AlertDialogDescription>
            <div className="flex gap-2 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (selectedPaymentId) {
                    await deletePaymentMutation.mutateAsync(selectedPaymentId);
                  }
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ModuleLayout>
  );
}

