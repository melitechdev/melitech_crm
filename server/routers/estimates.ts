import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { estimates } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const estimatesRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(estimates).limit(input?.limit || 50).offset(input?.offset || 0);
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(estimates).where(eq(estimates.id, input)).limit(1);
      return result[0] || null;
    }),

  byClient: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(estimates).where(eq(estimates.clientId, input.clientId));
      return result;
    }),

  create: protectedProcedure
    .input(z.object({
      estimateNumber: z.string(),
      clientId: z.string(),
      title: z.string().optional(),
      status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]).optional(),
      issueDate: z.date(),
      expiryDate: z.date().optional(),
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
      await db.insert(estimates).values({
        id,
        ...input,
        createdBy: ctx.user.id,
      } as any);
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]).optional(),
      total: z.number().optional(),
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
      
      await db.update(estimates).set(updateData).where(eq(estimates.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(estimates).where(eq(estimates.id, input));
      return { success: true };
    }),
});
