import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Download,
  Calendar,
  PieChart,
  FileSpreadsheet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/DatePicker";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";

export default function Reports() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  // Fetch real data from backend
  const { data: invoices = [] } = trpc.invoices.list.useQuery();
  const { data: clients = [] } = trpc.clients.list.useQuery();
  const { data: payments = [] } = trpc.payments.list.useQuery();
  const { data: expenses = [] } = trpc.expenses.list.useQuery();

  // Calculate real sales data from invoices
  const salesData = useMemo(() => {
    const monthlyData: { [key: string]: { revenue: number; invoices: number; clients: Set<string> } } = {};
    
    (invoices as any[]).forEach((invoice) => {
      const date = new Date(invoice.issueDate);
      const monthKey = date.toLocaleString('en-US', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, invoices: 0, clients: new Set() };
      }
      monthlyData[monthKey].revenue += (invoice.total || 0) / 100;
      monthlyData[monthKey].invoices += 1;
      monthlyData[monthKey].clients.add(invoice.clientId);
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue * 100,
      invoices: data.invoices,
      clients: data.clients.size,
    }));
  }, [invoices]);

  // Calculate financial metrics
  const totalRevenue = (invoices as any[]).reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalExpenses = (expenses as any[]).reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalInvoices = invoices.length;
  const avgMonthlyRevenue = salesData.length > 0 ? salesData.reduce((sum, d) => sum + d.revenue, 0) / salesData.length : 0;

  const topClients = useMemo(() => {
    const clientRevenue: { [key: string]: { name: string; revenue: number; invoices: number } } = {};
    
    (invoices as any[]).forEach((invoice) => {
      if (!clientRevenue[invoice.clientId]) {
        clientRevenue[invoice.clientId] = { name: invoice.clientName || 'Unknown', revenue: 0, invoices: 0 };
      }
      clientRevenue[invoice.clientId].revenue += (invoice.total || 0) / 100;
      clientRevenue[invoice.clientId].invoices += 1;
    });

    return Object.values(clientRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(c => ({ name: c.name, revenue: c.revenue * 100, invoices: c.invoices }));
  }, [invoices]);

  const productPerformance = [
    { product: "Website Development", sold: 15, revenue: 2250000 },
    { product: "Mobile App Development", sold: 8, revenue: 2400000 },
    { product: "CRM System License", sold: 45, revenue: 2250000 },
  ];

  const financialData = [
    { category: "Revenue", amount: totalRevenue, percentage: 100 },
    { category: "Expenses", amount: totalExpenses, percentage: totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0 },
    { category: "Net Profit", amount: totalRevenue - totalExpenses, percentage: totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0 },
  ];

  const handleExport = (reportType: string, format: string) => {
    console.log(`Exporting ${reportType} as ${format}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-2">Comprehensive business insights and performance metrics</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("sales", "pdf")}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("sales", "excel")}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {(totalRevenue / 100).toLocaleString('en-KE', { maximumFractionDigits: 0 })}</div>
              <p className="text-xs text-muted-foreground">From {totalInvoices} invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {(totalExpenses / 100).toLocaleString('en-KE', { maximumFractionDigits: 0 })}</div>
              <p className="text-xs text-muted-foreground">{expenses.length} expense records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${(totalRevenue - totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                KES {((totalRevenue - totalExpenses) / 100).toLocaleString('en-KE', { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-muted-foreground">Revenue minus expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">Total registered clients</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Sales Report</TabsTrigger>
            <TabsTrigger value="clients">Top Clients</TabsTrigger>
            <TabsTrigger value="financial">Financial Summary</TabsTrigger>
          </TabsList>

          {/* Sales Report Tab */}
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Overview</CardTitle>
                <CardDescription>Revenue and invoice trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Invoices</TableHead>
                        <TableHead className="text-right">Avg Invoice Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.length > 0 ? (
                        salesData.map((item) => (
                          <TableRow key={item.month}>
                            <TableCell>{item.month}</TableCell>
                            <TableCell className="text-right font-semibold">
                              KES {(item.revenue / 100).toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                            </TableCell>
                            <TableCell className="text-right">{item.invoices}</TableCell>
                            <TableCell className="text-right">
                              KES {item.invoices > 0 ? ((item.revenue / item.invoices) / 100).toLocaleString('en-KE', { maximumFractionDigits: 0 }) : '0'}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No sales data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Clients Tab */}
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Clients by Revenue</CardTitle>
                <CardDescription>Your most valuable clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead className="text-right">Total Revenue</TableHead>
                        <TableHead className="text-right">Number of Invoices</TableHead>
                        <TableHead className="text-right">Avg Invoice Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topClients.length > 0 ? (
                        topClients.map((client) => (
                          <TableRow key={client.name}>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell className="text-right">
                              KES {(client.revenue / 100).toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                            </TableCell>
                            <TableCell className="text-right">{client.invoices}</TableCell>
                            <TableCell className="text-right">
                              KES {client.invoices > 0 ? ((client.revenue / client.invoices) / 100).toLocaleString('en-KE', { maximumFractionDigits: 0 }) : '0'}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No client data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Summary Tab */}
          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Overall financial position</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm font-semibold">
                          KES {(item.amount / 100).toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {item.percentage.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

