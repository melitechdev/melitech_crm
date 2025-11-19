# CRUD Implementation Guide - Melitech CRM

This guide provides a systematic approach to implementing View, Edit, and Delete functionality across all CRM modules.

## Completed Modules ✓

- **Clients** - Full CRUD with KYC forms
- **Projects** - Full CRUD with task management
- **ClientDetails** - View with Edit/Delete buttons
- **ProjectDetails** - View with Edit/Delete buttons

## Infrastructure in Place

### 1. DeleteConfirmationModal Component
Location: `client/src/components/DeleteConfirmationModal.tsx`

Features:
- Soft delete confirmation dialog
- Loading states during deletion
- Dangerous action styling (red)
- Cancel/Confirm buttons
- Activity logging integration

Usage:
```tsx
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

<DeleteConfirmationModal
  isOpen={isDeleteOpen}
  title="Delete Item"
  description="Are you sure? This cannot be undone."
  itemName={itemName}
  isLoading={isDeleting}
  onConfirm={handleDelete}
  onCancel={() => setIsDeleteOpen(false)}
  isDangerous={true}
/>
```

### 2. Activity Logging System
Location: `client/src/lib/activityLog.ts`

Functions:
- `logDelete(module, id, name)` - Log deletion
- `logCreate(module, id, name)` - Log creation
- `logUpdate(module, id, name)` - Log updates
- `getActivityHistory()` - Retrieve logs
- `exportActivityLog()` - Export as CSV

Usage:
```tsx
import { logDelete } from "@/lib/activityLog";

logDelete("Invoices", invoiceId, invoiceNumber);
```

### 3. CRUDDetailsTemplate Component
Location: `client/src/components/CRUDDetailsTemplate.tsx`

A reusable template that handles:
- Header with Edit/Delete buttons
- Delete confirmation modal
- Navigation and error handling
- Activity logging

## Remaining Modules to Implement

### Sales Modules (Priority 1)
- [ ] Invoices - EstimateDetails.tsx
- [ ] Estimates - EstimateDetails.tsx  
- [ ] Receipts - ReceiptDetails.tsx
- [ ] Proposals - ProposalDetails.tsx

### Accounting Modules (Priority 2)
- [ ] Payments - PaymentDetails.tsx
- [ ] Expenses - ExpenseDetails.tsx
- [ ] Chart of Accounts - ChartOfAccountsDetails.tsx
- [ ] Bank Reconciliation - BankReconciliationDetails.tsx

### Products & Services (Priority 3)
- [ ] Products - ProductDetails.tsx
- [ ] Services - ServiceDetails.tsx

### HR Modules (Priority 4)
- [ ] Employees - EmployeeDetails.tsx
- [ ] Departments - DepartmentDetails.tsx
- [ ] Attendance - AttendanceDetails.tsx
- [ ] Payroll - PayrollDetails.tsx
- [ ] Leave - LeaveDetails.tsx

### Other Modules (Priority 5)
- [ ] Opportunities - OpportunityDetails.tsx
- [ ] Reports - ReportsDetails.tsx

## Implementation Checklist for Each Module

For each Details page, follow these steps:

### Step 1: Add Imports
```tsx
import { useState } from "react";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { logDelete } from "@/lib/activityLog";
```

### Step 2: Add State Hooks
```tsx
const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
```

### Step 3: Add Delete Handler
```tsx
const handleDelete = async () => {
  setIsDeleting(true);
  try {
    // Call API or simulate deletion
    await deleteItem(itemId);
    
    // Log the deletion
    logDelete("ModuleName", itemId, itemName);
    
    // Show success and navigate
    toast.success(`Item deleted successfully`);
    setIsDeleteOpen(false);
    navigate("/module-path");
  } catch (error) {
    toast.error("Failed to delete item");
  } finally {
    setIsDeleting(false);
  }
};
```

### Step 4: Add Edit/Delete Buttons to Header
```tsx
<div className="flex gap-2">
  <Badge>{itemStatus}</Badge>
  <Button onClick={() => navigate(`/module/${itemId}/edit`)} size="sm">
    <Edit className="mr-2 h-4 w-4" />
    Edit
  </Button>
  <Button variant="destructive" onClick={() => setIsDeleteOpen(true)} size="sm">
    <Trash2 className="mr-2 h-4 w-4" />
    Delete
  </Button>
</div>
```

### Step 5: Add Delete Confirmation Modal
```tsx
<DeleteConfirmationModal
  isOpen={isDeleteOpen}
  title="Delete Item"
  description="Are you sure? This action cannot be undone."
  itemName={itemName}
  isLoading={isDeleting}
  onConfirm={handleDelete}
  onCancel={() => setIsDeleteOpen(false)}
  isDangerous={true}
/>
```

## List Page Updates

For each module's list page (e.g., Invoices.tsx), ensure:

1. **View Button** - Navigates to detail page
   ```tsx
   onClick={() => navigate(`/invoices/${item.id}`)}
   ```

2. **Edit Button** - Navigates to edit page
   ```tsx
   onClick={() => navigate(`/invoices/${item.id}/edit`)}
   ```

3. **Delete Button** - Shows confirmation (delete from detail page)
   ```tsx
   onClick={() => navigate(`/invoices/${item.id}`)}
   ```

## Database Schema Updates

Add `deletedAt` field to all tables for soft delete support:

```sql
ALTER TABLE table_name ADD COLUMN deletedAt TIMESTAMP NULL;
```

Then update queries to filter out deleted items:

```sql
SELECT * FROM table_name WHERE deletedAt IS NULL;
```

## Testing Checklist

For each module, test:

- [ ] View page loads correctly
- [ ] Edit button navigates to edit form
- [ ] Delete button shows confirmation modal
- [ ] Confirming delete marks item as deleted
- [ ] Activity log records the deletion
- [ ] User is redirected to list page after delete
- [ ] Error handling works for failed deletes
- [ ] List page no longer shows deleted items

## Performance Considerations

1. **Soft Deletes** - Items are marked deleted, not removed
2. **Activity Logging** - Stored in localStorage for now, migrate to database
3. **Caching** - Invalidate lists after mutations
4. **Pagination** - May need updates to exclude deleted items

## Next Steps

1. Implement Sales modules (Invoices, Estimates, Receipts)
2. Implement Accounting modules
3. Implement Products & Services
4. Implement HR modules
5. Add database migrations for soft delete support
6. Migrate activity logs to database
7. Add comprehensive testing

## Notes

- All delete operations are soft deletes (mark as deleted, don't remove)
- Activity logs track all user actions for audit trails
- Edit forms should pre-fill with existing data
- All forms should include validation
- Implement optimistic updates where appropriate

