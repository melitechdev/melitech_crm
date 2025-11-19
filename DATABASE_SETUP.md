# Database Setup & Configuration for Production

## Database Selection

### Recommended: MySQL 8.0+

**Why MySQL:**
- Proven reliability and stability
- Excellent performance for business applications
- Strong transaction support
- Wide hosting support
- Good backup and recovery tools

**Alternative: TiDB (MySQL Compatible)**
- Cloud-native distributed database
- Horizontal scalability
- MySQL protocol compatible
- Better for very large datasets

---

## Database Installation

### On Linux Server

**Install MySQL:**
```bash
# Update package manager
sudo apt-get update

# Install MySQL Server
sudo apt-get install -y mysql-server

# Run security script
sudo mysql_secure_installation

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Verify installation
mysql --version
```

### On Cloud Platform

**AWS RDS MySQL:**
- Managed service
- Automatic backups
- Multi-AZ deployment
- Read replicas

**Google Cloud SQL:**
- Managed service
- Automatic backups
- High availability
- Integrated monitoring

**Azure Database for MySQL:**
- Managed service
- Built-in security
- Automatic backups
- Flexible scaling

---

## Database Creation

### Create Database and User

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE melitech_crm 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

# Create user
CREATE USER 'melitech'@'localhost' 
  IDENTIFIED BY 'strong_secure_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON melitech_crm.* 
  TO 'melitech'@'localhost';

# For remote access (if needed)
CREATE USER 'melitech'@'%' 
  IDENTIFIED BY 'strong_secure_password_here';
GRANT ALL PRIVILEGES ON melitech_crm.* 
  TO 'melitech'@'%';

# Apply changes
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### Verify Connection

```bash
# Test connection
mysql -u melitech -p -h localhost melitech_crm -e "SELECT 1;"

# Should return: 1
```

---

## Database Configuration

### MySQL Configuration File

**Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:**

```ini
[mysqld]
# Basic Settings
user            = mysql
pid-file        = /var/run/mysqld/mysqld.pid
socket          = /var/run/mysqld/mysqld.sock
port            = 3306
basedir         = /usr
datadir         = /var/lib/mysql

# Connection Settings
max_connections = 100
max_allowed_packet = 256M
thread_stack = 192K
thread_cache_size = 8
myisam_recover_options = BACKUP
key_buffer_size = 16M

# InnoDB Settings (Recommended for this application)
default_storage_engine = InnoDB
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit = 2

# Query Cache (Optional, can improve read performance)
query_cache_size = 256M
query_cache_type = 1
query_cache_limit = 2M

# Slow Query Log (For performance monitoring)
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Binary Logging (For backups and replication)
log_bin = /var/log/mysql/mysql-bin.log
expire_logs_days = 10
max_binlog_size = 100M

# Character Set
character_set_server = utf8mb4
collation_server = utf8mb4_unicode_ci

# Replication (if needed)
server-id = 1
binlog_format = ROW
```

**Restart MySQL:**
```bash
sudo systemctl restart mysql
```

---

## Database Migrations

### Run Initial Migrations

```bash
# Navigate to project directory
cd /var/www/melitech_crm

# Install dependencies
pnpm install

# Run migrations
pnpm db:push

# Verify tables created
mysql -u melitech -p melitech_crm -e "SHOW TABLES;"
```

### Migration Verification

```bash
# Check table structure
mysql -u melitech -p melitech_crm -e "DESCRIBE users;"

# Check all tables
mysql -u melitech -p melitech_crm -e "SHOW TABLES;"

# Check table count
mysql -u melitech -p melitech_crm -e "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema='melitech_crm';"
```

---

## Database Indexing

### Create Indexes for Performance

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_createdAt ON users(createdAt);

-- Client indexes
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);

-- Project indexes
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_createdAt ON projects(createdAt);

-- Invoice indexes
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_date ON invoices(date);
CREATE INDEX idx_invoices_dueDate ON invoices(dueDate);

-- Estimate indexes
CREATE INDEX idx_estimates_client_id ON estimates(client_id);
CREATE INDEX idx_estimates_status ON estimates(status);

-- Receipt indexes
CREATE INDEX idx_receipts_client_id ON receipts(client_id);
CREATE INDEX idx_receipts_date ON receipts(date);

-- Payment indexes
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(date);

-- User-Project Assignment indexes
CREATE INDEX idx_userProjectAssignments_user_id ON userProjectAssignments(user_id);
CREATE INDEX idx_userProjectAssignments_project_id ON userProjectAssignments(project_id);

-- Project Comments indexes
CREATE INDEX idx_projectComments_project_id ON projectComments(project_id);
CREATE INDEX idx_projectComments_user_id ON projectComments(user_id);
```

---

## Database Backup Strategy

### Automated Daily Backups

**Create backup script** (`/usr/local/bin/backup-melitech-db.sh`):

```bash
#!/bin/bash

# Configuration
DB_USER="melitech"
DB_PASSWORD="your_password"
DB_NAME="melitech_crm"
BACKUP_DIR="/backups/melitech_crm"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/melitech_crm_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
echo "Starting backup at $(date)" >> $BACKUP_DIR/backup.log
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE
BACKUP_FILE="$BACKUP_FILE.gz"

# Check backup size
SIZE=$(du -h $BACKUP_FILE | cut -f1)
echo "Backup completed: $BACKUP_FILE ($SIZE)" >> $BACKUP_DIR/backup.log

# Upload to S3 (optional)
if command -v aws &> /dev/null; then
  aws s3 cp $BACKUP_FILE s3://melitech-backups/
  echo "Uploaded to S3" >> $BACKUP_DIR/backup.log
fi

# Delete old backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "Deleted backups older than $RETENTION_DAYS days" >> $BACKUP_DIR/backup.log
echo "---" >> $BACKUP_DIR/backup.log
```

**Make script executable:**
```bash
chmod +x /usr/local/bin/backup-melitech-db.sh
```

**Add to crontab:**
```bash
# Edit crontab
crontab -e

# Add line for daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-melitech-db.sh
```

### Weekly Full Backups

```bash
# Add to crontab for weekly backup (Sunday at 3 AM)
0 3 * * 0 /usr/local/bin/backup-melitech-db.sh
```

### Manual Backup

```bash
# Create manual backup
mysqldump -u melitech -p melitech_crm > melitech_crm_manual_backup.sql

# Compress
gzip melitech_crm_manual_backup.sql

# Verify
gunzip -t melitech_crm_manual_backup.sql.gz
```

---

## Database Restore

### Restore from Backup

```bash
# Decompress backup
gunzip melitech_crm_backup.sql.gz

# Restore database
mysql -u melitech -p melitech_crm < melitech_crm_backup.sql

# Verify restore
mysql -u melitech -p melitech_crm -e "SELECT COUNT(*) FROM users;"
```

### Point-in-Time Recovery

```bash
# List binary logs
mysql -u root -p -e "SHOW BINARY LOGS;"

# Extract events from binary log
mysqlbinlog /var/log/mysql/mysql-bin.000001 > binlog_events.sql

# Restore with specific time
mysqlbinlog --start-datetime="2025-11-02 10:00:00" \
            --stop-datetime="2025-11-02 12:00:00" \
            /var/log/mysql/mysql-bin.000001 | mysql -u melitech -p melitech_crm
```

---

## Database Monitoring

### Monitor Database Performance

```sql
-- Check current connections
SHOW PROCESSLIST;

-- Check database size
SELECT 
  table_schema,
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.tables
GROUP BY table_schema;

-- Check slow queries
SELECT * FROM mysql.slow_log;

-- Check table statistics
SHOW TABLE STATUS FROM melitech_crm;

-- Check index usage
SELECT * FROM performance_schema.table_io_waits_summary_by_index_usage;
```

### Monitor Disk Space

```bash
# Check MySQL data directory size
du -sh /var/lib/mysql

# Check available disk space
df -h /var/lib/mysql

# Monitor in real-time
watch -n 5 'du -sh /var/lib/mysql'
```

### Database Health Check

```bash
# Check table integrity
mysqlcheck -u melitech -p melitech_crm --all-databases

# Repair corrupted tables
mysqlcheck -u melitech -p melitech_crm --repair --all-databases

# Optimize tables
mysqlcheck -u melitech -p melitech_crm --optimize --all-databases
```

---

## Database Optimization

### Query Optimization

```sql
-- Analyze query performance
EXPLAIN SELECT * FROM invoices WHERE client_id = 1;

-- Check index usage
ANALYZE TABLE invoices;

-- Update table statistics
OPTIMIZE TABLE invoices;
```

### Table Optimization

```sql
-- Check table size
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'melitech_crm'
ORDER BY size_mb DESC;

-- Optimize table
OPTIMIZE TABLE invoices;

-- Analyze table
ANALYZE TABLE invoices;
```

---

## Database Security

### User Access Control

```sql
-- Create read-only user
CREATE USER 'melitech_read'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT ON melitech_crm.* TO 'melitech_read'@'localhost';

-- Create backup user
CREATE USER 'melitech_backup'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON melitech_crm.* TO 'melitech_backup'@'localhost';

-- Remove default users
DROP USER ''@'localhost';
DROP USER ''@'hostname';
DROP USER 'root'@'hostname';
```

### Encrypt Connections

```bash
# Generate SSL certificates
sudo mysql_ssl_rsa_setup --datadir=/var/lib/mysql

# Update MySQL configuration
# Add to /etc/mysql/mysql.conf.d/mysqld.cnf
# [mysqld]
# ssl-ca=/var/lib/mysql/ca.pem
# ssl-cert=/var/lib/mysql/server-cert.pem
# ssl-key=/var/lib/mysql/server-key.pem
# require_secure_transport=ON

# Restart MySQL
sudo systemctl restart mysql

# Test SSL connection
mysql -u melitech -p --ssl-mode=REQUIRED -h localhost melitech_crm
```

---

## Disaster Recovery Plan

### Recovery Procedures

**Scenario 1: Database Corruption**
1. Stop application
2. Restore from latest backup
3. Run integrity check
4. Restart application
5. Verify data

**Scenario 2: Data Loss**
1. Identify point of loss
2. Restore backup before loss point
3. Apply binary logs to recover data after backup
4. Verify data integrity
5. Resume operations

**Scenario 3: Server Failure**
1. Provision new server
2. Install MySQL
3. Restore database from backup
4. Verify connectivity
5. Update application configuration
6. Resume operations

---

## Maintenance Schedule

### Daily Tasks
- [ ] Monitor database size
- [ ] Check backup completion
- [ ] Monitor slow queries
- [ ] Check error logs

### Weekly Tasks
- [ ] Analyze table statistics
- [ ] Check disk space usage
- [ ] Review user access logs
- [ ] Test backup restoration

### Monthly Tasks
- [ ] Optimize tables
- [ ] Update statistics
- [ ] Review security settings
- [ ] Audit user accounts

### Quarterly Tasks
- [ ] Full security audit
- [ ] Disaster recovery drill
- [ ] Performance tuning review
- [ ] Capacity planning

---

**Last Updated:** November 2, 2025
**Version:** 1.0

