import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Download, Send } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useState } from "react";
import { toast } from "sonner";

export default function PaymentDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data - replace with actual data fetching
  const payment = {
    id: id || "1",
    referenceNumber: `PAY-${id}`,
    client: "Sample Client",
    amount: 50000,
    status: "completed",
    paymentMethod: "bank_transfer",
    date: new Date().toLocaleDateString(),
  };

  const handleEdit = () => {
    navigate(`/payments/${id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Payment deleted successfully");
      navigate("/payments");
    } catch (error) {
      toast.error("Failed to delete payment");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/payments")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{payment.referenceNumber}</h1>
            <p className="text-muted-foreground">{payment.client}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>View payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Reference</label>
                <p className="text-muted-foreground">{payment.referenceNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Badge>{payment.status}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <p className="text-muted-foreground">Ksh {payment.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Method</label>
                <p className="text-muted-foreground">{payment.paymentMethod}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <p className="text-muted-foreground">{payment.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Payment"
        description="Are you sure you want to delete this payment? This action cannot be undone."
      />
    </DashboardLayout>
  );
}
