import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and, gte, lte } from "drizzle-orm";
import { projects, clients, invoices, payments, expenses, products, services, employees } from "../../drizzle/schema";

export const dashboardRouter = router({
  // Get dashboard metrics
  metrics: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        totalProjects: 0,
        activeClients: 0,
        pendingInvoices: 0,
        monthlyRevenue: 0,
        totalProducts: 0,
        totalServices: 0,
        totalEmployees: 0,
        totalAccounts: 0,
      };
    }

    try {
      // Get total projects
      const projectsData = await db.select().from(projects).limit(1000);
      const totalProjects = projectsData.length;

      // Get active clients
      const clientsData = await db.select().from(clients).where(eq(clients.status, "active")).limit(1000);
      const activeClients = clientsData.length;

      // Get pending invoices
      const invoicesData = await db.select().from(invoices).where(eq(invoices.status, "pending")).limit(1000);
      const pendingInvoices = invoicesData.length;

      // Get monthly revenue (payments from this month)
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const paymentsData = await db
        .select()
        .from(payments)
        .where(
          and(
            gte(payments.paymentDate, monthStart),
            lte(payments.paymentDate, monthEnd)
          )
        )
        .limit(1000);

      const monthlyRevenue = paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0);

      // Get total products
      const productsData = await db.select().from(products).limit(1000);
      const totalProducts = productsData.length;

      // Get total services
      const servicesData = await db.select().from(services).limit(1000);
      const totalServices = servicesData.length;

      // Get total employees
      const employeesData = await db.select().from(employees).limit(1000);
      const totalEmployees = employeesData.length;

      return {
        totalProjects,
        activeClients,
        pendingInvoices,
        monthlyRevenue,
        totalProducts,
        totalServices,
        totalEmployees,
        totalAccounts: 0, // Placeholder
      };
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      return {
        totalProjects: 0,
        activeClients: 0,
        pendingInvoices: 0,
        monthlyRevenue: 0,
        totalProducts: 0,
        totalServices: 0,
        totalEmployees: 0,
        totalAccounts: 0,
      };
    }
  }),

  // Get accounting metrics
  accountingMetrics: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        totalInvoices: 0,
        totalPayments: 0,
        totalExpenses: 0,
        totalRevenue: 0,
      };
    }

    try {
      // Get total invoices
      const invoicesData = await db.select().from(invoices).limit(1000);
      const totalInvoices = invoicesData.length;

      // Get total payments
      const paymentsData = await db.select().from(payments).limit(1000);
      const totalPayments = paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0);

      // Get total expenses
      const expensesData = await db.select().from(expenses).limit(1000);
      const totalExpenses = expensesData.reduce((sum, e) => sum + (e.amount || 0), 0);

      // Get total revenue (from invoices)
      const totalRevenue = invoicesData.reduce((sum, i) => sum + (i.totalAmount || 0), 0);

      return {
        totalInvoices,
        totalPayments,
        totalExpenses,
        totalRevenue,
      };
    } catch (error) {
      console.error("Error fetching accounting metrics:", error);
      return {
        totalInvoices: 0,
        totalPayments: 0,
        totalExpenses: 0,
        totalRevenue: 0,
      };
    }
  }),

  // Get HR metrics
  hrMetrics: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        totalDepartments: 0,
      };
    }

    try {
      // Get total employees
      const employeesData = await db.select().from(employees).limit(1000);
      const totalEmployees = employeesData.length;

      // Get active employees
      const activeEmployees = employeesData.filter((e) => e.isActive).length;

      // Get total departments (placeholder)
      const totalDepartments = 0;

      return {
        totalEmployees,
        activeEmployees,
        totalDepartments,
      };
    } catch (error) {
      console.error("Error fetching HR metrics:", error);
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        totalDepartments: 0,
      };
    }
  }),
});

