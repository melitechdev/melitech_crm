import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

export default function AttendanceDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const attendanceRecord = {
    id: id,
    employeeId: "EMP-001",
    employeeName: "John Doe",
    date: "2024-11-12",
    checkIn: "09:00 AM",
    checkOut: "05:30 PM",
    status: "Present",
    hoursWorked: 8.5,
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    setLocation("/attendance");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setLocation("/attendance")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Attendance Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{attendanceRecord.employeeName}</CardTitle>
          <CardDescription>Date: {attendanceRecord.date}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Employee ID</p>
              <p className="font-semibold">{attendanceRecord.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <p className="font-semibold text-green-600">{attendanceRecord.status}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Check In</p>
              <p className="font-semibold">{attendanceRecord.checkIn}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Check Out</p>
              <p className="font-semibold">{attendanceRecord.checkOut}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-600">Hours Worked</p>
              <p className="font-semibold">{attendanceRecord.hoursWorked} hours</p>
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
        title="Delete Attendance Record"
        description="Are you sure you want to delete this attendance record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
