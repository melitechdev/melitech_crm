import { ModuleLayout } from "@/components/ModuleLayout";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Plus, Search, Edit, Trash2, TrendingUp, TrendingDown, Layers } from "lucide-react";
import { useState } from "react";

export default function ChartOfAccounts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const accounts = [
    // Assets
    { id: "1", code: "1000", name: "Cash and Cash Equivalents", type: "asset", balance: 2450000, parent: null },
    { id: "2", code: "1100", name: "Accounts Receivable", type: "asset", balance: 650000, parent: null },
    { id: "3", code: "1200", name: "Inventory", type: "asset", balance: 320000, parent: null },
    { id: "4", code: "1500", name: "Fixed Assets", type: "asset", balance: 1500000, parent: null },
    
    // Liabilities
    { id: "5", code: "2000", name: "Accounts Payable", type: "liability", balance: 280000, parent: null },
    { id: "6", code: "2100", name: "Accrued Expenses", type: "liability", balance: 150000, parent: null },
    { id: "7", code: "2500", name: "Long-term Debt", type: "liability", balance: 500000, parent: null },
    
    // Equity
    { id: "8", code: "3000", name: "Owner's Equity", type: "equity", balance: 3000000, parent: null },
    { id: "9", code: "3100", name: "Retained Earnings", type: "equity", balance: 990000, parent: null },
    
    // Revenue
    { id: "10", code: "4000", name: "Service Revenue", type: "revenue", balance: 3810000, parent: null },
    { id: "11", code: "4100", name: "Product Sales", type: "revenue", balance: 1200000, parent: null },
    
    // Expenses
    { id: "12", code: "5000", name: "Salaries and Wages", type: "expense", balance: 1800000, parent: null },
    { id: "13", code: "5100", name: "Rent Expense", type: "expense", balance: 600000, parent: null },
    { id: "14", code: "5200", name: "Utilities", type: "expense", balance: 120000, parent: null },
    { id: "15", code: "5300", name: "Office Supplies", type: "expense", balance: 85000, parent: null },
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      asset: "text-blue-600 bg-blue-100",
      liability: "text-red-600 bg-red-100",
      equity: "text-purple-600 bg-purple-100",
      revenue: "text-green-600 bg-green-100",
      expense: "text-orange-600 bg-orange-100",
    };
    return colors[type as keyof typeof colors];
  };

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.includes(searchTerm);
    const matchesType = typeFilter === "all" || account.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalAssets = accounts.filter(a => a.type === "asset").reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === "liability").reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = accounts.filter(a => a.type === "equity").reduce((sum, a) => sum + a.balance, 0);
  const totalRevenue = accounts.filter(a => a.type === "revenue").reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = accounts.filter(a => a.type === "expense").reduce((sum, a) => sum + a.balance, 0);

  return (
    <ModuleLayout
      title="Chart of Accounts"
      description="Manage your accounting chart of accounts"
      icon={<BookOpen className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Accounting", href: "/" },
        { label: "Chart of Accounts", href: "/chart-of-accounts" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
                <DialogDescription>Add a new account to your chart of accounts</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Account Code</Label>
                    <Input id="code" placeholder="e.g., 1000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Account Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asset">Asset</SelectItem>
                        <SelectItem value="liability">Liability</SelectItem>
                        <SelectItem value="equity">Equity</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Account Name</Label>
                  <Input id="name" placeholder="Enter account name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Account (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter account description" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">Opening Balance (Ksh)</Label>
                  <Input id="balance" type="number" placeholder="0" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Create Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalAssets.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{accounts.filter(a => a.type === "asset").length} accounts</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalLiabilities.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{accounts.filter(a => a.type === "liability").length} accounts</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalEquity.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{accounts.filter(a => a.type === "equity").length} accounts</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{accounts.filter(a => a.type === "revenue").length} accounts</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{accounts.filter(a => a.type === "expense").length} accounts</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Accounts</CardTitle>
            <CardDescription>View and manage your chart of accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="asset">Assets</SelectItem>
                  <SelectItem value="liability">Liabilities</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-mono font-medium">{account.code}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${getTypeColor(account.type)}`}>
                        {account.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      Ksh {account.balance.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}

