# Melitech CRM - Production Deployment Guide

## Quick Start

This guide provides step-by-step instructions for deploying the Melitech CRM to production at **accounts.melitechsolutions.co.ke**.

### Prerequisites

- Linux server (Ubuntu 20.04 LTS or later)
- Node.js v18+ (v22 recommended)
- MySQL 8.0+
- Nginx web server
- SSL certificate (Let's Encrypt)
- Domain: accounts.melitechsolutions.co.ke

---

## Deployment Steps

### Step 1: Server Preparation

```bash
# SSH into your server
ssh user@accounts.melitechsolutions.co.ke

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Create application directory
sudo mkdir -p /var/www/melitech_crm
sudo chown -R $USER:$USER /var/www/melitech_crm
cd /var/www/melitech_crm
```

### Step 2: Clone Repository

```bash
# Clone the repository
git clone <your-repository-url> .

# Install dependencies
pnpm install

# Build for production
pnpm build
```

### Step 3: Database Setup

```bash
# Create database
mysql -u root -p << EOF
CREATE DATABASE melitech_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'melitech'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON melitech_crm.* TO 'melitech'@'localhost';
FLUSH PRIVILEGES;
EOF

# Run migrations
pnpm db:push
```

### Step 4: Environment Configuration

```bash
# Create .env.production file
cat > .env.production << 'EOF'
NODE_ENV=production
VITE_APP_ID=<your-oauth-app-id>
VITE_APP_TITLE=Melitech Solutions CRM
VITE_APP_LOGO=https://accounts.melitechsolutions.co.ke/logo.svg
DATABASE_URL=mysql://melitech:password@localhost:3306/melitech_crm
JWT_SECRET=$(openssl rand -base64 32)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://accounts.manus.im
BUILT_IN_FORGE_API_KEY=<your-forge-api-key>
BUILT_IN_FORGE_API_URL=https://api.manus.im
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@melitechsolutions.co.ke
SMTP_PASSWORD=<app-specific-password>
SMTP_FROM=noreply@melitechsolutions.co.ke
EOF

# Set proper permissions
chmod 600 .env.production
```

### Step 5: Process Manager Setup

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: "melitech-crm",
    script: "./server/index.ts",
    interpreter: "node",
    interpreterArgs: "--loader tsx",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    instances: "max",
    exec_mode: "cluster",
    error_file: "./logs/error.log",
    out_file: "./logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z"
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 6: Nginx Configuration

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create configuration
sudo tee /etc/nginx/sites-available/melitech-crm > /dev/null << 'EOF'
upstream melitech_crm {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name accounts.melitechsolutions.co.ke;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name accounts.melitechsolutions.co.ke;

    ssl_certificate /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    client_max_body_size 100M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/json;

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
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable configuration
sudo ln -s /etc/nginx/sites-available/melitech-crm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: SSL Certificate

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d accounts.melitechsolutions.co.ke

# Enable auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Step 8: Firewall Setup

```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

---

## Verification Checklist

After deployment, verify:

- [ ] Application accessible at https://accounts.melitechsolutions.co.ke
- [ ] SSL certificate valid (check browser)
- [ ] Database connected and accessible
- [ ] All environment variables configured
- [ ] Email notifications working
- [ ] File uploads working
- [ ] User authentication working
- [ ] API endpoints responding correctly
- [ ] Logs being generated properly
- [ ] Backups running on schedule

---

## Monitoring & Maintenance

### Check Application Status

```bash
# View PM2 status
pm2 status

# View application logs
pm2 logs melitech-crm

# Check system resources
top
free -h
df -h
```

### Backup Database

```bash
# Create backup
mysqldump -u melitech -p melitech_crm > backup.sql
gzip backup.sql

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-melitech-db.sh
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
pnpm install

# Build
pnpm build

# Restart application
pm2 restart melitech-crm
```

---

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs melitech-crm

# Check environment variables
env | grep DATABASE_URL

# Verify database connection
mysql -u melitech -p melitech_crm -e "SELECT 1;"
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal

# Check Nginx configuration
sudo nginx -t
```

### Database Connection Issues

```bash
# Test connection
mysql -u melitech -p -h localhost melitech_crm -e "SELECT 1;"

# Check MySQL status
sudo systemctl status mysql

# View MySQL logs
sudo tail -f /var/log/mysql/error.log
```

---

## Documentation References

For detailed information, see:

- **DEPLOYMENT_GUIDE.md** - Complete deployment instructions
- **PRODUCTION_CONFIG.md** - Production configuration and optimization
- **DOMAIN_SETUP.md** - Domain and DNS configuration
- **DATABASE_SETUP.md** - Database setup and management
- **EMAIL_NOTIFICATIONS_SETUP.md** - Email and notification configuration
- **FOLLOW_UPS.md** - Future enhancements and features

---

## Support

For deployment support:
- Email: devops@melitechsolutions.co.ke
- Documentation: See guides above
- GitHub Issues: Report bugs and issues

---

## Security Reminders

1. **Never commit .env.production to git**
2. **Use strong passwords for database and email**
3. **Enable firewall and restrict access**
4. **Keep system and dependencies updated**
5. **Monitor logs for suspicious activity**
6. **Regular backups are critical**
7. **Test disaster recovery procedures**

---

**Last Updated:** November 2, 2025
**Version:** 1.0

