#!/bin/bash

# WFH Attendance Application Restore Script

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -la database/backups/
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "🔄 Restoring database from: $BACKUP_FILE"

# Check if file is compressed
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "📦 Decompressing backup..."
    gunzip -c "$BACKUP_FILE" | docker exec -i wfh_mysql mysql -u wfh_user -pwfh_password wfh_attendance
else
    docker exec -i wfh_mysql mysql -u wfh_user -pwfh_password wfh_attendance < "$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully!"
else
    echo "❌ Restore failed!"
    exit 1
fi
