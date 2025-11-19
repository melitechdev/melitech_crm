import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { attendance } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const attendanceRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(attendance).limit(input?.limit || 50).offset(input?.offset || 0);
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(attendance).where(eq(attendance.id, input)).limit(1);
      return result[0] || null;
    }),

  byEmployee: protectedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(attendance).where(eq(attendance.employeeId, input.employeeId));
      return result;
    }),

  create: protectedProcedure
    .input(z.object({
      employeeId: z.string(),
      date: z.date(),
      checkInTime: z.date().optional(),
      checkOutTime: z.date().optional(),
      status: z.enum(["present", "absent", "late", "half_day", "leave"]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const id = uuidv4();
      await db.insert(attendance).values({
        id,
        ...input,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      employeeId: z.string().optional(),
      date: z.date().optional(),
      checkInTime: z.date().optional(),
      checkOutTime: z.date().optional(),
      status: z.enum(["present", "absent", "late", "half_day", "leave"]).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      await db.update(attendance).set(data as any).where(eq(attendance.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(attendance).where(eq(attendance.id, input));
      return { success: true };
    }),
});

