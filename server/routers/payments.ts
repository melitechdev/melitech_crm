import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { payments } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const paymentsRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(payments).limit(input?.limit || 50).offset(input?.offset || 0);
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(payments).where(eq(payments.id, input)).limit(1);
      return result[0] || null;
    }),

  create: protectedProcedure
    .input(z.object({
      invoiceId: z.string(),
      clientId: z.string(),
      amount: z.number(),
      paymentDate: z.date(),
      paymentMethod: z.enum(["cash", "bank_transfer", "cheque", "mpesa", "card", "other"]),
      referenceNumber: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const id = uuidv4();
      await db.insert(payments).values({
        id,
        ...input,
        createdBy: ctx.user.id,
      } as any);
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      amount: z.number().optional(),
      paymentDate: z.date().optional(),
      paymentMethod: z.enum(["cash", "bank_transfer", "cheque", "mpesa", "card", "other"]).optional(),
      referenceNumber: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      const updateData: any = {};
      Object.keys(data).forEach(key => {
        if (data[key as keyof typeof data] !== undefined) {
          updateData[key] = data[key as keyof typeof data];
        }
      });
      
      await db.update(payments).set(updateData).where(eq(payments.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(payments).where(eq(payments.id, input));
      return { success: true };
    }),
});
