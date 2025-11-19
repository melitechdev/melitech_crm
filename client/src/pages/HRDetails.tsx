import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

export default function HRDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const hrRecord = {
    id: id,
    employeeId: "EMP-001",
    employeeName: "John Doe",
    department: "Engineering",
    position: "Senior Developer",
    joinDate: "2022-01-15",
    email: "john.doe@melitech.com",
    phone: "+254 700 000 000",
    status: "Active",
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    setLocation("/hr");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setLocation("/hr")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">HR Record Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{hrRecord.employeeName}</CardTitle>
          <CardDescription>{hrRecord.position}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Employee ID</p>
              <p className="font-semibold">{hrRecord.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Department</p>
              <p className="font-semibold">{hrRecord.department}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Join Date</p>
              <p className="font-semibold">{hrRecord.joinDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <p className="font-semibold text-green-600">{hrRecord.status}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="font-semibold">{hrRecord.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Phone</p>
              <p className="font-semibold">{hrRecord.phone}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="gap-2">
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete HR Record"
        description="Are you sure you want to delete this HR record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
