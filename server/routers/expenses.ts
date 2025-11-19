import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { expenses } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const expensesRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(expenses).limit(input?.limit || 50).offset(input?.offset || 0);
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(expenses).where(eq(expenses.id, input)).limit(1);
      return result[0] || null;
    }),

  create: protectedProcedure
    .input(z.object({
      expenseNumber: z.string().optional(),
      category: z.string(),
      vendor: z.string().optional(),
      amount: z.number(),
      expenseDate: z.date(),
      paymentMethod: z.enum(["cash", "bank_transfer", "cheque", "card", "other"]).optional(),
      receiptUrl: z.string().optional(),
      description: z.string().optional(),
      accountId: z.string().optional(),
      status: z.enum(["pending", "approved", "rejected", "paid"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const id = uuidv4();
      const expenseNumber = input.expenseNumber || `EXP-${Date.now()}`;
      
      await db.insert(expenses).values({
        id,
        ...input,
        expenseNumber,
        createdBy: ctx.user.id,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      expenseNumber: z.string().optional(),
      category: z.string().optional(),
      vendor: z.string().optional(),
      amount: z.number().optional(),
      expenseDate: z.date().optional(),
      paymentMethod: z.enum(["cash", "bank_transfer", "cheque", "card", "other"]).optional(),
      receiptUrl: z.string().optional(),
      description: z.string().optional(),
      accountId: z.string().optional(),
      status: z.enum(["pending", "approved", "rejected", "paid"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      await db.update(expenses).set(data).where(eq(expenses.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(expenses).where(eq(expenses.id, input));
      return { success: true };
    }),

  byStatus: protectedProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(expenses).where(eq(expenses.status, input.status as any));
      return result;
    }),
});

