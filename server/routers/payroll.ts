import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { payroll } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const payrollRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(payroll).limit(input?.limit || 50).offset(input?.offset || 0);
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(payroll).where(eq(payroll.id, input)).limit(1);
      return result[0] || null;
    }),

  byEmployee: protectedProcedure
    .input(z.object({ employeeId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(payroll).where(eq(payroll.employeeId, input.employeeId));
      return result;
    }),

  create: protectedProcedure
    .input(z.object({
      employeeId: z.string(),
      payPeriodStart: z.date(),
      payPeriodEnd: z.date(),
      basicSalary: z.number(),
      allowances: z.number().optional(),
      deductions: z.number().optional(),
      tax: z.number().optional(),
      netSalary: z.number(),
      status: z.enum(["draft", "processed", "paid"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const id = uuidv4();
      await db.insert(payroll).values({
        id,
        ...input,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      employeeId: z.string().optional(),
      payPeriodStart: z.date().optional(),
      payPeriodEnd: z.date().optional(),
      basicSalary: z.number().optional(),
      allowances: z.number().optional(),
      deductions: z.number().optional(),
      tax: z.number().optional(),
      netSalary: z.number().optional(),
      status: z.enum(["draft", "processed", "paid"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      await db.update(payroll).set(data as any).where(eq(payroll.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(payroll).where(eq(payroll.id, input));
      return { success: true };
    }),
});

