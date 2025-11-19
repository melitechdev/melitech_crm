import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { opportunities } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const opportunitiesRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(opportunities).limit(input?.limit || 50).offset(input?.offset || 0);
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(opportunities).where(eq(opportunities.id, input)).limit(1);
      return result[0] || null;
    }),

  byClient: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(opportunities).where(eq(opportunities.clientId, input.clientId));
      return result;
    }),

  create: protectedProcedure
    .input(z.object({
      clientId: z.string(),
      title: z.string(),
      description: z.string().optional(),
      value: z.number(),
      stage: z.enum(["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]).optional(),
      probability: z.number().optional(),
      expectedCloseDate: z.date().optional(),
      assignedTo: z.string().optional(),
      source: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const id = uuidv4();
      await db.insert(opportunities).values({
        id,
        ...input,
        createdBy: ctx.user.id,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      clientId: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      value: z.number().optional(),
      stage: z.enum(["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]).optional(),
      probability: z.number().optional(),
      expectedCloseDate: z.date().optional(),
      actualCloseDate: z.date().optional(),
      assignedTo: z.string().optional(),
      source: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      await db.update(opportunities).set(data).where(eq(opportunities.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(opportunities).where(eq(opportunities.id, input));
      return { success: true };
    }),

  byStage: protectedProcedure
    .input(z.object({ stage: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(opportunities).where(eq(opportunities.stage, input.stage as any));
      return result;
    }),
});

