/**
 * User Management tRPC Router
 * Handles user CRUD operations with role-based access control
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../_core/trpc";
import * as dbUsers from "../db-users";

// Role-based procedure wrappers
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin' && ctx.user.role !== 'super_admin') {
    throw new TRPCError({ 
      code: 'FORBIDDEN', 
      message: 'Admin access required' 
    });
  }
  return next({ ctx });
});

export const clientProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'client') {
    throw new TRPCError({ 
      code: 'FORBIDDEN', 
      message: 'Client access required' 
    });
  }
  return next({ ctx });
});

export const staffProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'staff' && ctx.user.role !== 'admin' && ctx.user.role !== 'super_admin') {
    throw new TRPCError({ 
      code: 'FORBIDDEN', 
      message: 'Staff access required' 
    });
  }
  return next({ ctx });
});

export const accountantProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'accountant' && ctx.user.role !== 'admin' && ctx.user.role !== 'super_admin') {
    throw new TRPCError({ 
      code: 'FORBIDDEN', 
      message: 'Accountant access required' 
    });
  }
  return next({ ctx });
});

export const usersRouter = router({
  /**
   * Admin: Get all users
   */
  list: adminProcedure
    .input(z.object({
      search: z.string().optional(),
      role: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      return await dbUsers.getAllUsers(input?.search, input?.role);
    }),

  /**
   * Admin: Get a single user
   */
  get: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await dbUsers.getUserById(input.id);
    }),

  /**
   * Admin: Create a new user
   */
  create: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      role: z.enum(["user", "admin", "staff", "accountant", "client", "super_admin"]),
      department: z.string().optional(),
      clientId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const user = await dbUsers.createUser({
        id: input.id,
        name: input.name,
        email: input.email,
        role: input.role,
        department: input.department,
        clientId: input.clientId,
        isActive: true,
      });

      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        });
      }

      return user;
    }),

  /**
   * Admin: Update a user
   */
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      role: z.enum(["user", "admin", "staff", "accountant", "client", "super_admin"]).optional(),
      department: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const user = await dbUsers.updateUser(input.id, {
        name: input.name,
        email: input.email,
        role: input.role,
        department: input.department,
        isActive: input.isActive,
      });

      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user',
        });
      }

      return user;
    }),

  /**
   * Admin: Delete a user (soft delete)
   */
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const success = await dbUsers.deleteUser(input.id);
      
      if (!success) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete user',
        });
      }

      return { success: true };
    }),

  /**
   * Staff: Get their assigned projects
   */
  myProjects: staffProcedure.query(async ({ ctx }) => {
    return await dbUsers.getUserProjects(ctx.user.id);
  }),

  /**
   * Staff: Get their assigned tasks
   */
  myTasks: staffProcedure.query(async ({ ctx }) => {
    return await dbUsers.getUserTasks(ctx.user.id);
  }),

  /**
   * Staff: Update task status
   */
  updateTaskStatus: staffProcedure
    .input(z.object({
      taskId: z.string(),
      status: z.enum(["todo", "in_progress", "completed", "blocked"]),
    }))
    .mutation(async ({ input }) => {
      const success = await dbUsers.updateTaskStatus(input.taskId, input.status);
      
      if (!success) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update task status',
        });
      }

      return { success: true };
    }),

  /**
   * Staff: Get department tasks
   */
  departmentTasks: staffProcedure
    .input(z.object({ department: z.string() }))
    .query(async ({ input, ctx }) => {
      // Verify user belongs to this department
      const user = await dbUsers.getUserById(ctx.user.id);
      if (user?.department !== input.department && ctx.user.role !== 'admin' && ctx.user.role !== 'super_admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot access other departments',
        });
      }

      return await dbUsers.getDepartmentTasks(input.department);
    }),

  /**
   * Staff: Get department members
   */
  departmentMembers: staffProcedure
    .input(z.object({ department: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await dbUsers.getUserById(ctx.user.id);
      if (user?.department !== input.department && ctx.user.role !== 'admin' && ctx.user.role !== 'super_admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot access other departments',
        });
      }

      return await dbUsers.getDepartmentMembers(input.department);
    }),

  /**
   * Client: Get their profile
   */
  profile: clientProcedure.query(async ({ ctx }) => {
    return await dbUsers.getUserById(ctx.user.id);
  }),

  /**
   * Client: Get their assigned projects
   */
  clientProjects: clientProcedure.query(async ({ ctx }) => {
    return await dbUsers.getUserProjects(ctx.user.id);
  }),

  /**
   * Any authenticated user: Add comment to project
   */
  addProjectComment: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      comment: z.string(),
      commentType: z.enum(["remark", "update", "issue", "question", "approval"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const newComment = await dbUsers.addProjectComment(
        input.projectId,
        ctx.user.id,
        input.comment,
        input.commentType || "remark",
        true
      );

      if (!newComment) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add comment',
        });
      }

      return newComment;
    }),

  /**
   * Get project comments (public only for clients)
   */
  getProjectComments: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input, ctx }) => {
      const includePrivate = ctx.user.role !== 'client';
      return await dbUsers.getProjectComments(input.projectId, includePrivate);
    }),

  /**
   * Admin: Assign user to project
   */
  assignToProject: adminProcedure
    .input(z.object({
      userId: z.string(),
      projectId: z.string(),
      role: z.enum(["project_manager", "team_lead", "developer", "designer", "qa", "other"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const assignment = await dbUsers.assignUserToProject(
        input.userId,
        input.projectId,
        input.role || "developer"
      );

      if (!assignment) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to assign user to project',
        });
      }

      return assignment;
    }),

  /**
   * Admin: Get project team
   */
  getProjectTeam: adminProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      return await dbUsers.getProjectTeam(input.projectId);
    }),

  /**
   * Admin: Create staff task
   */
  createStaffTask: adminProcedure
    .input(z.object({
      title: z.string(),
      department: z.string(),
      description: z.string().optional(),
      assignedTo: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      dueDate: z.date().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const task = await dbUsers.createStaffTask(
        input.title,
        input.department,
        ctx.user.id,
        input.description,
        input.assignedTo,
        input.priority || "medium",
        input.dueDate
      );

      if (!task) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create task',
        });
      }

      return task;
    }),

  /**
   * Check if user has permission
   */
  hasPermission: protectedProcedure
    .input(z.object({ permission: z.string() }))
    .query(async ({ input, ctx }) => {
      return await dbUsers.userHasPermission(ctx.user.id, input.permission);
    }),
});

