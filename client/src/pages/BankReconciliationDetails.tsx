import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

export default function BankReconciliationDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const reconciliation = {
    id: id,
    bankAccount: "KCB - 1234567890",
    period: "November 2024",
    bankBalance: 500000,
    bookBalance: 495000,
    difference: 5000,
    status: "Reconciled",
    reconciliationDate: "2024-11-12",
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    setLocation("/bank-reconciliation");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setLocation("/bank-reconciliation")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Bank Reconciliation Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{reconciliation.bankAccount}</CardTitle>
          <CardDescription>Period: {reconciliation.period}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Bank Balance</p>
              <p className="font-semibold">KES {reconciliation.bankBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Book Balance</p>
              <p className="font-semibold">KES {reconciliation.bookBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Difference</p>
              <p className="font-semibold text-orange-600">KES {reconciliation.difference.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <p className="font-semibold text-green-600">{reconciliation.status}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-600">Reconciliation Date</p>
              <p className="font-semibold">{reconciliation.reconciliationDate}</p>
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
        title="Delete Reconciliation"
        description="Are you sure you want to delete this bank reconciliation record? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
