import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

export default function PayrollDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const payrollRecord = {
    id: id,
    employeeId: "EMP-001",
    employeeName: "John Doe",
    period: "November 2024",
    baseSalary: 50000,
    allowances: 5000,
    deductions: 8000,
    netSalary: 47000,
    status: "Processed",
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    setLocation("/payroll");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setLocation("/payroll")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Payroll Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{payrollRecord.employeeName}</CardTitle>
          <CardDescription>Period: {payrollRecord.period}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Employee ID</p>
              <p className="font-semibold">{payrollRecord.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <p className="font-semibold text-green-600">{payrollRecord.status}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Base Salary</p>
              <p className="font-semibold">KES {payrollRecord.baseSalary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Allowances</p>
              <p className="font-semibold text-green-600">+ KES {payrollRecord.allowances.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Deductions</p>
              <p className="font-semibold text-red-600">- KES {payrollRecord.deductions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Net Salary</p>
              <p className="font-semibold text-lg">KES {payrollRecord.netSalary.toLocaleString()}</p>
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
        title="Delete Payroll Record"
        description="Are you sure you want to delete this payroll record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
