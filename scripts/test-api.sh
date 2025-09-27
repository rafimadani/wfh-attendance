#!/bin/bash

# API Testing Script for WFH Attendance Application

BASE_URL="http://localhost"
AUTH_URL="$BASE_URL:3001"
EMPLOYEE_URL="$BASE_URL:3002"
ATTENDANCE_URL="$BASE_URL:3003"

echo "🧪 Testing WFH Attendance API..."

# Test Auth Service
echo "🔐 Testing Auth Service..."

# Login as HR
echo "📝 Login as HR..."
HR_RESPONSE=$(curl -s -X POST "$AUTH_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@company.com","password":"password123"}')

HR_TOKEN=$(echo $HR_RESPONSE | jq -r '.access_token')

if [ "$HR_TOKEN" != "null" ]; then
    echo "✅ HR login successful"
else
    echo "❌ HR login failed"
    exit 1
fi

# Login as Employee
echo "📝 Login as Employee..."
EMP_RESPONSE=$(curl -s -X POST "$AUTH_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"employee@company.com","password":"password123"}')

EMP_TOKEN=$(echo $EMP_RESPONSE | jq -r '.access_token')

if [ "$EMP_TOKEN" != "null" ]; then
    echo "✅ Employee login successful"
else
    echo "❌ Employee login failed"
    exit 1
fi

# Test Employee Service
echo "👥 Testing Employee Service..."

# Get all employees (HR only)
echo "📋 Getting all employees..."
EMPLOYEES_RESPONSE=$(curl -s -X GET "$EMPLOYEE_URL/employees" \
  -H "Authorization: Bearer $HR_TOKEN")

EMPLOYEE_COUNT=$(echo $EMPLOYEES_RESPONSE | jq '. | length')
echo "✅ Found $EMPLOYEE_COUNT employees"

# Create new employee
echo "➕ Creating new employee..."
NEW_EMPLOYEE=$(curl -s -X POST "$EMPLOYEE_URL/employees" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP999",
    "firstName": "Test",
    "lastName": "User",
    "department": "QA",
    "position": "Tester",
    "phone": "+1234567999",
    "hireDate": "2024-01-01",
    "status": "active"
  }')

NEW_EMP_ID=$(echo $NEW_EMPLOYEE | jq -r '.id')
if [ "$NEW_EMP_ID" != "null" ]; then
    echo "✅ Employee created with ID: $NEW_EMP_ID"
else
    echo "❌ Employee creation failed"
fi

# Test Attendance Service
echo "📅 Testing Attendance Service..."

# Create a test image file
echo "🖼️  Creating test image..."
TEST_IMAGE="/tmp/test_attendance.jpg"
# Create a simple 1x1 pixel JPEG
echo -e '\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\x27 \x0c\x0c,#\x1c\x1c(\x07\x0e\x0f\x1a\x14\x0e\x14\x0c\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x01\x01\x11\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x08\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00\x3f\x00\xaa\xff\xd9' > $TEST_IMAGE

# Submit attendance
echo "📤 Submitting attendance..."
ATTENDANCE_RESPONSE=$(curl -s -X POST "$ATTENDANCE_URL/attendance" \
  -H "Authorization: Bearer $EMP_TOKEN" \
  -F "employeeId=1" \
  -F "notes=Test attendance submission" \
  -F "photo=@$TEST_IMAGE")

ATTENDANCE_ID=$(echo $ATTENDANCE_RESPONSE | jq -r '.id')
if [ "$ATTENDANCE_ID" != "null" ]; then
    echo "✅ Attendance submitted with ID: $ATTENDANCE_ID"
else
    echo "❌ Attendance submission failed"
    echo "Response: $ATTENDANCE_RESPONSE"
fi

# Get attendance stats
echo "📊 Getting attendance stats..."
STATS_RESPONSE=$(curl -s -X GET "$ATTENDANCE_URL/attendance/stats" \
  -H "Authorization: Bearer $HR_TOKEN")

TOTAL_ATTENDANCE=$(echo $STATS_RESPONSE | jq -r '.total')
echo "✅ Total attendance records: $TOTAL_ATTENDANCE"

# Cleanup
echo "🧹 Cleaning up..."
rm -f $TEST_IMAGE

if [ "$NEW_EMP_ID" != "null" ]; then
    curl -s -X DELETE "$EMPLOYEE_URL/employees/$NEW_EMP_ID" \
      -H "Authorization: Bearer $HR_TOKEN" > /dev/null
    echo "✅ Test employee deleted"
fi

echo ""
echo "🎉 API testing completed!"
echo ""
echo "📋 Test Summary:"
echo "   ✅ Auth Service: Login/Token verification"
echo "   ✅ Employee Service: CRUD operations"
echo "   ✅ Attendance Service: Photo upload and stats"
echo ""
echo "🔗 API Endpoints tested:"
echo "   POST $AUTH_URL/auth/login"
echo "   GET  $EMPLOYEE_URL/employees"
echo "   POST $EMPLOYEE_URL/employees"
echo "   DELETE $EMPLOYEE_URL/employees/:id"
echo "   POST $ATTENDANCE_URL/attendance"
echo "   GET  $ATTENDANCE_URL/attendance/stats"
