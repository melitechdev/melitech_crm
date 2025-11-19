import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { ModuleLayout } from "@/components/ModuleLayout";
import ActionButtons from "@/components/ActionButtons";
import { handleView, handleEdit, handleDelete } from "@/lib/actions";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Plus,
  UserCheck,
  UserX,
  Briefcase,
  Mail,
  Phone,
} from "lucide-react";

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "on-leave";
  joinDate: string;
  salary: number;
}

export default function Employees() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch real data from backend
  const { data: data = [], isLoading } = trpc.employees.list.useQuery();
  const utils = trpc.useUtils();

  
  const initialEmployees: Employee[] = [
    {
      id: "1",
      employeeId: "EMP-001",
      name: "John Doe",
      email: "john.doe@melitechsolutions.co.ke",
      phone: "+254 712 345 678",
      department: "Engineering",
      position: "Senior Developer",
      status: "active",
      joinDate: "2023-01-15",
      salary: 150000,
    },
    {
      id: "2",
      employeeId: "EMP-002",
      name: "Jane Smith",
      email: "jane.smith@melitechsolutions.co.ke",
      phone: "+254 723 456 789",
      department: "Sales",
      position: "Sales Manager",
      status: "active",
      joinDate: "2023-03-20",
      salary: 120000,
    },
    {
      id: "3",
      employeeId: "EMP-003",
      name: "Michael Johnson",
      email: "michael.j@melitechsolutions.co.ke",
      phone: "+254 734 567 890",
      department: "Finance",
      position: "Accountant",
      status: "on-leave",
      joinDate: "2023-06-10",
      salary: 100000,
    },
    {
      id: "4",
      employeeId: "EMP-004",
      name: "Sarah Williams",
      email: "sarah.w@melitechsolutions.co.ke",
      phone: "+254 745 678 901",
      department: "HR",
      position: "HR Manager",
      status: "active",
      joinDate: "2022-11-05",
      salary: 110000,
    },
  ];

  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    status: "active",
  });

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "on-leave":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <UserCheck className="h-3 w-3" />;
      case "inactive":
        return <UserX className="h-3 w-3" />;
      case "on-leave":
        return <Briefcase className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department) {
      alert("Please fill in all required fields");
      return;
    }

    const employee: Employee = {
      id: String(employees.length + 1),
      employeeId: `EMP-${String(employees.length + 1).padStart(3, "0")}`,
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone || "",
      department: newEmployee.department,
      position: newEmployee.position || "",
      status: (newEmployee.status as "active" | "inactive" | "on-leave") || "active",
      joinDate: new Date().toISOString().split("T")[0],
      salary: newEmployee.salary || 0,
    };

    setEmployees([...employees, employee]);
    setIsAddDialogOpen(false);
    setNewEmployee({ status: "active" });
  };

  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const onLeaveEmployees = employees.filter((e) => e.status === "on-leave").length;
  const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);

  return (
    <ModuleLayout
      title="Employees"
      description="Manage your workforce and employee information"
      icon={<Users className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "HR", href: "/hr" },
        { label: "Employees" },
      ]}
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter the employee details below to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newEmployee.name || ""}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email || ""}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      placeholder="john.doe@melitechsolutions.co.ke"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newEmployee.phone || ""}
                      onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                      placeholder="+254 712 345 678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={newEmployee.department}
                      onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newEmployee.position || ""}
                      onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                      placeholder="Senior Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary (Ksh)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={newEmployee.salary || ""}
                      onChange={(e) =>
                        setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })
                      }
                      placeholder="100000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                    <Select
                    value={newEmployee.status}
                    onValueChange={(value) => setNewEmployee({ ...newEmployee, status: value as "active" | "inactive" | "on-leave" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEmployee}>Add Employee</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      }
    >
      <div className="space-y-6">

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-xs text-muted-foreground">All employees</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEmployees}</div>
              <p className="text-xs text-muted-foreground">Currently working</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Leave</CardTitle>
              <Briefcase className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onLeaveEmployees}</div>
              <p className="text-xs text-muted-foreground">Out of office</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalSalary.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Monthly</p>
            </CardContent>
          </Card>
        </div>

        {/* Employee List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Employees</CardTitle>
                <CardDescription>Manage your employee records</CardDescription>
              </div>
              <div className="flex gap-4">
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
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
                  <TableHead>Position</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.employeeId}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell className="text-muted-foreground">{employee.position}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Mail className="h-3 w-3" />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {employee.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(employee.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(employee.status)} className="gap-1">
                        {getStatusIcon(employee.status)}
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButtons
                        id={employee.id}
                        handlers={{
                          onView: (id) => handleView(id, "employee", navigate),
                          onEdit: (id) => handleEdit(id, "employee"),
                          onDelete: (id) =>
                            handleDelete(id, "employee", () => {
                              setEmployees(employees.filter((emp) => emp.id !== id));
                            }),
                        }}
                        showView={true}
                        showEdit={true}
                        showDelete={true}
                        variant="dropdown"
                      />
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

