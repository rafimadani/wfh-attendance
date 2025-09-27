#!/bin/bash
set -e

echo "=== Step 1: Install MySQL 8.0 with Homebrew ==="
brew install mysql@8.0

# Ensure MySQL is linked and running
brew link mysql@8.0 --force
brew services start mysql@8.0

echo "=== Step 2: Wait for MySQL to start ==="
sleep 10

echo "=== Step 3: Configure MySQL root password and create DB ==="
mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'rootpassword';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS wfh_attendance;
CREATE USER IF NOT EXISTS 'wfh_user'@'localhost' IDENTIFIED BY 'wfh_password';
GRANT ALL PRIVILEGES ON wfh_attendance.* TO 'wfh_user'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "=== Step 4: Import schema from database/init.sql ==="
mysql -u wfh_user -pwfh_password wfh_attendance < database/init.sql

echo "=== Step 5: Install Node.js (if not installed) ==="
if ! command -v node >/dev/null 2>&1; then
  brew install node
fi

echo "=== Step 6: Install dependencies for all services ==="

# Auth service
cd services/auth
npm install
cd ../..

# Employee service
cd services/employee
npm install
cd ../..

# Attendance service
cd services/attendance
npm install
cd ../..

# Frontend
cd frontend
npm install
cd ..

# Next.js app
cd app
npm install
cd ..

echo "=== DONE ✅ ==="
echo ""
echo "👉 To start services manually:"
echo "cd services/auth && npm run start:dev"
echo "cd services/employee && npm run start:dev"
echo "cd services/attendance && npm run start:dev"
echo "cd frontend && npm run dev"
echo "cd app && npm run dev"

