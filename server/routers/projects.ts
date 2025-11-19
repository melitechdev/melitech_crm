import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { projects } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const projectsRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(projects).limit(input?.limit || 50).offset(input?.offset || 0);
      return result;
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(projects).where(eq(projects.id, input)).limit(1);
      return result[0] || null;
    }),

  byClient: protectedProcedure
    .input(z.object({ clientId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(projects).where(eq(projects.clientId, input.clientId));
      return result;
    }),

  byStatus: protectedProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const result = await db.select().from(projects).where(eq(projects.status, input.status as any));
      return result;
    }),

  create: protectedProcedure
    .input(z.object({
      clientId: z.string(),
      name: z.string(),
      description: z.string().optional(),
      status: z.enum(["planning", "active", "on_hold", "completed", "cancelled"]).optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      budget: z.number().optional(),
      progress: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const id = uuidv4();
      const projectNumber = `PRJ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
      const data: any = {
        id,
        projectNumber,
        name: input.name,
        clientId: input.clientId,
        createdBy: ctx.user.id,
      };
      
      if (input.description) data.description = input.description;
      if (input.status) data.status = input.status;
      if (input.priority) data.priority = input.priority;
      if (input.startDate) data.startDate = input.startDate;
      if (input.endDate) data.endDate = input.endDate;
      if (input.budget) data.budget = input.budget;
      if (input.progress) data.progress = input.progress;
      
      await db.insert(projects).values(data);
      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["planning", "active", "on_hold", "completed", "cancelled"]).optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      startDate: z.date().optional(),
      endDate: z.date().optional(),
      budget: z.number().optional(),
      progress: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { id, ...data } = input;
      const updateData: any = {};
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.startDate !== undefined) updateData.startDate = data.startDate;
      if (data.endDate !== undefined) updateData.endDate = data.endDate;
      if (data.budget !== undefined) updateData.budget = data.budget;
      if (data.progress !== undefined) updateData.progress = data.progress;
      
      await db.update(projects).set(updateData).where(eq(projects.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db.delete(projects).where(eq(projects.id, input));
      return { success: true };
    }),

  // Project Tasks
  tasks: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ input }) => {
        // TODO: Implement task listing
        return [];
      }),

    create: protectedProcedure
      .input(z.object({
        projectId: z.string(),
        title: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // TODO: Implement task creation
        return { id: "task-id" };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        data: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        // TODO: Implement task update
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.string())
      .mutation(async ({ input }) => {
        // TODO: Implement task deletion
        return { success: true };
      }),
  }),
});
