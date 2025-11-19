import DashboardLayout from "@/components/DashboardLayout";
import React, { useState, useEffect, useCallback } from "react";
import DocumentForm from "@/components/forms/DocumentForm";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function CreateInvoice() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [isLoadingNumber, setIsLoadingNumber] = useState(false);
  const getNextNumberMutation = trpc.settings.getNextDocumentNumber.useMutation();

  // Generate invoice number on component mount (only once)
  useEffect(() => {
    let isMounted = true;

    const generateNumber = async () => {
      setIsLoadingNumber(true);
      try {
        const result = await getNextNumberMutation.mutateAsync({ documentType: 'invoice' });
        if (isMounted) {
          setInvoiceNumber(result.documentNumber || '');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to generate invoice number:', error);
          toast.error('Failed to generate invoice number');
        }
      } finally {
        if (isMounted) {
          setIsLoadingNumber(false);
        }
      }
    };

    generateNumber();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - run only once on mount

  const createInvoiceMutation = trpc.invoices.create.useMutation({
    onSuccess: () => {
      toast.success("Invoice created successfully!");
      utils.invoices.list.invalidate();
      // Navigate back to invoices list after a delay
      setTimeout(() => setLocation("/invoices"), 1500);
    },
    onError: (error) => {
      toast.error(`Failed to create invoice: ${error.message}`);
    },
  });

  const handleSave = useCallback((data: any) => {
    if (!invoiceNumber || !data.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const subtotal = data.subtotal || 0;
    const taxAmount = data.vat || 0;
    const total = data.grandTotal || (subtotal + taxAmount);

    const invoiceData = {
      invoiceNumber: invoiceNumber,
      clientId: "client_" + Date.now(),
      issueDate: new Date(data.date),
      dueDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal: Math.round(subtotal * 100),
      taxAmount: Math.round(taxAmount * 100),
      discountAmount: 0,
      total: Math.round(total * 100),
      status: "draft" as const,
      notes: data.notes || "",
      terms: "",
    };
    
    createInvoiceMutation.mutate(invoiceData);
  }, [invoiceNumber, createInvoiceMutation]);

  const handleSend = useCallback((data: any) => {
    if (!invoiceNumber || !data.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const subtotal = data.subtotal || 0;
    const taxAmount = data.vat || 0;
    const total = data.grandTotal || (subtotal + taxAmount);

    const invoiceData = {
      invoiceNumber: invoiceNumber,
      clientId: "client_" + Date.now(),
      issueDate: new Date(data.date),
      dueDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal: Math.round(subtotal * 100),
      taxAmount: Math.round(taxAmount * 100),
      discountAmount: 0,
      total: Math.round(total * 100),
      status: "sent" as const,
      notes: data.notes || "",
      terms: "",
    };
    
    createInvoiceMutation.mutate(invoiceData);
  }, [invoiceNumber, createInvoiceMutation]);

  if (isLoadingNumber) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-lg text-gray-500">Loading invoice number...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DocumentForm 
        type="invoice"
        initialData={{ documentNumber: invoiceNumber }}
        onSave={handleSave}
        onSend={handleSend}
      />
    </DashboardLayout>
  );
}

