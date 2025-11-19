import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

export default function ChartOfAccountsDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const account = {
    id: id,
    accountCode: "1010",
    accountName: "Cash in Bank",
    accountType: "Asset",
    balance: 500000,
    currency: "KES",
    status: "Active",
    description: "Main operating bank account",
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    setLocation("/chart-of-accounts");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setLocation("/chart-of-accounts")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Account Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{account.accountName}</CardTitle>
          <CardDescription>Code: {account.accountCode}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Account Type</p>
              <p className="font-semibold">{account.accountType}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <p className="font-semibold text-green-600">{account.status}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Balance</p>
              <p className="font-semibold">{account.currency} {account.balance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Currency</p>
              <p className="font-semibold">{account.currency}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-600">Description</p>
              <p className="font-semibold">{account.description}</p>
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
        title="Delete Account"
        description="Are you sure you want to delete this account? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
