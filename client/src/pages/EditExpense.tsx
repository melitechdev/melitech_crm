import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Receipt, ArrowLeft } from "lucide-react";

interface EditExpenseProps {
  expenseId?: string;
}

export default function EditExpense({ expenseId }: EditExpenseProps) {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [formData, setFormData] = useState({
    category: "",
    vendor: "",
    amount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    description: "",
    status: "pending",
  });

  // Get expense ID from URL or props
  const id = expenseId || new URLSearchParams(window.location.search).get("id");

  // Fetch expense data
  const { data: expense, isLoading } = trpc.expenses.getById.useQuery(id || "", {
    enabled: !!id,
  });

  // Populate form when expense data loads
  useEffect(() => {
    if (expense) {
      setFormData({
        category: expense.category || "",
        vendor: expense.vendor || "",
        amount: expense.amount ? (expense.amount / 100).toString() : "",
        expenseDate: expense.expenseDate ? new Date(expense.expenseDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        paymentMethod: expense.paymentMethod || "cash",
        description: expense.description || "",
        status: expense.status || "pending",
      });
    }
  }, [expense]);

  const updateExpenseMutation = trpc.expenses.update.useMutation({
    onSuccess: () => {
      toast.success("Expense updated successfully!");
      utils.expenses.list.invalidate();
      navigate("/expenses");
    },
    onError: (error: any) => {
      toast.error(`Failed to update expense: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!id) {
      toast.error("Expense ID is missing");
      return;
    }

    updateExpenseMutation.mutate({
      id,
      category: formData.category,
      vendor: formData.vendor || undefined,
      amount: Math.round(parseFloat(formData.amount) * 100),
      expenseDate: new Date(formData.expenseDate),
      paymentMethod: formData.paymentMethod as any,
      description: formData.description || undefined,
      status: formData.status as any,
    });
  };

  if (isLoading) {
    return (
      <ModuleLayout
        title="Edit Expense"
        description="Loading expense details..."
        icon={<Receipt className="w-6 h-6" />}
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Accounting", href: "/accounting" },
          { label: "Expenses", href: "/expenses" },
          { label: "Edit Expense" },
        ]}
      >
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout
      title="Edit Expense"
      description="Update expense details"
      icon={<Receipt className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Accounting", href: "/accounting" },
        { label: "Expenses", href: "/expenses" },
        { label: "Edit Expense" },
      ]}
    >
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Expense</CardTitle>
            <CardDescription>
              Update the expense details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Office Supplies"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input
                    id="vendor"
                    placeholder="e.g., ABC Supplies Ltd"
                    value={formData.vendor}
                    onChange={(e) =>
                      setFormData({ ...formData, vendor: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (Ksh) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expenseDate">Expense Date</Label>
                  <Input
                    id="expenseDate"
                    type="date"
                    value={formData.expenseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expenseDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter expense description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/expenses")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateExpenseMutation.isPending}
                >
                  {updateExpenseMutation.isPending
                    ? "Updating..."
                    : "Update Expense"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}

