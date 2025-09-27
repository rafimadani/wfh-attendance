# Deployment Guide

This guide covers deploying the WFH Attendance Application to various environments.

## Production Deployment

### Prerequisites

- Docker & Docker Compose
- Domain name with SSL certificate
- Cloud storage for file uploads (AWS S3, Google Cloud Storage)
- Managed database service (AWS RDS, Google Cloud SQL)

### Environment Configuration

1. **Update Environment Variables**
\`\`\`bash
# Production .env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=3306
DB_USERNAME=your-db-username
DB_PASSWORD=your-secure-password
DB_DATABASE=wfh_attendance

JWT_SECRET=your-super-secure-jwt-secret-256-bits
JWT_EXPIRES_IN=24h

# Frontend URLs
REACT_APP_AUTH_SERVICE_URL=https://api.yourdomain.com/auth
REACT_APP_EMPLOYEE_SERVICE_URL=https://api.yourdomain.com/employee
REACT_APP_ATTENDANCE_SERVICE_URL=https://api.yourdomain.com/attendance

# File Upload (use cloud storage in production)
UPLOAD_PATH=/app/uploads
MAX_FILE_SIZE=5242880
\`\`\`

2. **SSL Configuration**
\`\`\`nginx
# nginx.conf for production
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/auth/ {
        proxy_pass http://auth-service:3001/;
    }
    
    location /api/employee/ {
        proxy_pass http://employee-service:3002/;
    }
    
    location /api/attendance/ {
        proxy_pass http://attendance-service:3003/;
    }
}
\`\`\`

### Docker Production Setup

1. **Production Docker Compose**
\`\`\`yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - auth-service
      - employee-service
      - attendance-service
    networks:
      - wfh_network

  auth-service:
    build:
      context: ./services/auth
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      # ... other env vars
    networks:
      - wfh_network
    restart: unless-stopped

  # ... other services
\`\`\`

2. **Deploy Commands**
\`\`\`bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up --build -d

# Monitor logs
docker-compose -f docker-compose.prod.yml logs -f

# Update application
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## Cloud Deployment Options

### AWS Deployment

1. **Using AWS ECS**
   - Create ECS cluster
   - Define task definitions for each service
   - Set up Application Load Balancer
   - Configure RDS for MySQL
   - Use S3 for file storage

2. **Using AWS Elastic Beanstalk**
   - Package application as Docker containers
   - Deploy using EB CLI
   - Configure environment variables
   - Set up RDS and S3 integration

### Google Cloud Platform

1. **Using Google Cloud Run**
   - Build container images
   - Deploy each service to Cloud Run
   - Configure Cloud SQL for MySQL
   - Use Cloud Storage for files

2. **Using Google Kubernetes Engine**
   - Create Kubernetes manifests
   - Deploy to GKE cluster
   - Set up ingress controller
   - Configure persistent volumes

### Vercel Deployment

1. **Frontend Only**
\`\`\`bash
# Deploy frontend to Vercel
cd frontend
vercel --prod
\`\`\`

2. **Full Stack with Vercel Functions**
   - Convert services to Vercel Functions
   - Use Vercel Postgres for database
   - Deploy with \`vercel --prod\`

## Monitoring & Logging

### Health Checks

Add health check endpoints to each service:

\`\`\`typescript
// health.controller.ts
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'auth-service'
    };
  }
}
\`\`\`

### Logging Setup

\`\`\`typescript
// logger.service.ts
import { Logger } from '@nestjs/common';

export class AppLogger extends Logger {
  log(message: string, context?: string) {
    super.log(message, context);
    // Send to external logging service
  }
  
  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context);
    // Send to error tracking service
  }
}
\`\`\`

### Monitoring Tools

- **Application Monitoring**: New Relic, DataDog, or Sentry
- **Infrastructure Monitoring**: Prometheus + Grafana
- **Log Aggregation**: ELK Stack or Fluentd
- **Uptime Monitoring**: Pingdom or UptimeRobot

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use secret management services
   - Rotate secrets regularly

2. **Database Security**
   - Use SSL connections
   - Implement proper firewall rules
   - Regular security updates

3. **API Security**
   - Rate limiting
   - CORS configuration
   - Input validation
   - SQL injection prevention

4. **File Upload Security**
   - Virus scanning
   - File type validation
   - Size limits
   - Secure storage

## Backup Strategy

1. **Database Backups**
\`\`\`bash
# Automated daily backups
0 2 * * * /path/to/backup.sh
\`\`\`

2. **File Backups**
   - Sync uploads to cloud storage
   - Version control for code
   - Configuration backups

## Performance Optimization

1. **Database Optimization**
   - Proper indexing
   - Query optimization
   - Connection pooling

2. **Caching**
   - Redis for session storage
   - CDN for static assets
   - API response caching

3. **Load Balancing**
   - Multiple service instances
   - Database read replicas
   - Geographic distribution

## Troubleshooting

### Common Issues

1. **Service Connection Errors**
\`\`\`bash
# Check service logs
docker-compose logs service-name

# Check network connectivity
docker exec container-name ping other-service
\`\`\`

2. **Database Connection Issues**
\`\`\`bash
# Test database connection
docker exec mysql-container mysql -u username -p
\`\`\`

3. **File Upload Issues**
\`\`\`bash
# Check upload directory permissions
ls -la uploads/
chmod 755 uploads/
\`\`\`

### Performance Issues

1. **Monitor Resource Usage**
\`\`\`bash
# Check container resources
docker stats

# Check system resources
htop
\`\`\`

2. **Database Performance**
\`\`\`sql
-- Check slow queries
SHOW PROCESSLIST;
SHOW FULL PROCESSLIST;
\`\`\`

For additional support, check the main README.md or create an issue in the repository.
\`\`\`
