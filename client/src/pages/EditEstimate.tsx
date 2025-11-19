import DashboardLayout from "@/components/DashboardLayout";
import DocumentForm from "@/components/forms/DocumentForm";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";

export default function EditEstimate() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const estimateId = params.id;

  // TODO: Fetch estimate data from database
  const estimateData = {
    id: estimateId,
    quoteNumber: "QUOT-2025/10/001",
    client: "Acme Corporation",
    project: "Website Redesign",
    issueDate: "2024-01-10",
    expiryDate: "2024-02-24",
    items: [
      {
        description: "UI/UX Design",
        quantity: 1,
        unitPrice: 150000,
        amount: 150000,
      },
      {
        description: "Frontend Development",
        quantity: 1,
        unitPrice: 250000,
        amount: 250000,
      },
      {
        description: "Backend Integration",
        quantity: 1,
        unitPrice: 100000,
        amount: 100000,
      },
    ],
    subtotal: 500000,
    vat: 80000,
    total: 580000,
    terms: "Payment due within 30 days of acceptance",
  };

  const handleSave = (data: any) => {
    console.log("Estimate updated:", data);
    toast.success("Estimate updated successfully");
    // TODO: Update in database via tRPC
    setTimeout(() => setLocation("/estimates"), 1500);
  };

  const handleSend = (data: any) => {
    console.log("Estimate sent:", data);
    toast.success("Estimate sent successfully");
    // TODO: Send email via backend API
  };

  return (
    <DashboardLayout>
      <DocumentForm 
        type="estimate" 
        initialData={estimateData}
        onSave={handleSave}
        onSend={handleSend}
      />
    </DashboardLayout>
  );
}

