import { useState } from "react";
import { useLocation } from "wouter";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { DollarSign, ArrowLeft } from "lucide-react";

export default function CreatePayroll() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [formData, setFormData] = useState({
    employeeId: "",
    payPeriodStart: "",
    payPeriodEnd: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    tax: "",
    netSalary: "",
    status: "draft",
  });

  const { data: employees = [] } = trpc.employees.list.useQuery();

  const createPayrollMutation = trpc.payroll.create.useMutation({
    onSuccess: () => {
      toast.success("Payroll record created successfully!");
      utils.payroll.list.invalidate();
      navigate("/payroll");
    },
    onError: (error: any) => {
      toast.error(`Failed to create payroll record: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employeeId || !formData.payPeriodStart || !formData.payPeriodEnd || !formData.basicSalary || !formData.netSalary) {
      toast.error("Please fill in all required fields");
      return;
    }

    createPayrollMutation.mutate({
      employeeId: formData.employeeId,
      payPeriodStart: new Date(formData.payPeriodStart),
      payPeriodEnd: new Date(formData.payPeriodEnd),
      basicSalary: Math.round(parseFloat(formData.basicSalary) * 100),
      allowances: formData.allowances ? Math.round(parseFloat(formData.allowances) * 100) : 0,
      deductions: formData.deductions ? Math.round(parseFloat(formData.deductions) * 100) : 0,
      tax: formData.tax ? Math.round(parseFloat(formData.tax) * 100) : 0,
      netSalary: Math.round(parseFloat(formData.netSalary) * 100),
      status: formData.status as any,
    });
  };

  return (
    <ModuleLayout
      title="Create Payroll"
      description="Process employee payroll"
      icon={<DollarSign className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "HR", href: "/hr" },
        { label: "Payroll", href: "/payroll" },
        { label: "Create Payroll" },
      ]}
    >
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Payroll</CardTitle>
            <CardDescription>
              Process payroll for an employee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee *</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, employeeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {(employees as any[]).map((emp: any) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="payPeriodStart">Pay Period Start *</Label>
                  <Input
                    id="payPeriodStart"
                    type="date"
                    value={formData.payPeriodStart}
                    onChange={(e) =>
                      setFormData({ ...formData, payPeriodStart: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payPeriodEnd">Pay Period End *</Label>
                  <Input
                    id="payPeriodEnd"
                    type="date"
                    value={formData.payPeriodEnd}
                    onChange={(e) =>
                      setFormData({ ...formData, payPeriodEnd: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="basicSalary">Basic Salary (Ksh) *</Label>
                  <Input
                    id="basicSalary"
                    type="number"
                    placeholder="0.00"
                    value={formData.basicSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, basicSalary: e.target.value })
                    }
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowances">Allowances (Ksh)</Label>
                  <Input
                    id="allowances"
                    type="number"
                    placeholder="0.00"
                    value={formData.allowances}
                    onChange={(e) =>
                      setFormData({ ...formData, allowances: e.target.value })
                    }
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deductions">Deductions (Ksh)</Label>
                  <Input
                    id="deductions"
                    type="number"
                    placeholder="0.00"
                    value={formData.deductions}
                    onChange={(e) =>
                      setFormData({ ...formData, deductions: e.target.value })
                    }
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax">Tax (Ksh)</Label>
                  <Input
                    id="tax"
                    type="number"
                    placeholder="0.00"
                    value={formData.tax}
                    onChange={(e) =>
                      setFormData({ ...formData, tax: e.target.value })
                    }
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="netSalary">Net Salary (Ksh) *</Label>
                <Input
                  id="netSalary"
                  type="number"
                  placeholder="0.00"
                  value={formData.netSalary}
                  onChange={(e) =>
                    setFormData({ ...formData, netSalary: e.target.value })
                  }
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/payroll")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createPayrollMutation.isPending}
                >
                  {createPayrollMutation.isPending
                    ? "Creating..."
                    : "Create Payroll"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}

