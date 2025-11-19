import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Umbrella,
} from "lucide-react";

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: "annual" | "sick" | "unpaid" | "maternity" | "paternity";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "approved" | "pending" | "rejected";
  appliedDate: string;
}

export default function LeaveManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch real data from backend
  const { data: data = [], isLoading } = trpc.leave.list.useQuery();
  const utils = trpc.useUtils();


  const initialRequests: LeaveRequest[] = [
    {
      id: "1",
      employeeId: "EMP-001",
      employeeName: "John Doe",
      leaveType: "annual",
      startDate: "2024-11-01",
      endDate: "2024-11-05",
      days: 5,
      reason: "Family vacation",
      status: "approved",
      appliedDate: "2024-10-15",
    },
    {
      id: "2",
      employeeId: "EMP-002",
      employeeName: "Jane Smith",
      leaveType: "sick",
      startDate: "2024-10-25",
      endDate: "2024-10-27",
      days: 3,
      reason: "Medical appointment",
      status: "pending",
      appliedDate: "2024-10-20",
    },
    {
      id: "3",
      employeeId: "EMP-003",
      employeeName: "Michael Johnson",
      leaveType: "annual",
      startDate: "2024-12-20",
      endDate: "2024-12-31",
      days: 12,
      reason: "Year-end holiday",
      status: "pending",
      appliedDate: "2024-10-18",
    },
    {
      id: "4",
      employeeId: "EMP-004",
      employeeName: "Sarah Williams",
      leaveType: "maternity",
      startDate: "2024-11-15",
      endDate: "2025-02-15",
      days: 90,
      reason: "Maternity leave",
      status: "approved",
      appliedDate: "2024-09-01",
    },
  ];

  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.leaveType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "rejected":
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "annual":
        return "bg-blue-500/10 text-blue-500";
      case "sick":
        return "bg-red-500/10 text-red-500";
      case "unpaid":
        return "bg-gray-500/10 text-gray-500";
      case "maternity":
        return "bg-pink-500/10 text-pink-500";
      case "paternity":
        return "bg-purple-500/10 text-purple-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const totalDays = requests
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + r.days, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
            <p className="text-muted-foreground">Manage employee leave requests and approvals</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Leave Request
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">Leave requests approved</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDays}</div>
              <p className="text-xs text-muted-foreground">Days approved</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Leave</CardTitle>
              <Umbrella className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Currently on leave</p>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Leave Requests</CardTitle>
                <CardDescription>Review and manage leave applications</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search requests..."
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
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.employeeName}</div>
                        <div className="text-xs text-muted-foreground">{request.employeeId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLeaveTypeColor(request.leaveType)} variant="outline">
                        {request.leaveType}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{request.days} days</TableCell>
                    <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(request.status)} className="gap-1">
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButtons
                        id={request.id}
                        handlers={{
                          onView: (id) => handleView(id, "leave-request"),
                          onEdit: (id) => handleEdit(id, "leave-request"),
                          onDelete: (id) =>
                            handleDelete(id, "leave-request", () => {
                              setRequests(requests.filter((req) => req.id !== id));
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
    </DashboardLayout>
  );
}

