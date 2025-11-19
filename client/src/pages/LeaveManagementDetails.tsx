import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

export default function LeaveManagementDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const leaveRecord = {
    id: id,
    employeeId: "EMP-001",
    employeeName: "John Doe",
    leaveType: "Annual Leave",
    startDate: "2024-11-15",
    endDate: "2024-11-20",
    daysRequested: 5,
    status: "Approved",
    reason: "Personal vacation",
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    setLocation("/leave-management");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setLocation("/leave-management")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Leave Request Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{leaveRecord.employeeName}</CardTitle>
          <CardDescription>{leaveRecord.leaveType}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Employee ID</p>
              <p className="font-semibold">{leaveRecord.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <p className="font-semibold text-green-600">{leaveRecord.status}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Start Date</p>
              <p className="font-semibold">{leaveRecord.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">End Date</p>
              <p className="font-semibold">{leaveRecord.endDate}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-600">Days Requested</p>
              <p className="font-semibold">{leaveRecord.daysRequested} days</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-600">Reason</p>
              <p className="font-semibold">{leaveRecord.reason}</p>
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
        title="Delete Leave Request"
        description="Are you sure you want to delete this leave request? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
