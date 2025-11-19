import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { services } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const servicesRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(services).limit(input?.limit || 50).offset(input?.offset || 0);
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(services).where(eq(services.id, input)).limit(1);
      return result[0] || null;
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      category: z.string().optional(),
      hourlyRate: z.number().optional(),
      fixedPrice: z.number().optional(),
      unit: z.string().optional(),
      taxRate: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const id = uuidv4();
      await db.insert(services).values({
        id,
        ...input,
        createdBy: ctx.user.id,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      hourlyRate: z.number().optional(),
      fixedPrice: z.number().optional(),
      unit: z.string().optional(),
      taxRate: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      await db.update(services).set(data).where(eq(services.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(services).where(eq(services.id, input));
      return { success: true };
    }),
});

