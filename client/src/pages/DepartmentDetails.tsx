import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useState } from "react";
import { toast } from "sonner";

export default function DepartmentDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const department = {
    id: id || "1",
    name: "Engineering",
    code: "ENG",
    manager: "John Doe",
    employeeCount: 12,
    budget: 2400000,
    status: "active",
  };

  const handleEdit = () => {
    navigate(`/departments/${id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Department deleted successfully");
      navigate("/departments");
    } catch (error) {
      toast.error("Failed to delete department");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/departments")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{department.name}</h1>
            <p className="text-muted-foreground">{department.code}</p>
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
            <CardTitle>Department Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Manager</label>
                <p className="text-muted-foreground">{department.manager}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Employees</label>
                <p className="text-muted-foreground">{department.employeeCount}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Budget</label>
                <p className="text-muted-foreground">Ksh {department.budget.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Badge>{department.status}</Badge>
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
        title="Delete Department"
        description="Are you sure you want to delete this department? This action cannot be undone."
      />
    </DashboardLayout>
  );
}
