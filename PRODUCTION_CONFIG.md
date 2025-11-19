# Melitech CRM - Production Configuration & Optimization

## Build Configuration

### Vite Configuration for Production

The application uses Vite for building. Key production optimizations are configured in `vite.config.ts`:

**Build Settings:**
- Minification enabled (esbuild)
- Source maps disabled for production
- Code splitting enabled
- Asset optimization enabled
- Tree-shaking enabled

**Performance Targets:**
- Bundle size: < 500KB (gzipped)
- Initial load time: < 2 seconds
- Time to interactive: < 3 seconds

### Build Commands

```bash
# Development build
pnpm dev

# Production build
pnpm build

# Preview production build locally
pnpm preview

# Build analysis
pnpm build --analyze
```

---

## Environment Configuration

### Production Environment Variables

**Critical Variables (Must be set):**
- `NODE_ENV=production`
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - OAuth application ID
- `BUILT_IN_FORGE_API_KEY` - API authentication

**Optional Variables:**
- `VITE_ANALYTICS_ENDPOINT` - Analytics service URL
- `VITE_ANALYTICS_WEBSITE_ID` - Analytics tracking ID
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` - Email configuration

### Secrets Management

**Option 1: Environment File (Not Recommended)**
```bash
# Create .env.production file
cp .env.example .env.production
# Edit with production values
nano .env.production
```

**Option 2: System Environment Variables (Recommended)**
```bash
# Set via systemd service file
export DATABASE_URL="mysql://user:pass@host/db"
export JWT_SECRET="$(openssl rand -base64 32)"
```

**Option 3: Secrets Manager (Best Practice)**
- Use AWS Secrets Manager
- Use HashiCorp Vault
- Use environment-specific secret files with restricted permissions

---

## Performance Optimization

### Frontend Optimization

**Code Splitting:**
- Automatic route-based code splitting
- Lazy loading of components
- Dynamic imports for heavy modules

**Asset Optimization:**
- Image compression (WebP format)
- CSS minification
- JavaScript minification
- Font optimization

**Caching Strategy:**
```
Static assets (images, fonts): 1 year
JavaScript/CSS: 1 month
HTML: No cache (always fresh)
API responses: 5 minutes
```

### Backend Optimization

**Database:**
- Connection pooling (max 20 connections)
- Query optimization with indexes
- Prepared statements for security
- Query caching where appropriate

**API:**
- Response compression (gzip)
- HTTP/2 support
- Keep-alive connections
- Rate limiting (100 requests/minute per IP)

**Caching:**
- Redis for session storage
- In-memory caching for frequently accessed data
- Cache invalidation on data updates

---

## Security Configuration

### HTTPS/TLS

- TLS 1.2 minimum
- Strong cipher suites
- HSTS header enabled
- Certificate pinning (optional)

### Authentication

- OAuth 2.0 with Manus
- JWT tokens with 24-hour expiration
- Secure session cookies (HttpOnly, Secure, SameSite)
- CSRF protection enabled

### Data Protection

- SQL injection prevention (parameterized queries)
- XSS prevention (input sanitization)
- CORS properly configured
- Rate limiting enabled
- Request validation

### Headers Security

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Database Configuration

### Connection String Format

```
mysql://username:password@hostname:3306/database_name
```

### Connection Pool Settings

```javascript
{
  max: 20,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}
```

### Performance Tuning

**MySQL Configuration (`/etc/mysql/mysql.conf.d/mysqld.cnf`):**
```ini
[mysqld]
# Connection settings
max_connections = 100
max_allowed_packet = 256M

# Performance settings
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
query_cache_size = 256M
query_cache_type = 1

# Replication (if needed)
server-id = 1
log_bin = mysql-bin
binlog_format = ROW
```

---

## Monitoring & Observability

### Application Metrics

**Key Metrics to Monitor:**
- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate (5xx, 4xx errors)
- Database query time
- Memory usage
- CPU usage
- Disk I/O

### Logging

**Log Levels:**
- ERROR: Critical errors requiring immediate attention
- WARN: Warnings that should be investigated
- INFO: General information about application flow
- DEBUG: Detailed debugging information (disabled in production)

**Log Destinations:**
- Console: Application startup and shutdown
- File: All application logs
- Remote: Sentry for error tracking
- Centralized: ELK Stack or similar for log aggregation

### Health Checks

**Endpoint:** `/health`
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-02T12:00:00Z",
  "uptime": 3600,
  "database": "connected",
  "cache": "connected"
}
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code review completed
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Database migrations tested
- [ ] Backup strategy verified
- [ ] Disaster recovery plan reviewed
- [ ] Monitoring configured
- [ ] Alerts configured
- [ ] Documentation updated

### Deployment

- [ ] Build production bundle
- [ ] Verify bundle size
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Verify all features working
- [ ] Check performance metrics
- [ ] Deploy to production
- [ ] Monitor error logs
- [ ] Verify user access
- [ ] Send deployment notification

### Post-Deployment

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify backups running
- [ ] Test critical workflows
- [ ] Gather user feedback
- [ ] Document any issues
- [ ] Plan next iteration

---

## Rollback Procedure

If issues occur after deployment:

```bash
# 1. Check current status
pm2 status

# 2. View recent logs
pm2 logs melitech-crm --lines 100

# 3. Rollback to previous version
git checkout <previous-commit-hash>
pnpm install
pnpm build
pm2 restart melitech-crm

# 4. Verify application
curl https://accounts.melitechsolutions.co.ke/health

# 5. Notify team
# Send incident notification
```

---

## Scaling Considerations

### Horizontal Scaling

**Load Balancing:**
- Use Nginx upstream with multiple application instances
- Sticky sessions for user state
- Health checks for instance availability

**Database Scaling:**
- Read replicas for reporting queries
- Write master for transactional queries
- Connection pooling across instances

### Vertical Scaling

**Resource Allocation:**
- Increase server RAM for caching
- Increase CPU for processing
- Increase disk space for backups

---

## Cost Optimization

### Infrastructure

- Use auto-scaling for variable load
- Reserved instances for baseline capacity
- Spot instances for non-critical workloads
- CDN for static asset delivery

### Database

- Optimize queries to reduce execution time
- Archive old data to reduce storage
- Use appropriate index strategy
- Monitor slow query log

### Monitoring

- Use application-level metrics instead of infrastructure
- Aggregate logs to reduce storage costs
- Set appropriate retention policies

---

## Compliance & Regulations

### Data Protection

- GDPR compliance for EU users
- CCPA compliance for California users
- Data encryption at rest and in transit
- Regular security audits

### Audit Logging

- Log all user actions
- Log all data modifications
- Log all authentication events
- Retain logs for 1 year minimum

### Backups

- Daily automated backups
- Weekly full backups
- Monthly archive backups
- Test restore procedures monthly

---

## Support & Maintenance

### Incident Response

**Severity Levels:**
- Critical: System down, data loss risk
- High: Major feature broken
- Medium: Minor feature broken
- Low: Cosmetic issues

**Response Times:**
- Critical: 15 minutes
- High: 1 hour
- Medium: 4 hours
- Low: 24 hours

### Maintenance Windows

- Scheduled: Sundays 2-4 AM (UTC)
- Emergency: As needed
- Notification: 48 hours advance notice

---

## Version Management

### Release Process

1. Create release branch from main
2. Update version number
3. Update CHANGELOG
4. Create release notes
5. Tag release
6. Deploy to production
7. Monitor for issues

### Version Numbering

- Major.Minor.Patch (e.g., 1.2.3)
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

---

**Last Updated:** November 2, 2025
**Version:** 1.0

