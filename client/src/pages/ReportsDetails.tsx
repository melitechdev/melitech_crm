import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { ArrowLeft, Edit2, Trash2, Download } from "lucide-react";

export default function ReportsDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const report = {
    id: id,
    name: "Monthly Sales Report",
    type: "Sales",
    period: "November 2024",
    generatedDate: "2024-11-12",
    totalRevenue: 250000,
    totalTransactions: 45,
    status: "Completed",
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    setLocation("/reports");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setLocation("/reports")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Report Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{report.name}</CardTitle>
          <CardDescription>Period: {report.period}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Report Type</p>
              <p className="font-semibold">{report.type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <p className="font-semibold text-green-600">{report.status}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Generated Date</p>
              <p className="font-semibold">{report.generatedDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="font-semibold">KES {report.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-600">Total Transactions</p>
              <p className="font-semibold">{report.totalTransactions}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
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
        title="Delete Report"
        description="Are you sure you want to delete this report? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
