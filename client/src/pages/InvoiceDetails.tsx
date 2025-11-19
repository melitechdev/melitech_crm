import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Download,
  Send,
  Edit,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function InvoiceDetails() {
  const [, params] = useRoute("/invoices/:id");
  const [, navigate] = useLocation();
  const invoiceId = params?.id;

  // Mock invoice data - in production, fetch from API
  const invoice = {
    id: invoiceId,
    invoiceNumber: "INV-2024-001",
    status: "paid",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    paidDate: "2024-02-10",
    client: {
      name: "Acme Corporation",
      email: "billing@acmecorp.com",
      phone: "+254 712 345 678",
      address: "456 Business Park, Westlands, Nairobi, Kenya",
    },
    project: "Website Redesign",
    items: [
      { description: "UI/UX Design", quantity: 40, rate: 5000, amount: 200000 },
      { description: "Frontend Development", quantity: 80, rate: 4000, amount: 320000 },
      { description: "Backend Development", quantity: 60, rate: 4500, amount: 270000 },
      { description: "Testing & QA", quantity: 20, rate: 3000, amount: 60000 },
    ],
    subtotal: 850000,
    tax: 136000, // 16% VAT
    discount: 0,
    total: 986000,
    amountPaid: 986000,
    balance: 0,
    notes: "Payment terms: Net 30 days. Thank you for your business!",
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "outline";
      case "overdue":
        return "destructive";
      case "draft":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "overdue":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleDownload = () => {
    alert(`Downloading invoice ${invoice.invoiceNumber} as PDF...`);
  };

  const handleEmail = () => {
    alert(`Sending invoice ${invoice.invoiceNumber} to ${invoice.client.email}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="print-area space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/invoices")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{invoice.invoiceNumber}</h1>
              <p className="text-muted-foreground">Invoice for {invoice.client.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handleEmail}>
              <Send className="mr-2 h-4 w-4" />
              Send Email
            </Button>
            <Button onClick={() => navigate(`/invoices/${invoiceId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Invoice
            </Button>
          </div>
        </div>

        {/* Invoice Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Invoice Details</CardTitle>
                <CardDescription>Complete invoice information and line items</CardDescription>
              </div>
              <Badge variant={getStatusVariant(invoice.status)} className="gap-1 px-3 py-2">
                {getStatusIcon(invoice.status)}
                {invoice.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company & Client Info */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* From */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">FROM</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Melitech Solutions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    info@melitechsolutions.co.ke
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    +254 700 000 000
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Nairobi, Kenya
                  </div>
                </div>
              </div>

              {/* To */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">BILL TO</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{invoice.client.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {invoice.client.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {invoice.client.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {invoice.client.address}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Invoice Meta */}
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                <p className="text-sm font-semibold">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                <p className="text-sm font-semibold">{new Date(invoice.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                <p className="text-sm font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Project</p>
                <p className="text-sm font-semibold">{invoice.project}</p>
              </div>
            </div>

            <Separator />

            {/* Line Items */}
            <div>
              <h3 className="font-semibold mb-4">Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity} hrs</TableCell>
                      <TableCell className="text-right">Ksh {item.rate.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">
                        Ksh {item.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator />

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">Ksh {invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (16% VAT)</span>
                  <span className="font-medium">Ksh {invoice.tax.toLocaleString()}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-green-600">
                      -Ksh {invoice.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Ksh {invoice.total.toLocaleString()}</span>
                </div>
                {invoice.amountPaid > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="font-medium text-green-600">
                        Ksh {invoice.amountPaid.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Balance Due</span>
                      <span className={invoice.balance === 0 ? "text-green-600" : "text-red-600"}>
                        Ksh {invoice.balance.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

