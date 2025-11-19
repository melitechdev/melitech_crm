import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useState } from "react";
import { toast } from "sonner";

export default function ServiceDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const service = {
    id: id || "1",
    name: "Sample Service",
    code: `SVC-${id}`,
    category: "Consulting",
    rate: 5000,
    billingType: "hourly",
    status: "active",
    description: "Professional service",
  };

  const handleEdit = () => {
    navigate(`/services/${id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Service deleted successfully");
      navigate("/services");
    } catch (error) {
      toast.error("Failed to delete service");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/services")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <p className="text-muted-foreground">{service.code}</p>
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
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-muted-foreground">{service.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Badge>{service.status}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Rate</label>
                <p className="text-muted-foreground">Ksh {service.rate.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Billing Type</label>
                <p className="text-muted-foreground">{service.billingType}</p>
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
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
      />
    </DashboardLayout>
  );
}
