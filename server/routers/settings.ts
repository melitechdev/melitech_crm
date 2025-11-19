import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin' && ctx.user.role !== 'super_admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const settingsRouter = router({
  // Get a single setting by key
  get: protectedProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const setting = await db.getSetting(input.key);
      return setting;
    }),

  // Get all settings by category
  getByCategory: protectedProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      const settings = await db.getSettingsByCategory(input.category);
      return settings;
    }),

  // Get all settings
  getAll: protectedProcedure.query(async () => {
    const settings = await db.getAllSettings();
    return settings;
  }),

  // Set a setting (create or update)
  set: adminProcedure
    .input(z.object({
      key: z.string(),
      value: z.string(),
      category: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const id = await db.setSetting(
        input.key,
        input.value,
        input.category,
        input.description,
        ctx.user.id
      );

      await db.logActivity({
        userId: ctx.user.id,
        action: "setting_updated",
        entityType: "setting",
        entityId: id,
        description: `Updated setting: ${input.key}`,
      });

      return { id, success: true };
    }),

  // Delete a setting
  delete: adminProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db.deleteSetting(input.key);

      await db.logActivity({
        userId: ctx.user.id,
        action: "setting_deleted",
        entityType: "setting",
        entityId: input.key,
        description: `Deleted setting: ${input.key}`,
      });

      return { success: true };
    }),

  // ============= DOCUMENT NUMBERING =============

  // Get next document number
  getNextDocumentNumber: protectedProcedure
    .input(z.object({ documentType: z.enum(['invoice', 'estimate', 'receipt', 'proposal', 'expense']) }))
    .mutation(async ({ input, ctx }) => {
      const documentNumber = await db.getNextDocumentNumber(input.documentType);

      await db.logActivity({
        userId: ctx.user.id,
        action: "document_number_generated",
        entityType: "document",
        entityId: documentNumber,
        description: `Generated ${input.documentType} number: ${documentNumber}`,
      });

      return { documentNumber };
    }),

  // Get all document numbering settings
  getDocumentNumberingSettings: protectedProcedure.query(async () => {
    const settings = await db.getDocumentNumberingSettings();
    return settings;
  }),

  // Update document numbering prefix
  updateDocumentPrefix: adminProcedure
    .input(z.object({
      documentType: z.enum(['invoice', 'estimate', 'receipt', 'proposal', 'expense']),
      prefix: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const prefixKey = `${input.documentType}_prefix`;
      await db.setSetting(prefixKey, input.prefix, 'document_numbering', undefined, ctx.user.id);

      await db.logActivity({
        userId: ctx.user.id,
        action: "document_prefix_updated",
        entityType: "setting",
        entityId: prefixKey,
        description: `Updated ${input.documentType} prefix to: ${input.prefix}`,
      });

      return { success: true };
    }),

  // Reset document number counter
  resetDocumentCounter: adminProcedure
    .input(z.object({
      documentType: z.enum(['invoice', 'estimate', 'receipt', 'proposal', 'expense']),
      startNumber: z.number().int().min(1).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const startNumber = input.startNumber || 1;
      await db.resetDocumentNumberCounter(input.documentType, startNumber);

      await db.logActivity({
        userId: ctx.user.id,
        action: "document_counter_reset",
        entityType: "setting",
        entityId: `${input.documentType}_next`,
        description: `Reset ${input.documentType} counter to: ${startNumber}`,
      });

      return { success: true };
    }),

  // ============= COMPANY SETTINGS =============

  // Get company info
  getCompanyInfo: protectedProcedure.query(async () => {
    const settings = await db.getSettingsByCategory('company_info');
    const result: Record<string, string> = {};

    settings.forEach(setting => {
      result[setting.key] = setting.value || '';
    });

    return result;
  }),

  // Update company info
  updateCompanyInfo: adminProcedure
    .input(z.object({
      companyName: z.string().optional(),
      companyEmail: z.string().optional(),
      companyPhone: z.string().optional(),
      companyAddress: z.string().optional(),
      companyCity: z.string().optional(),
      companyCountry: z.string().optional(),
      companyPostalCode: z.string().optional(),
      companyWebsite: z.string().optional(),
      companyLogo: z.string().optional(),
      taxId: z.string().optional(),
      registrationNumber: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const updates = Object.entries(input).filter(([, value]) => value !== undefined);

      for (const [key, value] of updates) {
        await db.setSetting(key, value as string, 'company_info', undefined, ctx.user.id);
      }

      await db.logActivity({
        userId: ctx.user.id,
        action: "company_info_updated",
        entityType: "setting",
        entityId: "company_info",
        description: `Updated company information`,
      });

      return { success: true };
    }),

  // ============= BANK SETTINGS =============

  // Get bank details
  getBankDetails: protectedProcedure.query(async () => {
    const settings = await db.getSettingsByCategory('bank_details');
    const result: Record<string, string> = {};

    settings.forEach(setting => {
      result[setting.key] = setting.value || '';
    });

    return result;
  }),

  // Update bank details
  updateBankDetails: adminProcedure
    .input(z.object({
      bankName: z.string().optional(),
      bankAccountNumber: z.string().optional(),
      bankBranch: z.string().optional(),
      bankCode: z.string().optional(),
      swiftCode: z.string().optional(),
      iban: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const updates = Object.entries(input).filter(([, value]) => value !== undefined);

      for (const [key, value] of updates) {
        await db.setSetting(key, value as string, 'bank_details', undefined, ctx.user.id);
      }

      await db.logActivity({
        userId: ctx.user.id,
        action: "bank_details_updated",
        entityType: "setting",
        entityId: "bank_details",
        description: `Updated bank details`,
      });

      return { success: true };
    }),

  // ============= DOCUMENT NUMBER FORMATTING =============

  // Get document number format
  getDocumentNumberFormat: protectedProcedure
    .input(z.object({ documentType: z.enum(['invoice', 'estimate', 'receipt', 'proposal', 'expense']) }))
    .query(async ({ input }) => {
      const format = await db.getDocumentNumberFormat(input.documentType);
      return format;
    }),

  // Update document number format
  updateDocumentNumberFormat: adminProcedure
    .input(z.object({
      documentType: z.enum(['invoice', 'estimate', 'receipt', 'proposal', 'expense']),
      prefix: z.string().optional(),
      padding: z.number().int().min(2).max(8).optional(),
      separator: z.string().max(10).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const id = await db.updateDocumentNumberFormat(input.documentType, {
        prefix: input.prefix,
        padding: input.padding,
        separator: input.separator,
      });

      await db.logActivity({
        userId: ctx.user.id,
        action: "document_format_updated",
        entityType: "document_format",
        entityId: id,
        description: `Updated ${input.documentType} format`,
      });

      return { success: true, id };
    }),

  // Reset document number format counter
  resetDocumentNumberFormatCounter: adminProcedure
    .input(z.object({
      documentType: z.enum(['invoice', 'estimate', 'receipt', 'proposal', 'expense']),
      startNumber: z.number().int().min(1).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const startNumber = input.startNumber || 1;
      await db.resetDocumentNumberFormatCounter(input.documentType, startNumber);

      await db.logActivity({
        userId: ctx.user.id,
        action: "document_format_counter_reset",
        entityType: "document_format",
        entityId: input.documentType,
        description: `Reset ${input.documentType} counter to ${startNumber}`,
      });

      return { success: true };
    }),

  // ============= RESET TO DEFAULT =============

  // Reset a single setting to default
  resetSettingToDefault: adminProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db.resetSettingToDefault(input.key);

      await db.logActivity({
        userId: ctx.user.id,
        action: "setting_reset_to_default",
        entityType: "setting",
        entityId: input.key,
        description: `Reset setting to default: ${input.key}`,
      });

      return { success: true };
    }),

  // Reset all settings in a category to defaults
  resetCategoryToDefaults: adminProcedure
    .input(z.object({ category: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await db.resetCategoryToDefaults(input.category);

      await db.logActivity({
        userId: ctx.user.id,
        action: "category_reset_to_defaults",
        entityType: "setting_category",
        entityId: input.category,
        description: `Reset all settings in category to defaults: ${input.category}`,
      });

      return { success: true };
    }),

  // ============= ROLES & PERMISSIONS =============

  // Get all roles
  getRoles: protectedProcedure.query(async () => {
    const roles = await db.getRoles();
    return roles;
  }),

  // Get all permissions
  getPermissions: protectedProcedure.query(async () => {
    const permissions = await db.getPermissions();
    return permissions;
  }),

  // Get permissions for a specific role
  getRolePermissions: protectedProcedure
    .input(z.object({ roleId: z.string() }))
    .query(async ({ input }) => {
      const permissions = await db.getRolePermissions(input.roleId);
      return permissions;
    }),

  // Assign permission to role
  assignPermissionToRole: adminProcedure
    .input(z.object({
      roleId: z.string(),
      permissionId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const id = await db.assignPermissionToRole(input.roleId, input.permissionId);

      await db.logActivity({
        userId: ctx.user.id,
        action: "permission_assigned_to_role",
        entityType: "role_permission",
        entityId: id,
        description: `Assigned permission to role`,
      });

      return { success: true, id };
    }),

  // Remove permission from role
  removePermissionFromRole: adminProcedure
    .input(z.object({
      roleId: z.string(),
      permissionId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await db.removePermissionFromRole(input.roleId, input.permissionId);

      await db.logActivity({
        userId: ctx.user.id,
        action: "permission_removed_from_role",
        entityType: "role_permission",
        entityId: `${input.roleId}_${input.permissionId}`,
        description: `Removed permission from role`,
      });

      return { success: true };
    }),

  // Create new role
  createRole: adminProcedure
    .input(z.object({
      roleName: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const id = await db.createRole(input.roleName, input.description);

      await db.logActivity({
        userId: ctx.user.id,
        action: "role_created",
        entityType: "role",
        entityId: id,
        description: `Created role: ${input.roleName}`,
      });

      return { success: true, id };
    }),

  // Create new permission
  createPermission: adminProcedure
    .input(z.object({
      permissionName: z.string(),
      description: z.string().optional(),
      category: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const id = await db.createPermission(input.permissionName, input.description, input.category);

      await db.logActivity({
        userId: ctx.user.id,
        action: "permission_created",
        entityType: "permission",
        entityId: id,
        description: `Created permission: ${input.permissionName}`,
      });

      return { success: true, id };
    }),
});

