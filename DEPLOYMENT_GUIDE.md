# Melitech CRM - Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Melitech CRM application to a production environment at **accounts.melitechsolutions.co.ke**.

---

## Pre-Deployment Checklist

### Infrastructure Requirements

- **Server**: Linux-based server (Ubuntu 20.04 LTS or later recommended)
- **Node.js**: v18+ (v22 recommended)
- **Package Manager**: pnpm
- **Database**: MySQL 8.0+ or TiDB
- **SSL Certificate**: Valid SSL certificate for accounts.melitechsolutions.co.ke
- **Reverse Proxy**: Nginx or Apache
- **Process Manager**: PM2 or systemd

### Domain Configuration

- [ ] Domain: accounts.melitechsolutions.co.ke
- [ ] DNS A record pointing to server IP
- [ ] SSL certificate obtained (Let's Encrypt recommended)
- [ ] Email domain configured for notifications

### Security Requirements

- [ ] Firewall configured (allow ports 80, 443, 3000)
- [ ] SSH key-based authentication enabled
- [ ] Regular backup strategy in place
- [ ] Database encryption enabled
- [ ] Environment variables secured

---

## Phase 1: Environment Configuration

### 1.1 Production Environment Variables

Create a `.env.production` file with the following variables:

```env
# Application
NODE_ENV=production
VITE_APP_ID=<your-oauth-app-id>
VITE_APP_TITLE=Melitech Solutions CRM
VITE_APP_LOGO=https://accounts.melitechsolutions.co.ke/logo.svg

# Database
DATABASE_URL=mysql://username:password@db-host:3306/melitech_crm

# Authentication
JWT_SECRET=<generate-strong-random-secret>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://accounts.manus.im

# API Keys
BUILT_IN_FORGE_API_KEY=<your-forge-api-key>
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=<your-frontend-forge-api-key>
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Owner Information
OWNER_NAME=Melitech Solutions
OWNER_OPEN_ID=<owner-open-id>

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=<website-id>

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@melitechsolutions.co.ke
SMTP_PASSWORD=<app-specific-password>
SMTP_FROM=noreply@melitechsolutions.co.ke

# S3/Storage Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_S3_BUCKET=melitech-crm-storage

# Security
CORS_ORIGIN=https://accounts.melitechsolutions.co.ke
SESSION_SECRET=<generate-strong-random-secret>
SECURE_COOKIES=true
```

### 1.2 Security Best Practices

**Password Generation for Secrets:**
```bash
# Generate strong random secrets
openssl rand -base64 32
```

**Environment Variable Security:**
- Never commit `.env.production` to version control
- Use a secrets management system (AWS Secrets Manager, HashiCorp Vault)
- Rotate secrets regularly
- Limit access to environment variables

---

## Phase 2: Database Setup

### 2.1 Database Preparation

**Create Database:**
```bash
mysql -u root -p
CREATE DATABASE melitech_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'melitech'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON melitech_crm.* TO 'melitech'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.2 Run Migrations

```bash
# Connect to server
ssh user@accounts.melitechsolutions.co.ke

# Navigate to project
cd /var/www/melitech_crm

# Run database migrations
pnpm db:push
```

### 2.3 Database Backup Strategy

**Automated Daily Backups:**
```bash
# Create backup script at /usr/local/bin/backup-melitech-db.sh
#!/bin/bash
BACKUP_DIR="/backups/melitech_crm"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/melitech_crm_$DATE.sql"

mkdir -p $BACKUP_DIR

mysqldump -u melitech -p$DB_PASSWORD melitech_crm > $BACKUP_FILE
gzip $BACKUP_FILE

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp "$BACKUP_FILE.gz" s3://melitech-backups/
```

**Add to crontab:**
```bash
0 2 * * * /usr/local/bin/backup-melitech-db.sh
```

---

## Phase 3: Application Deployment

### 3.1 Server Setup

```bash
# SSH into server
ssh user@accounts.melitechsolutions.co.ke

# Create application directory
sudo mkdir -p /var/www/melitech_crm
sudo chown -R $USER:$USER /var/www/melitech_crm

# Install Node.js and pnpm
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm

# Clone repository
cd /var/www/melitech_crm
git clone <repository-url> .
```

### 3.2 Install Dependencies

```bash
# Install project dependencies
pnpm install

# Build for production
pnpm build

# Verify build
ls -la dist/
```

### 3.3 Configure Process Manager (PM2)

**Install PM2:**
```bash
npm install -g pm2
```

**Create PM2 ecosystem file** (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [
    {
      name: "melitech-crm",
      script: "./server/index.ts",
      interpreter: "node",
      interpreterArgs: "--loader tsx",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s"
    }
  ]
};
```

**Start Application:**
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Enable PM2 startup on system reboot
pm2 startup
```

---

## Phase 4: Nginx Configuration

### 4.1 Install Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### 4.2 Create Nginx Configuration

**Create file** `/etc/nginx/sites-available/melitech-crm`:
```nginx
upstream melitech_crm {
    server 127.0.0.1:3000;
    keepalive 64;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name accounts.melitechsolutions.co.ke;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name accounts.melitechsolutions.co.ke;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Logging
    access_log /var/log/nginx/melitech_crm_access.log;
    error_log /var/log/nginx/melitech_crm_error.log;

    # Client upload size limit
    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;

    # Proxy settings
    location / {
        proxy_pass http://melitech_crm;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable Configuration:**
```bash
sudo ln -s /etc/nginx/sites-available/melitech-crm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Phase 5: SSL Certificate Setup

### 5.1 Install Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

### 5.2 Obtain SSL Certificate

```bash
sudo certbot certonly --nginx -d accounts.melitechsolutions.co.ke
```

### 5.3 Auto-Renewal

```bash
# Enable auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

---

## Phase 6: Monitoring & Logging

### 6.1 Application Monitoring

**Install Monitoring Tools:**
```bash
# Install node-exporter for system metrics
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvfz node_exporter-1.6.1.linux-amd64.tar.gz
sudo mv node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/
```

### 6.2 Log Rotation

**Create logrotate configuration** (`/etc/logrotate.d/melitech-crm`):
```
/var/www/melitech_crm/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 restart melitech-crm > /dev/null
    endscript
}
```

### 6.3 Health Checks

**Create health check endpoint** in application:
```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

**Monitor with cron:**
```bash
# Add to crontab
*/5 * * * * curl -f https://accounts.melitechsolutions.co.ke/health || pm2 restart melitech-crm
```

---

## Phase 7: Security Hardening

### 7.1 Firewall Configuration

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny all other incoming traffic
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### 7.2 Fail2Ban Setup

```bash
# Install Fail2Ban
sudo apt-get install -y fail2ban

# Create configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 7.3 Regular Security Updates

```bash
# Enable automatic security updates
sudo apt-get install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Phase 8: Performance Optimization

### 8.1 Database Optimization

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_date ON invoices(date);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);

-- Enable query cache (if using MySQL)
SET GLOBAL query_cache_size = 268435456;
SET GLOBAL query_cache_type = 1;
```

### 8.2 Application Optimization

**Enable compression in Node.js:**
```typescript
import compression from 'compression';
app.use(compression());
```

**Implement caching:**
```typescript
import redis from 'redis';
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});
```

### 8.3 CDN Configuration

- Configure CloudFlare or similar CDN for static assets
- Set cache headers for images and stylesheets
- Enable HTTP/2 push for critical resources

---

## Phase 9: Backup & Disaster Recovery

### 9.1 Backup Strategy

**Daily Database Backups:**
- Automated MySQL dumps to S3
- Retention: 30 days

**Weekly Full Backups:**
- Complete application and database backup
- Retention: 12 weeks

**Monthly Archive:**
- Long-term archive for compliance
- Retention: 7 years

### 9.2 Disaster Recovery Plan

**Recovery Time Objective (RTO):** 4 hours
**Recovery Point Objective (RPO):** 1 hour

**Recovery Procedure:**
1. Restore database from latest backup
2. Deploy application from git repository
3. Verify system health
4. Notify users of recovery

---

## Phase 10: Post-Deployment

### 10.1 Verification Checklist

- [ ] Application accessible at accounts.melitechsolutions.co.ke
- [ ] SSL certificate valid and not expiring soon
- [ ] Database connected and accessible
- [ ] All environment variables configured
- [ ] Email notifications working
- [ ] File uploads working
- [ ] User authentication working
- [ ] API endpoints responding correctly
- [ ] Logs being generated properly
- [ ] Backups running on schedule

### 10.2 Performance Baseline

Record baseline metrics:
- Page load time: < 2 seconds
- API response time: < 500ms
- Database query time: < 100ms
- Uptime: > 99.9%

### 10.3 Monitoring Setup

- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure error tracking (Sentry)
- Set up performance monitoring (New Relic, DataDog)
- Configure alerts for critical issues

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs melitech-crm

# Check system logs
sudo journalctl -u melitech-crm -n 50

# Verify environment variables
env | grep DATABASE_URL
```

### Database Connection Issues

```bash
# Test database connection
mysql -h localhost -u melitech -p melitech_crm -e "SELECT 1;"

# Check MySQL status
sudo systemctl status mysql

# Verify DATABASE_URL format
echo $DATABASE_URL
```

### SSL Certificate Issues

```bash
# Check certificate expiration
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal

# Check Nginx SSL configuration
sudo nginx -t
```

### Performance Issues

```bash
# Check server resources
top
free -h
df -h

# Check database slow queries
mysql -u root -p -e "SET GLOBAL slow_query_log = 'ON';"

# Monitor Nginx
sudo tail -f /var/log/nginx/melitech_crm_access.log
```

---

## Support & Maintenance

### Regular Maintenance Tasks

**Weekly:**
- Review error logs
- Check disk space
- Verify backups completed

**Monthly:**
- Review performance metrics
- Update dependencies
- Test disaster recovery

**Quarterly:**
- Security audit
- Performance optimization
- User feedback review

### Contact Information

For deployment support, contact:
- DevOps Team: devops@melitechsolutions.co.ke
- System Administrator: admin@melitechsolutions.co.ke

---

## Additional Resources

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [MySQL Security](https://dev.mysql.com/doc/refman/8.0/en/security.html)

---

**Last Updated:** November 2, 2025
**Version:** 1.0

