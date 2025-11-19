# ModuleLayout Update Guide for All Modules

This guide provides step-by-step instructions for updating each module page to use the new ModuleLayout component with breadcrumbs, page headers, and consistent UI.

## Quick Reference: Module Configuration

| Module | Icon | Breadcrumb Path | File |
|--------|------|-----------------|------|
| Invoices | FileText | Dashboard > Accounting > Invoices | Invoices.tsx |
| Estimates | FileText | Dashboard > Sales > Estimates | Estimates.tsx |
| Receipts | Receipt | Dashboard > Sales > Receipts | Receipts.tsx |
| Payments | DollarSign | Dashboard > Accounting > Payments | Payments.tsx |
| Expenses | TrendingDown | Dashboard > Accounting > Expenses | Expenses.tsx |
| Products | Package | Dashboard > Products & Services > Products | Products.tsx |
| Services | Briefcase | Dashboard > Products & Services > Services | Services.tsx |
| Employees | Users | Dashboard > HR > Employees | Employees.tsx |
| Departments | Building2 | Dashboard > HR > Departments | Departments.tsx |
| Attendance | Calendar | Dashboard > HR > Attendance | Attendance.tsx |
| Payroll | DollarSign | Dashboard > HR > Payroll | Payroll.tsx |
| Leave Management | Calendar | Dashboard > HR > Leave Management | LeaveManagement.tsx |
| Reports | BarChart3 | Dashboard > Reports | Reports.tsx |
| Opportunities | Target | Dashboard > Sales > Opportunities | Opportunities.tsx |
| Bank Reconciliation | CreditCard | Dashboard > Accounting > Bank Reconciliation | BankReconciliation.tsx |
| Chart of Accounts | Layers | Dashboard > Accounting > Chart of Accounts | ChartOfAccounts.tsx |
| Proposals | FileText | Dashboard > Sales > Proposals | Proposals.tsx |

## Step-by-Step Update Process

### Step 1: Update Imports

Replace:
```tsx
import DashboardLayout from "@/components/DashboardLayout";
```

With:
```tsx
import { ModuleLayout } from "@/components/ModuleLayout";
```

Add the module icon to lucide-react imports. Example for Invoices:
```tsx
import { FileText, Plus, ... } from "lucide-react";
```

### Step 2: Wrap Component with ModuleLayout

Replace the opening of the return statement:
```tsx
return (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Module Name</h1>
          <p className="text-muted-foreground">Module description</p>
        </div>
        {/* Action buttons here */}
      </div>
```

With:
```tsx
return (
  <ModuleLayout
    title="Module Name"
    description="Module description"
    icon={<ModuleIcon className="w-6 h-6" />}
    breadcrumbs={[
      { label: "Dashboard", href: "/" },
      { label: "Section", href: "/section" },
      { label: "Module Name" },
    ]}
    actions={
      {/* Action buttons here */}
    }
  >
    <div className="space-y-6">
```

### Step 3: Close ModuleLayout

Replace:
```tsx
      </div>
    </DashboardLayout>
  );
```

With:
```tsx
      </div>
    </ModuleLayout>
  );
```

## Module-Specific Examples

### Invoices Module

**File:** `client/src/pages/Invoices.tsx`

```tsx
import { ModuleLayout } from "@/components/ModuleLayout";
import { FileText, Plus, ... } from "lucide-react";

export default function Invoices() {
  // ... existing code ...

  return (
    <ModuleLayout
      title="Invoices"
      description="Create and manage invoices for your clients"
      icon={<FileText className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Accounting", href: "/accounting" },
        { label: "Invoices" },
      ]}
      actions={
        <Button onClick={() => navigate("/invoices/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Existing content */}
      </div>
    </ModuleLayout>
  );
}
```

### Estimates Module

**File:** `client/src/pages/Estimates.tsx`

```tsx
import { ModuleLayout } from "@/components/ModuleLayout";
import { FileText, Plus, ... } from "lucide-react";

export default function Estimates() {
  // ... existing code ...

  return (
    <ModuleLayout
      title="Estimates"
      description="Generate quotations and estimates for clients"
      icon={<FileText className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Sales", href: "/sales" },
        { label: "Estimates" },
      ]}
      actions={
        <Button onClick={() => navigate("/estimates/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Estimate
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Existing content */}
      </div>
    </ModuleLayout>
  );
}
```

### Products Module

**File:** `client/src/pages/Products.tsx`

```tsx
import { ModuleLayout } from "@/components/ModuleLayout";
import { Package, Plus, ... } from "lucide-react";

export default function Products() {
  // ... existing code ...

  return (
    <ModuleLayout
      title="Products"
      description="Manage your product catalog"
      icon={<Package className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Products & Services", href: "/products-services" },
        { label: "Products" },
      ]}
      actions={
        <Button onClick={() => navigate("/products/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Existing content */}
      </div>
    </ModuleLayout>
  );
}
```

### Employees Module

**File:** `client/src/pages/Employees.tsx`

```tsx
import { ModuleLayout } from "@/components/ModuleLayout";
import { Users, Plus, ... } from "lucide-react";

export default function Employees() {
  // ... existing code ...

  return (
    <ModuleLayout
      title="Employees"
      description="Manage your employee database"
      icon={<Users className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "HR", href: "/hr" },
        { label: "Employees" },
      ]}
      actions={
        <Button onClick={() => navigate("/employees/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Existing content */}
      </div>
    </ModuleLayout>
  );
}
```

## Breadcrumb Hierarchy

Use this hierarchy for breadcrumbs:

```
Dashboard (/)
├── Accounting (/accounting)
│   ├── Invoices (/invoices)
│   ├── Payments (/payments)
│   ├── Expenses (/expenses)
│   ├── Chart of Accounts (/chart-of-accounts)
│   └── Bank Reconciliation (/bank-reconciliation)
├── Sales (/sales)
│   ├── Estimates (/estimates)
│   ├── Receipts (/receipts)
│   ├── Opportunities (/opportunities)
│   └── Proposals (/proposals)
├── Products & Services (/products-services)
│   ├── Products (/products)
│   └── Services (/services)
├── HR (/hr)
│   ├── Employees (/employees)
│   ├── Departments (/departments)
│   ├── Attendance (/attendance)
│   ├── Payroll (/payroll)
│   └── Leave Management (/leave)
└── Reports (/reports)
```

## Icon Reference

| Icon | Usage |
|------|-------|
| FileText | Invoices, Estimates, Receipts, Proposals |
| DollarSign | Payments, Payroll |
| TrendingDown | Expenses |
| Package | Products |
| Briefcase | Services |
| Users | Employees |
| Building2 | Departments |
| Calendar | Attendance, Leave Management |
| BarChart3 | Reports |
| Target | Opportunities |
| CreditCard | Bank Reconciliation |
| Layers | Chart of Accounts |

## Testing Checklist

After updating each module:

- [ ] Breadcrumbs display correctly
- [ ] Page title and description visible
- [ ] Module icon displays in header
- [ ] Action buttons work correctly
- [ ] Left sidebar navigation visible
- [ ] Collapsible settings sidebar accessible
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Dark/light mode toggle works
- [ ] Page content displays below header

## Common Issues & Solutions

### Issue: JSX Closing Tag Errors

**Problem:** "Expected corresponding JSX closing tag for ModuleLayout"

**Solution:** Ensure you have exactly one closing `</ModuleLayout>` tag at the end, and that all inner divs are properly closed before it.

### Issue: Icon Not Importing

**Problem:** "Icon is not defined"

**Solution:** Add the icon to the lucide-react import statement at the top of the file.

### Issue: Navigation Not Working

**Problem:** Breadcrumb links don't navigate

**Solution:** Ensure the href values match your route configuration in App.tsx.

### Issue: Styling Issues

**Problem:** Layout looks broken or misaligned

**Solution:** Ensure the inner content is wrapped in `<div className="space-y-6">` and all existing content is preserved.

## Automation Script

To automate the update process, run:

```bash
cd /home/ubuntu/melitech_crm
./scripts/update-modules-to-modulelayout.sh
```

**Note:** The script performs basic replacements. Manual review and testing is recommended for each module.

## Priority Order for Updates

1. **High Priority (Sales/Accounting):**
   - Invoices
   - Estimates
   - Receipts
   - Payments

2. **Medium Priority (Products/HR):**
   - Products
   - Services
   - Employees
   - Departments

3. **Low Priority (Remaining):**
   - Attendance
   - Payroll
   - Leave Management
   - Reports
   - Opportunities
   - Bank Reconciliation
   - Chart of Accounts
   - Proposals

## Next Steps

After updating all modules with ModuleLayout:

1. Integrate search filters into each module
2. Complete CRUD operations (View, Edit, Delete)
3. Improve date range pickers
4. Optimize for mobile responsiveness
5. Connect to backend tRPC procedures
6. Implement advanced features (bulk operations, export/import)

