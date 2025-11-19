# Email & Notification Services Setup

## Email Service Configuration

### SMTP Provider Selection

**Recommended Options:**

1. **Gmail (Google Workspace)**
   - Cost: $6-14/user/month
   - Reliability: Excellent
   - Support: Good
   - Limits: 500 emails/day for free account

2. **SendGrid**
   - Cost: Free tier (100 emails/day), Paid plans from $19.95/month
   - Reliability: Excellent
   - Support: Excellent
   - Features: Advanced analytics, templates, webhooks

3. **Mailgun**
   - Cost: Free tier (1000 emails/month), Paid plans from $35/month
   - Reliability: Excellent
   - Support: Good
   - Features: API-first, webhooks, domain verification

4. **AWS SES**
   - Cost: $0.10 per 1000 emails
   - Reliability: Excellent
   - Support: AWS support
   - Features: Scalable, cost-effective for high volume

### Gmail SMTP Setup

**Enable Gmail SMTP:**

```bash
# 1. Enable 2-Factor Authentication on Gmail account
# 2. Generate App Password:
#    - Go to https://myaccount.google.com/apppasswords
#    - Select Mail and Windows Computer
#    - Copy the 16-character password

# 3. Configure in .env.production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@melitechsolutions.co.ke
SMTP_PASSWORD=<16-character-app-password>
SMTP_FROM="Melitech Solutions <noreply@melitechsolutions.co.ke>"
```

### SendGrid Setup

**Get SendGrid API Key:**

```bash
# 1. Sign up at https://sendgrid.com
# 2. Create API Key:
#    - Go to Settings > API Keys
#    - Create new API Key
#    - Copy the key

# 3. Configure in .env.production
SENDGRID_API_KEY=<your-sendgrid-api-key>
SENDGRID_FROM_EMAIL=noreply@melitechsolutions.co.ke
SENDGRID_FROM_NAME="Melitech Solutions"
```

### Mailgun Setup

**Get Mailgun Credentials:**

```bash
# 1. Sign up at https://mailgun.com
# 2. Add Domain:
#    - Go to Domains
#    - Add new domain (accounts.melitechsolutions.co.ke)
#    - Verify domain with DNS records

# 3. Get API Key:
#    - Go to API Keys
#    - Copy API Key

# 4. Configure in .env.production
MAILGUN_API_KEY=<your-mailgun-api-key>
MAILGUN_DOMAIN=accounts.melitechsolutions.co.ke
MAILGUN_FROM_EMAIL=noreply@accounts.melitechsolutions.co.ke
```

---

## Email Template Configuration

### Email Templates to Create

**1. Welcome Email**
```
Subject: Welcome to Melitech Solutions CRM
Content:
- Welcome message
- Account details
- Login link
- Getting started guide
```

**2. Invoice Notification**
```
Subject: Invoice #INV-2024-001 from Melitech Solutions
Content:
- Invoice details
- Amount due
- Due date
- Payment link
- Download invoice button
```

**3. Payment Confirmation**
```
Subject: Payment Received - Thank You
Content:
- Payment confirmation
- Amount received
- Payment method
- Invoice reference
- Receipt download
```

**4. Project Update**
```
Subject: Project Update: [Project Name]
Content:
- Project status
- Latest updates
- Next steps
- Link to project details
```

**5. Password Reset**
```
Subject: Reset Your Password
Content:
- Password reset link
- Expiration time
- Support contact
```

**6. User Invitation**
```
Subject: You're Invited to Melitech Solutions CRM
Content:
- Invitation message
- Role information
- Activation link
- Support contact
```

---

## Email Implementation

### Node.js Email Service

**Install Email Library:**
```bash
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

**Create Email Service** (`server/_core/emailService.ts`):

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@melitechsolutions.co.ke',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export async function sendInvoiceEmail(
  clientEmail: string,
  invoiceNumber: string,
  amount: number
) {
  const html = `
    <h2>Invoice #${invoiceNumber}</h2>
    <p>Amount Due: Ksh ${amount.toLocaleString()}</p>
    <p><a href="https://accounts.melitechsolutions.co.ke/invoices/${invoiceNumber}">View Invoice</a></p>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `Invoice #${invoiceNumber} from Melitech Solutions`,
    html,
  });
}
```

---

## In-App Notifications

### Notification System Setup

**Database Table:**
```sql
CREATE TABLE notifications (
  id VARCHAR(64) PRIMARY KEY,
  userId VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

**Create Notification Service** (`server/_core/notificationService.ts`):

```typescript
import { getDb } from '../db';
import { notifications } from '../../drizzle/schema';

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) {
  const db = await getDb();
  if (!db) return null;

  const id = `notif_${Date.now()}`;
  
  await db.insert(notifications).values({
    id,
    userId,
    title,
    message,
    type,
  });

  return { id, userId, title, message, type };
}

export async function getUserNotifications(userId: string) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: string) {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.id, notificationId));

  return true;
}
```

---

## Notification Triggers

### Automatic Notifications

**Invoice Created:**
```typescript
// When invoice is created
await createNotification(
  clientId,
  'New Invoice',
  `Invoice #${invoiceNumber} has been created for Ksh ${amount}`,
  'info'
);

// Send email
await sendInvoiceEmail(clientEmail, invoiceNumber, amount);
```

**Payment Received:**
```typescript
// When payment is recorded
await createNotification(
  clientId,
  'Payment Received',
  `Payment of Ksh ${amount} received`,
  'success'
);

// Send email
await sendPaymentConfirmationEmail(clientEmail, amount);
```

**Project Updated:**
```typescript
// When project status changes
await createNotification(
  projectManagerId,
  'Project Update',
  `Project "${projectName}" status changed to ${newStatus}`,
  'info'
);
```

**Task Assigned:**
```typescript
// When task is assigned to staff
await createNotification(
  staffId,
  'New Task',
  `Task "${taskName}" has been assigned to you`,
  'info'
);
```

---

## Email Verification

### Verify Email Configuration

**Test SMTP Connection:**
```bash
# Using telnet
telnet smtp.gmail.com 587

# Or using Python
python3 << 'EOF'
import smtplib
try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login('your-email@gmail.com', 'your-app-password')
    print('SMTP connection successful')
    server.quit()
except Exception as e:
    print(f'SMTP connection failed: {e}')
EOF
```

**Send Test Email:**
```bash
# Using Node.js
node << 'EOF'
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

transporter.sendMail({
  from: 'your-email@gmail.com',
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This is a test email'
}, (error, info) => {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
EOF
```

---

## Email Deliverability

### SPF Configuration

**Add SPF Record to DNS:**
```
Type: TXT
Name: melitechsolutions.co.ke
Value: v=spf1 include:sendgrid.net include:_spf.google.com ~all
```

### DKIM Configuration

**For SendGrid:**
```
1. Go to Settings > Sender Authentication
2. Authenticate Your Domain
3. Add CNAME records provided by SendGrid
4. Verify domain
```

**For Gmail:**
```
1. Go to Google Admin Console
2. Security > Authentication > Manage DKIM signing
3. Enable DKIM for your domain
4. Add DKIM records to DNS
```

### DMARC Configuration

**Add DMARC Record to DNS:**
```
Type: TXT
Name: _dmarc.melitechsolutions.co.ke
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@melitechsolutions.co.ke; ruf=mailto:dmarc@melitechsolutions.co.ke
```

---

## Email Monitoring

### Monitor Email Delivery

**Check Email Logs:**
```bash
# View mail log
tail -f /var/log/mail.log

# Search for specific email
grep "user@example.com" /var/log/mail.log

# Count emails sent
grep "status=sent" /var/log/mail.log | wc -l
```

**Monitor Bounces:**
```bash
# Using SendGrid
curl https://api.sendgrid.com/v3/suppression/bounces \
  -H "Authorization: Bearer $SENDGRID_API_KEY"
```

---

## Troubleshooting

### Email Not Sending

**Check SMTP Credentials:**
```bash
# Verify credentials are correct
echo "SMTP_HOST: $SMTP_HOST"
echo "SMTP_PORT: $SMTP_PORT"
echo "SMTP_USER: $SMTP_USER"
```

**Check Firewall:**
```bash
# Verify port is open
telnet smtp.gmail.com 587

# Check firewall rules
sudo ufw status
```

**Check Email Logs:**
```bash
# View application logs
pm2 logs melitech-crm | grep -i email

# View system mail logs
sudo tail -f /var/log/mail.log
```

### Emails Going to Spam

**Improve Deliverability:**
1. Verify SPF, DKIM, DMARC records
2. Use consistent From address
3. Include unsubscribe link
4. Avoid spam trigger words
5. Monitor bounce rates
6. Maintain list hygiene

---

## Email Templates

### Invoice Email Template

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: #f5f5f5; padding: 20px; }
    .content { padding: 20px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; }
    .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Melitech Solutions</h1>
      <p>Invoice #{{invoiceNumber}}</p>
    </div>
    <div class="content">
      <p>Dear {{clientName}},</p>
      <p>Please find your invoice below:</p>
      <table>
        <tr>
          <td>Invoice Number:</td>
          <td>{{invoiceNumber}}</td>
        </tr>
        <tr>
          <td>Date:</td>
          <td>{{invoiceDate}}</td>
        </tr>
        <tr>
          <td>Due Date:</td>
          <td>{{dueDate}}</td>
        </tr>
        <tr>
          <td>Amount:</td>
          <td>Ksh {{amount}}</td>
        </tr>
      </table>
      <p><a href="{{invoiceLink}}" class="button">View Invoice</a></p>
    </div>
    <div class="footer">
      <p>&copy; 2025 Melitech Solutions. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

---

## Notification Preferences

### User Notification Settings

**Database Table:**
```sql
CREATE TABLE notificationPreferences (
  userId VARCHAR(64) PRIMARY KEY,
  emailOnInvoice BOOLEAN DEFAULT TRUE,
  emailOnPayment BOOLEAN DEFAULT TRUE,
  emailOnProjectUpdate BOOLEAN DEFAULT TRUE,
  emailOnTaskAssignment BOOLEAN DEFAULT TRUE,
  inAppNotifications BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

---

## Testing Email Service

### Send Test Notification

```typescript
// In your application
import { sendEmail } from '@/server/_core/emailService';

// Test email
await sendEmail({
  to: 'test@example.com',
  subject: 'Test Email from Melitech CRM',
  html: '<h1>Test Email</h1><p>This is a test email</p>',
});
```

---

**Last Updated:** November 2, 2025
**Version:** 1.0

