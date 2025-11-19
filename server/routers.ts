import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

import { TRPCError } from "@trpc/server";
import { usersRouter } from "./routers/users";
import { clientsRouter } from "./routers/clients";
import { invoicesRouter } from "./routers/invoices";
import { projectsRouter } from "./routers/projects";
import { paymentsRouter } from "./routers/payments";
import { estimatesRouter } from "./routers/estimates";
import { productsRouter } from "./routers/products";
import { receiptsRouter } from "./routers/receipts";
import { servicesRouter } from "./routers/services";
import { expensesRouter } from "./routers/expenses";
import { opportunitiesRouter } from "./routers/opportunities";
import { employeesRouter } from "./routers/employees";
import { departmentsRouter } from "./routers/departments";
import { attendanceRouter } from "./routers/attendance";
import { payrollRouter } from "./routers/payroll";
import { leaveRouter } from "./routers/leave";
import { settingsRouter } from "./routers/settings";
import { dashboardRouter } from "./routers/dashboard";
import { z } from "zod";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin' && ctx.user.role !== 'super_admin' && ctx.user.role !== 'staff') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  users: usersRouter as any,
  clients: clientsRouter,
  invoices: invoicesRouter,
  projects: projectsRouter,
  payments: paymentsRouter,
  estimates: estimatesRouter,
  products: productsRouter,
  receipts: receiptsRouter,
  services: servicesRouter,
  expenses: expensesRouter,
  opportunities: opportunitiesRouter,
  employees: employeesRouter,
  departments: departmentsRouter,
  attendance: attendanceRouter,
  payroll: payrollRouter,
  leave: leaveRouter,
  settings: settingsRouter,
  dashboard: dashboardRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const userId = ctx.user.id;
        const updateData: any = {};
        
        if (input.name) updateData.name = input.name;
        if (input.email) updateData.email = input.email;
        
        if (Object.keys(updateData).length === 0) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'No fields to update' });
        }
        
        try {
          await db.updateUser(userId, updateData);
          return { success: true, message: 'Profile updated successfully' };
        } catch (error) {
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update profile' });
        }
      }),
  }),

  // ============= NOTIFICATIONS =============
  notifications: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return await db.getUserNotifications(ctx.user.id, input?.limit);
      }),

    unread: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUnreadNotifications(ctx.user.id);
    }),

    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      const unread = await db.getUnreadNotifications(ctx.user.id);
      return unread.length;
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),

    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      await db.markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteNotification(input.id);
        return { success: true };
      }),

    create: protectedProcedure
      .input(z.object({
        userId: z.string(),
        title: z.string(),
        message: z.string(),
        type: z.enum(["info", "success", "warning", "error", "reminder"]).optional(),
        category: z.string().optional(),
        entityType: z.string().optional(),
        entityId: z.string().optional(),
        actionUrl: z.string().optional(),
        priority: z.enum(["low", "normal", "high"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createNotification(input);
        await db.logActivity({
          userId: ctx.user.id,
          action: "notification_created",
          entityType: "notification",
          entityId: id,
          description: `Created notification: ${input.title}`,
        });
        return { id };
      }),
  }),
});

export type AppRouter = typeof appRouter;

