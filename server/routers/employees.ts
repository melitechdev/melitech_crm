import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { employees } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const employeesRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      return await db.select().from(employees).limit(input?.limit || 50).offset(input?.offset || 0);
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(employees).where(eq(employees.id, input)).limit(1);
      return result[0] || null;
    }),

  byDepartment: protectedProcedure
    .input(z.object({ department: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(employees).where(eq(employees.department, input.department));
      return result;
    }),

  create: protectedProcedure
    .input(z.object({
      employeeNumber: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().optional(),
      phone: z.string().optional(),
      dateOfBirth: z.date().optional(),
      hireDate: z.date(),
      department: z.string().optional(),
      position: z.string().optional(),
      salary: z.number().optional(),
      employmentType: z.string().optional(),
      status: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const id = uuidv4();
      await db.insert(employees).values({
        id,
        ...input,
        createdBy: ctx.user.id,
      } as any);
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      employeeNumber: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      dateOfBirth: z.date().optional(),
      hireDate: z.date().optional(),
      department: z.string().optional(),
      position: z.string().optional(),
      salary: z.number().optional(),
      employmentType: z.string().optional(),
      status: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      await db.update(employees).set(data as any).where(eq(employees.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(employees).where(eq(employees.id, input));
      return { success: true };
    }),
});

