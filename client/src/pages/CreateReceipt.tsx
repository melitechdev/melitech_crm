import DashboardLayout from "@/components/DashboardLayout";
import React, { useState, useEffect, useCallback } from "react";
import DocumentForm from "@/components/forms/DocumentForm";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function CreateReceipt() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [receiptNumber, setReceiptNumber] = useState<string>("");
  const [isLoadingNumber, setIsLoadingNumber] = useState(false);
  const getNextNumberMutation = trpc.settings.getNextDocumentNumber.useMutation();

  // Generate receipt number on component mount (only once)
  useEffect(() => {
    let isMounted = true;

    const generateNumber = async () => {
      setIsLoadingNumber(true);
      try {
        const result = await getNextNumberMutation.mutateAsync({ documentType: 'receipt' });
        if (isMounted) {
          setReceiptNumber(result.documentNumber || '');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to generate receipt number:', error);
          toast.error('Failed to generate receipt number');
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

  const createReceiptMutation = trpc.receipts.create.useMutation({
    onSuccess: () => {
      toast.success("Receipt created successfully!");
      utils.receipts.list.invalidate();
      setTimeout(() => setLocation("/receipts"), 1500);
    },
    onError: (error: any) => {
      toast.error(`Failed to create receipt: ${error.message}`);
    },
  });

  const handleSave = useCallback((data: any) => {
    if (!receiptNumber || !data.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const receiptData = {
      receiptNumber: receiptNumber,
      clientId: "client_" + Date.now(),
      paymentId: "payment_" + Date.now(),
      amount: Math.round((data.grandTotal || 0) * 100),
      paymentMethod: "cash" as const,
      receiptDate: new Date(data.date),
      notes: data.notes || "",
    };
    
    createReceiptMutation.mutate(receiptData);
  }, [receiptNumber, createReceiptMutation]);

  const handleSend = useCallback((data: any) => {
    if (!receiptNumber || !data.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const receiptData = {
      receiptNumber: receiptNumber,
      clientId: "client_" + Date.now(),
      paymentId: "payment_" + Date.now(),
      amount: Math.round((data.grandTotal || 0) * 100),
      paymentMethod: "cash" as const,
      receiptDate: new Date(data.date),
      notes: data.notes || "",
    };
    
    createReceiptMutation.mutate(receiptData);
  }, [receiptNumber, createReceiptMutation]);

  if (isLoadingNumber) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-lg text-gray-500">Loading receipt number...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DocumentForm 
        type="receipt"
        initialData={{ documentNumber: receiptNumber }}
        onSave={handleSave}
        onSend={handleSend}
      />
    </DashboardLayout>
  );
}

