import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CreditCard, Building2, CheckCircle2, AlertCircle, Upload, Download } from "lucide-react";

export default function BankReconciliation() {
  const [selectedAccount, setSelectedAccount] = useState("main");
  const [reconciliationPeriod, setReconciliationPeriod] = useState("october");

  const bankAccounts = [
    { id: "main", name: "Main Business Account", balance: 45230.50, lastReconciled: "2024-09-30" },
    { id: "payroll", name: "Payroll Account", balance: 12450.00, lastReconciled: "2024-09-30" },
    { id: "savings", name: "Savings Account", balance: 85000.00, lastReconciled: "2024-09-15" },
  ];

  const bankTransactions = [
    { id: "TXN001", date: "2024-10-15", description: "Client Payment - ABC Corp", amount: 5000.00, status: "matched" },
    { id: "TXN002", date: "2024-10-14", description: "Supplier Payment - XYZ Ltd", amount: -2500.00, status: "matched" },
    { id: "TXN003", date: "2024-10-13", description: "Transfer from Payroll", amount: 3000.00, status: "unmatched" },
    { id: "TXN004", date: "2024-10-12", description: "Interest Deposit", amount: 125.50, status: "matched" },
    { id: "TXN005", date: "2024-10-11", description: "Bank Fee", amount: -50.00, status: "unmatched" },
  ];

  const systemTransactions = [
    { id: "INV001", date: "2024-10-15", description: "Invoice INV-2024-001", amount: 5000.00, status: "matched" },
    { id: "EXP001", date: "2024-10-14", description: "Expense - Office Supplies", amount: -2500.00, status: "matched" },
    { id: "PAY001", date: "2024-10-13", description: "Payroll Transfer", amount: 3000.00, status: "unmatched" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bank Reconciliation</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Match bank transactions with system records</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Import Bank Statement
          </Button>
        </div>

        {/* Account Selection */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Select Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} - Balance: KES {account.balance.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Reconciliation Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Bank Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">KES 45,230.50</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">As of Oct 15, 2024</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">System Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">KES 45,230.50</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">As of Oct 15, 2024</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Matched</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">4</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Unmatched</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Bank Transactions */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Bank Transactions</CardTitle>
            <CardDescription>Transactions from your bank statement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="text-sm">{txn.date}</TableCell>
                      <TableCell className="text-sm">{txn.description}</TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        KES {txn.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {txn.status === "matched" ? (
                          <div className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            Matched
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-yellow-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Unmatched
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="text-xs">
                          {txn.status === "matched" ? "View" : "Match"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Reconciliation Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700">Complete Reconciliation</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

