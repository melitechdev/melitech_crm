import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { leaveRequests } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const leaveRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(leaveRequests).limit(input?.limit || 50).offset(input?.offset || 0);
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(leaveRequests).where(eq(leaveRequests.id, input)).limit(1);
      return result[0] || null;
    }),

  byEmployee: protectedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(leaveRequests).where(eq(leaveRequests.employeeId, input.employeeId));
      return result;
    }),

  create: protectedProcedure
    .input(z.object({
      employeeId: z.string(),
      leaveType: z.enum(["annual", "sick", "maternity", "paternity", "unpaid", "other"]),
      startDate: z.date(),
      endDate: z.date(),
      days: z.number(),
      reason: z.string().optional(),
      status: z.enum(["pending", "approved", "rejected", "cancelled"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const id = uuidv4();
      await db.insert(leaveRequests).values({
        id,
        ...input,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      employeeId: z.string().optional(),
      leaveType: z.enum(["annual", "sick", "maternity", "paternity", "unpaid", "other"]).optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      days: z.number().optional(),
      reason: z.string().optional(),
      status: z.enum(["pending", "approved", "rejected", "cancelled"]).optional(),
      approvedBy: z.string().optional(),
      approvalDate: z.date().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      await db.update(leaveRequests).set(data as any).where(eq(leaveRequests.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(leaveRequests).where(eq(leaveRequests.id, input));
      return { success: true };
    }),

  byStatus: protectedProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(leaveRequests).where(eq(leaveRequests.status, input.status as any));
      return result;
    }),
});

