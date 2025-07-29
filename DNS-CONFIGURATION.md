# DNS Configuration Guide for tejo-nails.com

## Current Status

- **Domain**: tejo-nails.com
- **Current IP**: 128.140.56.43 (incorrect)
- **Server IP**: 138.199.226.201 (correct)

The domain is currently pointing to the wrong IP address. To make the website accessible at tejo-nails.com, you need to update the DNS records.

## Required DNS Records

Update the following DNS records at your domain registrar or DNS provider:

| Type | Name | Value           | TTL  |
| ---- | ---- | --------------- | ---- |
| A    | @    | 138.199.226.201 | 3600 |
| A    | www  | 138.199.226.201 | 3600 |

## Steps to Update DNS

1. Log in to your domain registrar's website (e.g., GoDaddy, Namecheap, etc.)
2. Navigate to the DNS management section for tejo-nails.com
3. Find the existing A records for @ and www
4. Update them to point to 138.199.226.201
5. Save your changes

## Verification

After updating the DNS records, it may take some time for the changes to propagate (typically 15 minutes to 48 hours, depending on your TTL settings).

You can verify the DNS propagation using:

```bash
nslookup tejo-nails.com
```

Once the DNS has propagated, you should be able to access the website at:

- https://tejo-nails.com
- https://www.tejo-nails.com

## Temporary Access

While waiting for DNS propagation, you can access the site directly via the IP address:

- https://138.199.226.201

## SSL Certificates

After the DNS records have been updated and propagated, run the following command to obtain proper SSL certificates:

```bash
./scripts/setup-ssl.sh
```

This will obtain Let's Encrypt SSL certificates for tejo-nails.com and www.tejo-nails.com.

## Troubleshooting

If you're still having issues after DNS propagation:

1. Clear your browser cache
2. Try accessing the site from a different network
3. Use a DNS propagation checker like https://www.whatsmydns.net/
4. Check the server logs: `sudo journalctl -u nginx`
