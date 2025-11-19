import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { receipts } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const receiptsRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(receipts).limit(input?.limit || 50).offset(input?.offset || 0);
      return result;
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(receipts).where(eq(receipts.id, input)).limit(1);
      return result[0] || null;
    }),

  byClient: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(receipts).where(eq(receipts.clientId, input.clientId));
      return result;
    }),

  create: protectedProcedure
    .input(z.object({
      receiptNumber: z.string(),
      clientId: z.string(),
      paymentId: z.string().optional(),
      amount: z.number(),
      paymentMethod: z.enum(["cash", "bank_transfer", "cheque", "mpesa", "card", "other"]),
      receiptDate: z.date(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const id = uuidv4();
      await db.insert(receipts).values({
        id,
        ...input,
        createdBy: ctx.user.id,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      receiptNumber: z.string().optional(),
      clientId: z.string().optional(),
      paymentId: z.string().optional(),
      amount: z.number().optional(),
      paymentMethod: z.enum(["cash", "bank_transfer", "cheque", "mpesa", "card", "other"]).optional(),
      receiptDate: z.date().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      await db.update(receipts).set(data).where(eq(receipts.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(receipts).where(eq(receipts.id, input));
      return { success: true };
    }),
});

