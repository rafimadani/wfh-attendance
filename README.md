# WFH Attendance Application

A comprehensive Work From Home attendance application built with microservices architecture using NestJS backend services and React frontend.

## Features

### Employee Features
- Secure login/logout
- Submit daily attendance with photo proof
- View personal attendance history

### HR Features
- Employee management (CRUD operations)
- View all employee attendance records
- Monitor WFH compliance

## Architecture

- **Auth Service** (Port 3001): JWT authentication and authorization
- **Employee Service** (Port 3002): Employee management operations
- **Attendance Service** (Port 3003): Attendance tracking with photo upload
- **Frontend** (Port 3000): React application with responsive UI
- **Database**: MySQL with proper relationships

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MySQL (if running locally)

### Development Setup

1. **Clone and install dependencies:**
\`\`\`bash
git clone <repository-url>
cd wfh-attendance-app
npm install
\`\`\`

2. **Setup environment variables:**
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

3. **Start with Docker (Recommended):**
\`\`\`bash
npm run docker:up
\`\`\`

4. **Or start services individually:**
\`\`\`bash
# Install dependencies for each service
cd services/auth && npm install && cd ../..
cd services/employee && npm install && cd ../..
cd services/attendance && npm install && cd ../..
cd frontend && npm install && cd ..

# Start all services
npm run dev
\`\`\`

### Default Credentials

- **HR Account**: hr@company.com / password123
- **Employee Account**: employee@company.com / password123

## API Documentation

### Auth Service (3001)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

### Employee Service (3002)
- `GET /employees` - List all employees (HR only)
- `POST /employees` - Create employee (HR only)
- `PUT /employees/:id` - Update employee (HR only)
- `DELETE /employees/:id` - Delete employee (HR only)

### Attendance Service (3003)
- `POST /attendance` - Submit attendance with photo
- `GET /attendance` - Get attendance records
- `GET /attendance/employee/:id` - Get employee attendance (HR only)

## Project Structure

\`\`\`
wfh-attendance-app/
├── services/
│   ├── auth/          # Authentication microservice
│   ├── employee/      # Employee management microservice
│   └── attendance/    # Attendance tracking microservice
├── frontend/          # React frontend application
├── database/          # Database initialization scripts
├── uploads/           # File upload directory
├── docker-compose.yml # Docker orchestration
└── README.md
\`\`\`

## Technology Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Validation**: class-validator

### Frontend
- **Framework**: React with TypeScript
- **Routing**: React Router
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State Management**: React Context

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: MySQL 8.0
- **Reverse Proxy**: Nginx (production)

## Development Guidelines

1. **Code Style**: Follow TypeScript best practices
2. **API Design**: RESTful endpoints with proper HTTP status codes
3. **Security**: JWT authentication, input validation, file upload restrictions
4. **Error Handling**: Consistent error responses across services
5. **Documentation**: OpenAPI/Swagger documentation for each service

## Production Deployment

1. **Environment Variables**: Update production values in `.env`
2. **SSL Certificates**: Configure HTTPS for production
3. **Database**: Use managed MySQL service (AWS RDS, Google Cloud SQL)
4. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage)
5. **Monitoring**: Add logging and monitoring solutions

## Testing

\`\`\`bash
# Run tests for all services
npm run test

# Run tests for specific service
cd services/auth && npm run test
\`\`\`

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.
