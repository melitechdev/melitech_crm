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

export default function EstimateDetails() {
  const [, params] = useRoute("/estimates/:id");
  const [, navigate] = useLocation();
  const estimateId = params?.id;

  // Mock estimate data - in production, fetch from API
  const estimate = {
    id: estimateId,
    estimateNumber: "EST-2024-001",
    status: "pending",
    issueDate: "2024-01-10",
    expiryDate: "2024-02-10",
    client: {
      name: "Acme Corporation",
      email: "john@acmecorp.com",
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
    notes: "This estimate is valid for 30 days from the issue date. Please contact us for any clarifications.",
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default";
      case "pending":
        return "outline";
      case "rejected":
        return "destructive";
      case "expired":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "rejected":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleDownload = () => {
    alert(`Downloading estimate ${estimate.estimateNumber} as PDF...`);
  };

  const handleEmail = () => {
    alert(`Sending estimate ${estimate.estimateNumber} to ${estimate.client.email}...`);
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
            <Button variant="ghost" size="icon" onClick={() => navigate("/estimates")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{estimate.estimateNumber}</h1>
              <p className="text-muted-foreground">Estimate for {estimate.client.name}</p>
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
            <Button onClick={() => navigate(`/estimates/${estimateId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Estimate
            </Button>
          </div>
        </div>

        {/* Estimate Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Estimate Details</CardTitle>
                <CardDescription>Complete estimate information and line items</CardDescription>
              </div>
              <Badge variant={getStatusVariant(estimate.status)} className="gap-1 px-3 py-2">
                {getStatusIcon(estimate.status)}
                {estimate.status.toUpperCase()}
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
                <h3 className="font-semibold text-sm text-muted-foreground">ESTIMATE FOR</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{estimate.client.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {estimate.client.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {estimate.client.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {estimate.client.address}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Estimate Meta */}
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estimate Number</p>
                <p className="text-sm font-semibold">{estimate.estimateNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                <p className="text-sm font-semibold">{new Date(estimate.issueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                <p className="text-sm font-semibold">{new Date(estimate.expiryDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Project</p>
                <p className="text-sm font-semibold">{estimate.project}</p>
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
                  {estimate.items.map((item, index) => (
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
                  <span className="font-medium">Ksh {estimate.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (16% VAT)</span>
                  <span className="font-medium">Ksh {estimate.tax.toLocaleString()}</span>
                </div>
                {estimate.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-green-600">
                      -Ksh {estimate.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Ksh {estimate.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {estimate.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">{estimate.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

