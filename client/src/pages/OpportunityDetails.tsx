import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useState } from "react";
import { toast } from "sonner";

export default function OpportunityDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const opportunity = {
    id: id || "1",
    name: "Enterprise Solution Deal",
    client: "Sample Client",
    value: 500000,
    stage: "negotiation",
    probability: 75,
    expectedClose: "2024-12-31",
    status: "active",
  };

  const handleEdit = () => {
    navigate(`/opportunities/${id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Opportunity deleted successfully");
      navigate("/opportunities");
    } catch (error) {
      toast.error("Failed to delete opportunity");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/opportunities")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{opportunity.name}</h1>
            <p className="text-muted-foreground">{opportunity.client}</p>
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Opportunity Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Value</label>
                <p className="text-muted-foreground">Ksh {opportunity.value.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Stage</label>
                <Badge>{opportunity.stage}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Probability</label>
                <p className="text-muted-foreground">{opportunity.probability}%</p>
              </div>
              <div>
                <label className="text-sm font-medium">Expected Close</label>
                <p className="text-muted-foreground">{opportunity.expectedClose}</p>
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
        title="Delete Opportunity"
        description="Are you sure you want to delete this opportunity? This action cannot be undone."
      />
    </DashboardLayout>
  );
}
