import DashboardLayout from "@/components/DashboardLayout";
import React, { useState, useEffect, useCallback } from "react";
import DocumentForm from "@/components/forms/DocumentForm";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function CreateEstimate() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [estimateNumber, setEstimateNumber] = useState<string>("");
  const [isLoadingNumber, setIsLoadingNumber] = useState(false);
  const getNextNumberMutation = trpc.settings.getNextDocumentNumber.useMutation();

  // Generate estimate number on component mount (only once)
  useEffect(() => {
    let isMounted = true;

    const generateNumber = async () => {
      setIsLoadingNumber(true);
      try {
        const result = await getNextNumberMutation.mutateAsync({ documentType: 'estimate' });
        if (isMounted) {
          setEstimateNumber(result.documentNumber || '');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to generate estimate number:', error);
          toast.error('Failed to generate estimate number');
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

  const createEstimateMutation = trpc.estimates.create.useMutation({
    onSuccess: () => {
      toast.success("Estimate created successfully!");
      utils.estimates.list.invalidate();
      setTimeout(() => setLocation("/estimates"), 1500);
    },
    onError: (error) => {
      toast.error(`Failed to create estimate: ${error.message}`);
    },
  });

  const handleSave = useCallback((data: any) => {
    if (!estimateNumber || !data.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const subtotal = data.subtotal || 0;
    const taxAmount = data.vat || 0;
    const total = data.grandTotal || (subtotal + taxAmount);

    const estimateData = {
      estimateNumber: estimateNumber,
      clientId: "client_" + Date.now(),
      issueDate: new Date(data.date),
      expiryDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal: Math.round(subtotal * 100),
      taxAmount: Math.round(taxAmount * 100),
      discountAmount: 0,
      total: Math.round(total * 100),
      status: "draft" as const,
      notes: data.notes || "",
      terms: "",
    };
    
    createEstimateMutation.mutate(estimateData);
  }, [estimateNumber, createEstimateMutation]);

  const handleSend = useCallback((data: any) => {
    if (!estimateNumber || !data.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const subtotal = data.subtotal || 0;
    const taxAmount = data.vat || 0;
    const total = data.grandTotal || (subtotal + taxAmount);

    const estimateData = {
      estimateNumber: estimateNumber,
      clientId: "client_" + Date.now(),
      issueDate: new Date(data.date),
      expiryDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal: Math.round(subtotal * 100),
      taxAmount: Math.round(taxAmount * 100),
      discountAmount: 0,
      total: Math.round(total * 100),
      status: "sent" as const,
      notes: data.notes || "",
      terms: "",
    };
    
    createEstimateMutation.mutate(estimateData);
  }, [estimateNumber, createEstimateMutation]);

  if (isLoadingNumber) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-lg text-gray-500">Loading estimate number...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DocumentForm 
        type="estimate"
        initialData={{ documentNumber: estimateNumber }}
        onSave={handleSave}
        onSend={handleSend}
      />
    </DashboardLayout>
  );
}

