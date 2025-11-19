import { useState, useEffect } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, DollarSign, BarChart3, Plus, Receipt } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Accounting() {
  const [, navigate] = useLocation();
  const [financialData, setFinancialData] = useState({
    totalInvoices: 0,
    totalPayments: 0,
    totalExpenses: 0,
    totalRevenue: 0,
    netProfit: 0,
  });

  // Fetch accounting data from backend
  const { data: invoices = [] } = trpc.invoices.list.useQuery();
  const { data: payments = [] } = trpc.payments.list.useQuery();
  const { data: expenses = [] } = trpc.expenses.list.useQuery();

  // Calculate financial metrics
  useEffect(() => {
    const totalRevenue = (invoices as any[]).reduce((sum, inv) => sum + (inv.total || 0), 0) / 100;
    const totalExpensesAmount = (expenses as any[]).reduce((sum, exp) => sum + (exp.amount || 0), 0) / 100;
    const netProfit = totalRevenue - totalExpensesAmount;

    setFinancialData({
      totalInvoices: invoices.length,
      totalPayments: payments.length,
      totalExpenses: expenses.length,
      totalRevenue,
      netProfit,
    });
  }, [invoices, payments, expenses]);

  const accountingModules = [
    {
      title: "Invoices",
      description: "Create and manage client invoices",
      icon: FileText,
      href: "/invoices",
      stats: { label: "Total Invoices", value: financialData.totalInvoices.toString() },
    },
    {
      title: "Payments",
      description: "Track incoming and outgoing payments",
      icon: DollarSign,
      href: "/payments",
      stats: { label: "Total Payments", value: financialData.totalPayments.toString() },
    },
    {
      title: "Expenses",
      description: "Record and manage business expenses",
      icon: Receipt,
      href: "/expenses",
      stats: { label: "Total Expenses", value: financialData.totalExpenses.toString() },
    },
    {
      title: "Chart of Accounts",
      description: "Manage your accounting structure",
      icon: BarChart3,
      href: "/chart-of-accounts",
      stats: { label: "Accounts", value: "0" },
    },
  ];

  return (
    <ModuleLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Accounting", href: "/accounting" },
      ]}
      title="Accounting"
      description="Manage invoices, payments, and financial records"
      icon={<CreditCard className="w-6 h-6" />}
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-3 flex-wrap">
          <Button onClick={() => navigate("/invoices/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
          <Button onClick={() => navigate("/payments/create")} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Payment
          </Button>
          <Button onClick={() => navigate("/expenses/create")} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Expense
          </Button>
        </div>

        {/* Accounting Modules Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {accountingModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.title}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(module.href)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{module.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">{module.description}</CardDescription>
                    </div>
                    <Icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{module.stats.value}</span>
                    <span className="text-xs text-muted-foreground">{module.stats.label}</span>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(module.href);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Overview of your financial position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">KES {financialData.totalRevenue.toLocaleString('en-KE', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">KES {(financialData.totalRevenue - financialData.netProfit).toLocaleString('en-KE', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Outstanding Invoices</p>
                <p className="text-2xl font-bold">{financialData.totalInvoices}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className={`text-2xl font-bold ${financialData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  KES {financialData.netProfit.toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}

