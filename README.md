# Melitech Solutions CRM

**A Complete Customer Relationship Management System**

![Melitech Solutions](client/public/logo.png)

*— Redefining Technology!!! —*

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [User Roles](#user-roles)
- [Module Documentation](#module-documentation)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Security](#security)
- [Support](#support)
- [License](#license)

---

## 🎯 Overview

Melitech Solutions CRM is a comprehensive, full-stack customer relationship management system designed specifically for Melitech Solutions. The system provides complete business management capabilities including client management, project tracking, invoicing, accounting, HR management, and detailed analytics.

### Key Highlights

- **24+ Integrated Modules** covering all aspects of business operations
- **Role-Based Access Control** with 5 user levels (Super Admin, HR, Accountant, Staff, Client)
- **Client Portal** for customer self-service
- **Automated Document Generation** (PDF invoices, receipts, quotations)
- **Email Integration** with professional templates
- **Real-time Analytics** and reporting
- **Dark/Light Mode** with modern, responsive UI
- **Secure Authentication** with password reset and MFA support

---

## ✨ Features

### Core Business Management

#### Client Management
- Comprehensive client database with KYC (Know Your Client) information
- Corporate and individual client profiles
- Contact management with multiple contacts per client
- Key personnel tracking
- Financial information and credit limits
- Risk assessment and compliance tracking
- Document management
- Client activity history

#### Project Management
- Project creation and tracking
- Task management with completion tracking
- Budget management (planned vs actual)
- Progress monitoring with visual indicators
- Timeline tracking (start date, due date, completion)
- Client and team assignment
- Project status management (Planning, Active, On Hold, Completed, Cancelled)
- Priority levels (Low, Medium, High, Urgent)
- Integration with invoices, estimates, and files

### Sales & Revenue

#### Estimates/Quotations
- Professional quotation generation
- Line item management
- Pricing and discount calculations
- Validity period tracking
- Status management (Draft, Sent, Accepted, Rejected, Expired)
- PDF generation with branding
- Email delivery
- Conversion to invoices

#### Proposals
- Business proposal creation
- Template-based generation
- Status tracking
- Document management
- Client approval workflow

#### Opportunities
- Sales pipeline management
- Stage tracking (Lead → Qualified → Proposal → Negotiation → Won/Lost)
- Value and probability tracking
- Expected close date
- Conversion tracking
- Win/loss analysis

#### Receipts
- Payment receipt generation
- Auto-increment receipt numbering (REC-XXXXX)
- Multiple payment methods (Cash, Bank Transfer, M-Pesa, Cheque, Card)
- Payment method distribution charts
- Monthly trends visualization
- Bulk operations
- PDF generation
- Email delivery

### Accounting & Finance

#### Invoices
- Professional invoice generation
- Auto-increment invoice numbering (INV-YYYY-XXX)
- Line item management
- Tax calculations
- Payment terms
- Status tracking (Draft, Sent, Paid, Overdue, Cancelled)
- Payment recording
- Receipt generation
- Aging reports
- PDF generation with branding
- Email delivery

#### Payments
- Payment tracking and recording
- Multiple payment methods
- Payment allocation to invoices
- Payment history
- Receipt generation
- Payment analytics

#### Expenses
- Expense tracking and management
- Category management
- Approval workflow (Pending, Approved, Rejected)
- Receipt upload
- Expense reports
- Budget tracking

#### Bank Reconciliation
- Bank statement import
- Transaction matching
- Reconciliation workflow
- Unmatched transaction management
- Account balance tracking
- Reconciliation reports

#### Chart of Accounts
- Complete accounting structure
- Account types (Asset, Liability, Equity, Revenue, Expense)
- Account hierarchy
- Account code system
- Balance tracking
- Financial reporting integration

### Products & Services

#### Products
- Product catalog management
- SKU generation
- Pricing management (cost, selling price, margin)
- Stock tracking
- Reorder level alerts
- Category management
- Low stock notifications
- Product performance analytics

#### Services
- Service catalog
- Billing types (Hourly, Fixed, Project-based)
- Rate management
- Service descriptions
- Category management
- Service performance tracking

### Human Resources

#### Employees
- Employee database
- Personal information management
- Contact details
- Employment information
- Salary information
- Department assignment
- Role assignment
- Employee status (Active, On Leave, Inactive)
- Performance tracking

#### Departments
- Department management
- Department head assignment
- Employee count tracking
- Department hierarchy

#### Attendance
- Clock in/out functionality
- Daily attendance tracking
- Calendar view
- Late arrival tracking
- Early departure tracking
- Overtime calculation
- Attendance reports

#### Payroll
- Payroll period management
- Salary calculations
- Statutory deductions (PAYE, NHIF, NSSF)
- Allowances management
- Net salary calculation
- Payslip generation
- Bulk payment processing
- Payroll reports

#### Leave Management
- Leave balance tracking
- Leave request submission
- Leave types (Annual, Sick, Maternity, Paternity, Unpaid)
- Approval workflow
- Leave calendar
- Leave history
- Leave reports

### Reports & Analytics

#### Sales Reports
- Sales revenue trends
- Revenue by client
- Revenue by product/service
- Sales performance
- Conversion rates

#### Financial Reports
- Profit & Loss (P&L)
- Cash flow statements
- Balance sheet
- Expense breakdown
- Outstanding invoices
- Payment collection rates

#### Client Analytics
- Client acquisition
- Client retention
- Client lifetime value
- Top clients by revenue
- Client activity

#### Product Performance
- Product sales
- Product profitability
- Inventory turnover
- Best-selling products

#### Export Options
- PDF export
- Excel export
- CSV export
- Print functionality

### System Administration

#### Settings
- Company information management
- Logo upload
- Contact details
- Bank details
- Tax information
- Document numbering configuration
- Email template management
- User management
- Role and permission management

#### User Management
- User creation and management
- Role assignment
- Permission settings
- Active/inactive status
- Password reset
- User activity logs

#### Security
- Secure authentication
- Password encryption
- Session management
- Role-based access control
- Password reset with email verification
- Multi-factor authentication (MFA) support
- Security audit logs

### Client Portal

Dedicated portal for clients to:
- View their projects and progress
- Access invoices and make payments
- Download receipts and documents
- View proposals and estimates
- Update profile information
- Track project milestones
- Communicate with the team

### Document Management

#### PDF Generation
- Professional invoice PDFs
- Receipt PDFs
- Quotation PDFs
- Proposal PDFs
- Payslip PDFs
- Report PDFs
- Melitech branding on all documents
- Orange accent color (#FF8C00)

#### Email Templates
- Invoice delivery emails
- Receipt confirmation emails
- Quotation emails
- Password reset emails
- Welcome emails
- Reminder emails
- Professional HTML templates
- Plain text fallback

---

## 🛠 Technology Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **tRPC** - End-to-end typesafe APIs
- **Wouter** - Lightweight routing
- **Recharts** - Data visualization
- **jsPDF** - PDF generation
- **date-fns** - Date manipulation

### Backend
- **Node.js 22** - JavaScript runtime
- **Express 4** - Web framework
- **tRPC 11** - API layer
- **Drizzle ORM** - Type-safe database ORM
- **MySQL/TiDB** - Database
- **JWT** - Authentication tokens
- **Superjson** - Data serialization

### Development Tools
- **Vite** - Build tool
- **pnpm** - Package manager
- **TypeScript** - Type checking
- **ESLint** - Code linting

### Infrastructure
- **S3** - File storage
- **SMTP** - Email delivery
- **OAuth** - Authentication (Manus Auth)

---

## 💻 System Requirements

### Development Environment
- Node.js 22.x or higher
- pnpm 8.x or higher
- MySQL 8.0 or higher (or TiDB compatible)
- 4GB RAM minimum
- 10GB free disk space

### Production Environment
- Node.js 22.x or higher
- MySQL 8.0 or higher (or TiDB compatible)
- 8GB RAM minimum
- 50GB free disk space
- SSL certificate for HTTPS
- SMTP server for email
- S3-compatible storage

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/melitechsolutions/crm.git
cd melitech_crm
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE melitech_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=mysql://username:password@localhost:3306/melitech_crm

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im

# Application
VITE_APP_ID=your-app-id
VITE_APP_TITLE=Melitech Solutions CRM
VITE_APP_LOGO=/logo.png

# Owner (Super Admin)
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Admin User

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@melitechsolutions.co.ke
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_NAME=Melitech Solutions
SMTP_FROM_EMAIL=info@melitechsolutions.co.ke

# Storage (S3)
S3_BUCKET=melitech-crm-files
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Built-in Services
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
```

### 5. Database Migration

Push the schema to the database:

```bash
pnpm db:push
```

### 6. Seed Data (Optional)

Run the seed script to populate sample data:

```bash
pnpm tsx scripts/seed-data.ts
```

### 7. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

---

## ⚙️ Configuration

### Document Numbering

Configure document number formats in Settings → Document Numbering:

- **Invoices**: `INV-YYYY-XXX` (e.g., INV-2024-001)
- **Receipts**: `REC-XXXXX` (e.g., REC-00001)
- **Quotations**: `QUOT-YYYY/MM/XXX` (e.g., QUOT-2024/10/001)
- **Proposals**: `PROP-YYYY-XXX` (e.g., PROP-2024-001)

### Email Templates

Customize email templates in `email-templates/` directory:

- `invoice-receipt-email.html` - Invoice and receipt delivery
- `password-reset.html` - Password reset emails
- Add custom templates as needed

### Company Branding

Update company information in Settings → Company Information:

- Company name
- Logo (upload PNG/JPG)
- Contact details
- Address
- Tax information
- Bank details

---

## 👥 User Roles

### Super Admin
**Full system access** including:
- All CRM modules
- User management
- System settings
- Security configuration
- Database management
- Audit logs

### HR Manager
**Human Resources focus**:
- Employee management
- Attendance tracking
- Leave management
- Payroll processing
- Department management
- HR reports

### Accountant/Finance Officer
**Financial operations**:
- Invoicing
- Payments and receipts
- Expenses
- Bank reconciliation
- Chart of accounts
- Financial reports
- Client financial data

### Staff
**Operational access**:
- Clients (view/edit)
- Projects (assigned)
- Tasks
- Time tracking
- Basic reports

### Client
**Self-service portal**:
- View projects
- View invoices
- Download documents
- Make payments
- Update profile
- View receipts

---

## 📚 Module Documentation

### Authentication

#### Login
- **URL**: `/login`
- **Method**: POST
- **Credentials**: Username and password
- **Demo Accounts**:
  - Admin: `admin` / any password
  - HR: `hr` / any password
  - Accountant: `accountant` / any password
  - Staff: `staff` / any password
  - Client: `client` / any password

#### Password Reset
1. Click "Forgot password?" on login page
2. Enter email address
3. Check email for reset link
4. Click link and create new password
5. Login with new password

### Dashboard

Main dashboard shows:
- Revenue statistics
- Active projects count
- Total clients
- Pending invoices
- Recent projects with progress
- Recent activity feed
- Quick action buttons

### Clients

**Add New Client**:
1. Click "Add Client" button
2. Fill in company/individual information
3. Add contact details
4. Add key personnel (optional)
5. Add financial information (optional)
6. Upload KYC documents (optional)
7. Click "Save"

**View Client Details**:
- Click on client name in table
- View all tabs: Overview, Contact, Personnel, Financial, Risk & Compliance, Documents

### Projects

**Create New Project**:
1. Click "New Project" button
2. Enter project details (name, description, client)
3. Set budget and timeline
4. Assign team members
5. Set status and priority
6. Click "Create Project"

**Track Progress**:
- Update tasks in Tasks tab
- Record expenses against budget
- Link invoices and estimates
- Upload project files

### Invoices

**Create Invoice**:
1. Click "Create Invoice" button
2. Select client
3. Add line items (products/services)
4. Set quantities and prices
5. Add tax if applicable
6. Set payment terms and due date
7. Click "Save" or "Save & Send"

**Send Invoice**:
- Click action button (three dots)
- Select "Email"
- Review email content
- Click "Send"

**Record Payment**:
- Open invoice details
- Click "Record Payment"
- Enter payment amount and method
- Receipt is generated automatically

### Reports

**Generate Report**:
1. Navigate to Reports
2. Select report type (Sales, Financial, Client, Product)
3. Set date range
4. Click "Generate"
5. Click "Export" to download (PDF/Excel/CSV)

---

## 🔌 API Documentation

### Authentication Endpoints

```typescript
// Login
POST /api/auth/login
Body: { username: string, password: string }
Response: { success: boolean, token: string, user: User }

// Logout
POST /api/auth/logout
Response: { success: boolean }

// Password Reset Request
POST /api/auth/forgot-password
Body: { email: string }
Response: { success: boolean, message: string }

// Password Reset
POST /api/auth/reset-password
Body: { token: string, password: string }
Response: { success: boolean }
```

### tRPC Procedures

```typescript
// Get current user
trpc.auth.me.useQuery()

// Clients
trpc.clients.list.useQuery()
trpc.clients.getById.useQuery({ id: number })
trpc.clients.create.useMutation()
trpc.clients.update.useMutation()
trpc.clients.delete.useMutation()

// Projects
trpc.projects.list.useQuery()
trpc.projects.getById.useQuery({ id: number })
trpc.projects.create.useMutation()
trpc.projects.update.useMutation()
trpc.projects.delete.useMutation()

// Invoices
trpc.invoices.list.useQuery()
trpc.invoices.getById.useQuery({ id: number })
trpc.invoices.create.useMutation()
trpc.invoices.update.useMutation()
trpc.invoices.delete.useMutation()
trpc.invoices.recordPayment.useMutation()

// And more...
```

---

## 🚀 Deployment

### Deployment to accounts.melitechsolutions.co.ke

#### Prerequisites
- Domain: `accounts.melitechsolutions.co.ke`
- SSL certificate
- MySQL database
- SMTP server
- S3 storage

#### Step 1: Build for Production

```bash
pnpm build
```

#### Step 2: Configure Environment

Create `.env.production`:

```env
NODE_ENV=production
DATABASE_URL=mysql://user:pass@prod-db-host:3306/melitech_crm
JWT_SECRET=super-secure-production-secret
# ... other production variables
```

#### Step 3: Deploy Files

Upload to server:
```bash
rsync -avz --exclude node_modules --exclude .git ./ user@accounts.melitechsolutions.co.ke:/var/www/melitech-crm/
```

#### Step 4: Install Dependencies on Server

```bash
ssh user@accounts.melitechsolutions.co.ke
cd /var/www/melitech-crm
pnpm install --prod
```

#### Step 5: Run Database Migrations

```bash
pnpm db:push
```

#### Step 6: Start Application

Using PM2:
```bash
pm2 start npm --name "melitech-crm" -- start
pm2 save
pm2 startup
```

#### Step 7: Configure Nginx

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name accounts.melitechsolutions.co.ke;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name accounts.melitechsolutions.co.ke;

    ssl_certificate /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Step 8: Restart Nginx

```bash
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 9: SSL Certificate (Let's Encrypt)

```bash
sudo certbot --nginx -d accounts.melitechsolutions.co.ke
```

---

## 🔒 Security

### Best Practices Implemented

1. **Password Security**
   - Passwords hashed with bcrypt
   - Minimum 8 characters required
   - Password strength indicator
   - Secure password reset flow

2. **Authentication**
   - JWT tokens with expiration
   - Secure session management
   - HTTP-only cookies
   - CSRF protection

3. **Authorization**
   - Role-based access control (RBAC)
   - Permission checks on all routes
   - Protected API endpoints
   - Client data isolation

4. **Data Protection**
   - SQL injection prevention (parameterized queries)
   - XSS protection
   - Input validation and sanitization
   - Secure file uploads

5. **Communication**
   - HTTPS enforced in production
   - Secure email delivery
   - Encrypted data transmission

### Security Checklist for Production

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable audit logging
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts
- [ ] Review and restrict CORS settings
- [ ] Implement MFA for admin accounts

---

## 📞 Support

### Documentation
- User Guide: `/docs/USER_GUIDE.md`
- API Documentation: `/docs/API.md`
- Deployment Guide: `/docs/DEPLOYMENT.md`

### Contact
- **Email**: info@melitechsolutions.co.ke
- **Phone**: +254 700 000 000
- **Website**: https://www.melitechsolutions.co.ke
- **Support Portal**: https://accounts.melitechsolutions.co.ke/support

### Reporting Issues
1. Check existing documentation
2. Search for similar issues
3. Create detailed bug report with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/system information

---

## 📄 License

Copyright © 2024 Melitech Solutions. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

---

## 🙏 Acknowledgments

- Built with React, TypeScript, and tRPC
- UI components from shadcn/ui
- Icons from Lucide React
- Charts from Recharts

---

**Melitech Solutions CRM** - *Redefining Technology!!!*

For more information, visit [www.melitechsolutions.co.ke](https://www.melitechsolutions.co.ke)

