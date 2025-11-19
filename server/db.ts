import { eq, desc, and, gte, lte, sql, or, like, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  clients,
  InsertClient,
  products,
  InsertProduct,
  services,
  InsertService,
  estimates,
  InsertEstimate,
  estimateItems,
  InsertEstimateItem,
  invoices,
  InsertInvoice,
  invoiceItems,
  InsertInvoiceItem,
  payments,
  InsertPayment,
  expenses,
  InsertExpense,
  accounts,
  InsertAccount,
  journalEntries,
  InsertJournalEntry,
  journalEntryLines,
  InsertJournalEntryLine,
  bankAccounts,
  InsertBankAccount,
  bankTransactions,
  InsertBankTransaction,
  employees,
  InsertEmployee,
  leaveRequests,
  InsertLeaveRequest,
  payroll,
  InsertPayroll,
  opportunities,
  InsertOpportunity,
  templates,
  InsertTemplate,
  activityLog,
  InsertActivityLog,
  settings,
  InsertSetting,
  projects,
  InsertProject,
  projectTasks,
  InsertProjectTask,
  notifications,
  InsertNotification,
  documentNumberFormats,
  InsertDocumentNumberFormat,
  defaultSettings,
  InsertDefaultSetting,
  rolePermissions,
  InsertRolePermission,
  permissions,
  InsertPermission,
  userRoles,
  InsertUserRole,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUser(id: string, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return;
  }

  try {
    const updateSet: Record<string, unknown> = {};
    
    if (data.name !== undefined) updateSet.name = data.name;
    if (data.email !== undefined) updateSet.email = data.email;
    if (data.loginMethod !== undefined) updateSet.loginMethod = data.loginMethod;
    if (data.role !== undefined) updateSet.role = data.role;
    if (data.lastSignedIn !== undefined) updateSet.lastSignedIn = data.lastSignedIn;
    
    if (Object.keys(updateSet).length === 0) {
      return; // Nothing to update
    }
    
    await db.update(users).set(updateSet).where(eq(users.id, id));
  } catch (error) {
    console.error("[Database] Failed to update user:", error);
    throw error;
  }
}

// ============= NOTIFICATIONS =============

export async function createNotification(notification: Omit<InsertNotification, 'id'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(notifications).values({ ...notification, id });
  return id;
}

export async function getUserNotifications(userId: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotifications(userId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(notifications)
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false)
    ))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(notifications.id, notificationId));
}

export async function markAllNotificationsAsRead(userId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false)
    ));
}

export async function deleteNotification(notificationId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(notifications).where(eq(notifications.id, notificationId));
}

// ============= PROJECTS =============

export async function createProject(project: Omit<InsertProject, 'id'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(projects).values({ ...project, id });
  return id;
}

export async function getProject(id: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function getProjectsByClient(clientId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(projects)
    .where(eq(projects.clientId, clientId))
    .orderBy(desc(projects.createdAt));
}

export async function getProjectsByStatus(status: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(projects)
    .where(eq(projects.status, status as any))
    .orderBy(desc(projects.createdAt));
}

export async function updateProject(id: string, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id));
}

export async function deleteProject(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(projects).where(eq(projects.id, id));
}

// ============= PROJECT TASKS =============

export async function createProjectTask(task: Omit<InsertProjectTask, 'id'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(projectTasks).values({ ...task, id });
  return id;
}

export async function getProjectTasks(projectId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(projectTasks)
    .where(eq(projectTasks.projectId, projectId))
    .orderBy(projectTasks.order, desc(projectTasks.createdAt));
}

export async function updateProjectTask(id: string, data: Partial<InsertProjectTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(projectTasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projectTasks.id, id));
}

export async function deleteProjectTask(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(projectTasks).where(eq(projectTasks.id, id));
}

// ============= CLIENTS =============

export async function createClient(client: Omit<InsertClient, 'id'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(clients).values({ ...client, id });
  return id;
}

export async function getClient(id: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(clients).orderBy(desc(clients.createdAt));
}

export async function updateClient(id: string, data: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(clients)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(clients.id, id));
}

export async function deleteClient(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(clients).where(eq(clients.id, id));
}

// ============= INVOICES =============

export async function createInvoice(invoice: Omit<InsertInvoice, 'id'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(invoices).values({ ...invoice, id });
  return id;
}

export async function getInvoice(id: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllInvoices() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(invoices).orderBy(desc(invoices.createdAt));
}

export async function getInvoicesByClient(clientId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(invoices)
    .where(eq(invoices.clientId, clientId))
    .orderBy(desc(invoices.createdAt));
}

export async function updateInvoice(id: string, data: Partial<InsertInvoice>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(invoices)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(invoices.id, id));
}

// ============= ESTIMATES =============

export async function createEstimate(estimate: Omit<InsertEstimate, 'id'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `est_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(estimates).values({ ...estimate, id });
  return id;
}

export async function getEstimate(id: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(estimates).where(eq(estimates.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllEstimates() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(estimates).orderBy(desc(estimates.createdAt));
}

export async function getEstimatesByClient(clientId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(estimates)
    .where(eq(estimates.clientId, clientId))
    .orderBy(desc(estimates.createdAt));
}

export async function updateEstimate(id: string, data: Partial<InsertEstimate>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(estimates)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(estimates.id, id));
}

// ============= PAYMENTS =============

export async function createPayment(payment: Omit<InsertPayment, 'id'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(payments).values({ ...payment, id });
  return id;
}

export async function getPaymentsByInvoice(invoiceId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(payments)
    .where(eq(payments.invoiceId, invoiceId))
    .orderBy(desc(payments.paymentDate));
}

// ============= ACTIVITY LOG =============

export async function logActivity(activity: Omit<InsertActivityLog, 'id'>) {
  const db = await getDb();
  if (!db) return;
  
  const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(activityLog).values({ ...activity, id });
}



// ============= SETTINGS =============

export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getSettingsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(settings)
    .where(eq(settings.category, category))
    .orderBy(settings.key);
}

export async function getAllSettings() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(settings)
    .orderBy(settings.category, settings.key);
}

export async function setSetting(
  key: string,
  value: string,
  category?: string,
  description?: string,
  updatedBy?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Try to update first
  const existing = await getSetting(key);
  
  if (existing) {
    await db
      .update(settings)
      .set({
        value,
        category: category || existing.category,
        description: description || existing.description,
        updatedBy,
        updatedAt: new Date(),
      })
      .where(eq(settings.key, key));
    
    return existing.id;
  } else {
    // Insert new setting
    await db.insert(settings).values({
      id,
      key,
      value,
      category,
      description,
      updatedBy,
      updatedAt: new Date(),
    });
    
    return id;
  }
}

export async function deleteSetting(key: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(settings).where(eq(settings.key, key));
}

// ============= DOCUMENT NUMBER AUTO-INCREMENT =============

/**
 * Get the next document number for a given document type
 * Supports: invoice, estimate, receipt, proposal, expense
 */
export async function getNextDocumentNumber(documentType: string): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const prefixKey = `${documentType}_prefix`;
  const nextKey = `${documentType}_next`;
  
  // Get current settings
  const prefixSetting = await getSetting(prefixKey);
  const nextSetting = await getSetting(nextKey);
  
  const prefix = prefixSetting?.value || getDefaultPrefix(documentType);
  const nextNum = nextSetting?.value || "1";
  
  // Parse the next number
  let num = parseInt(nextNum, 10);
  if (isNaN(num)) num = 1;
  
  // Generate the document number
  const documentNumber = `${prefix}${String(num).padStart(6, '0')}`;
  
  // Increment and save the next number
  await setSetting(nextKey, String(num + 1), 'document_numbering');
  
  return documentNumber;
}

function getDefaultPrefix(documentType: string): string {
  const prefixes: Record<string, string> = {
    invoice: 'INV-',
    estimate: 'EST-',
    receipt: 'REC-',
    proposal: 'PROP-',
    expense: 'EXP-',
  };
  
  return prefixes[documentType] || 'DOC-';
}

/**
 * Reset document number counter for a given document type
 */
export async function resetDocumentNumberCounter(documentType: string, startNumber: number = 1) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const nextKey = `${documentType}_next`;
  await setSetting(nextKey, String(startNumber), 'document_numbering');
}

/**
 * Get all document numbering settings
 */
export async function getDocumentNumberingSettings() {
  const db = await getDb();
  if (!db) return {};
  
  const settings_list = await getSettingsByCategory('document_numbering');
  const result: Record<string, string> = {};
  
  settings_list.forEach(setting => {
    result[setting.key] = setting.value || '';
  });
  
  return result;
}



// ============= DOCUMENT NUMBER FORMATTING =============

export async function getDocumentNumberFormat(documentType: string) {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db
      .select()
      .from(documentNumberFormats)
      .where(eq(documentNumberFormats.documentType, documentType))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error: any) {
    // If table doesn't exist, return null (graceful fallback)
    if (error?.code === 'ER_NO_SUCH_TABLE') {
      return null;
    }
    throw error;
  }
}

export async function updateDocumentNumberFormat(
  documentType: string,
  format: {
    prefix?: string;
    padding?: number;
    separator?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const existing = await getDocumentNumberFormat(documentType);
    
    if (existing) {
      await db
        .update(documentNumberFormats)
        .set({
          prefix: format.prefix !== undefined ? format.prefix : existing.prefix,
          padding: format.padding !== undefined ? format.padding : existing.padding,
          separator: format.separator !== undefined ? format.separator : existing.separator,
          updatedAt: new Date(),
        })
        .where(eq(documentNumberFormats.documentType, documentType));
      
      return existing.id;
    } else {
      const id = `dnf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.insert(documentNumberFormats).values({
        id,
        documentType,
        prefix: format.prefix || '',
        padding: format.padding || 6,
        separator: format.separator || '-',
        currentNumber: 1,
        formatExample: generateFormatExample(format.prefix || '', format.padding || 6, format.separator || '-', 1),
        isActive: true,
      });
      return id;
    }
  } catch (error: any) {
    if (error?.code === 'ER_NO_SUCH_TABLE') {
      console.warn('[Database] documentNumberFormats table not available');
      return `dnf_${Date.now()}`;
    }
    throw error;
  }
}

export async function getNextDocumentNumberWithFormat(documentType: string): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const format = await getDocumentNumberFormat(documentType);
  
  if (!format) {
    // Fallback to old method if format not found
    return getNextDocumentNumber(documentType);
  }
  
  const prefix = format.prefix || '';
  const padding = format.padding || 6;
  const separator = format.separator || '-';
  const nextNum = format.currentNumber || 1;
  
  // Generate the document number
  const paddedNumber = String(nextNum).padStart(padding, '0');
  const documentNumber = prefix ? `${prefix}${separator}${paddedNumber}` : paddedNumber;
  
  // Increment and save the next number
  await db
    .update(documentNumberFormats)
    .set({
      currentNumber: nextNum + 1,
      updatedAt: new Date(),
    })
    .where(eq(documentNumberFormats.documentType, documentType));
  
  return documentNumber;
}

function generateFormatExample(prefix: string, padding: number, separator: string, exampleNumber: number = 1): string {
  const paddedNumber = String(exampleNumber).padStart(padding, '0');
  return prefix ? `${prefix}${separator}${paddedNumber}` : paddedNumber;
}

export async function resetDocumentNumberFormatCounter(documentType: string, startNumber: number = 1) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(documentNumberFormats)
    .set({
      currentNumber: startNumber,
      updatedAt: new Date(),
    })
    .where(eq(documentNumberFormats.documentType, documentType));
}

// ============= DEFAULT SETTINGS =============

export async function getDefaultSetting(category: string, key: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(defaultSettings)
    .where(and(
      eq(defaultSettings.category, category),
      eq(defaultSettings.key, key)
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getDefaultSettingsByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(defaultSettings)
    .where(eq(defaultSettings.category, category))
    .orderBy(defaultSettings.key);
}

export async function setDefaultSetting(
  category: string,
  key: string,
  defaultValue: string,
  description?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `dset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const existing = await getDefaultSetting(category, key);
  
  if (existing) {
    await db
      .update(defaultSettings)
      .set({
        defaultValue,
        description: description || existing.description,
      })
      .where(and(
        eq(defaultSettings.category, category),
        eq(defaultSettings.key, key)
      ));
    
    return existing.id;
  } else {
    await db.insert(defaultSettings).values({
      id,
      category,
      key,
      defaultValue,
      description,
    });
    return id;
  }
}

export async function resetSettingToDefault(key: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Find the default value
  const allDefaults = await db.select().from(defaultSettings);
  const defaultSetting = allDefaults.find(d => d.key === key);
  
  if (defaultSetting) {
    // Reset the setting to its default value
    await setSetting(key, defaultSetting.defaultValue, defaultSetting.category);
  }
}

export async function resetCategoryToDefaults(category: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const defaults = await getDefaultSettingsByCategory(category);
  
  for (const defaultSetting of defaults) {
    if (defaultSetting.defaultValue) {
      await setSetting(defaultSetting.key, defaultSetting.defaultValue, category);
    }
  }
}

// ============= ROLES & PERMISSIONS =============

export async function getRoles() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(userRoles)
    .orderBy(userRoles.roleName);
}

export async function getPermissions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(permissions)
    .orderBy(permissions.category, permissions.permissionName);
}

export async function getRolePermissions(roleId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      permissionId: rolePermissions.permissionId,
      permissionName: permissions.permissionName,
      description: permissions.description,
      category: permissions.category,
    })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId))
    .orderBy(permissions.category, permissions.permissionName);
}

export async function assignPermissionToRole(roleId: string, permissionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if already assigned
  const existing = await db
    .select()
    .from(rolePermissions)
    .where(
      and(
        eq(rolePermissions.roleId, roleId),
        eq(rolePermissions.permissionId, permissionId)
      )
    )
    .limit(1);
  
  if (existing.length > 0) {
    return existing[0].id;
  }
  
  const id = `rp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(rolePermissions).values({
    id,
    roleId,
    permissionId,
  });
  
  return id;
}

export async function removePermissionFromRole(roleId: string, permissionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(rolePermissions)
    .where(
      and(
        eq(rolePermissions.roleId, roleId),
        eq(rolePermissions.permissionId, permissionId)
      )
    );
}

export async function createRole(roleName: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(userRoles).values({
    id,
    roleName,
    description,
    isActive: true,
  });
  
  return id;
}

export async function createPermission(permissionName: string, description?: string, category?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.insert(permissions).values({
    id,
    permissionName,
    description,
    category,
  });
  
  return id;
}

