#!/bin/bash

# WFH Attendance Application Cleanup Script

echo "🧹 Cleaning up WFH Attendance Application..."

# Stop and remove containers
echo "🛑 Stopping containers..."
docker-compose down

# Remove images
echo "🗑️  Removing Docker images..."
docker rmi $(docker images "wfh-attendance-app*" -q) 2>/dev/null || true

# Remove volumes (optional - uncomment if you want to remove data)
# echo "💾 Removing volumes..."
# docker volume rm wfh-attendance-app_mysql_data 2>/dev/null || true

# Clean up uploads directory
echo "📁 Cleaning uploads directory..."
rm -rf uploads/*

echo "✅ Cleanup complete!"
