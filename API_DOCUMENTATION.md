# WFH Attendance Management System - API Documentation

Complete API documentation for the Work From Home Attendance Management System microservices.

## Overview

The WFH Attendance Management System is built using a microservices architecture with three main services:

- **Auth Service** (Port 3001) - Authentication and user management
- **Employee Service** (Port 3002) - Employee data management
- **Attendance Service** (Port 3003) - Attendance tracking with photo uploads

## Base URLs

- **Auth Service**: `http://localhost:3001`
- **Employee Service**: `http://localhost:3002`
- **Attendance Service**: `http://localhost:3003`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

### User Roles
- **employee**: Regular employees who can submit attendance and view their own records
- **hr**: HR personnel with administrative privileges

## Auth Service API

### POST /auth/login
Authenticate user with email and password.

**Request Body:**
\`\`\`json
{
  "email": "user@company.com",
  "password": "password123"
}
\`\`\`

**Response (200):**
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

**Validation:**
- `email`: Must be a valid email address
- `password`: Minimum 6 characters

### POST /auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "email": "newuser@company.com",
  "password": "password123"
}
\`\`\`

**Response (201):**
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

**Validation:**
- `email`: Must be a valid email address and unique
- `password`: Minimum 6 characters

### GET /auth/profile
Get current user profile. **Requires authentication.**

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": 1,
  "email": "user@company.com",
  "role": "employee",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
\`\`\`

### GET /auth/verify
Verify JWT token validity. **Requires authentication.**

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
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

### DELETE /auth/users/:id
Delete a user account. **Requires HR role.**

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
\`\`\`

**Response (204):** No content

## Employee Service API

### GET /employees
Get all employees with pagination. **Requires HR role.**

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
\`\`\`

**Response (200):**
\`\`\`json
[
  {
    "id": 1,
    "userId": 1,
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

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "userId": 1,
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

**Response (201):**
\`\`\`json
{
  "id": 2,
  "userId": 1,
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

**Validation:**
- `employeeId`: Required, must be unique
- `firstName`: Required string
- `lastName`: Required string
- `department`: Optional string
- `position`: Optional string
- `phone`: Optional string
- `hireDate`: Optional date string (ISO format)
- `status`: Optional enum (`active` | `inactive`)

### GET /employees/:id
Get employee by ID. **Requires HR role.**

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": 1,
  "userId": 1,
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
Update employee information. **Requires HR role.**

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
Content-Type: application/json
\`\`\`

**Request Body (partial update):**
\`\`\`json
{
  "department": "IT",
  "position": "Senior Developer",
  "status": "active"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": 1,
  "userId": 1,
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "department": "IT",
  "position": "Senior Developer",
  "phone": "+1234567890",
  "hireDate": "2024-01-15",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
\`\`\`

### DELETE /employees/:id
Delete employee. **Requires HR role.**

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
\`\`\`

**Response (204):** No content

### POST /employees/with-user
Create employee with associated user account. **Requires HR role.**

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "email": "newemployee@company.com",
  "password": "password123",
  "employeeId": "EMP003",
  "firstName": "Alice",
  "lastName": "Johnson",
  "department": "HR",
  "position": "HR Specialist",
  "phone": "+1234567892",
  "hireDate": "2024-03-01",
  "status": "active"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "user": {
    "id": 3,
    "email": "newemployee@company.com",
    "role": "employee"
  },
  "employee": {
    "id": 3,
    "userId": 3,
    "employeeId": "EMP003",
    "firstName": "Alice",
    "lastName": "Johnson",
    "department": "HR",
    "position": "HR Specialist",
    "phone": "+1234567892",
    "hireDate": "2024-03-01",
    "status": "active"
  }
}
\`\`\`

## Attendance Service API

### POST /attendance/submit
Submit attendance with photo. **Requires authentication.**

**Headers:**
\`\`\`
Authorization: Bearer <token>
Content-Type: multipart/form-data
\`\`\`

**Request Body (Form Data):**
- `photo`: File (required) - JPG, JPEG, PNG, GIF (max 5MB)
- `notes`: String (optional) - Additional notes
- `employeeId`: Number (optional, HR only) - Employee ID for HR submissions

**Response (201):**
\`\`\`json
{
  "id": 1,
  "employeeId": 1,
  "checkInTime": "2024-01-15T09:00:00.000Z",
  "photoPath": "/uploads/photo-1642234567890-123456789.jpg",
  "notes": "Working from home today",
  "status": "present",
  "createdAt": "2024-01-15T09:00:00.000Z",
  "updatedAt": "2024-01-15T09:00:00.000Z"
}
\`\`\`

**Validation:**
- `photo`: Required file upload
- `notes`: Optional string
- `employeeId`: Required for HR, auto-detected for employees

### GET /attendance
Get all attendance records with pagination. **Requires HR role.**

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
\`\`\`

**Query Parameters:**
- `page`: Number (default: 1)
- `limit`: Number (default: 10)

**Response (200):**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "checkInTime": "2024-01-15T09:00:00.000Z",
      "photoPath": "/uploads/photo-1642234567890-123456789.jpg",
      "notes": "Working from home today",
      "status": "present",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T09:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
\`\`\`

### GET /attendance/employee/:employeeId
Get attendance records for specific employee. **Requires HR role.**

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
\`\`\`

**Query Parameters:**
- `page`: Number (default: 1)
- `limit`: Number (default: 10)

**Response (200):**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "checkInTime": "2024-01-15T09:00:00.000Z",
      "photoPath": "/uploads/photo-1642234567890-123456789.jpg",
      "notes": "Working from home today",
      "status": "present",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T09:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
\`\`\`

### GET /attendance/my-attendance
Get current user's attendance records. **Requires authentication.**

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Query Parameters:**
- `page`: Number (default: 1)
- `limit`: Number (default: 10)

**Response (200):**
\`\`\`json
{
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "checkInTime": "2024-01-15T09:00:00.000Z",
      "photoPath": "/uploads/photo-1642234567890-123456789.jpg",
      "notes": "Working from home today",
      "status": "present",
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T09:00:00.000Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
\`\`\`

### GET /attendance/today
Get today's attendance for current user. **Requires authentication.**

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": 1,
  "employeeId": 1,
  "checkInTime": "2024-01-15T09:00:00.000Z",
  "photoPath": "/uploads/photo-1642234567890-123456789.jpg",
  "notes": "Working from home today",
  "status": "present",
  "createdAt": "2024-01-15T09:00:00.000Z",
  "updatedAt": "2024-01-15T09:00:00.000Z"
}
\`\`\`

**Response (404):** If no attendance record for today
\`\`\`json
{
  "statusCode": 404,
  "message": "No attendance record found for today",
  "error": "Not Found"
}
\`\`\`

### GET /attendance/:id
Get specific attendance record. **Requires HR role.**

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": 1,
  "employeeId": 1,
  "checkInTime": "2024-01-15T09:00:00.000Z",
  "photoPath": "/uploads/photo-1642234567890-123456789.jpg",
  "notes": "Working from home today",
  "status": "present",
  "createdAt": "2024-01-15T09:00:00.000Z",
  "updatedAt": "2024-01-15T09:00:00.000Z"
}
\`\`\`

### PATCH /attendance/:id
Update attendance record. **Requires HR role.**

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "status": "late",
  "notes": "Updated by HR - arrived late"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": 1,
  "employeeId": 1,
  "checkInTime": "2024-01-15T09:00:00.000Z",
  "photoPath": "/uploads/photo-1642234567890-123456789.jpg",
  "notes": "Updated by HR - arrived late",
  "status": "late",
  "createdAt": "2024-01-15T09:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
\`\`\`

### DELETE /attendance/:id
Delete attendance record. **Requires HR role.**

**Headers:**
\`\`\`
Authorization: Bearer <hr-token>
\`\`\`

**Response (204):** No content

## Data Models

### User Entity
\`\`\`typescript
{
  id: number;
  email: string;
  password: string; // Excluded from responses
  role: 'employee' | 'hr';
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

### Employee Entity
\`\`\`typescript
{
  id: number;
  userId: number;
  employeeId: string; // Unique identifier
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  phone: string;
  hireDate: Date;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

### Attendance Entity
\`\`\`typescript
{
  id: number;
  employeeId: number;
  checkInTime: Date;
  photoPath: string;
  notes: string;
  status: 'present' | 'absent' | 'late';
  createdAt: Date;
  updatedAt: Date;
}
\`\`\`

## Error Responses

All endpoints return consistent error responses following this format:

### 400 Bad Request
\`\`\`json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be longer than or equal to 6 characters"],
  "error": "Bad Request"
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "statusCode": 404,
  "message": "Employee not found",
  "error": "Not Found"
}
\`\`\`

### 409 Conflict
\`\`\`json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
\`\`\`

## File Upload Specifications

### Attendance Photo Upload
- **Accepted formats**: JPG, JPEG, PNG, GIF
- **Maximum size**: 5MB per file
- **Storage location**: `./uploads/` directory
- **Naming convention**: `photo-{timestamp}-{random}.{ext}`
- **Access**: Files are served statically from the uploads directory

### Upload Error Responses
\`\`\`json
{
  "statusCode": 400,
  "message": "Photo is required for attendance",
  "error": "Bad Request"
}
\`\`\`

\`\`\`json
{
  "statusCode": 413,
  "message": "File too large",
  "error": "Payload Too Large"
}
\`\`\`

## Rate Limiting

API endpoints implement rate limiting to prevent abuse:

- **Authentication endpoints** (`/auth/login`, `/auth/register`): 5 requests per minute per IP
- **File upload endpoints**: 10 requests per minute per user
- **Other endpoints**: 100 requests per minute per user

### Rate Limit Headers
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
\`\`\`

### Rate Limit Exceeded Response
\`\`\`json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "Too Many Requests"
}
\`\`\`

## CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:

- **Allowed Origins**: `http://localhost:3000` (frontend), configurable via environment
- **Allowed Methods**: GET, POST, PATCH, DELETE, OPTIONS
- **Allowed Headers**: Authorization, Content-Type, Accept
- **Credentials**: Supported for authenticated requests

## Environment Variables

### Auth Service
\`\`\`env
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/wfh_attendance
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
\`\`\`

### Employee Service
\`\`\`env
PORT=3002
DATABASE_URL=postgresql://username:password@localhost:5432/wfh_attendance
AUTH_SERVICE_URL=http://localhost:3001
\`\`\`

### Attendance Service
\`\`\`env
PORT=3003
DATABASE_URL=postgresql://username:password@localhost:5432/wfh_attendance
AUTH_SERVICE_URL=http://localhost:3001
EMPLOYEE_SERVICE_URL=http://localhost:3002
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
\`\`\`

## SDK Examples

### JavaScript/TypeScript Client

\`\`\`typescript
class WFHAttendanceClient {
  private baseUrls = {
    auth: 'http://localhost:3001',
    employee: 'http://localhost:3002',
    attendance: 'http://localhost:3003'
  };
  
  private token: string | null = null;

  // Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrls.auth}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) throw new Error('Login failed');
    
    const data = await response.json();
    this.token = data.access_token;
    return data;
  }

  async register(email: string, password: string) {
    const response = await fetch(`${this.baseUrls.auth}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) throw new Error('Registration failed');
    
    const data = await response.json();
    this.token = data.access_token;
    return data;
  }

  async getProfile() {
    const response = await fetch(`${this.baseUrls.auth}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    
    if (!response.ok) throw new Error('Failed to get profile');
    return response.json();
  }

  // Employee Management
  async getEmployees() {
    const response = await fetch(`${this.baseUrls.employee}/employees`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    
    if (!response.ok) throw new Error('Failed to get employees');
    return response.json();
  }

  async createEmployee(employeeData: any) {
    const response = await fetch(`${this.baseUrls.employee}/employees`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeData)
    });
    
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  }

  // Attendance Management
  async submitAttendance(photo: File, notes?: string, employeeId?: number) {
    const formData = new FormData();
    formData.append('photo', photo);
    if (notes) formData.append('notes', notes);
    if (employeeId) formData.append('employeeId', employeeId.toString());

    const response = await fetch(`${this.baseUrls.attendance}/attendance/submit`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    });
    
    if (!response.ok) throw new Error('Failed to submit attendance');
    return response.json();
  }

  async getMyAttendance(page = 1, limit = 10) {
    const response = await fetch(
      `${this.baseUrls.attendance}/attendance/my-attendance?page=${page}&limit=${limit}`,
      {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
    );
    
    if (!response.ok) throw new Error('Failed to get attendance');
    return response.json();
  }

  async getTodayAttendance() {
    const response = await fetch(`${this.baseUrls.attendance}/attendance/today`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    
    if (response.status === 404) return null; // No attendance today
    if (!response.ok) throw new Error('Failed to get today\'s attendance');
    return response.json();
  }
}

// Usage Example
const client = new WFHAttendanceClient();

// Login
await client.login('employee@company.com', 'password123');

// Submit attendance
const photoFile = document.getElementById('photo-input').files[0];
await client.submitAttendance(photoFile, 'Working from home today');

// Get my attendance records
const myAttendance = await client.getMyAttendance(1, 10);
\`\`\`

### Python Client

\`\`\`python
import requests
from typing import Optional, Dict, Any
import json

class WFHAttendanceClient:
    def __init__(self, base_url: str = "http://localhost"):
        self.base_urls = {
            'auth': f"{base_url}:3001",
            'employee': f"{base_url}:3002",
            'attendance': f"{base_url}:3003"
        }
        self.token: Optional[str] = None

    def _get_headers(self) -> Dict[str, str]:
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        return headers

    def _get_auth_headers(self) -> Dict[str, str]:
        if not self.token:
            raise ValueError("Not authenticated. Please login first.")
        return {'Authorization': f'Bearer {self.token}'}

    # Authentication
    def login(self, email: str, password: str) -> Dict[str, Any]:
        response = requests.post(
            f"{self.base_urls['auth']}/auth/login",
            json={'email': email, 'password': password}
        )
        response.raise_for_status()
        
        data = response.json()
        self.token = data['access_token']
        return data

    def register(self, email: str, password: str) -> Dict[str, Any]:
        response = requests.post(
            f"{self.base_urls['auth']}/auth/register",
            json={'email': email, 'password': password}
        )
        response.raise_for_status()
        
        data = response.json()
        self.token = data['access_token']
        return data

    def get_profile(self) -> Dict[str, Any]:
        response = requests.get(
            f"{self.base_urls['auth']}/auth/profile",
            headers=self._get_auth_headers()
        )
        response.raise_for_status()
        return response.json()

    # Employee Management
    def get_employees(self) -> list:
        response = requests.get(
            f"{self.base_urls['employee']}/employees",
            headers=self._get_auth_headers()
        )
        response.raise_for_status()
        return response.json()

    def create_employee(self, employee_data: Dict[str, Any]) -> Dict[str, Any]:
        headers = self._get_auth_headers()
        headers['Content-Type'] = 'application/json'
        
        response = requests.post(
            f"{self.base_urls['employee']}/employees",
            headers=headers,
            json=employee_data
        )
        response.raise_for_status()
        return response.json()

    def get_employee(self, employee_id: int) -> Dict[str, Any]:
        response = requests.get(
            f"{self.base_urls['employee']}/employees/{employee_id}",
            headers=self._get_auth_headers()
        )
        response.raise_for_status()
        return response.json()

    def update_employee(self, employee_id: int, update_data: Dict[str, Any]) -> Dict[str, Any]:
        headers = self._get_auth_headers()
        headers['Content-Type'] = 'application/json'
        
        response = requests.patch(
            f"{self.base_urls['employee']}/employees/{employee_id}",
            headers=headers,
            json=update_data
        )
        response.raise_for_status()
        return response.json()

    # Attendance Management
    def submit_attendance(self, photo_path: str, notes: Optional[str] = None, 
                         employee_id: Optional[int] = None) -> Dict[str, Any]:
        with open(photo_path, 'rb') as photo_file:
            files = {'photo': photo_file}
            data = {}
            
            if notes:
                data['notes'] = notes
            if employee_id:
                data['employeeId'] = str(employee_id)

            response = requests.post(
                f"{self.base_urls['attendance']}/attendance/submit",
                headers=self._get_auth_headers(),
                files=files,
                data=data
            )
            response.raise_for_status()
            return response.json()

    def get_all_attendance(self, page: int = 1, limit: int = 10) -> Dict[str, Any]:
        response = requests.get(
            f"{self.base_urls['attendance']}/attendance",
            headers=self._get_auth_headers(),
            params={'page': page, 'limit': limit}
        )
        response.raise_for_status()
        return response.json()

    def get_my_attendance(self, page: int = 1, limit: int = 10) -> Dict[str, Any]:
        response = requests.get(
            f"{self.base_urls['attendance']}/attendance/my-attendance",
            headers=self._get_auth_headers(),
            params={'page': page, 'limit': limit}
        )
        response.raise_for_status()
        return response.json()

    def get_today_attendance(self) -> Optional[Dict[str, Any]]:
        response = requests.get(
            f"{self.base_urls['attendance']}/attendance/today",
            headers=self._get_auth_headers()
        )
        
        if response.status_code == 404:
            return None  # No attendance record for today
        
        response.raise_for_status()
        return response.json()

    def get_employee_attendance(self, employee_id: int, page: int = 1, 
                               limit: int = 10) -> Dict[str, Any]:
        response = requests.get(
            f"{self.base_urls['attendance']}/attendance/employee/{employee_id}",
            headers=self._get_auth_headers(),
            params={'page': page, 'limit': limit}
        )
        response.raise_for_status()
        return response.json()

# Usage Example
if __name__ == "__main__":
    client = WFHAttendanceClient()
    
    # Login
    login_result = client.login('employee@company.com', 'password123')
    print(f"Logged in as: {login_result['user']['email']}")
    
    # Submit attendance
    try:
        attendance = client.submit_attendance(
            'work_photo.jpg', 
            'Working from home today'
        )
        print(f"Attendance submitted: {attendance['id']}")
    except FileNotFoundError:
        print("Photo file not found")
    
    # Get my attendance records
    my_attendance = client.get_my_attendance(page=1, limit=5)
    print(f"Found {my_attendance['total']} attendance records")
    
    # Check today's attendance
    today = client.get_today_attendance()
    if today:
        print(f"Already checked in today at {today['checkInTime']}")
    else:
        print("No attendance record for today")
\`\`\`

## Postman Collection

Import the Postman collection from `postman/WFH-Attendance-API.postman_collection.json` to test all endpoints with pre-configured requests and environment variables.

### Collection Variables
- `auth_base_url`: http://localhost:3001
- `employee_base_url`: http://localhost:3002
- `attendance_base_url`: http://localhost:3003
- `access_token`: (automatically set after login)

### Testing Workflow
1. **Login** - Use the login request to authenticate and automatically set the token
2. **Create Employee** - Create employee records (HR only)
3. **Submit Attendance** - Upload photo and submit attendance
4. **View Records** - Get attendance records and statistics

## Database Schema

### Relationships
- `users.id` → `employees.user_id` (One-to-One)
- `employees.id` → `attendance.employee_id` (One-to-Many)

### Indexes
- `users.email` (unique)
- `employees.employee_id` (unique)
- `employees.user_id`
- `attendance.employee_id`
- `attendance.check_in_time`

For detailed database schema and setup instructions, refer to the main README.md file.

## Support

For API support and bug reports:
- Check the logs in each service for detailed error information
- Verify environment variables are properly configured
- Ensure database connections are established
- Test endpoints using the provided Postman collection

For additional help, refer to the project documentation or contact the development team.
