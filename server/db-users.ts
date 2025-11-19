/**
 * User Management Database Helpers
 * Handles all user-related database operations
 */

import { eq, and, like, desc } from "drizzle-orm";
import { 
  users, 
  userRoles, 
  permissions, 
  rolePermissions,
  userProjectAssignments,
  projectComments,
  staffTasks,
  InsertUser,
  User,
  UserRole,
  Permission,
  RolePermission,
  UserProjectAssignment,
  ProjectComment,
  StaffTask,
} from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Get all users with optional filtering
 */
export async function getAllUsers(searchTerm?: string, role?: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    if (searchTerm && role) {
      return await db.select().from(users).where(and(
        like(users.name, `%${searchTerm}%`),
        eq(users.role, role as any)
      ));
    } else if (searchTerm) {
      return await db.select().from(users).where(like(users.name, `%${searchTerm}%`));
    } else if (role) {
      return await db.select().from(users).where(eq(users.role, role as any));
    }

    return await db.select().from(users);
  } catch (error) {
    console.error("[Database] Failed to get users:", error);
    return [];
  }
}

/**
 * Get a single user by ID
 */
export async function getUserById(userId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user:", error);
    return undefined;
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: InsertUser): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const newUser: InsertUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
      department: userData.department,
      isActive: userData.isActive !== false,
      clientId: userData.clientId,
      permissions: userData.permissions,
      loginMethod: userData.loginMethod,
    };

    await db.insert(users).values(newUser);
    const result = await getUserById(userData.id);
    return result || null;
  } catch (error) {
    console.error("[Database] Failed to create user:", error);
    return null;
  }
}

/**
 * Update an existing user
 */
export async function updateUser(userId: string, updates: Partial<InsertUser>): Promise<User | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const updateData: Record<string, any> = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.department !== undefined) updateData.department = updates.department;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
    if (updates.clientId !== undefined) updateData.clientId = updates.clientId;
    if (updates.permissions !== undefined) updateData.permissions = updates.permissions;

    if (Object.keys(updateData).length === 0) {
      const result = await getUserById(userId);
      return result || null;
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));
    const result = await getUserById(userId);
    return result || null;
  } catch (error) {
    console.error("[Database] Failed to update user:", error);
    return null;
  }
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Soft delete by marking as inactive
    await db.update(users).set({ isActive: false }).where(eq(users.id, userId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete user:", error);
    return false;
  }
}

/**
 * Assign a user to a project
 */
export async function assignUserToProject(
  userId: string,
  projectId: string,
  role: "project_manager" | "team_lead" | "developer" | "designer" | "qa" | "other" = "developer"
): Promise<UserProjectAssignment | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `upa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const assignment: any = {
      id,
      userId,
      projectId,
      role,
      isActive: true,
    };

    await db.insert(userProjectAssignments).values(assignment);
    return assignment;
  } catch (error) {
    console.error("[Database] Failed to assign user to project:", error);
    return null;
  }
}

/**
 * Get projects assigned to a user
 */
export async function getUserProjects(userId: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(userProjectAssignments)
      .where(and(
        eq(userProjectAssignments.userId, userId),
        eq(userProjectAssignments.isActive, true)
      ));
  } catch (error) {
    console.error("[Database] Failed to get user projects:", error);
    return [];
  }
}

/**
 * Get team members for a project
 */
export async function getProjectTeam(projectId: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(userProjectAssignments)
      .where(and(
        eq(userProjectAssignments.projectId, projectId),
        eq(userProjectAssignments.isActive, true)
      ));
  } catch (error) {
    console.error("[Database] Failed to get project team:", error);
    return [];
  }
}

/**
 * Add a comment to a project
 */
export async function addProjectComment(
  projectId: string,
  userId: string,
  comment: string,
  commentType: "remark" | "update" | "issue" | "question" | "approval" = "remark",
  isPublic: boolean = true
): Promise<ProjectComment | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `pc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newComment: any = {
      id,
      projectId,
      userId,
      comment,
      commentType,
      isPublic,
    };

    await db.insert(projectComments).values(newComment);
    return newComment;
  } catch (error) {
    console.error("[Database] Failed to add project comment:", error);
    return null;
  }
}

/**
 * Get comments for a project
 */
export async function getProjectComments(projectId: string, includePrivate: boolean = false) {
  const db = await getDb();
  if (!db) return [];

  try {
    const whereConditions: any[] = [eq(projectComments.projectId, projectId)];
    
    if (!includePrivate) {
      whereConditions.push(eq(projectComments.isPublic, true));
    }

    return await db
      .select()
      .from(projectComments)
      .where(and(...whereConditions))
      .orderBy(desc(projectComments.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get project comments:", error);
    return [];
  }
}

/**
 * Create a staff task
 */
export async function createStaffTask(
  title: string,
  department: string,
  createdBy: string,
  description?: string,
  assignedTo?: string,
  priority: "low" | "medium" | "high" | "urgent" = "medium",
  dueDate?: Date
): Promise<StaffTask | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const id = `st_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const task: any = {
      id,
      title,
      description,
      department,
      assignedTo,
      createdBy,
      status: "todo",
      priority,
      dueDate,
    };

    await db.insert(staffTasks).values(task);
    return task;
  } catch (error) {
    console.error("[Database] Failed to create staff task:", error);
    return null;
  }
}

/**
 * Get staff tasks for a department
 */
export async function getDepartmentTasks(department: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(staffTasks)
      .where(eq(staffTasks.department, department))
      .orderBy(desc(staffTasks.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get department tasks:", error);
    return [];
  }
}

/**
 * Get tasks assigned to a user
 */
export async function getUserTasks(userId: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(staffTasks)
      .where(eq(staffTasks.assignedTo, userId))
      .orderBy(desc(staffTasks.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get user tasks:", error);
    return [];
  }
}

/**
 * Update staff task status
 */
export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "in_progress" | "completed" | "blocked"
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const updateData: any = { status };
    if (status === "completed") {
      updateData.completedDate = new Date();
    }

    await db.update(staffTasks).set(updateData).where(eq(staffTasks.id, taskId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update task status:", error);
    return false;
  }
}

/**
 * Get all permissions for a role
 */
export async function getRolePermissions(roleId: string): Promise<Permission[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    const perms = await db
      .select({ permission: permissions })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, roleId));

    return perms.map(p => p.permission);
  } catch (error) {
    console.error("[Database] Failed to get role permissions:", error);
    return [];
  }
}

/**
 * Check if user has a specific permission
 */
export async function userHasPermission(userId: string, permissionName: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const user = await getUserById(userId);
    if (!user) return false;

    // Admins have all permissions
    if (user.role === "admin" || user.role === "super_admin") {
      return true;
    }

    // Check if user has the permission in their permissions field (JSON)
    if (user.permissions) {
      try {
        const perms = JSON.parse(user.permissions);
        return Array.isArray(perms) && perms.includes(permissionName);
      } catch {
        return false;
      }
    }

    return false;
  } catch (error) {
    console.error("[Database] Failed to check user permission:", error);
    return false;
  }
}

/**
 * Get department members
 */
export async function getDepartmentMembers(department: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(users)
      .where(and(
        eq(users.department, department),
        eq(users.isActive, true)
      ));
  } catch (error) {
    console.error("[Database] Failed to get department members:", error);
    return [];
  }
}

