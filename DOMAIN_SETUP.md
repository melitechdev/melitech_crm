# Domain & DNS Configuration for accounts.melitechsolutions.co.ke

## Domain Registration

### Current Domain
- **Domain:** accounts.melitechsolutions.co.ke
- **Registrar:** (To be confirmed)
- **Renewal Date:** (To be confirmed)
- **Auto-Renewal:** Recommended to enable

---

## DNS Configuration

### DNS Records to Add

**A Record (Primary):**
```
Type:  A
Name:  accounts
TTL:   3600 (1 hour)
Value: <your-server-ip-address>
```

**AAAA Record (IPv6):**
```
Type:  AAAA
Name:  accounts
TTL:   3600
Value: <your-server-ipv6-address>
```

**MX Records (Email):**
```
Type:     MX
Name:     melitechsolutions.co.ke
Priority: 10
Value:    mail.melitechsolutions.co.ke

Type:     MX
Name:     melitechsolutions.co.ke
Priority: 20
Value:    mail2.melitechsolutions.co.ke
```

**TXT Records (SPF, DKIM, DMARC):**
```
Type:  TXT
Name:  melitechsolutions.co.ke
Value: v=spf1 include:sendgrid.net ~all

Type:  TXT
Name:  default._domainkey.melitechsolutions.co.ke
Value: v=DKIM1; k=rsa; p=<your-dkim-public-key>

Type:  TXT
Name:  _dmarc.melitechsolutions.co.ke
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@melitechsolutions.co.ke
```

**CNAME Records (Optional):**
```
Type:  CNAME
Name:  www.accounts
TTL:   3600
Value: accounts.melitechsolutions.co.ke
```

---

## DNS Propagation

### Verification Steps

1. **Update DNS Records:**
   - Log in to domain registrar
   - Update A record to point to server IP
   - Update other records as needed
   - Save changes

2. **Wait for Propagation:**
   - DNS changes can take 24-48 hours to propagate globally
   - Check propagation status at: https://dnschecker.org/

3. **Verify DNS Resolution:**
   ```bash
   # Check A record
   nslookup accounts.melitechsolutions.co.ke
   
   # Check MX records
   nslookup -type=MX melitechsolutions.co.ke
   
   # Check all records
   dig accounts.melitechsolutions.co.ke
   ```

---

## SSL Certificate Configuration

### Let's Encrypt Setup

**Automatic Renewal with Certbot:**

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d accounts.melitechsolutions.co.ke

# Certificate location
# Private key: /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/privkey.pem
# Certificate: /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/fullchain.pem
# Chain: /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/chain.pem
```

**Auto-Renewal Configuration:**

```bash
# Enable auto-renewal timer
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run

# Check renewal status
sudo certbot certificates
```

### Certificate Monitoring

**Check Certificate Expiration:**
```bash
# View certificate details
openssl x509 -in /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/fullchain.pem -text -noout

# Check expiration date
openssl x509 -in /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/fullchain.pem -noout -dates

# Days until expiration
echo "Certificate expires in:" $(( ($(date -d "$(openssl x509 -in /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/fullchain.pem -noout -enddate | cut -d= -f2)" +%s) - $(date +%s)) / 86400 )) "days"
```

---

## Subdomain Configuration (Optional)

### Additional Subdomains

If you need additional subdomains:

**API Subdomain:**
```
Type:  A
Name:  api.accounts
TTL:   3600
Value: <your-server-ip-address>
```

**Admin Subdomain:**
```
Type:  A
Name:  admin.accounts
TTL:   3600
Value: <your-server-ip-address>
```

**Staging Subdomain:**
```
Type:  A
Name:  staging.accounts
TTL:   3600
Value: <staging-server-ip>
```

---

## Email Configuration

### Email Service Setup

**SMTP Configuration:**
```
Host: smtp.gmail.com (or your email provider)
Port: 587 (TLS) or 465 (SSL)
Username: noreply@melitechsolutions.co.ke
Password: <app-specific-password>
From Address: Melitech Solutions <noreply@melitechsolutions.co.ke>
```

**SPF Record:**
```
v=spf1 include:sendgrid.net include:_spf.google.com ~all
```

**DKIM Setup:**
1. Generate DKIM key pair
2. Add public key to DNS TXT record
3. Configure private key in application

**DMARC Policy:**
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@melitechsolutions.co.ke; ruf=mailto:dmarc@melitechsolutions.co.ke
```

---

## SSL/TLS Best Practices

### Security Headers

**Strict-Transport-Security (HSTS):**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Certificate Pinning (Optional):**
```
Public-Key-Pins: pin-sha256="<base64-encoded-public-key>"; max-age=2592000; includeSubDomains
```

### Certificate Validation

**Check Certificate Chain:**
```bash
openssl s_client -connect accounts.melitechsolutions.co.ke:443 -showcerts
```

**Verify Certificate Validity:**
```bash
curl -vI https://accounts.melitechsolutions.co.ke
```

---

## Troubleshooting

### DNS Not Resolving

```bash
# Check DNS server
nslookup accounts.melitechsolutions.co.ke 8.8.8.8

# Check with specific nameserver
nslookup accounts.melitechsolutions.co.ke ns1.registrar.com

# Flush local DNS cache
sudo systemd-resolve --flush-caches
```

### SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/fullchain.pem -noout -dates

# Check certificate chain
openssl verify -CAfile /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/chain.pem /etc/letsencrypt/live/accounts.melitechsolutions.co.ke/fullchain.pem

# Renew certificate
sudo certbot renew --force-renewal -d accounts.melitechsolutions.co.ke
```

### Email Not Sending

```bash
# Test SMTP connection
telnet smtp.gmail.com 587

# Check SPF record
dig accounts.melitechsolutions.co.ke TXT

# Check DKIM record
dig default._domainkey.melitechsolutions.co.ke TXT

# Check DMARC record
dig _dmarc.melitechsolutions.co.ke TXT
```

---

## DNS Monitoring

### Health Checks

**Monitor DNS Resolution:**
```bash
# Create monitoring script
#!/bin/bash
while true; do
  if nslookup accounts.melitechsolutions.co.ke > /dev/null; then
    echo "DNS OK: $(date)"
  else
    echo "DNS FAILED: $(date)"
    # Send alert
  fi
  sleep 300
done
```

**Monitor Certificate Expiration:**
```bash
# Create renewal alert script
#!/bin/bash
CERT_FILE="/etc/letsencrypt/live/accounts.melitechsolutions.co.ke/fullchain.pem"
EXPIRY=$(openssl x509 -in $CERT_FILE -noout -enddate | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

if [ $DAYS_LEFT -lt 30 ]; then
  echo "Certificate expires in $DAYS_LEFT days"
  # Send alert
fi
```

---

## Maintenance Schedule

### Monthly Tasks
- [ ] Verify DNS records are correct
- [ ] Check SSL certificate expiration
- [ ] Review email delivery logs
- [ ] Test domain accessibility

### Quarterly Tasks
- [ ] Update DNS records if needed
- [ ] Review and update security headers
- [ ] Test disaster recovery with domain failover
- [ ] Audit DNS access logs

### Annually Tasks
- [ ] Review domain registrar contract
- [ ] Update domain contact information
- [ ] Renew domain registration
- [ ] Audit all DNS records

---

## Backup & Recovery

### DNS Backup

```bash
# Export DNS records
dig @ns1.registrar.com accounts.melitechsolutions.co.ke AXFR > dns_backup.txt

# Backup certificate
cp -r /etc/letsencrypt ~/letsencrypt_backup
```

### Domain Recovery

If domain becomes unavailable:
1. Contact domain registrar
2. Verify domain ownership
3. Update DNS records to point to backup server
4. Update SSL certificate for backup server
5. Test accessibility
6. Notify users of recovery

---

**Last Updated:** November 2, 2025
**Version:** 1.0

