import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Edit,
  UserCheck,
  Clock,
  Umbrella,
} from "lucide-react";

export default function EmployeeDetails() {
  const [, params] = useRoute("/employees/:id");
  const [, navigate] = useLocation();
  const employeeId = params?.id;

  // Mock employee data - in production, fetch from API
  const employee = {
    id: employeeId,
    employeeId: "EMP-001",
    name: "John Doe",
    email: "john.doe@melitechsolutions.co.ke",
    phone: "+254 712 345 678",
    address: "123 Nairobi Street, Westlands, Nairobi",
    department: "Engineering",
    position: "Senior Developer",
    status: "active",
    joinDate: "2023-01-15",
    salary: 150000,
    avatar: null,
  };

  const attendanceRecords = [
    { date: "2024-10-21", clockIn: "08:30 AM", clockOut: "05:45 PM", hours: 9.25, status: "present" },
    { date: "2024-10-20", clockIn: "08:45 AM", clockOut: "06:00 PM", hours: 9.25, status: "present" },
    { date: "2024-10-19", clockIn: "09:15 AM", clockOut: "05:30 PM", hours: 8.25, status: "late" },
  ];

  const leaveHistory = [
    { type: "Annual Leave", startDate: "2024-09-01", endDate: "2024-09-05", days: 5, status: "approved" },
    { type: "Sick Leave", startDate: "2024-07-15", endDate: "2024-07-16", days: 2, status: "approved" },
  ];

  const payrollHistory = [
    { month: "October 2024", basic: 150000, allowances: 20000, deductions: 15000, net: 155000 },
    { month: "September 2024", basic: 150000, allowances: 20000, deductions: 15000, net: 155000 },
    { month: "August 2024", basic: 150000, allowances: 20000, deductions: 15000, net: 155000 },
  ];

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
      case "present":
        return <UserCheck className="h-3 w-3" />;
      case "late":
        return <Clock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/employees")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
              <p className="text-muted-foreground">{employee.employeeId} • {employee.position}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Employee
            </Button>
            <Badge variant={getStatusVariant(employee.status)} className="gap-1 px-3 py-1">
              {getStatusIcon(employee.status)}
              {employee.status}
            </Badge>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Department</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employee.department}</div>
              <p className="text-xs text-muted-foreground">{employee.position}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {employee.salary.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Monthly</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Join Date</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(employee.joinDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.floor((Date.now() - new Date(employee.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
              <Umbrella className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14 days</div>
              <p className="text-xs text-muted-foreground">Annual leave remaining</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Employee contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{employee.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{employee.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for detailed information */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave History</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
                <CardDescription>Last 30 days attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.clockIn}</TableCell>
                        <TableCell>{record.clockOut}</TableCell>
                        <TableCell>{record.hours} hrs</TableCell>
                        <TableCell>
                          <Badge variant={record.status === "present" ? "default" : "outline"}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leave History</CardTitle>
                <CardDescription>Past leave requests and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveHistory.map((leave, index) => (
                      <TableRow key={index}>
                        <TableCell>{leave.type}</TableCell>
                        <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>{leave.days} days</TableCell>
                        <TableCell>
                          <Badge variant="default">{leave.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payroll History</CardTitle>
                <CardDescription>Monthly salary breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Basic Salary</TableHead>
                      <TableHead className="text-right">Allowances</TableHead>
                      <TableHead className="text-right">Deductions</TableHead>
                      <TableHead className="text-right">Net Salary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollHistory.map((payroll, index) => (
                      <TableRow key={index}>
                        <TableCell>{payroll.month}</TableCell>
                        <TableCell className="text-right">Ksh {payroll.basic.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-green-600">
                          +Ksh {payroll.allowances.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          -Ksh {payroll.deductions.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          Ksh {payroll.net.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

