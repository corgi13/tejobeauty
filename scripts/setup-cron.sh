#!/bin/bash
# setup-cron.sh - Setup cron jobs for monitoring and backups

echo "⏰ Setting up cron jobs for Tejo Nails Platform..."

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Create cron jobs
CRON_JOBS="
# Tejo Nails Platform - System monitoring every 5 minutes
*/5 * * * * cd $PROJECT_DIR && ./scripts/monitor.sh

# Tejo Nails Platform - Daily backup at 2 AM
0 2 * * * cd $PROJECT_DIR && ./scripts/backup.sh

# Tejo Nails Platform - Weekly system health check at 3 AM on Sundays
0 3 * * 0 cd $PROJECT_DIR && ./scripts/system-check.sh >> /var/log/tejonails-weekly-check.log

# Tejo Nails Platform - Clean old logs weekly
0 4 * * 0 find /var/log -name '*tejonails*' -mtime +30 -delete
"

# Add cron jobs
echo "Adding cron jobs..."
(crontab -l 2>/dev/null; echo "$CRON_JOBS") | crontab -

if [ $? -eq 0 ]; then
    echo "✅ Cron jobs added successfully"
else
    echo "❌ Failed to add cron jobs"
    exit 1
fi

# Display current cron jobs
echo ""
echo "Current cron jobs:"
crontab -l | grep -A 10 -B 2 "Tejo Nails"

# Create log directory if it doesn't exist
sudo mkdir -p /var/log
sudo touch /var/log/tejonails-monitor.log
sudo chmod 644 /var/log/tejonails-monitor.log

echo ""
echo "✅ Cron jobs setup completed!"
echo ""
echo "Monitoring will run every 5 minutes"
echo "Backups will run daily at 2 AM"
echo "Weekly health checks will run on Sundays at 3 AM"
echo ""
echo "To view logs:"
echo "- Monitor log: tail -f /var/log/tejonails-monitor.log"
echo "- Weekly check log: tail -f /var/log/tejonails-weekly-check.log"