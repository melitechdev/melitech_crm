# Search & Filter Integration Guide

This guide explains how to integrate the pre-built search and filter components into all modules of the Melitech CRM.

## Available Search Filter Components

### 1. ClientSearchFilter
**Location:** `client/src/components/SearchAndFilter/ClientSearchFilter.tsx`

**Features:**
- Search by name, email, or phone
- Filter by status (active/inactive)
- Filter by client type (individual/corporate)
- Sort by name, date, or revenue
- Sort order (ascending/descending)

**Integration Example:**
```tsx
import { ClientSearchFilter, type ClientFilters } from "@/components/SearchAndFilter";

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ClientFilters>({
    status: "all",
    type: "all",
    sortBy: "name",
    sortOrder: "asc",
  });

  const filteredClients = clients
    .filter((client) => {
      // Apply search and status filters
      return client.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      // Apply sorting
      let aVal: any = a[filters.sortBy as keyof typeof a];
      let bVal: any = b[filters.sortBy as keyof typeof b];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return filters.sortOrder === "desc" ? -comparison : comparison;
    });

  return (
    <div>
      <ClientSearchFilter
        onSearch={setSearchQuery}
        onFilter={setFilters}
      />
      {/* Render filtered clients */}
    </div>
  );
}
```

### 2. ProjectSearchFilter
**Location:** `client/src/components/SearchAndFilter/ProjectSearchFilter.tsx`

**Features:**
- Search by project name or client
- Filter by status (active/completed/on-hold)
- Filter by priority (high/medium/low)
- Sort by name, date, deadline, or progress
- Sort order (ascending/descending)

### 3. InvoiceSearchFilter
**Location:** `client/src/components/SearchAndFilter/InvoiceSearchFilter.tsx`

**Features:**
- Search by invoice number or client
- Filter by status (draft/sent/paid/overdue)
- Sort by number, date, amount, or due date
- Sort order (ascending/descending)

### 4. EstimateSearchFilter
**Location:** `client/src/components/SearchAndFilter/EstimateSearchFilter.tsx`

**Features:**
- Search by estimate number or client
- Filter by status (draft/sent/accepted/rejected/expired)
- Sort by number, date, amount, or expiry date
- Sort order (ascending/descending)

### 5. ProductSearchFilter
**Location:** `client/src/components/SearchAndFilter/ProductSearchFilter.tsx`

**Features:**
- Search by product name or SKU
- Filter by status (active/inactive/discontinued)
- Sort by name, price, stock, or date added
- Sort order (ascending/descending)

## Integration Steps

### Step 1: Import the Component
```tsx
import { ClientSearchFilter, type ClientFilters } from "@/components/SearchAndFilter";
```

### Step 2: Add State Management
```tsx
const [searchQuery, setSearchQuery] = useState("");
const [filters, setFilters] = useState<ClientFilters>({
  status: "all",
  type: "all",
  sortBy: "name",
  sortOrder: "asc",
});
```

### Step 3: Implement Filter Logic
```tsx
const filteredItems = items
  .filter((item) => {
    // Search filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === "all" || item.status === filters.status;
    
    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    // Sorting logic
    let aVal: any = a[filters.sortBy as keyof typeof a];
    let bVal: any = b[filters.sortBy as keyof typeof b];
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return filters.sortOrder === "desc" ? -comparison : comparison;
  });
```

### Step 4: Render the Component
```tsx
<ClientSearchFilter
  onSearch={setSearchQuery}
  onFilter={setFilters}
  isLoading={isLoading}
/>
```

## Modules Ready for Integration

### Completed
- ✅ Clients (ClientSearchFilter integrated)

### Ready to Integrate
- [ ] Projects (ProjectSearchFilter)
- [ ] Invoices (InvoiceSearchFilter)
- [ ] Estimates (EstimateSearchFilter)
- [ ] Receipts (InvoiceSearchFilter variant)
- [ ] Products (ProductSearchFilter)
- [ ] Services (ProductSearchFilter variant)
- [ ] Payments (InvoiceSearchFilter variant)
- [ ] Expenses (ProductSearchFilter variant)
- [ ] Employees (ClientSearchFilter variant)
- [ ] Departments (ProductSearchFilter variant)
- [ ] Attendance (ProductSearchFilter variant)
- [ ] Payroll (InvoiceSearchFilter variant)
- [ ] Leave (ProductSearchFilter variant)

## Creating Custom Search Filters

If you need a custom search filter for a module not listed above:

1. Copy an existing filter component (e.g., `ClientSearchFilter.tsx`)
2. Rename it to match your module (e.g., `EmployeeSearchFilter.tsx`)
3. Update the interface and filter options:
   ```tsx
   export interface EmployeeFilters {
     status?: "active" | "inactive" | "on-leave" | "all";
     department?: string;
     sortBy?: "name" | "joinDate" | "salary";
     sortOrder?: "asc" | "desc";
   }
   ```
4. Update the filter UI to match your module's fields
5. Export from `SearchAndFilter/index.ts`
6. Integrate into your module page

## Best Practices

### 1. Debounce Search
For large datasets, consider debouncing the search:
```tsx
const [searchQuery, setSearchQuery] = useState("");
const debouncedSearch = useMemo(
  () => debounce((value: string) => onSearch(value), 300),
  [onSearch]
);

const handleSearch = (value: string) => {
  setSearchQuery(value);
  debouncedSearch(value);
};
```

### 2. Preserve Filter State
Store filter preferences in localStorage:
```tsx
useEffect(() => {
  localStorage.setItem("clientFilters", JSON.stringify(filters));
}, [filters]);

const savedFilters = localStorage.getItem("clientFilters");
if (savedFilters) {
  setFilters(JSON.parse(savedFilters));
}
```

### 3. URL Query Parameters
Sync filters with URL for shareable links:
```tsx
const [searchParams, setSearchParams] = useSearchParams();

useEffect(() => {
  const params = new URLSearchParams();
  if (searchQuery) params.set("search", searchQuery);
  if (filters.status !== "all") params.set("status", filters.status);
  setSearchParams(params);
}, [searchQuery, filters]);
```

### 4. Performance Optimization
Use `useMemo` for expensive filter operations:
```tsx
const filteredItems = useMemo(() => {
  return items
    .filter(/* ... */)
    .sort(/* ... */);
}, [items, searchQuery, filters]);
```

## Troubleshooting

### Issue: Filters not updating
**Solution:** Ensure filter state is properly connected to the component:
```tsx
<ClientSearchFilter
  onSearch={setSearchQuery}
  onFilter={setFilters}  // Make sure this is passed
/>
```

### Issue: Sorting not working
**Solution:** Verify the sort key exists in your data object:
```tsx
// Check that filters.sortBy matches a property in your object
const aVal: any = a[filters.sortBy as keyof typeof a];
```

### Issue: Search not working
**Solution:** Ensure search is case-insensitive:
```tsx
item.name.toLowerCase().includes(searchQuery.toLowerCase())
```

## Next Steps

1. Integrate ProjectSearchFilter into Projects page
2. Integrate InvoiceSearchFilter into Invoices page
3. Integrate EstimateSearchFilter into Estimates page
4. Create and integrate remaining module filters
5. Add advanced search with date ranges
6. Implement saved filter templates
7. Add export/import filters functionality

