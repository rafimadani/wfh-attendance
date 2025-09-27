#!/bin/bash

# WFH Attendance Application Backup Script

BACKUP_DIR="database/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="wfh_attendance_backup_$TIMESTAMP.sql"

echo "💾 Creating database backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
docker exec wfh_mysql mysqldump -u wfh_user -pwfh_password wfh_attendance > "$BACKUP_DIR/$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database backup created: $BACKUP_DIR/$BACKUP_FILE"
    
    # Compress the backup
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    echo "✅ Backup compressed: $BACKUP_DIR/$BACKUP_FILE.gz"
    
    # Keep only last 7 backups
    cd $BACKUP_DIR
    ls -t *.gz | tail -n +8 | xargs -r rm
    echo "🧹 Old backups cleaned up (keeping last 7)"
else
    echo "❌ Backup failed!"
    exit 1
fi
