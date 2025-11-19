import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, Send, Download } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface LineItem {
  id: string;
  sno: number;
  description: string;
  uom: string; // Unit of Measurement
  qty: number;
  unitPrice: number;
  tax: number; // Tax percentage (default 16%)
  total: number;
}

interface DocumentFormProps {
  type: "invoice" | "estimate" | "receipt";
  onSave?: (data: any) => void;
  onSend?: (data: any) => void;
  initialData?: any;
}

export default function DocumentForm({ type, onSave, onSend, initialData }: DocumentFormProps) {
  const [documentNumber, setDocumentNumber] = useState(initialData?.documentNumber || "");
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [clientId, setClientId] = useState(initialData?.clientId || "");
  const [clientName, setClientName] = useState(initialData?.clientName || "");
  const [clientEmail, setClientEmail] = useState(initialData?.clientEmail || "");
  const [clientAddress, setClientAddress] = useState(initialData?.clientAddress || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [applyVAT, setApplyVAT] = useState(initialData?.applyVAT ?? false);
  const [vatPercentage, setVatPercentage] = useState(initialData?.vatPercentage ?? 16);

  // Fetch clients from backend
  const { data: clients = [] } = trpc.clients.list.useQuery();

  // Update client details when selected client changes - with proper dependency
  useEffect(() => {
    if (clientId && clients.length > 0) {
      const selectedClient = clients.find((c: any) => c.id === clientId);
      if (selectedClient) {
        setClientName(selectedClient.companyName || "");
        setClientEmail(selectedClient.email || "");
        setClientAddress(selectedClient.address || "");
      }
    }
  }, [clientId]); // Only depend on clientId, not clients array
  
  const [lineItems, setLineItems] = useState<LineItem[]>(initialData?.lineItems || [
    { id: "1", sno: 1, description: "", uom: "Pcs", qty: 1, unitPrice: 0, tax: 0, total: 0 }
  ]);

  // Calculate line total including tax
  const calculateLineTotal = useCallback((qty: number, unitPrice: number, taxPercent: number): number => {
    const subtotal = qty * unitPrice;
    const taxAmount = (subtotal * taxPercent) / 100;
    return subtotal + taxAmount;
  }, []);

  // Calculate document totals - memoized to prevent unnecessary recalculations
  const { subtotal, vat, grandTotal } = useMemo(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    const vat = applyVAT ? (subtotal * vatPercentage) / 100 : 0;
    const grandTotal = subtotal + vat;
    return { subtotal, vat, grandTotal };
  }, [lineItems, applyVAT, vatPercentage]);

  // Add new line item
  const addLineItem = useCallback(() => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      sno: lineItems.length + 1,
      description: "",
      uom: "Pcs",
      qty: 1,
      unitPrice: 0,
      tax: 0,
      total: 0
    };
    setLineItems(prev => [...prev, newItem]);
  }, [lineItems.length]);

  // Remove line item
  const removeLineItem = useCallback((id: string) => {
    if (lineItems.length === 1) {
      toast.error("Cannot remove the last item");
      return;
    }
    const updated = lineItems.filter(item => item.id !== id);
    const renumbered = updated.map((item, index) => ({ ...item, sno: index + 1 }));
    setLineItems(renumbered);
  }, [lineItems.length]);

  // Update line item
  const updateLineItem = useCallback((id: string, field: string, value: any) => {
    const updated = lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'qty' || field === 'unitPrice' || field === 'tax') {
          updatedItem.total = calculateLineTotal(updatedItem.qty, updatedItem.unitPrice, updatedItem.tax);
        }
        return updatedItem;
      }
      return item;
    });
    setLineItems(updated);
  }, [lineItems, calculateLineTotal]);

  // Handle save
  const handleSave = useCallback(() => {
    const data = {
      documentNumber,
      type,
      date,
      dueDate,
      clientId,
      clientName,
      clientEmail,
      clientAddress,
      lineItems,
      subtotal,
      vat,
      grandTotal,
      notes,
      applyVAT,
      vatPercentage
    };
    onSave?.(data);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} saved successfully`);
  }, [documentNumber, type, date, dueDate, clientId, clientName, clientEmail, clientAddress, lineItems, subtotal, vat, grandTotal, notes, applyVAT, vatPercentage, onSave]);

  // Handle send
  const handleSend = useCallback(() => {
    const data = {
      documentNumber,
      type,
      date,
      dueDate,
      clientId,
      clientName,
      clientEmail,
      clientAddress,
      lineItems,
      subtotal,
      vat,
      grandTotal,
      notes,
      applyVAT,
      vatPercentage
    };
    onSend?.(data);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} sent to ${clientEmail}`);
  }, [documentNumber, type, date, dueDate, clientId, clientName, clientEmail, clientAddress, lineItems, subtotal, vat, grandTotal, notes, applyVAT, vatPercentage, onSend]);

  const documentTitle = type === "invoice" ? "INVOICE" : type === "estimate" ? "QUOTATION" : "RECEIPT";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <img src="/logo.png" alt="Melitech Solutions" className="h-12 mb-2" />
            <h1 className="text-3xl font-bold text-primary">{documentTitle}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Melitech Solutions</p>
            <p className="text-sm text-muted-foreground">P.O. Box 12345-00100</p>
            <p className="text-sm text-muted-foreground">Nairobi, Kenya</p>
            <p className="text-sm text-muted-foreground">info@melitechsolutions.co.ke</p>
            <p className="text-sm text-muted-foreground">+254 700 000 000</p>
          </div>
        </div>

        {/* Document Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label>{documentTitle} Number</Label>
              <Input 
                value={documentNumber} 
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder={`${type.toUpperCase()}-2024/001`}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            {type !== "receipt" && (
              <div>
                <Label>Due Date</Label>
                <Input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label>Select Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Client Name</Label>
              <Input 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Company Name"
              />
            </div>
            <div>
              <Label>Client Email</Label>
              <Input 
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>
            <div>
              <Label>Client Address</Label>
              <Textarea 
                value={clientAddress} 
                onChange={(e) => setClientAddress(e.target.value)}
                placeholder="Client address"
                rows={2}
                disabled={!!clientId}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Line Items Table */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Items</h2>
          <Button onClick={addLineItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Line
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-2 text-left w-16">S/No</th>
                <th className="border p-2 text-left">Item Description</th>
                <th className="border p-2 text-left w-24">UOM</th>
                <th className="border p-2 text-right w-24">QTY</th>
                <th className="border p-2 text-right w-32">Unit Price</th>
                <th className="border p-2 text-right w-24">Tax (%)</th>
                <th className="border p-2 text-right w-32">Total</th>
                <th className="border p-2 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="border p-2 text-center">{item.sno}</td>
                  <td className="border p-2">
                    <Input
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      placeholder="Item description"
                      className="border-0 focus-visible:ring-0"
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      value={item.uom}
                      onChange={(e) => updateLineItem(item.id, 'uom', e.target.value)}
                      placeholder="Pcs"
                      className="border-0 focus-visible:ring-0"
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateLineItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                      className="border-0 focus-visible:ring-0 text-right"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="border-0 focus-visible:ring-0 text-right"
                      min="0"
                      step="0.01"
                    />
                  </td>
                  <td className="border p-2">
                    <Input
                      type="number"
                      value={item.tax}
                      onChange={(e) => updateLineItem(item.id, 'tax', parseFloat(e.target.value) || 0)}
                      className="border-0 focus-visible:ring-0 text-right"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </td>
                  <td className="border p-2 text-right font-semibold">
                    {item.total.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
                  </td>
                  <td className="border p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">
                {subtotal.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
              </span>
            </div>
            
            {/* Optional VAT Section */}
            <div className="py-2 border-b space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="applyVAT"
                  checked={applyVAT}
                  onChange={(e) => setApplyVAT(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="applyVAT" className="font-medium cursor-pointer">Apply VAT</Label>
              </div>
              {applyVAT && (
                <div className="flex items-center gap-2 ml-6">
                  <Label htmlFor="vatPercentage" className="text-sm">VAT Percentage:</Label>
                  <Input
                    id="vatPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={vatPercentage}
                    onChange={(e) => setVatPercentage(parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                  <span className="text-sm">%</span>
                </div>
              )}
            </div>
            
            {applyVAT && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">VAT ({vatPercentage}%):</span>
                <span className="font-semibold">
                  {vat.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-3 border-t-2 border-primary bg-primary/5">
              <span className="text-lg font-bold">Grand Total:</span>
              <span className="text-lg font-bold text-primary">
                {grandTotal.toLocaleString('en-KE', { style: 'currency', currency: 'KES' })}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Terms and Conditions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>1. All prices are in Kenya Shillings (KSHs). VAT is charged where applicable.</p>
          {type === "estimate" && (
            <p>2. This quotation is valid for 45 days from the date of generation.</p>
          )}
          <p>{type === "estimate" ? "3" : "2"}. Payment of 75% is expected before commencement of the project.</p>
          {type === "invoice" && (
            <p>3. Payment is due within 30 days from the invoice date unless otherwise agreed.</p>
          )}
        </div>

        <div className="mt-6">
          <Label>Additional Notes</Label>
          <Textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or terms..."
            rows={4}
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button 
          variant="outline" 
          onClick={handleSave}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save as Draft
        </Button>
        {type !== "receipt" && (
          <Button 
            onClick={handleSend}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        )}
        <Button 
          variant="outline"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}

