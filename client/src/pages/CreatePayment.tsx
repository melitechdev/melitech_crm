import { useState } from "react";
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
import { DollarSign, ArrowLeft } from "lucide-react";

export default function CreatePayment() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [formData, setFormData] = useState({
    invoiceId: "",
    clientId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "mpesa",
    referenceNumber: "",
    notes: "",
  });

  const { data: invoices = [] } = trpc.invoices.list.useQuery();
  const { data: clients = [] } = trpc.clients.list.useQuery();

  const createPaymentMutation = trpc.payments.create.useMutation({
    onSuccess: () => {
      toast.success("Payment recorded successfully!");
      utils.payments.list.invalidate();
      navigate("/payments");
    },
    onError: (error: any) => {
      toast.error(`Failed to record payment: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.invoiceId || !formData.clientId || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    createPaymentMutation.mutate({
      invoiceId: formData.invoiceId,
      clientId: formData.clientId,
      amount: Math.round(parseFloat(formData.amount) * 100),
      paymentDate: new Date(formData.paymentDate),
      paymentMethod: formData.paymentMethod as any,
      referenceNumber: formData.referenceNumber || undefined,
      notes: formData.notes || undefined,
    });
  };

  return (
    <ModuleLayout
      title="Record Payment"
      description="Record a new payment from a client"
      icon={<DollarSign className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Accounting", href: "/accounting" },
        { label: "Payments", href: "/payments" },
        { label: "Record Payment" },
      ]}
    >
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Record Payment</CardTitle>
            <CardDescription>
              Enter the payment details below to record a new payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client *</Label>
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, clientId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {(clients as any[]).map((client: any) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.companyName || client.contactPerson}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceId">Invoice *</Label>
                  <Select
                    value={formData.invoiceId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, invoiceId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an invoice" />
                    </SelectTrigger>
                    <SelectContent>
                      {(invoices as any[]).map((invoice: any) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.invoiceNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="paymentDate">Payment Date *</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData({ ...formData, paymentMethod: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Reference Number</Label>
                  <Input
                    id="referenceNumber"
                    placeholder="e.g., CHQ-123456 or TRF-001"
                    value={formData.referenceNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, referenceNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this payment..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/payments")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createPaymentMutation.isPending}
                >
                  {createPaymentMutation.isPending
                    ? "Recording..."
                    : "Record Payment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}

