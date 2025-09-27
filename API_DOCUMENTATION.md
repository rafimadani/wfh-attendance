# API Documentation

Complete API documentation for the WFH Attendance Application microservices.

## Base URLs

- **Auth Service**: `http://localhost:3001`
- **Employee Service**: `http://localhost:3002`
- **Attendance Service**: `http://localhost:3003`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Auth Service API

### POST /auth/login
Login with email and password.

**Request Body:**
\`\`\`json
{
  "email": "user@company.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@company.com",
    "role": "employee"
  }
}
\`\`\`

### POST /auth/register
Register a new user.

**Request Body:**
\`\`\`json
{
  "email": "newuser@company.com",
  "password": "password123",
  "role": "employee"
}
\`\`\`

**Response:**
\`\`\`json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "newuser@company.com",
    "role": "employee"
  }
}
\`\`\`

### GET /auth/profile
Get current user profile. **Requires authentication.**

**Response:**
\`\`\`json
{
  "id": 1,
  "email": "user@company.com",
  "role": "employee",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
\`\`\`

### GET /auth/verify
Verify JWT token validity. **Requires authentication.**

**Response:**
\`\`\`json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@company.com",
    "role": "employee"
  }
}
\`\`\`

## Employee Service API

### GET /employees
Get all employees. **Requires HR role.**

**Response:**
\`\`\`json
[
  {
    "id": 1,
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "department": "IT",
    "position": "Software Developer",
    "phone": "+1234567890",
    "hireDate": "2024-01-15",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
\`\`\`

### POST /employees
Create a new employee. **Requires HR role.**

**Request Body:**
\`\`\`json
{
  "employeeId": "EMP002",
  "firstName": "Jane",
  "lastName": "Smith",
  "department": "Marketing",
  "position": "Marketing Manager",
  "phone": "+1234567891",
  "hireDate": "2024-02-01",
  "status": "active"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": 2,
  "employeeId": "EMP002",
  "firstName": "Jane",
  "lastName": "Smith",
  "department": "Marketing",
  "position": "Marketing Manager",
  "phone": "+1234567891",
  "hireDate": "2024-02-01",
  "status": "active",
  "createdAt": "2024-02-01T09:00:00.000Z",
  "updatedAt": "2024-02-01T09:00:00.000Z"
}
\`\`\`

### GET /employees/:id
Get employee by ID. **Requires HR role.**

**Response:**
\`\`\`json
{
  "id": 1,
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "department": "IT",
  "position": "Software Developer",
  "phone": "+1234567890",
  "hireDate": "2024-01-15",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
\`\`\`

### PATCH /employees/:id
Update employee. **Requires HR role.**

**Request Body:**
\`\`\`json
{
  "department": "IT",
  "position": "Senior Developer"
}
\`\`\`

### DELETE /employees/:id
Delete employee. **Requires HR role.**

**Response:** `204 No Content`

### GET /employees/stats
Get employee statistics. **Requires HR role.**

**Response:**
\`\`\`json
{
  "total": 10,
  "active": 8,
  "inactive": 2
}
\`\`\`

## Attendance Service API

### POST /attendance
Submit attendance with photo. **Requires authentication.**

**Request:** Multipart form data
- `employeeId`: number
- `notes`: string (optional)
- `photo`: file (required)

**Response:**
\`\`\`json
{
  "id": 1,
  "employeeId": 1,
  "checkInTime": "2024-01-15T09:00:00.000Z",
  "photoPath": "/uploads/attendance-1642234567890-123456789.jpg",
  "notes": "Working from home today",
  "status": "present",
  "createdAt": "2024-01-15T09:00:00.000Z",
  "updatedAt": "2024-01-15T09:00:00.000Z"
}
\`\`\`

### GET /attendance
Get all attendance records with pagination. **Requires HR role.**

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "checkInTime": "2024-01-15T09:00:00.000Z",
      "photoPath": "/uploads/attendance-1642234567890-123456789.jpg",
      "notes": "Working from home today",
      "status": "present",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T09:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
\`\`\`

### GET /attendance/my-attendance
Get current user's attendance records. **Requires authentication.**

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)

### GET /attendance/today
Get today's attendance for current user. **Requires authentication.**

**Response:**
\`\`\`json
{
  "id": 1,
  "employeeId": 1,
  "checkInTime": "2024-01-15T09:00:00.000Z",
  "photoPath": "/uploads/attendance-1642234567890-123456789.jpg",
  "notes": "Working from home today",
  "status": "present"
}
\`\`\`

### GET /attendance/employee/:employeeId
Get attendance records for specific employee. **Requires HR role.**

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)

### GET /attendance/stats
Get attendance statistics. **Requires HR role.**

**Query Parameters:**
- `employeeId`: number (optional, for specific employee stats)

**Response:**
\`\`\`json
{
  "total": 100,
  "present": 85,
  "late": 10,
  "absent": 5,
  "todayAttendance": 8
}
\`\`\`

### PATCH /attendance/:id
Update attendance record. **Requires HR role.**

**Request Body:**
\`\`\`json
{
  "status": "late",
  "notes": "Updated by HR"
}
\`\`\`

### DELETE /attendance/:id
Delete attendance record. **Requires HR role.**

**Response:** `204 No Content`

## Error Responses

All endpoints return consistent error responses:

**400 Bad Request:**
\`\`\`json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
\`\`\`

**401 Unauthorized:**
\`\`\`json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
\`\`\`

**403 Forbidden:**
\`\`\`json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
\`\`\`

**404 Not Found:**
\`\`\`json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
\`\`\`

**500 Internal Server Error:**
\`\`\`json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
\`\`\`

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- **Authentication endpoints**: 5 requests per minute per IP
- **Other endpoints**: 100 requests per minute per user

## File Upload Specifications

**Attendance Photo Upload:**
- **Accepted formats**: JPG, JPEG, PNG, GIF
- **Maximum size**: 5MB
- **Storage**: Local filesystem (development) / Cloud storage (production)
- **Access**: Photos are served via `/uploads/` endpoint on attendance service

## Postman Collection

Import the Postman collection from `postman/WFH-Attendance-API.postman_collection.json` to test all endpoints with pre-configured requests and environment variables.

## SDK Examples

### JavaScript/TypeScript

\`\`\`typescript
// Auth Service Client
class AuthService {
  private baseURL = 'http://localhost:3001';
  
  async login(email: string, password: string) {
    const response = await fetch(\`\${this.baseURL}/auth/login\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }
  
  async getProfile(token: string) {
    const response = await fetch(\`\${this.baseURL}/auth/profile\`, {
      headers: { 'Authorization': \`Bearer \${token}\` }
    });
    return response.json();
  }
}

// Attendance Service Client
class AttendanceService {
  private baseURL = 'http://localhost:3003';
  
  async submitAttendance(employeeId: number, photo: File, notes?: string, token?: string) {
    const formData = new FormData();
    formData.append('employeeId', employeeId.toString());
    formData.append('photo', photo);
    if (notes) formData.append('notes', notes);
    
    const response = await fetch(\`\${this.baseURL}/attendance\`, {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${token}\` },
      body: formData
    });
    return response.json();
  }
}
\`\`\`

### Python

\`\`\`python
import requests

class WFHAttendanceAPI:
    def __init__(self, base_url="http://localhost"):
        self.auth_url = f"{base_url}:3001"
        self.employee_url = f"{base_url}:3002"
        self.attendance_url = f"{base_url}:3003"
        self.token = None
    
    def login(self, email, password):
        response = requests.post(f"{self.auth_url}/auth/login", json={
            "email": email,
            "password": password
        })
        data = response.json()
        self.token = data.get("access_token")
        return data
    
    def get_headers(self):
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}
    
    def submit_attendance(self, employee_id, photo_path, notes=None):
        with open(photo_path, 'rb') as photo:
            files = {'photo': photo}
            data = {'employeeId': employee_id}
            if notes:
                data['notes'] = notes
            
            response = requests.post(
                f"{self.attendance_url}/attendance",
                files=files,
                data=data,
                headers=self.get_headers()
            )
        return response.json()

# Usage
api = WFHAttendanceAPI()
api.login("employee@company.com", "password123")
result = api.submit_attendance(1, "work_photo.jpg", "Working from home")
\`\`\`

For more examples and detailed integration guides, check the `/examples` directory in the repository.
\`\`\`
