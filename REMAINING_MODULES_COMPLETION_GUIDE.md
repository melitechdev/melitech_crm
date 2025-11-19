# Remaining Modules Completion Guide

This guide provides step-by-step instructions for updating the remaining 10 modules to use ModuleLayout with consistent breadcrumbs and Material Tailwind design.

## Modules to Update (10 remaining)

1. **Departments.tsx** - HR Module
2. **Attendance.tsx** - HR Module
3. **Payroll.tsx** - HR Module
4. **LeaveManagement.tsx** - HR Module
5. **Reports.tsx** - Reports Module
6. **Opportunities.tsx** - Sales Module
7. **BankReconciliation.tsx** - Accounting Module
8. **ChartOfAccounts.tsx** - Accounting Module
9. **Proposals.tsx** - Sales Module
10. **Expenses.tsx** - Accounting Module

## Update Pattern

Each module follows this pattern:

### Step 1: Update Import
Replace:
```tsx
import DashboardLayout from "@/components/DashboardLayout";
```

With:
```tsx
import { ModuleLayout } from "@/components/ModuleLayout";
```

### Step 2: Replace Return Statement
Replace the opening:
```tsx
return (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">[Title]</h1>
          <p className="text-muted-foreground">[Description]</p>
        </div>
        [Action Buttons]
      </div>
```

With:
```tsx
return (
  <ModuleLayout
    title="[Title]"
    description="[Description]"
    icon={<[Icon] className="w-6 h-6" />}
    breadcrumbs={[
      { label: "Dashboard", href: "/" },
      { label: "[Section]", href: "/[section]" },
      { label: "[Title]" },
    ]}
    actions={
      [Action Buttons]
    }
  >
    <div className="space-y-6">
```

### Step 3: Replace Closing Tags
Replace:
```tsx
    </DashboardLayout>
  );
```

With:
```tsx
    </ModuleLayout>
  );
```

## Module-Specific Configurations

### Departments.tsx
- **Icon**: Building2
- **Section**: HR
- **Breadcrumb**: Dashboard > HR > Departments
- **Description**: Manage company departments

### Attendance.tsx
- **Icon**: Calendar
- **Section**: HR
- **Breadcrumb**: Dashboard > HR > Attendance
- **Description**: Track employee attendance

### Payroll.tsx
- **Icon**: DollarSign
- **Section**: HR
- **Breadcrumb**: Dashboard > HR > Payroll
- **Description**: Manage payroll and compensation

### LeaveManagement.tsx
- **Icon**: Calendar
- **Section**: HR
- **Breadcrumb**: Dashboard > HR > Leave Management
- **Description**: Manage employee leave requests

### Reports.tsx
- **Icon**: BarChart3
- **Section**: Reports
- **Breadcrumb**: Dashboard > Reports
- **Description**: View analytics and reports

### Opportunities.tsx
- **Icon**: Target
- **Section**: Sales
- **Breadcrumb**: Dashboard > Sales > Opportunities
- **Description**: Manage sales opportunities

### BankReconciliation.tsx
- **Icon**: CreditCard
- **Section**: Accounting
- **Breadcrumb**: Dashboard > Accounting > Bank Reconciliation
- **Description**: Reconcile bank statements

### ChartOfAccounts.tsx
- **Icon**: Layers
- **Section**: Accounting
- **Breadcrumb**: Dashboard > Accounting > Chart of Accounts
- **Description**: Manage accounting structure

### Proposals.tsx
- **Icon**: FileText
- **Section**: Sales
- **Breadcrumb**: Dashboard > Sales > Proposals
- **Description**: Create and manage proposals

### Expenses.tsx
- **Icon**: TrendingDown
- **Section**: Accounting
- **Breadcrumb**: Dashboard > Accounting > Expenses
- **Description**: Track and manage business expenses

## Implementation Order

1. Start with HR modules (Departments, Attendance, Payroll, LeaveManagement)
2. Then Accounting modules (BankReconciliation, ChartOfAccounts, Expenses)
3. Then Sales modules (Opportunities, Proposals)
4. Finally Reports module

## Testing Checklist

After updating each module:
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Breadcrumbs display correctly
- [ ] Page header shows correct icon and title
- [ ] Action buttons are visible and functional
- [ ] Left sidebar navigation works
- [ ] Collapsible settings sidebar works
- [ ] Dark/light theme toggle works
- [ ] Responsive layout verified

## Common Issues & Solutions

### Issue: "Expected corresponding JSX closing tag"
**Solution**: Ensure all opening tags have matching closing tags. Check that the ModuleLayout closing tag is properly placed.

### Issue: "Adjacent JSX elements must be wrapped"
**Solution**: Make sure the content inside ModuleLayout is wrapped in a single div with className="space-y-6".

### Issue: Import errors
**Solution**: Verify that ModuleLayout is imported from "@/components/ModuleLayout" and that all icon imports are present.

## Next Steps After Module Updates

1. **Integrate Search Filters** - Add search/filter components to each module
2. **Complete CRUD Operations** - Implement View, Edit, Delete for all modules
3. **Mobile Responsiveness** - Test and optimize for mobile devices
4. **Data Integration** - Connect to backend tRPC procedures
5. **Advanced Features** - Add bulk operations, export/import functionality

## Quick Reference

All updated modules should have:
- ✓ ModuleLayout wrapper
- ✓ Consistent breadcrumbs
- ✓ Module icon in header
- ✓ Action buttons in header
- ✓ Left sidebar navigation
- ✓ Collapsible settings sidebar
- ✓ Material Tailwind design
- ✓ Responsive layout
- ✓ Dark/light theme support

## Support

For detailed examples, refer to:
- `client/src/pages/Clients.tsx` - Complete example with CRUD
- `client/src/pages/Projects.tsx` - Project management example
- `client/src/pages/Invoices.tsx` - Complex form example
- `MODULELAYOUT_UPDATE_GUIDE.md` - Comprehensive reference guide

