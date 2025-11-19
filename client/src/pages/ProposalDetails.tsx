import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Download, Send } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useState } from "react";
import { toast } from "sonner";

export default function ProposalDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const proposal = {
    id: id || "1",
    title: "Web Development Project",
    client: "Sample Client",
    amount: 150000,
    status: "sent",
    validUntil: "2024-12-31",
    createdDate: new Date().toLocaleDateString(),
  };

  const handleEdit = () => {
    navigate(`/proposals/${id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Proposal deleted successfully");
      navigate("/proposals");
    } catch (error) {
      toast.error("Failed to delete proposal");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/proposals")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{proposal.title}</h1>
            <p className="text-muted-foreground">{proposal.client}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
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
            <CardTitle>Proposal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <p className="text-muted-foreground">Ksh {proposal.amount.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Badge>{proposal.status}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Valid Until</label>
                <p className="text-muted-foreground">{proposal.validUntil}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Created</label>
                <p className="text-muted-foreground">{proposal.createdDate}</p>
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
        title="Delete Proposal"
        description="Are you sure you want to delete this proposal? This action cannot be undone."
      />
    </DashboardLayout>
  );
}
