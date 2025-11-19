import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { invoices } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const invoicesRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(invoices).limit(input?.limit || 50).offset(input?.offset || 0);
      return result;
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(invoices).where(eq(invoices.id, input)).limit(1);
      return result[0] || null;
    }),

  byClient: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(invoices).where(eq(invoices.clientId, input.clientId));
      return result;
    }),

  create: protectedProcedure
    .input(z.object({
      invoiceNumber: z.string(),
      clientId: z.string(),
      title: z.string().optional(),
      status: z.enum(["draft", "sent", "paid", "partial", "overdue", "cancelled"]).optional(),
      issueDate: z.date(),
      dueDate: z.date(),
      subtotal: z.number(),
      taxAmount: z.number().optional(),
      discountAmount: z.number().optional(),
      total: z.number(),
      notes: z.string().optional(),
      terms: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const id = uuidv4();
      await db.insert(invoices).values({
        id,
        ...input,
        createdBy: ctx.user.id,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      invoiceNumber: z.string().optional(),
      clientId: z.string().optional(),
      title: z.string().optional(),
      status: z.enum(["draft", "sent", "paid", "partial", "overdue", "cancelled"]).optional(),
      issueDate: z.date().optional(),
      dueDate: z.date().optional(),
      subtotal: z.number().optional(),
      taxAmount: z.number().optional(),
      discountAmount: z.number().optional(),
      total: z.number().optional(),
      paidAmount: z.number().optional(),
      notes: z.string().optional(),
      terms: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      await db.update(invoices).set(data).where(eq(invoices.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(invoices).where(eq(invoices.id, input));
      return { success: true };
    }),

  byStatus: protectedProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(invoices).where(eq(invoices.status, input.status as any));
      return result;
    }),
});
