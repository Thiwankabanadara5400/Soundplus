#!/bin/bash

echo "======================================"
echo "SoundPlus++ Docker Complete Rebuild"
echo "======================================"
echo ""

# Step 1: Stop all containers
echo "1️⃣  Stopping all containers..."
docker-compose down
echo "✅ Containers stopped"
echo ""

# Step 2: Remove old images
echo "2️⃣  Removing old images..."
docker rmi soundplus_frontend soundplus_backend 2>/dev/null || echo "No old images to remove"
echo "✅ Old images removed"
echo ""

# Step 3: Clean build cache (optional)
echo "3️⃣  Cleaning Docker build cache..."
docker builder prune -f
echo "✅ Build cache cleaned"
echo ""

# Step 4: Rebuild with latest configuration
echo "4️⃣  Building new images (this may take a few minutes)..."
docker-compose build --no-cache
echo "✅ Images built successfully"
echo ""

# Step 5: Start containers
echo "5️⃣  Starting containers..."
docker-compose up -d
echo "✅ Containers started"
echo ""

# Step 6: Wait for containers to be ready
echo "6️⃣  Waiting for services to be ready..."
sleep 10
echo ""

# Step 7: Show status
echo "7️⃣  Container Status:"
echo "===================="
docker ps --filter "name=soundplus"
echo ""

# Step 8: Show logs
echo "8️⃣  Recent Logs:"
echo "==============="
echo ""
echo "--- BACKEND LOGS ---"
docker-compose logs backend --tail=20
echo ""
echo "--- FRONTEND LOGS ---"
docker-compose logs frontend --tail=20
echo ""

# Step 9: Test endpoints
echo "9️⃣  Testing Endpoints:"
echo "====================="
echo ""
echo "Testing Backend Health..."
curl -s http://localhost:5000/health | jq '.' 2>/dev/null || curl -s http://localhost:5000/health
echo ""
echo ""
echo "Testing Frontend..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000
echo ""

echo "======================================"
echo "✅ Rebuild Complete!"
echo "======================================"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Health:   http://localhost:5000/health"
echo ""
echo "📊 View live logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
