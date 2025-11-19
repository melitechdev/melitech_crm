# Settings Router & Document Numbering Guide

## Overview

This guide documents the backend settings router and automatic document number auto-increment feature implemented for the Melitech CRM system.

## Features

### 1. Settings Management Router

The settings router provides comprehensive CRUD operations for managing application settings with role-based access control.

#### Location
- **Backend**: `server/routers/settings.ts`
- **Database Helpers**: `server/db.ts` (settings functions)

#### Endpoints

##### Public Endpoints (Protected - Any Authenticated User)

- **`settings.get`** - Get a single setting by key
  ```typescript
  const setting = await trpc.settings.get.query({ key: 'invoice_prefix' });
  ```

- **`settings.getByCategory`** - Get all settings in a category
  ```typescript
  const settings = await trpc.settings.getByCategory.query({ category: 'document_numbering' });
  ```

- **`settings.getAll`** - Get all settings
  ```typescript
  const allSettings = await trpc.settings.getAll.query();
  ```

- **`settings.getDocumentNumberingSettings`** - Get document numbering configuration
  ```typescript
  const numbering = await trpc.settings.getDocumentNumberingSettings.query();
  ```

- **`settings.getCompanyInfo`** - Get company information
  ```typescript
  const company = await trpc.settings.getCompanyInfo.query();
  ```

- **`settings.getBankDetails`** - Get bank details
  ```typescript
  const bank = await trpc.settings.getBankDetails.query();
  ```

##### Admin-Only Endpoints (super_admin or admin role required)

- **`settings.set`** - Create or update a setting
  ```typescript
  await trpc.settings.set.mutate({
    key: 'invoice_prefix',
    value: 'INV-',
    category: 'document_numbering',
    description: 'Prefix for invoice numbers'
  });
  ```

- **`settings.delete`** - Delete a setting
  ```typescript
  await trpc.settings.delete.mutate({ key: 'invoice_prefix' });
  ```

- **`settings.updateDocumentPrefix`** - Update document prefix
  ```typescript
  await trpc.settings.updateDocumentPrefix.mutate({
    documentType: 'invoice',
    prefix: 'INV-'
  });
  ```

- **`settings.resetDocumentCounter`** - Reset document number counter
  ```typescript
  await trpc.settings.resetDocumentCounter.mutate({
    documentType: 'invoice',
    startNumber: 1
  });
  ```

- **`settings.updateCompanyInfo`** - Update company information
  ```typescript
  await trpc.settings.updateCompanyInfo.mutate({
    companyName: 'Melitech Solutions',
    companyEmail: 'info@melitech.com',
    taxId: 'TAX123456'
  });
  ```

- **`settings.updateBankDetails`** - Update bank details
  ```typescript
  await trpc.settings.updateBankDetails.mutate({
    bankName: 'Example Bank',
    bankAccountNumber: '1234567890',
    swiftCode: 'EXBKUS33'
  });
  ```

### 2. Document Number Auto-Increment

Automatic document number generation with customizable prefixes and sequential numbering.

#### Supported Document Types

- `invoice` - Default prefix: `INV-`
- `estimate` - Default prefix: `EST-`
- `receipt` - Default prefix: `REC-`
- `proposal` - Default prefix: `PROP-`
- `expense` - Default prefix: `EXP-`

#### How It Works

1. **Number Generation**: When a document is created, the system calls `getNextDocumentNumber(documentType)`
2. **Prefix Lookup**: System retrieves the prefix from settings (or uses default)
3. **Counter Increment**: System retrieves and increments the counter
4. **Format**: Numbers are formatted as `PREFIX + 6-digit zero-padded number`
   - Example: `INV-000001`, `EST-000042`, `REC-001234`

#### Database Storage

Settings are stored in the `settings` table with the following structure:

```
Key: {documentType}_prefix    (e.g., invoice_prefix)
Value: INV-                   (customizable prefix)
Category: document_numbering

Key: {documentType}_next      (e.g., invoice_next)
Value: 1                      (next number to use)
Category: document_numbering
```

#### Usage in Document Creation

The document creation forms automatically use the auto-increment feature:

**CreateInvoice.tsx**:
```typescript
const getNextNumberMutation = trpc.settings.getNextDocumentNumber.useMutation();

useEffect(() => {
  const generateNumber = async () => {
    const result = await getNextNumberMutation.mutateAsync({ documentType: 'invoice' });
    setInvoiceNumber(result.documentNumber);
  };
  generateNumber();
}, [getNextNumberMutation]);
```

Similar implementation for:
- `CreateEstimate.tsx`
- `CreateReceipt.tsx`

#### Resetting Counters

Administrators can reset document counters at any time:

```typescript
// Reset invoice counter to 1
await trpc.settings.resetDocumentCounter.mutate({
  documentType: 'invoice',
  startNumber: 1
});

// Reset to a specific number (e.g., 100)
await trpc.settings.resetDocumentCounter.mutate({
  documentType: 'invoice',
  startNumber: 100
});
```

#### Customizing Prefixes

Administrators can customize prefixes for each document type:

```typescript
// Change invoice prefix
await trpc.settings.updateDocumentPrefix.mutate({
  documentType: 'invoice',
  prefix: 'INVOICE-'
});

// Use year-based prefix
await trpc.settings.updateDocumentPrefix.mutate({
  documentType: 'invoice',
  prefix: 'INV-2025-'
});
```

## Database Schema

### Settings Table

```sql
CREATE TABLE settings (
  id VARCHAR(64) PRIMARY KEY,
  key VARCHAR(100) NOT NULL,
  value TEXT,
  category VARCHAR(100),
  description TEXT,
  updatedBy VARCHAR(64),
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX key_idx (key),
  INDEX category_idx (category)
);
```

### Type Definitions

```typescript
export type Setting = {
  id: string;
  key: string;
  value?: string | null;
  category?: string | null;
  description?: string | null;
  updatedBy?: string | null;
  updatedAt: Date;
};
```

## Database Helper Functions

Located in `server/db.ts`:

### Settings Functions

```typescript
// Get a single setting
getSetting(key: string): Promise<Setting | null>

// Get settings by category
getSettingsByCategory(category: string): Promise<Setting[]>

// Get all settings
getAllSettings(): Promise<Setting[]>

// Create or update a setting
setSetting(
  key: string,
  value: string,
  category?: string,
  description?: string,
  updatedBy?: string
): Promise<string>

// Delete a setting
deleteSetting(key: string): Promise<void>
```

### Document Numbering Functions

```typescript
// Get next document number
getNextDocumentNumber(documentType: string): Promise<string>

// Reset document counter
resetDocumentNumberCounter(documentType: string, startNumber?: number): Promise<void>

// Get all document numbering settings
getDocumentNumberingSettings(): Promise<Record<string, string>>
```

## Activity Logging

All settings changes are automatically logged to the `activityLog` table with:
- User ID who made the change
- Action type (e.g., `setting_updated`, `document_number_generated`)
- Entity type and ID
- Timestamp

## Testing

### Test Files

1. **`server/routers/__tests__/settings.integration.test.ts`** - Integration tests for document numbering logic
   - 23 test cases covering:
     - Default prefixes for all document types
     - Sequential number generation
     - Zero-padding logic
     - Edge cases (large numbers, empty prefixes)
     - Workflow scenarios

Run tests:
```bash
npm test -- server/routers/__tests__/settings.integration.test.ts
```

## Security Considerations

1. **Role-Based Access Control**
   - Only `admin` and `super_admin` roles can modify settings
   - All authenticated users can read settings

2. **Activity Logging**
   - All setting changes are logged with user ID and timestamp
   - Enables audit trail for compliance

3. **Validation**
   - Document type must be one of: invoice, estimate, receipt, proposal, expense
   - Prefix and values are validated as strings
   - Start numbers must be positive integers

## Performance Notes

1. **Caching**: Settings are retrieved from database on each request
   - Consider implementing Redis caching for high-traffic scenarios
   - Settings changes are infrequent, so caching is safe

2. **Database Indexes**
   - `key_idx` on settings.key for fast lookups
   - `category_idx` on settings.category for category-based queries

3. **Concurrency**
   - Document number generation uses database transactions
   - Ensures no duplicate numbers even with concurrent requests

## Future Enhancements

1. **Caching Layer**: Implement Redis caching for settings
2. **Batch Operations**: Support bulk setting updates
3. **Settings UI**: Create admin panel for settings management
4. **Audit Dashboard**: Display settings change history
5. **Export/Import**: Backup and restore settings
6. **Settings Versioning**: Track historical changes to settings

## Troubleshooting

### Document numbers not incrementing

**Issue**: Document numbers restart from 1 each time

**Solution**: Check that the `{documentType}_next` setting exists in the database
```sql
SELECT * FROM settings WHERE key LIKE '%_next';
```

### Duplicate document numbers

**Issue**: Two documents have the same number

**Solution**: 
1. Verify database transaction support is enabled
2. Check for concurrent requests
3. Reset counter and regenerate numbers if needed

### Settings not persisting

**Issue**: Settings changes don't appear to save

**Solution**:
1. Verify user has admin role
2. Check database connection
3. Review activity log for errors

## API Examples

### Complete Workflow Example

```typescript
// 1. Get current document numbering settings
const settings = await trpc.settings.getDocumentNumberingSettings.query();
console.log('Current settings:', settings);

// 2. Update invoice prefix
await trpc.settings.updateDocumentPrefix.mutate({
  documentType: 'invoice',
  prefix: 'INV-2025-'
});

// 3. Reset counter to 1
await trpc.settings.resetDocumentCounter.mutate({
  documentType: 'invoice',
  startNumber: 1
});

// 4. Generate first invoice number
const result = await trpc.settings.getNextDocumentNumber.mutate({
  documentType: 'invoice'
});
console.log('First invoice number:', result.documentNumber); // INV-2025-000001

// 5. Generate more numbers
const result2 = await trpc.settings.getNextDocumentNumber.mutate({
  documentType: 'invoice'
});
console.log('Second invoice number:', result2.documentNumber); // INV-2025-000002
```

## References

- Settings Router: `server/routers/settings.ts`
- Database Helpers: `server/db.ts`
- Schema: `drizzle/schema.ts`
- Tests: `server/routers/__tests__/settings.integration.test.ts`

