#!/bin/bash
# SSL Certificate Setup Script for tejo-beauty.com
# This script installs Certbot, generates SSL certificates, sets up auto-renewal, and tests SSL configuration

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAINS=("tejo-beauty.com" "www.tejo-beauty.com" "api.tejo-beauty.com" "admin.tejo-beauty.com" "cdn.tejo-beauty.com")
EMAIL="admin@tejo-beauty.com"
WEBROOT="/var/www/tejo-beauty"
NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Function to check system compatibility
check_system() {
    print_status "Checking system compatibility..."
    
    # Check OS
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VERSION=$VERSION_ID
    else
        print_error "Cannot determine OS version"
        exit 1
    fi
    
    print_status "Detected OS: $OS $VERSION"
    
    # Check if Nginx is installed
    if ! command -v nginx &> /dev/null; then
        print_error "Nginx is not installed. Please install Nginx first."
        exit 1
    fi
    
    print_success "System compatibility check passed"
}

# Function to install Certbot
install_certbot() {
    print_status "Installing Certbot..."
    
    case $OS in
        *"Ubuntu"*|"Debian"*)
            apt update
            apt install -y certbot python3-certbot-nginx
            ;;
        *"CentOS"*|"Red Hat"*)
            yum install -y epel-release
            yum install -y certbot python3-certbot-nginx
            ;;
        *"Fedora"*)
            dnf install -y certbot python3-certbot-nginx
            ;;
        *)
            print_error "Unsupported OS for automatic Certbot installation"
            print_status "Please install Certbot manually for your OS"
            exit 1
            ;;
    esac
    
    if command -v certbot &> /dev/null; then
        print_success "Certbot installed successfully"
    else
        print_error "Failed to install Certbot"
        exit 1
    fi
}

# Function to create webroot directories
create_webroot() {
    print_status "Creating webroot directories..."
    
    for domain in "${DOMAINS[@]}"; do
        mkdir -p "$WEBROOT/$domain"
        echo "<h1>Welcome to $domain</h1>" > "$WEBROOT/$domain/index.html"
    done
    
    # Set proper permissions
    chown -R www-data:www-data "$WEBROOT"
    chmod -R 755 "$WEBROOT"
    
    print_success "Webroot directories created"
}

# Function to configure Nginx for Certbot
configure_nginx_for_certbot() {
    print_status "Configuring Nginx for Certbot..."
    
    # Create temporary Nginx configuration for certificate generation
    cat > "$NGINX_CONF_DIR/tejo-beauty-certbot" << EOF
server {
    listen 80;
    listen [::]:80;
    
    server_name ${DOMAINS[*]};
    
    location /.well-known/acme-challenge/ {
        root $WEBROOT;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF
    
    # Create symbolic link
    ln -sf "$NGINX_CONF_DIR/tejo-beauty-certbot" "$NGINX_SITES_ENABLED/"
    
    # Test Nginx configuration
    nginx -t
    
    # Reload Nginx
    systemctl reload nginx
    
    print_success "Nginx configured for Certbot"
}

# Function to generate SSL certificates
generate_certificates() {
    print_status "Generating SSL certificates..."
    
    # Build domain arguments
    DOMAIN_ARGS=""
    for domain in "${DOMAINS[@]}"; do
        DOMAIN_ARGS="$DOMAIN_ARGS -d $domain"
    done
    
    # Generate certificates
    certbot certonly --webroot \
        --webroot-path="$WEBROOT" \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        $DOMAIN_ARGS
    
    if [ $? -eq 0 ]; then
        print_success "SSL certificates generated successfully"
    else
        print_error "Failed to generate SSL certificates"
        exit 1
    fi
}

# Function to setup auto-renewal
setup_auto_renewal() {
    print_status "Setting up auto-renewal..."
    
    # Create renewal script
    cat > /usr/local/bin/certbot-renew-hook.sh << 'EOF'
#!/bin/bash
# Post-renewal hook for Certbot

# Reload Nginx
systemctl reload nginx

# Send notification (optional)
# echo "SSL certificates renewed at $(date)" | mail -s "SSL Renewal" admin@tejo-beauty.com
EOF
    
    chmod +x /usr/local/bin/certbot-renew-hook.sh
    
    # Test renewal
    certbot renew --dry-run
    
    # Add cron job for auto-renewal
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/bin/certbot renew --quiet --renew-hook /usr/local/bin/certbot-renew-hook.sh") | crontab -
    
    print_success "Auto-renewal configured"
}

# Function to test SSL configuration
test_ssl_configuration() {
    print_status "Testing SSL configuration..."
    
    # Wait a moment for services to start
    sleep 5
    
    # Test each domain
    for domain in "${DOMAINS[@]}"; do
        print_status "Testing $domain..."
        
        # Test HTTPS
        if curl -sSf "https://$domain" > /dev/null; then
            print_success "HTTPS working for $domain"
        else
            print_warning "HTTPS not working for $domain"
        fi
        
        # Test SSL certificate
        if echo | openssl s_client -connect "$domain:443" -servername "$domain" 2>/dev/null | openssl x509 -noout -dates | grep -q "notAfter"; then
            print_success "SSL certificate valid for $domain"
        else
            print_warning "SSL certificate issue for $domain"
        fi
        
        # Test SSL grade
        print_status "SSL grade for $domain:"
        nmap --script ssl-enum-ciphers -p 443 "$domain" | grep -E "(TLSv1\.[2-3]|SSLv3)" || echo "Check SSL configuration manually"
    done
}

# Function to create final Nginx configuration
create_final_nginx_config() {
    print_status "Creating final Nginx configuration..."
    
    # Copy the nginx.conf file to sites-available
    cp nginx.conf "$NGINX_CONF_DIR/tejo-beauty"
    
    # Create symbolic link
    ln -sf "$NGINX_CONF_DIR/tejo-beauty" "$NGINX_SITES_ENABLED/"
    
    # Test Nginx configuration
    nginx -t
    
    # Reload Nginx
    systemctl reload nginx
    
    print_success "Final Nginx configuration applied"
}

# Function to backup existing certificates
backup_existing_certificates() {
    print_status "Backing up existing certificates..."
    
    BACKUP_DIR="/etc/letsencrypt/backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    if [ -d "/etc/letsencrypt/live" ]; then
        cp -r /etc/letsencrypt/live "$BACKUP_DIR/"
        print_success "Existing certificates backed up to $BACKUP_DIR"
    else
        print_status "No existing certificates found"
    fi
}

# Function to create SSL certificate monitoring
create_ssl_monitoring() {
    print_status "Creating SSL certificate monitoring..."
    
    cat > /usr/local/bin/check-ssl-expiry.sh << 'EOF'
#!/bin/bash
# Check SSL certificate expiry

DOMAINS=("tejo-beauty.com" "www.tejo-beauty.com" "api.tejo-beauty.com" "admin.tejo-beauty.com" "cdn.tejo-beauty.com")
DAYS_THRESHOLD=30

for domain in "${DOMAINS[@]}"; do
    expiry_date=$(echo | openssl s_client -connect "$domain:443" -servername "$domain" 2>/dev/null | openssl x509 -noout -dates | grep "notAfter" | cut -d= -f2)
    expiry_timestamp=$(date -d "$expiry_date" +%s)
    current_timestamp=$(date +%s)
    days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
    
    if [ $days_until_expiry -le $DAYS_THRESHOLD ]; then
        echo "WARNING: SSL certificate for $domain expires in $days_until_expiry days"
        # Send notification (optional)
        # echo "SSL certificate for $domain expires in $days_until_expiry days" | mail -s "SSL Expiry Warning" admin@tejo-beauty.com
    fi
done
EOF
    
    chmod +x /usr/local/bin/check-ssl-expiry.sh
    
    # Add to cron for daily checks
    (crontab -l 2>/dev/null; echo "0 6 * * * /usr/local/bin/check-ssl-expiry.sh") | crontab -
    
    print_success "SSL monitoring configured"
}

# Function to display summary
display_summary() {
    print_success "SSL Certificate Setup Complete!"
    echo
    echo "============================================"
    echo "SSL Certificate Summary"
    echo "============================================"
    echo "Domains: ${DOMAINS[*]}"
    echo "Email: $EMAIL"
    echo "Certificate Directory: /etc/letsencrypt/live/"
    echo "Auto-renewal: Enabled (daily at 2 AM)"
    echo "Monitoring: Enabled (daily at 6 AM)"
    echo
    echo "Test your SSL configuration:"
    echo "  https://www.ssllabs.com/ssltest/analyze.html?d=tejo-beauty.com"
    echo
    echo "Certificate files:"
    echo "  Full chain: /etc/letsencrypt/live/tejo-beauty.com/fullchain.pem"
    echo "  Private key: /etc/letsencrypt/live/tejo-beauty.com/privkey.pem"
    echo
    echo "To manually renew certificates:"
    echo "  sudo certbot renew --dry-run"
    echo
    echo "To force renewal:"
    echo "  sudo certbot renew --force-renewal"
}

# Main execution
main() {
    print_status "Starting SSL Certificate Setup for tejo-beauty.com"
    echo
    
    check_root
    check_system
    backup_existing_certificates
    install_certbot
    create_webroot
    configure_nginx_for_certbot
    generate_certificates
    setup_auto_renewal
    create_final_nginx_config
    test_ssl_configuration
    create_ssl_monitoring
    display_summary
}

# Run main function
main