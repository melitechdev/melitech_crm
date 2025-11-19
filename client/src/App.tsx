import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import MFA from "./pages/MFA";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import EditClient from "./pages/EditClient";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import CreateInvoice from "./pages/CreateInvoice";
import EditInvoice from "./pages/EditInvoice";
import Estimates from "./pages/Estimates";
import EstimateDetails from "./pages/EstimateDetails";
import CreateEstimate from "./pages/CreateEstimate";
import EditEstimate from "./pages/EditEstimate";
import Receipts from "./pages/Receipts";
import ReceiptDetails from "./pages/ReceiptDetails";
import CreateReceipt from "./pages/CreateReceipt";
import EditReceipt from "./pages/EditReceipt";
import Opportunities from "./pages/Opportunities";
import Payments from "./pages/Payments";
import CreatePayment from "./pages/CreatePayment";
import CreateProduct from "./pages/CreateProduct";
import CreateService from "./pages/CreateService";
import CreateExpense from "./pages/CreateExpense";
import CreateOpportunity from "./pages/CreateOpportunity";
import CreateEmployee from "./pages/CreateEmployee";
import CreateDepartment from "./pages/CreateDepartment";
import CreateAttendance from "./pages/CreateAttendance";
import CreatePayroll from "./pages/CreatePayroll";
import CreateLeaveRequest from "./pages/CreateLeaveRequest";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import Products from "./pages/Products";
import Services from "./pages/Services";
import HR from "./pages/HR";
import Employees from "./pages/Employees";
import EmployeeDetails from "./pages/EmployeeDetails";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import LeaveManagement from "./pages/LeaveManagement";
import Reports from "./pages/Reports";
import Settings from "@/pages/Settings";
import TestPDFGeneration from "@/pages/TestPDFGeneration";
import Proposals from "./pages/Proposals";
import ProposalDetails from "./pages/ProposalDetails";
import Expenses from "./pages/Expenses";
import BankReconciliation from "./pages/BankReconciliation";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import Departments from "./pages/Departments";
import DepartmentDetails from "./pages/DepartmentDetails";
import PaymentDetails from "./pages/PaymentDetails";
import ProductDetails from "./pages/ProductDetails";
import ServiceDetails from "./pages/ServiceDetails";
import OpportunityDetails from "./pages/OpportunityDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ClientPortal from "./pages/ClientPortal";
import AttendanceDetails from "@/pages/AttendanceDetails";
import PayrollDetails from "@/pages/PayrollDetails";
import LeaveManagementDetails from "@/pages/LeaveManagementDetails";
import ReportsDetails from "@/pages/ReportsDetails";
import BankReconciliationDetails from "@/pages/BankReconciliationDetails";
import ChartOfAccountsDetails from "@/pages/ChartOfAccountsDetails";
import ExpensesDetails from "@/pages/ExpensesDetails";
import HRDetails from "@/pages/HRDetails";
import Account from "./pages/Account";
import Sales from "./pages/Sales";
import Accounting from "./pages/Accounting";
import HRModule from "./pages/HRModule";


function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Auth Routes */}
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />
      
      {/* Portal Routes */}
      <Route path={"/client-portal"} component={ClientPortal} />
      
      {/* Home & Dashboard */}
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={DashboardHome} />
      
      {/* Clients Routes - Specific before generic */}
      <Route path={"/clients"} component={Clients} />
      <Route path={"/clients/:id/edit"} component={EditClient} />
      <Route path={"/clients/:id"} component={ClientDetails} />
      
      {/* Invoices Routes - Specific before generic */}
      <Route path={"/invoices"} component={Invoices} />
      <Route path={"/invoices/create"} component={CreateInvoice} />
      <Route path={"/invoices/:id/edit"} component={EditInvoice} />
      <Route path={"/invoices/:id"} component={InvoiceDetails} />
      
      {/* Estimates Routes - Specific before generic */}
      <Route path={"/estimates"} component={Estimates} />
      <Route path={"/estimates/create"} component={CreateEstimate} />
      <Route path={"/estimates/:id/edit"} component={EditEstimate} />
      <Route path={"/estimates/:id"} component={EstimateDetails} />
      
      {/* Receipts Routes - Specific before generic */}
      <Route path={"/receipts"} component={Receipts} />
      <Route path={"/receipts/create"} component={CreateReceipt} />
      <Route path={"/receipts/:id/edit"} component={EditReceipt} />
      <Route path={"/receipts/:id"} component={ReceiptDetails} />
      
      {/* Sales Routes */}
      <Route path={"/opportunities"} component={Opportunities} />
      <Route path={"/opportunities/create"} component={CreateOpportunity} />
      <Route path={"/opportunities/:id"} component={OpportunityDetails} />
      <Route path={"/proposals"} component={Proposals} />
      <Route path={"/proposals/:id"} component={ProposalDetails} />
      
      {/* Accounting Routes */}
      <Route path={"/payments"} component={Payments} />
      <Route path={"/payments/create"} component={CreatePayment} />
      <Route path={"/payments/:id"} component={PaymentDetails} />
      <Route path={"/expenses"} component={Expenses} />
      <Route path={"/expenses/create"} component={CreateExpense} />
      <Route path={"/bank-reconciliation"} component={BankReconciliation} />
      <Route path={"/chart-of-accounts"} component={ChartOfAccounts} />
      
      {/* Products & Services */}
      <Route path={"/products"} component={Products} />
      <Route path={"/products/create"} component={CreateProduct} />
      <Route path={"/products/:id"} component={ProductDetails} />
      <Route path={"/services"} component={Services} />
      <Route path={"/services/create"} component={CreateService} />
      <Route path={"/services/:id"} component={ServiceDetails} />
      
      {/* HR Routes */}
      <Route path={"/employees"} component={Employees} />
      <Route path={"/employees/create"} component={CreateEmployee} />
      <Route path={"/employees/:id"} component={EmployeeDetails} />
      <Route path={"/departments"} component={Departments} />
      <Route path={"/departments/create"} component={CreateDepartment} />
      <Route path={"/departments/:id"} component={DepartmentDetails} />
      <Route path={"/attendance"} component={Attendance} />
      <Route path={"/attendance/create"} component={CreateAttendance} />
      <Route path={"/payroll"} component={Payroll} />
      <Route path={"/payroll/create"} component={CreatePayroll} />
      <Route path={"/leave-management"} component={LeaveManagement} />
      <Route path={"/leave-management/create"} component={CreateLeaveRequest} />
      
      {/* Projects Routes - Specific before generic */}
      <Route path={"/projects"} component={Projects} />
      <Route path={"/projects/create"} component={CreateProject} />
      <Route path={"/projects/:id/edit"} component={EditProject} />
      <Route path={"/projects/:id"} component={ProjectDetails} />
      
      {/* Sales, Accounting, HR Landing Pages */}
      <Route path={"/sales"} component={Sales} />
      <Route path={"/accounting"} component={Accounting} />
      <Route path={"/hr"} component={HRModule} />
      
      {/* Reports & Settings */}
      <Route path={"/reports"} component={Reports} />
      <Route path={"/settings"} component={Settings} />
      
      {/* User Profile Routes */}
      <Route path={"/account"} component={Account} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/security"} component={Security} />
      <Route path={"/mfa"} component={MFA} />
      
      {/* Test Routes */}
      <Route path={"/test-pdf"} component={TestPDFGeneration} />
      
      {/* Error Routes */}
      <Route path={"/404"} component={NotFound} />
      
      {/* Final fallback route */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
