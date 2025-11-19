import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

export default function ExpensesDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const expense = {
    id: id,
    description: "Office Supplies",
    category: "Supplies",
    amount: 5000,
    date: "2024-11-12",
    vendor: "Stationary Store",
    paymentMethod: "Cash",
    status: "Approved",
    approvedBy: "Manager",
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    setLocation("/expenses");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setLocation("/expenses")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Expense Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{expense.description}</CardTitle>
          <CardDescription>Category: {expense.category}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Amount</p>
              <p className="font-semibold">KES {expense.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Date</p>
              <p className="font-semibold">{expense.date}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Vendor</p>
              <p className="font-semibold">{expense.vendor}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Payment Method</p>
              <p className="font-semibold">{expense.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <p className="font-semibold text-green-600">{expense.status}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Approved By</p>
              <p className="font-semibold">{expense.approvedBy}</p>
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
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
