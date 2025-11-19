import { useState } from "react";
import { ModuleLayout } from "@/components/ModuleLayout";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import {
  Plus,
  Search,
  Users,
  Building2,
  Calendar,
  DollarSign,
  UserCircle,
  Edit,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function HR() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);

  const employees = [
    {
      id: 1,
      name: "Alice Wanjiku",
      employeeId: "EMP-001",
      email: "alice@melitechsolutions.co.ke",
      phone: "+254 700 111 222",
      department: "Engineering",
      position: "Senior Developer",
      joinDate: "2022-01-15",
      salary: 120000,
      status: "active",
    },
    {
      id: 2,
      name: "Brian Omondi",
      employeeId: "EMP-002",
      email: "brian@melitechsolutions.co.ke",
      phone: "+254 700 222 333",
      department: "Sales",
      position: "Sales Manager",
      joinDate: "2021-06-01",
      salary: 100000,
      status: "active",
    },
    {
      id: 3,
      name: "Catherine Muthoni",
      employeeId: "EMP-003",
      email: "catherine@melitechsolutions.co.ke",
      phone: "+254 700 333 444",
      department: "Finance",
      position: "Accountant",
      joinDate: "2023-03-10",
      salary: 85000,
      status: "active",
    },
    {
      id: 4,
      name: "David Kiprop",
      employeeId: "EMP-004",
      email: "david@melitechsolutions.co.ke",
      phone: "+254 700 444 555",
      department: "Engineering",
      position: "UI/UX Designer",
      joinDate: "2022-09-20",
      salary: 90000,
      status: "active",
    },
  ];

  const departments = [
    { name: "Engineering", employees: 2, budget: 210000 },
    { name: "Sales", employees: 1, budget: 100000 },
    { name: "Finance", employees: 1, budget: 85000 },
  ];

  const leaveRequests = [
    {
      id: 1,
      employee: "Alice Wanjiku",
      type: "Annual Leave",
      from: "2024-11-01",
      to: "2024-11-05",
      days: 5,
      status: "pending",
    },
    {
      id: 2,
      employee: "Brian Omondi",
      type: "Sick Leave",
      from: "2024-10-28",
      to: "2024-10-29",
      days: 2,
      status: "approved",
    },
  ];

  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);
  const avgSalary = totalSalary / totalEmployees;

  const handleAddEmployee = () => {
    toast.success("Employee added successfully!");
    setIsAddEmployeeDialogOpen(false);
  };

  return (
    <ModuleLayout title="HR" description="Human resources management" icon={Users as any} breadcrumbs={[{ label: "Dashboard" }, { label: "HR" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Human Resources</h1>
            <p className="text-muted-foreground">Manage employees, departments, and payroll</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalSalary.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Monthly payroll</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {avgSalary.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Per employee</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="employees" className="space-y-6">
          <TabsList>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Employees</CardTitle>
                    <CardDescription>View and manage employee records</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Employee
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Employee</DialogTitle>
                          <DialogDescription>
                            Create a new employee record
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="fullName">Full Name *</Label>
                              <Input id="fullName" placeholder="Enter full name" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="employeeId">Employee ID *</Label>
                              <Input id="employeeId" placeholder="e.g., EMP-001" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email *</Label>
                              <Input id="email" type="email" placeholder="employee@company.com" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone</Label>
                              <Input id="phone" placeholder="+254 700 000 000" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="department">Department</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="engineering">Engineering</SelectItem>
                                  <SelectItem value="sales">Sales</SelectItem>
                                  <SelectItem value="finance">Finance</SelectItem>
                                  <SelectItem value="hr">Human Resources</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="position">Position</Label>
                              <Input id="position" placeholder="Job title" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="joinDate">Join Date</Label>
                              <Input id="joinDate" type="date" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="salary">Monthly Salary (KES)</Label>
                              <Input id="salary" type="number" placeholder="0.00" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsAddEmployeeDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAddEmployee}>Add Employee</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserCircle className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-muted-foreground">{employee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{employee.employeeId}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{employee.department}</Badge>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">Ksh {employee.salary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-500">
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" title="View">
                              <Eye className="h-4 w-4" />
                            </Button>
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
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {departments.map((dept, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Employees</span>
                      <span className="font-medium">{dept.employees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Budget</span>
                      <span className="font-medium">Ksh {dept.budget.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leave Management Tab */}
          <TabsContent value="leave" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Manage employee leave applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.employee}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{new Date(request.from).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(request.to).toLocaleDateString()}</TableCell>
                        <TableCell>{request.days}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className={
                              request.status === "approved" ? "bg-green-500" : ""
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === "pending" && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" title="Approve">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Reject">
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payroll Summary</CardTitle>
                    <CardDescription>Monthly payroll breakdown</CardDescription>
                  </div>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Process Payroll
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Gross Salary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Ksh {totalSalary.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Deductions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Ksh {(totalSalary * 0.15).toLocaleString()}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Net Payroll</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          Ksh {(totalSalary * 0.85).toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Gross Salary</TableHead>
                        <TableHead>PAYE</TableHead>
                        <TableHead>NHIF</TableHead>
                        <TableHead>NSSF</TableHead>
                        <TableHead>Net Salary</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => {
                        const paye = employee.salary * 0.10;
                        const nhif = 1700;
                        const nssf = 2160;
                        const net = employee.salary - paye - nhif - nssf;
                        return (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">{employee.name}</TableCell>
                            <TableCell>Ksh {employee.salary.toLocaleString()}</TableCell>
                            <TableCell>Ksh {paye.toLocaleString()}</TableCell>
                            <TableCell>Ksh {nhif.toLocaleString()}</TableCell>
                            <TableCell>Ksh {nssf.toLocaleString()}</TableCell>
                            <TableCell className="font-medium text-green-600">
                              Ksh {net.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}

