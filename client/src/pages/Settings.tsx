import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  Settings as SettingsIcon,
  Building2,
  FileText,
  Hash,
  Upload,
  Save,
} from "lucide-react";

export default function Settings() {
  const [companyInfo, setCompanyInfo] = useState({
    name: "Melitech Solutions",
    tagline: "Shaping Technology!!!",
    email: "info@melitechsolutions.co.ke",
    phone: "+254(0)712 23 6643",
    website: "www.melitechsolutions.co.ke",
    address: "Tropicana, Kitengela, Kajiado County",
    poBox: "P.O BOX 85845 - 00200, Nairobi",
    taxId: "KRA PIN: A123456789X",
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: "Kenya Commercial Bank",
    branch: "Kitengela",
    accountNumber: "1295660644",
    mpesaPaybill: "522522",
    mpesaAccount: "1295660644",
  });

  const [documentNumbers, setDocumentNumbers] = useState({
    invoicePrefix: "INV",
    invoiceNext: "2024-004",
    quotePrefix: "QUOT",
    quoteNext: "2025/10/004",
    receiptPrefix: "REC",
    receiptNext: "00179",
    proposalPrefix: "PROP",
    proposalNext: "2024-001",
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedCompanyInfo = localStorage.getItem("companyInfo");
    const savedBankDetails = localStorage.getItem("bankDetails");
    const savedDocNumbers = localStorage.getItem("documentNumbers");
    
    if (savedCompanyInfo) setCompanyInfo(JSON.parse(savedCompanyInfo));
    if (savedBankDetails) setBankDetails(JSON.parse(savedBankDetails));
    if (savedDocNumbers) setDocumentNumbers(JSON.parse(savedDocNumbers));
  }, []);

  const handleSaveCompany = () => {
    try {
      localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
      toast.success("Company information saved successfully!");
    } catch (error) {
      toast.error("Failed to save company information");
    }
  };

  const handleSaveBank = () => {
    try {
      localStorage.setItem("bankDetails", JSON.stringify(bankDetails));
      toast.success("Bank details saved successfully!");
    } catch (error) {
      toast.error("Failed to save bank details");
    }
  };

  const handleSaveDocNumbers = () => {
    try {
      localStorage.setItem("documentNumbers", JSON.stringify(documentNumbers));
      toast.success("Document numbering updated successfully!");
    } catch (error) {
      toast.error("Failed to save document numbering");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your CRM system and company information
          </p>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList>
            <TabsTrigger value="company">
              <Building2 className="mr-2 h-4 w-4" />
              Company Info
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="mr-2 h-4 w-4" />
              Document Templates
            </TabsTrigger>
            <TabsTrigger value="numbering">
              <Hash className="mr-2 h-4 w-4" />
              Document Numbering
            </TabsTrigger>
          </TabsList>

          {/* Company Information Tab */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company details that appear on invoices and quotations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={companyInfo.tagline}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, tagline: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="poBox">P.O. Box</Label>
                    <Input
                      id="poBox"
                      value={companyInfo.poBox}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, poBox: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Physical Address</Label>
                  <Textarea
                    id="address"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / KRA PIN</Label>
                  <Input
                    id="taxId"
                    value={companyInfo.taxId}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, taxId: e.target.value })}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 border rounded-lg flex items-center justify-center bg-muted">
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: PNG or SVG, 500x500px, max 2MB
                  </p>
                </div>

                <Separator />

                <Button onClick={handleSaveCompany}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Company Information
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bank Account Details</CardTitle>
                <CardDescription>
                  Payment information displayed on invoices and quotations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      value={bankDetails.branch}
                      onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mpesaPaybill">M-Pesa Paybill</Label>
                    <Input
                      id="mpesaPaybill"
                      value={bankDetails.mpesaPaybill}
                      onChange={(e) => setBankDetails({ ...bankDetails, mpesaPaybill: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mpesaAccount">M-Pesa Account Number</Label>
                    <Input
                      id="mpesaAccount"
                      value={bankDetails.mpesaAccount}
                      onChange={(e) => setBankDetails({ ...bankDetails, mpesaAccount: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveBank}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Bank Details
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Templates Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Template</CardTitle>
                  <CardDescription>Customize your invoice layout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-[8.5/11] border rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Custom Template
                  </Button>
                  <Button className="w-full">Preview Template</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quotation Template</CardTitle>
                  <CardDescription>Customize your quotation layout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-[8.5/11] border rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Custom Template
                  </Button>
                  <Button className="w-full">Preview Template</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receipt Template</CardTitle>
                  <CardDescription>Customize your receipt layout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-[8.5/11] border rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Custom Template
                  </Button>
                  <Button className="w-full">Preview Template</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Proposal Template</CardTitle>
                  <CardDescription>Customize your proposal layout</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-[8.5/11] border rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Custom Template
                  </Button>
                  <Button className="w-full">Preview Template</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Document Numbering Tab */}
          <TabsContent value="numbering" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Increment Document Numbers</CardTitle>
                <CardDescription>
                  Configure automatic numbering for invoices, quotations, receipts, and proposals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Invoice Numbering</h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoicePrefix">Prefix</Label>
                        <Input
                          id="invoicePrefix"
                          value={documentNumbers.invoicePrefix}
                          onChange={(e) => setDocumentNumbers({ ...documentNumbers, invoicePrefix: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="invoiceNext">Next Number</Label>
                        <Input
                          id="invoiceNext"
                          value={documentNumbers.invoiceNext}
                          onChange={(e) => setDocumentNumbers({ ...documentNumbers, invoiceNext: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Next invoice: {documentNumbers.invoicePrefix}-{documentNumbers.invoiceNext}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Quotation Numbering</h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quotePrefix">Prefix</Label>
                        <Input
                          id="quotePrefix"
                          value={documentNumbers.quotePrefix}
                          onChange={(e) => setDocumentNumbers({ ...documentNumbers, quotePrefix: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quoteNext">Next Number</Label>
                        <Input
                          id="quoteNext"
                          value={documentNumbers.quoteNext}
                          onChange={(e) => setDocumentNumbers({ ...documentNumbers, quoteNext: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Next quote: {documentNumbers.quotePrefix}-{documentNumbers.quoteNext}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Receipt Numbering</h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="receiptPrefix">Prefix</Label>
                        <Input
                          id="receiptPrefix"
                          value={documentNumbers.receiptPrefix}
                          onChange={(e) => setDocumentNumbers({ ...documentNumbers, receiptPrefix: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="receiptNext">Next Number</Label>
                        <Input
                          id="receiptNext"
                          value={documentNumbers.receiptNext}
                          onChange={(e) => setDocumentNumbers({ ...documentNumbers, receiptNext: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Next receipt: {documentNumbers.receiptPrefix}-{documentNumbers.receiptNext}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Proposal Numbering</h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="proposalPrefix">Prefix</Label>
                        <Input
                          id="proposalPrefix"
                          value={documentNumbers.proposalPrefix}
                          onChange={(e) => setDocumentNumbers({ ...documentNumbers, proposalPrefix: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="proposalNext">Next Number</Label>
                        <Input
                          id="proposalNext"
                          value={documentNumbers.proposalNext}
                          onChange={(e) => setDocumentNumbers({ ...documentNumbers, proposalNext: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Next proposal: {documentNumbers.proposalPrefix}-{documentNumbers.proposalNext}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <Button onClick={handleSaveDocNumbers}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Document Numbering
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

