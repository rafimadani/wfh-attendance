#!/bin/bash

# WFH Attendance Application Setup Script

echo "🚀 Setting up WFH Attendance Application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads
mkdir -p database/backups

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "✅ Environment file created. Please review and update .env file with your settings."
fi

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
services=("auth-service:3001" "employee-service:3002" "attendance-service:3003" "frontend:3000")

for service in "${services[@]}"; do
    IFS=':' read -r name port <<< "$service"
    if curl -f -s "http://localhost:$port" > /dev/null; then
        echo "✅ $name is running on port $port"
    else
        echo "❌ $name is not responding on port $port"
    fi
done

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Auth Service: http://localhost:3001"
echo "   Employee Service: http://localhost:3002"
echo "   Attendance Service: http://localhost:3003"
echo ""
echo "🔑 Default Login Credentials:"
echo "   HR Account: hr@company.com / password123"
echo "   Employee Account: employee@company.com / password123"
echo ""
echo "📚 Next Steps:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Login with the default credentials"
echo "   3. Import the Postman collection from postman/WFH-Attendance-API.postman_collection.json"
echo "   4. Review the README.md for detailed documentation"
echo ""
echo "🛠️  Development Commands:"
echo "   Start services: docker-compose up -d"
echo "   Stop services: docker-compose down"
echo "   View logs: docker-compose logs -f [service-name]"
echo "   Rebuild: docker-compose up --build -d"
