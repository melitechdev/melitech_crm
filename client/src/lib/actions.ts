import { toast } from "sonner";

export interface ActionHandlers {
  onView?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onDownload?: (id: string | number) => void;
  onEmail?: (id: string | number) => void;
  onDuplicate?: (id: string | number) => void;
}

export const handleView = (id: string | number, type: string, navigate?: (path: string) => void) => {
  if (navigate) {
    // Convert type to plural form for routes
    const pluralType = type.endsWith('s') ? type : `${type}s`;
    navigate(`/${pluralType}/${id}`);
  } else {
    toast.info(`Viewing ${type} #${id}`);
  }
};

export const handleEdit = (id: string | number, type: string, onEdit?: (id: string | number) => void) => {
  if (onEdit) {
    onEdit(id);
  } else {
    toast.info(`Opening editor for ${type} #${id}`);
    // Could open a modal or navigate to edit page
  }
};

export const handleDelete = async (
  id: string | number,
  type: string,
  onConfirm?: () => void
) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete this ${type}? This action cannot be undone.`
  );

  if (confirmed) {
    try {
      // Simulate API call - in production, this would call the actual API
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(`${type} deleted successfully`);
      onConfirm?.();
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
    }
  }
};

export const handleDownload = async (
  id: string | number,
  type: string,
  format: "pdf" | "excel" | "csv" = "pdf",
  data?: any
) => {
  const toastId = toast.loading(`Generating ${format.toUpperCase()} for ${type} #${id}...`);

  try {
    // Simulate document generation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate document content based on type
    const content = generateDocumentContent(type, id, data);

    // Create and trigger download
    const blob = new Blob([content], {
      type: format === "pdf" ? "application/pdf" : "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}-${id}-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success(`${type} downloaded successfully`, { id: toastId });
  } catch (error) {
    toast.error(`Failed to download ${type}`, { id: toastId });
  }
};

export const handleEmail = async (
  id: string | number,
  type: string,
  recipientEmail?: string,
  data?: any
) => {
  let email = recipientEmail;

  if (!email) {
    const promptResult = prompt(`Enter recipient email for ${type} #${id}:`);
    if (!promptResult) {
      toast.error("Email address is required");
      return;
    }
    email = promptResult;
  }

  if (!email) {
    toast.error("Email address is required");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  const toastId = toast.loading(`Sending ${type} to ${email}...`);

  try {
    // Simulate API call to send email
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success(`${type} sent successfully to ${email}`, { id: toastId });
  } catch (error) {
    toast.error(`Failed to send ${type}`, { id: toastId });
  }
};

export const handleDuplicate = async (
  id: string | number,
  type: string,
  onSuccess?: () => void
) => {
  const toastId = toast.loading(`Duplicating ${type} #${id}...`);

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(`${type} duplicated successfully`, { id: toastId });
    onSuccess?.();
  } catch (error) {
    toast.error(`Failed to duplicate ${type}`, { id: toastId });
  }
};

// Generate document content for download
const generateDocumentContent = (type: string, id: string | number, data?: any): string => {
  const timestamp = new Date().toLocaleString();

  switch (type.toLowerCase()) {
    case "invoice":
      return `
INVOICE #${id}
Generated: ${timestamp}

Melitech Solutions
P.O. Box 12345, Nairobi
Email: info@melitechsolutions.co.ke
Phone: +254 700 000 000

Bill To: ${data?.clientName || "Client Name"}
Invoice Date: ${data?.date || new Date().toLocaleDateString()}
Due Date: ${data?.dueDate || "N/A"}

Description: ${data?.description || "Services rendered"}
Amount: Ksh ${data?.amount?.toLocaleString() || "0"}

Thank you for your business!
      `.trim();

    case "receipt":
      return `
PAYMENT RECEIPT #${id}
Generated: ${timestamp}

Melitech Solutions
P.O. Box 12345, Nairobi
Email: info@melitechsolutions.co.ke

Received From: ${data?.clientName || "Client Name"}
Amount: Ksh ${data?.amount?.toLocaleString() || "0"}
Payment Method: ${data?.method || "N/A"}
Date: ${data?.date || new Date().toLocaleDateString()}

Thank you for your payment!
      `.trim();

    case "estimate":
    case "quotation":
      return `
QUOTATION #${id}
Generated: ${timestamp}

Melitech Solutions
P.O. Box 12345, Nairobi
Email: info@melitechsolutions.co.ke

Prepared For: ${data?.clientName || "Client Name"}
Date: ${data?.date || new Date().toLocaleDateString()}
Valid Until: ${data?.validUntil || "N/A"}

Description: ${data?.description || "Services"}
Total Amount: Ksh ${data?.amount?.toLocaleString() || "0"}

This quotation is valid for 30 days from the date of issue.
      `.trim();

    case "proposal":
      return `
BUSINESS PROPOSAL #${id}
Generated: ${timestamp}

Melitech Solutions
P.O. Box 12345, Nairobi

Proposal For: ${data?.clientName || "Client Name"}
Title: ${data?.title || "Project Proposal"}
Date: ${data?.date || new Date().toLocaleDateString()}

${data?.description || "Proposal details..."}

Total Value: Ksh ${data?.amount?.toLocaleString() || "0"}
      `.trim();

    default:
      return `
${type.toUpperCase()} #${id}
Generated: ${timestamp}

Melitech Solutions
Document generated from CRM system.
      `.trim();
  }
};

// Email template generator
export const generateEmailTemplate = (type: string, data: any) => {
  const templates: Record<string, string> = {
    invoice: `
      <h2>Invoice #${data.number}</h2>
      <p>Dear ${data.clientName},</p>
      <p>Please find attached your invoice for ${data.description}.</p>
      <p>Amount Due: Ksh ${data.amount?.toLocaleString()}</p>
      <p>Due Date: ${data.dueDate}</p>
      <p>Thank you for your business!</p>
      <br/>
      <p>Best regards,<br/>Melitech Solutions</p>
    `,
    receipt: `
      <h2>Payment Receipt #${data.number}</h2>
      <p>Dear ${data.clientName},</p>
      <p>Thank you for your payment of Ksh ${data.amount?.toLocaleString()}.</p>
      <p>Payment Date: ${data.date}</p>
      <p>Payment Method: ${data.method}</p>
      <br/>
      <p>Best regards,<br/>Melitech Solutions</p>
    `,
    estimate: `
      <h2>Quotation #${data.number}</h2>
      <p>Dear ${data.clientName},</p>
      <p>Please find attached our quotation for ${data.description}.</p>
      <p>Total Amount: Ksh ${data.amount?.toLocaleString()}</p>
      <p>Valid Until: ${data.validUntil}</p>
      <br/>
      <p>Best regards,<br/>Melitech Solutions</p>
    `,
    proposal: `
      <h2>Business Proposal #${data.number}</h2>
      <p>Dear ${data.clientName},</p>
      <p>We are pleased to submit our proposal for ${data.title}.</p>
      <p>Please review the attached document and let us know if you have any questions.</p>
      <br/>
      <p>Best regards,<br/>Melitech Solutions</p>
    `,
  };

  return templates[type] || `<p>${type} document attached.</p>`;
};

