import DashboardLayout from "@/components/DashboardLayout";
import DocumentForm from "@/components/forms/DocumentForm";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";

export default function EditReceipt() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const receiptId = params.id;

  // TODO: Fetch receipt data from database
  const receiptData = {
    id: receiptId,
    documentNumber: "REC-00001",
    clientName: "Acme Corporation",
    clientEmail: "john@acmecorp.com",
    clientAddress: "Nairobi, Kenya",
    date: "2024-01-20",
    lineItems: [
      {
        id: "1",
        sno: 1,
        description: "Payment for Invoice INV-2024-00001",
        uom: "Payment",
        qty: 1,
        unitPrice: 580000,
        tax: 0,
        total: 580000,
      },
    ],
    notes: "Payment received via M-Pesa",
  };

  const handleSave = (data: any) => {
    console.log("Receipt updated:", data);
    toast.success("Receipt updated successfully");
    // TODO: Update in database via tRPC
    setTimeout(() => setLocation("/receipts"), 1500);
  };

  const handleSend = (data: any) => {
    console.log("Receipt sent:", data);
    toast.success("Receipt sent successfully");
    // TODO: Send email via backend API
  };

  return (
    <DashboardLayout>
      <DocumentForm 
        type="receipt" 
        initialData={receiptData}
        onSave={handleSave}
        onSend={handleSend}
      />
    </DashboardLayout>
  );
}

