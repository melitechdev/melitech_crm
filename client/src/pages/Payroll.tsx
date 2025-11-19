import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Search,
  Download,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "paid" | "pending" | "processing";
  paymentDate: string;
  month: string;
}

export default function Payroll() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("2024-10");

  // Fetch real data from backend
  const { data: data = [], isLoading } = trpc.payroll.list.useQuery();
  const utils = trpc.useUtils();


  const initialRecords: PayrollRecord[] = [
    {
      id: "1",
      employeeId: "EMP-001",
      employeeName: "John Doe",
      department: "Engineering",
      basicSalary: 150000,
      allowances: 20000,
      deductions: 15000,
      netSalary: 155000,
      status: "paid",
      paymentDate: "2024-10-01",
      month: "2024-10",
    },
    {
      id: "2",
      employeeId: "EMP-002",
      employeeName: "Jane Smith",
      department: "Sales",
      basicSalary: 120000,
      allowances: 15000,
      deductions: 12000,
      netSalary: 123000,
      status: "paid",
      paymentDate: "2024-10-01",
      month: "2024-10",
    },
    {
      id: "3",
      employeeId: "EMP-003",
      employeeName: "Michael Johnson",
      department: "Finance",
      basicSalary: 100000,
      allowances: 10000,
      deductions: 10000,
      netSalary: 100000,
      status: "processing",
      paymentDate: "2024-10-01",
      month: "2024-10",
    },
    {
      id: "4",
      employeeId: "EMP-004",
      employeeName: "Sarah Williams",
      department: "HR",
      basicSalary: 110000,
      allowances: 12000,
      deductions: 11000,
      netSalary: 111000,
      status: "pending",
      paymentDate: "2024-10-01",
      month: "2024-10",
    },
  ];

  const [records] = useState<PayrollRecord[]>(initialRecords);

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesMonth = record.month === monthFilter;

    return matchesSearch && matchesStatus && matchesMonth;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "processing":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-3 w-3" />;
      case "pending":
        return <AlertCircle className="h-3 w-3" />;
      case "processing":
        return <Clock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const totalGrossPay = filteredRecords.reduce((sum, r) => sum + r.basicSalary + r.allowances, 0);
  const totalDeductions = filteredRecords.reduce((sum, r) => sum + r.deductions, 0);
  const totalNetPay = filteredRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const paidCount = filteredRecords.filter((r) => r.status === "paid").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
            <p className="text-muted-foreground">Process and manage employee salaries</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Payroll
            </Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Process Payroll
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gross Pay</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalGrossPay.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Before deductions</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalDeductions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">PAYE, NHIF, NSSF</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Net Pay</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalNetPay.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">After deductions</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidCount}</div>
              <p className="text-xs text-muted-foreground">Employees paid</p>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Records */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payroll Records</CardTitle>
                <CardDescription>Monthly salary processing</CardDescription>
              </div>
              <div className="flex gap-4">
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-10">October 2024</SelectItem>
                    <SelectItem value="2024-09">September 2024</SelectItem>
                    <SelectItem value="2024-08">August 2024</SelectItem>
                    <SelectItem value="2024-07">July 2024</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Basic Salary</TableHead>
                  <TableHead className="text-right">Allowances</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeId}</TableCell>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell className="text-muted-foreground">{record.department}</TableCell>
                    <TableCell className="text-right">
                      Ksh {record.basicSalary.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      +Ksh {record.allowances.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      -Ksh {record.deductions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      Ksh {record.netSalary.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(record.status)} className="gap-1">
                        {getStatusIcon(record.status)}
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

