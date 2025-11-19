import DashboardLayout from "@/components/DashboardLayout";
import DocumentForm from "@/components/forms/DocumentForm";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";

export default function EditInvoice() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const invoiceId = params.id;

  // TODO: Fetch invoice data from database
  const invoiceData = {
    id: invoiceId,
    documentNumber: "INV-2024-00001",
    clientName: "Acme Corporation",
    clientEmail: "john@acmecorp.com",
    clientAddress: "Nairobi, Kenya",
    date: "2024-01-15",
    dueDate: "2024-02-14",
    lineItems: [
      {
        id: "1",
        sno: 1,
        description: "Website Development",
        uom: "Project",
        qty: 1,
        unitPrice: 500000,
        tax: 16,
        total: 580000,
      },
    ],
    notes: "Thank you for your business",
  };

  const handleSave = (data: any) => {
    console.log("Invoice updated:", data);
    toast.success("Invoice updated successfully");
    // TODO: Update in database via tRPC
    setTimeout(() => setLocation("/invoices"), 1500);
  };

  const handleSend = (data: any) => {
    console.log("Invoice sent:", data);
    toast.success("Invoice sent successfully");
    // TODO: Send email via backend API
  };

  return (
    <DashboardLayout>
      <DocumentForm 
        type="invoice" 
        initialData={invoiceData}
        onSave={handleSave}
        onSend={handleSend}
      />
    </DashboardLayout>
  );
}

