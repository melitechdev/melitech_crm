# Melitech Solutions CRM - Installation Guide

Complete step-by-step guide for installing and configuring the Melitech Solutions CRM system.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Configuration](#database-configuration)
4. [Environment Variables](#environment-variables)
5. [Running the Application](#running-the-application)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing the Melitech Solutions CRM, ensure your system meets the following requirements:

### Software Requirements

**Node.js and pnpm:**
- Node.js version 22.x or higher
- pnpm version 8.x or higher

Check your versions:
```bash
node --version  # Should output v22.x.x or higher
pnpm --version  # Should output 8.x.x or higher
```

If you need to install Node.js, download it from [nodejs.org](https://nodejs.org/). For pnpm installation:
```bash
npm install -g pnpm
```

**Database:**
- MySQL 8.0 or higher
- OR TiDB (MySQL-compatible cloud database)
- Minimum 1GB database storage

**Git:**
- Git version control system for cloning the repository

### Hardware Requirements

**Development Environment:**
- CPU: 2 cores minimum
- RAM: 4GB minimum (8GB recommended)
- Storage: 10GB free space
- Operating System: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)

**Production Environment:**
- CPU: 4 cores minimum
- RAM: 8GB minimum (16GB recommended)
- Storage: 50GB free space (SSD recommended)
- Operating System: Linux (Ubuntu 22.04 LTS recommended)

---

## Local Development Setup

### Step 1: Clone the Repository

Clone the Melitech Solutions CRM repository to your local machine:

```bash
git clone https://github.com/melitechsolutions/crm.git
cd melitech_crm
```

If you received the project as a zip file, extract it and navigate to the directory:
```bash
unzip melitech_crm.zip
cd melitech_crm
```

### Step 2: Install Dependencies

Install all required Node.js packages using pnpm:

```bash
pnpm install
```

This process may take 5-10 minutes depending on your internet connection. The command will install:
- Frontend dependencies (React, TypeScript, Tailwind CSS, etc.)
- Backend dependencies (Express, tRPC, Drizzle ORM, etc.)
- Development tools (Vite, TypeScript compiler, etc.)

### Step 3: Verify Installation

After installation completes, verify that all dependencies are installed correctly:

```bash
pnpm list --depth=0
```

You should see a list of installed packages without any errors.

---

## Database Configuration

### Option 1: Local MySQL Setup

**Install MySQL:**

On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

On macOS (using Homebrew):
```bash
brew install mysql
brew services start mysql
```

On Windows:
Download and install MySQL from [mysql.com/downloads](https://dev.mysql.com/downloads/installer/)

**Create Database:**

Log into MySQL:
```bash
mysql -u root -p
```

Create the database:
```sql
CREATE DATABASE melitech_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Create a dedicated user (recommended):
```sql
CREATE USER 'melitech_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON melitech_crm.* TO 'melitech_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Test Connection:**
```bash
mysql -u melitech_user -p melitech_crm
```

### Option 2: Cloud Database (TiDB)

TiDB is a MySQL-compatible cloud database that's recommended for production deployments.

1. Sign up for TiDB Cloud at [tidbcloud.com](https://tidbcloud.com)
2. Create a new cluster
3. Create a database named `melitech_crm`
4. Note down the connection string provided

The connection string format:
```
mysql://username:password@host:4000/melitech_crm?ssl={"rejectUnauthorized":true}
```

---

## Environment Variables

### Create Environment File

Create a `.env` file in the root directory of the project:

```bash
cp .env.example .env
```

If `.env.example` doesn't exist, create `.env` manually:

```bash
touch .env
```

### Configure Environment Variables

Open `.env` in your text editor and configure the following variables:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
# Local MySQL example:
DATABASE_URL=mysql://melitech_user:secure_password_here@localhost:3306/melitech_crm

# TiDB Cloud example:
# DATABASE_URL=mysql://username:password@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/melitech_crm?ssl={"rejectUnauthorized":true}

# ============================================
# AUTHENTICATION & SECURITY
# ============================================
# Generate a secure random string (32+ characters)
# You can use: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-change-this

# OAuth Configuration (Manus Auth)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im

# ============================================
# APPLICATION CONFIGURATION
# ============================================
VITE_APP_ID=melitech-crm-app
VITE_APP_TITLE=Melitech Solutions CRM
VITE_APP_LOGO=/logo.png

# ============================================
# SUPER ADMIN CONFIGURATION
# ============================================
# The first user with this ID will be assigned Super Admin role
OWNER_OPEN_ID=admin-user-id
OWNER_NAME=System Administrator

# ============================================
# EMAIL CONFIGURATION (SMTP)
# ============================================
# Gmail example:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@melitechsolutions.co.ke
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM_NAME=Melitech Solutions
SMTP_FROM_EMAIL=info@melitechsolutions.co.ke

# Custom SMTP server example:
# SMTP_HOST=mail.melitechsolutions.co.ke
# SMTP_PORT=465
# SMTP_SECURE=true
# SMTP_USER=crm@melitechsolutions.co.ke
# SMTP_PASSWORD=your-smtp-password

# ============================================
# FILE STORAGE (S3)
# ============================================
# AWS S3 configuration
S3_BUCKET=melitech-crm-files
S3_REGION=us-east-1
S3_ACCESS_KEY=your-aws-access-key
S3_SECRET_KEY=your-aws-secret-key
S3_ENDPOINT=https://s3.amazonaws.com

# Alternative: DigitalOcean Spaces
# S3_ENDPOINT=https://nyc3.digitaloceanspaces.com

# Alternative: MinIO (self-hosted)
# S3_ENDPOINT=https://minio.melitechsolutions.co.ke

# ============================================
# ANALYTICS (OPTIONAL)
# ============================================
VITE_ANALYTICS_ENDPOINT=https://analytics.melitechsolutions.co.ke
VITE_ANALYTICS_WEBSITE_ID=melitech-crm

# ============================================
# BUILT-IN SERVICES
# ============================================
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
```

### Important Security Notes

**JWT_SECRET:**
- Must be at least 32 characters long
- Should be completely random
- Never commit this to version control
- Change it in production

Generate a secure JWT secret:
```bash
openssl rand -base64 32
```

**SMTP Password:**
- For Gmail, use App-Specific Passwords (not your regular password)
- Enable 2-factor authentication on your Gmail account
- Generate app password at: https://myaccount.google.com/apppasswords

**Database Password:**
- Use strong, unique passwords
- Never use default passwords in production
- Rotate passwords regularly

---

## Running the Application

### Push Database Schema

Before running the application for the first time, push the database schema:

```bash
pnpm db:push
```

This command will:
- Create all necessary tables
- Set up indexes and relationships
- Initialize the database structure

You should see output like:
```
✓ Schema pushed successfully
✓ 25 tables created
```

### Seed Sample Data (Optional)

To populate the database with sample data for testing:

```bash
pnpm tsx scripts/seed-data.ts
```

This will create:
- 3 sample clients
- 5 sample projects
- 10 sample invoices
- Sample products and services
- Sample employees

### Start Development Server

Start the development server:

```bash
pnpm dev
```

You should see output like:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.x:3000/
```

The application is now running! Open your browser and navigate to:
```
http://localhost:3000
```

### Login with Demo Credentials

Use these demo credentials to login:

**Super Admin:**
- Username: `admin`
- Password: any password

**HR Manager:**
- Username: `hr`
- Password: any password

**Accountant:**
- Username: `accountant`
- Password: any password

**Staff:**
- Username: `staff`
- Password: any password

**Client:**
- Username: `client`
- Password: any password

### Development Tools

**TypeScript Type Checking:**
```bash
pnpm tsc --noEmit
```

**Database Studio (Visual Database Editor):**
```bash
pnpm db:studio
```

**Build for Production:**
```bash
pnpm build
```

**Preview Production Build:**
```bash
pnpm preview
```

---

## Production Deployment

### Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All environment variables are configured for production
- [ ] JWT_SECRET is changed to a secure random value
- [ ] Database is backed up
- [ ] SSL certificate is obtained
- [ ] Domain DNS is configured
- [ ] Firewall rules are set up
- [ ] SMTP credentials are verified
- [ ] S3 storage is configured

### Step 1: Prepare Production Environment

**Update Environment Variables:**

Create `.env.production`:
```env
NODE_ENV=production
DATABASE_URL=mysql://prod_user:prod_password@prod-db-host:3306/melitech_crm
JWT_SECRET=super-secure-production-secret-minimum-64-characters
# ... other production variables
```

**Build Application:**
```bash
pnpm build
```

This creates optimized production files in the `dist/` directory.

### Step 2: Server Setup (Ubuntu 22.04)

**Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Install pnpm:**
```bash
npm install -g pnpm
```

**Install PM2 (Process Manager):**
```bash
npm install -g pm2
```

**Install Nginx:**
```bash
sudo apt update
sudo apt install nginx
```

### Step 3: Deploy Application Files

**Upload Files to Server:**
```bash
rsync -avz --exclude node_modules --exclude .git \
  ./ user@accounts.melitechsolutions.co.ke:/var/www/melitech-crm/
```

**SSH into Server:**
```bash
ssh user@accounts.melitechsolutions.co.ke
```

**Navigate to Application Directory:**
```bash
cd /var/www/melitech-crm
```

**Install Dependencies:**
```bash
pnpm install --prod
```

**Push Database Schema:**
```bash
pnpm db:push
```

### Step 4: Start Application with PM2

**Start Application:**
```bash
pm2 start npm --name "melitech-crm" -- start
```

**Save PM2 Configuration:**
```bash
pm2 save
```

**Set PM2 to Start on Boot:**
```bash
pm2 startup
# Follow the instructions provided by the command
```

**Monitor Application:**
```bash
pm2 status
pm2 logs melitech-crm
pm2 monit
```

### Step 5: Configure Nginx

**Create Nginx Configuration:**
```bash
sudo nano /etc/nginx/sites-available/melitech-crm
```

**Add Configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name accounts.melitechsolutions.co.ke;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name accounts.melitechsolutions.co.ke;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Proxy to Node.js Application
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static Files (if needed)
    location /static/ {
        alias /var/www/melitech-crm/dist/client/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Client Max Body Size (for file uploads)
    client_max_body_size 50M;

    # Logging
    access_log /var/log/nginx/melitech-crm-access.log;
    error_log /var/log/nginx/melitech-crm-error.log;
}
```

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/melitech-crm /etc/nginx/sites-enabled/
```

**Test Nginx Configuration:**
```bash
sudo nginx -t
```

**Restart Nginx:**
```bash
sudo systemctl restart nginx
```

### Step 6: SSL Certificate (Let's Encrypt)

**Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx
```

**Obtain SSL Certificate:**
```bash
sudo certbot --nginx -d accounts.melitechsolutions.co.ke
```

Follow the prompts to:
- Enter email address
- Agree to terms of service
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

**Auto-Renewal:**
Certbot automatically sets up a cron job for renewal. Test it:
```bash
sudo certbot renew --dry-run
```

### Step 7: Configure Firewall

**Allow SSH, HTTP, and HTTPS:**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**Check Firewall Status:**
```bash
sudo ufw status
```

### Step 8: Set Up Database Backups

**Create Backup Script:**
```bash
sudo nano /usr/local/bin/backup-melitech-db.sh
```

**Add Backup Script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/melitech-crm"
mkdir -p $BACKUP_DIR

mysqldump -u prod_user -p'prod_password' melitech_crm | gzip > $BACKUP_DIR/melitech_crm_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

**Make Script Executable:**
```bash
sudo chmod +x /usr/local/bin/backup-melitech-db.sh
```

**Schedule Daily Backups:**
```bash
sudo crontab -e
```

Add this line to run backup daily at 2 AM:
```
0 2 * * * /usr/local/bin/backup-melitech-db.sh
```

### Step 9: Verify Deployment

**Check Application Status:**
```bash
pm2 status
```

**Check Nginx Status:**
```bash
sudo systemctl status nginx
```

**Test Application:**
Open browser and navigate to:
```
https://accounts.melitechsolutions.co.ke
```

**Check Logs:**
```bash
# Application logs
pm2 logs melitech-crm

# Nginx access logs
sudo tail -f /var/log/nginx/melitech-crm-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/melitech-crm-error.log
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Cannot connect to database"

**Solution:**
1. Verify database is running:
   ```bash
   sudo systemctl status mysql
   ```
2. Check DATABASE_URL in `.env`:
   - Verify hostname, port, username, password
   - Ensure database name exists
3. Test connection manually:
   ```bash
   mysql -h hostname -u username -p database_name
   ```

#### Issue: "Port 3000 already in use"

**Solution:**
1. Find process using port 3000:
   ```bash
   lsof -i :3000
   ```
2. Kill the process:
   ```bash
   kill -9 <PID>
   ```
3. Or use a different port in `.env`:
   ```env
   PORT=3001
   ```

#### Issue: "pnpm: command not found"

**Solution:**
Install pnpm globally:
```bash
npm install -g pnpm
```

#### Issue: "Module not found" errors

**Solution:**
1. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules
   pnpm install
   ```
2. Clear pnpm cache:
   ```bash
   pnpm store prune
   ```

#### Issue: "Database schema out of sync"

**Solution:**
Push schema again:
```bash
pnpm db:push
```

#### Issue: "Email not sending"

**Solution:**
1. Verify SMTP credentials in `.env`
2. For Gmail, ensure:
   - 2FA is enabled
   - App-specific password is used
   - "Less secure apps" is NOT needed with app passwords
3. Test SMTP connection:
   ```bash
   telnet smtp.gmail.com 587
   ```

#### Issue: "File uploads not working"

**Solution:**
1. Check S3 configuration in `.env`
2. Verify S3 bucket exists and has correct permissions
3. Test S3 connection with AWS CLI:
   ```bash
   aws s3 ls s3://melitech-crm-files
   ```

#### Issue: "Nginx 502 Bad Gateway"

**Solution:**
1. Check if application is running:
   ```bash
   pm2 status
   ```
2. Check application logs:
   ```bash
   pm2 logs melitech-crm
   ```
3. Verify proxy_pass URL in Nginx config
4. Restart both services:
   ```bash
   pm2 restart melitech-crm
   sudo systemctl restart nginx
   ```

#### Issue: "SSL certificate errors"

**Solution:**
1. Verify certificate files exist:
   ```bash
   sudo ls -l /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/
   ```
2. Renew certificate:
   ```bash
   sudo certbot renew
   ```
3. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

### Getting Help

If you encounter issues not covered here:

1. Check application logs:
   ```bash
   pm2 logs melitech-crm --lines 100
   ```

2. Check system logs:
   ```bash
   sudo journalctl -u nginx -n 50
   ```

3. Contact support:
   - Email: info@melitechsolutions.co.ke
   - Include error messages and logs
   - Describe steps to reproduce the issue

---

## Next Steps

After successful installation:

1. **Configure System Settings**
   - Update company information
   - Upload company logo
   - Configure document numbering
   - Set up email templates

2. **Create User Accounts**
   - Create admin users
   - Set up department managers
   - Create staff accounts
   - Invite clients to portal

3. **Import Data**
   - Import existing clients
   - Import products and services
   - Import historical invoices (if applicable)

4. **Customize**
   - Customize invoice templates
   - Set up email templates
   - Configure notification preferences

5. **Train Users**
   - Conduct user training sessions
   - Provide user documentation
   - Set up support channels

---

**Installation Complete!**

Your Melitech Solutions CRM is now ready to use. For detailed usage instructions, refer to the User Guide.

For support, contact: info@melitechsolutions.co.ke

