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

export default function ReceiptDetails() {
  const [, params] = useRoute("/receipts/:id");
  const [, navigate] = useLocation();
  const receiptId = params?.id;

  // Mock receipt data - in production, fetch from API
  const receipt = {
    id: receiptId,
    receiptNumber: "REC-00001",
    status: "received",
    issueDate: "2024-01-20",
    paymentMethod: "Bank Transfer",
    referenceNumber: "TXN-2024-001",
    client: {
      name: "Acme Corporation",
      email: "billing@acmecorp.com",
      phone: "+254 712 345 678",
      address: "456 Business Park, Westlands, Nairobi, Kenya",
    },
    project: "Website Redesign",
    items: [
      { description: "Payment for Invoice INV-2024-001", quantity: 1, rate: 986000, amount: 986000 },
    ],
    subtotal: 986000,
    tax: 0,
    discount: 0,
    total: 986000,
    notes: "Payment received and processed. Thank you!",
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "received":
        return "default";
      case "pending":
        return "outline";
      case "failed":
        return "destructive";
      case "draft":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received":
        return <CheckCircle2 className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "failed":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleDownload = () => {
    alert(`Downloading receipt ${receipt.receiptNumber} as PDF...`);
  };

  const handleEmail = () => {
    alert(`Sending receipt ${receipt.receiptNumber} to ${receipt.client.email}...`);
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
            <Button variant="ghost" size="icon" onClick={() => navigate("/receipts")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{receipt.receiptNumber}</h1>
              <p className="text-muted-foreground">Receipt for {receipt.client.name}</p>
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
            <Button onClick={() => navigate(`/receipts/${receiptId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Receipt
            </Button>
          </div>
        </div>

        {/* Receipt Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Receipt Details</CardTitle>
                <CardDescription>Complete receipt information and payment details</CardDescription>
              </div>
              <Badge variant={getStatusVariant(receipt.status)} className="gap-1 px-3 py-2">
                {getStatusIcon(receipt.status)}
                {receipt.status.toUpperCase()}
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
                <h3 className="font-semibold text-sm text-muted-foreground">RECEIVED FROM</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{receipt.client.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {receipt.client.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {receipt.client.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {receipt.client.address}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Receipt Meta */}
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receipt Number</p>
                <p className="text-sm font-semibold">{receipt.receiptNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receipt Date</p>
                <p className="text-sm font-semibold">{new Date(receipt.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <p className="text-sm font-semibold">{receipt.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reference Number</p>
                <p className="text-sm font-semibold">{receipt.referenceNumber}</p>
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
                  {receipt.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
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
                  <span className="font-medium">Ksh {receipt.subtotal.toLocaleString()}</span>
                </div>
                {receipt.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (16% VAT)</span>
                    <span className="font-medium">Ksh {receipt.tax.toLocaleString()}</span>
                  </div>
                )}
                {receipt.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-green-600">
                      -Ksh {receipt.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount Received</span>
                  <span>Ksh {receipt.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {receipt.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">{receipt.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

