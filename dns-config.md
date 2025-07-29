# DNS Configuration for tejo-beauty.com

## Overview
This document provides comprehensive DNS configuration instructions for migrating from tejo-nails.com to tejo-beauty.com.

## DNS Records Configuration

### 1. A Records (IPv4)
```
Type: A
Name: @
Value: 138.199.226.201
TTL: 300
```

```
Type: A
Name: www
Value: 138.199.226.201
TTL: 300
```

```
Type: A
Name: api
Value: 138.199.226.201
TTL: 300
```

```
Type: A
Name: admin
Value: 138.199.226.201
TTL: 300
```

```
Type: A
Name: cdn
Value: 138.199.226.201
TTL: 300
```

### 2. AAAA Records (IPv6) - Optional
```
Type: AAAA
Name: @
Value: 2001:db8::1
TTL: 300
```

### 3. CNAME Records
```
Type: CNAME
Name: *
Value: tejo-beauty.com
TTL: 300
```

```
Type: CNAME
Name: mail
Value: mail.tejo-beauty.com
TTL: 300
```

### 4. MX Records (Email Configuration)
```
Type: MX
Name: @
Value: 10 mail.tejo-beauty.com
TTL: 3600
```

```
Type: MX
Name: @
Value: 20 backup-mail.tejo-beauty.com
TTL: 3600
```

### 5. TXT Records (Domain Verification & Security)

#### SPF Record (Sender Policy Framework)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com include:mailgun.org include:spf.tejo-beauty.com ~all
TTL: 3600
```

#### DKIM Record (DomainKeys Identified Mail)
```
Type: TXT
Name: google._domainkey
Value: v=DKIM1; k=rsa; p=your_dkim_public_key_here
TTL: 3600
```

#### DMARC Record (Domain-based Message Authentication)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@tejo-beauty.com; ruf=mailto:dmarc@tejo-beauty.com; fo=1
TTL: 3600
```

#### Google Workspace Verification
```
Type: TXT
Name: @
Value: google-site-verification=your_google_verification_code_here
TTL: 3600
```

#### SSL Certificate Verification (Let's Encrypt)
```
Type: TXT
Name: _acme-challenge
Value: your_letsencrypt_challenge_token_here
TTL: 300
```

### 6. SRV Records (Service Discovery)

#### Email Client Auto-configuration
```
Type: SRV
Name: _autodiscover._tcp
Value: 0 5 443 autodiscover.tejo-beauty.com
TTL: 3600
```

```
Type: SRV
Name: _submission._tcp
Value: 0 5 587 mail.tejo-beauty.com
TTL: 3600
```

## Subdomain Structure

### Primary Subdomains
- **tejo-beauty.com** - Main website (Next.js frontend)
- **api.tejo-beauty.com** - REST API (NestJS backend)
- **admin.tejo-beauty.com** - Admin dashboard
- **cdn.tejo-beauty.com** - Content delivery network
- **mail.tejo-beauty.com** - Email server

### Service Subdomains
- **app.tejo-beauty.com** - Mobile app API
- **ws.tejo-beauty.com** - WebSocket server
- **analytics.tejo-beauty.com** - Analytics dashboard
- **files.tejo-beauty.com** - File storage
- **dev.tejo-beauty.com** - Development environment
- **staging.tejo-beauty.com** - Staging environment

## DNS Provider Instructions

### Cloudflare Configuration
1. Log into Cloudflare dashboard
2. Add site: tejo-beauty.com
3. Choose "Free" plan initially
4. Update nameservers at your registrar:
   - Name: ns1.cloudflare.com
   - Name: ns2.cloudflare.com
5. Add all DNS records listed above
6. Enable Cloudflare proxy (orange cloud) for:
   - tejo-beauty.com
   - www.tejo-beauty.com
   - api.tejo-beauty.com
   - admin.tejo-beauty.com

### Namecheap Configuration
1. Log into Namecheap account
2. Go to Domain List → Manage → Advanced DNS
3. Add A records for main domain and subdomains
4. Add CNAME records for www and other subdomains
5. Add MX records for email
6. Add TXT records for verification and security

### GoDaddy Configuration
1. Log into GoDaddy account
2. Go to My Products → DNS
3. Add all required DNS records
4. Ensure TTL is set appropriately (300 for A records, 3600 for MX/TXT)

## Migration Timeline

### Phase 1: DNS Setup (Day 1)
1. Purchase tejo-beauty.com domain
2. Configure DNS records as listed above
3. Verify DNS propagation (use dig/nslookup)

### Phase 2: SSL Certificate Setup (Day 2)
1. Generate SSL certificates for all subdomains
2. Configure web server with certificates
3. Test HTTPS on all subdomains

### Phase 3: Application Deployment (Day 3)
1. Deploy application to new domain
2. Configure reverse proxy (Nginx)
3. Test all functionality

### Phase 4: Email Configuration (Day 4)
1. Set up email server
2. Configure email authentication
3. Test email delivery

### Phase 5: Monitoring & Testing (Day 5)
1. Set up monitoring for DNS
2. Test all subdomains
3. Verify SSL certificates
4. Monitor for any issues

## Testing Checklist

### DNS Propagation Test
```bash
# Test A records
dig tejo-beauty.com A
dig www.tejo-beauty.com A
dig api.tejo-beauty.com A

# Test MX records
dig tejo-beauty.com MX

# Test TXT records
dig tejo-beauty.com TXT

# Test CNAME records
dig www.tejo-beauty.com CNAME
```

### SSL Certificate Test
```bash
# Test SSL certificates
openssl s_client -connect tejo-beauty.com:443
openssl s_client -connect api.tejo-beauty.com:443
```

### Email Configuration Test
```bash
# Test email delivery
nslookup -type=mx tejo-beauty.com
```

## Troubleshooting

### Common Issues
1. **DNS propagation delays**: Wait 24-48 hours for global propagation
2. **SSL certificate errors**: Check certificate validity and chain
3. **Email delivery issues**: Verify SPF/DKIM/DMARC records
4. **Subdomain not resolving**: Check CNAME/A record configuration

### Support Contacts
- **Domain Registrar**: Contact your domain provider's support
- **DNS Provider**: Check DNS provider's documentation
- **SSL Certificate**: Contact certificate authority support
- **Email Provider**: Check email service documentation

## Security Considerations

### DNS Security
- Enable DNSSEC for domain security
- Use Cloudflare for DDoS protection
- Implement rate limiting on DNS queries
- Monitor for DNS hijacking attempts

### Email Security
- Implement SPF, DKIM, and DMARC
- Use TLS for all email communications
- Monitor for email spoofing
- Set up email authentication reports

## Monitoring Setup

### DNS Monitoring
- Set up alerts for DNS changes
- Monitor DNS response times
- Track DNS query volume
- Monitor for DNS attacks

### Uptime Monitoring
- Monitor all subdomains
- Set up alerts for downtime
- Track response times
- Monitor SSL certificate expiration