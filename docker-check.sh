#!/bin/bash

echo "======================================"
echo "SoundPlus++ Docker Diagnostics"
echo "======================================"
echo ""

echo "📦 Container Status:"
echo "===================="
docker ps --filter "name=soundplus" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "🏥 Container Health:"
echo "===================="
docker inspect soundplus-backend --format='Backend: {{.State.Health.Status}}' 2>/dev/null || echo "Backend: No health status"
docker inspect soundplus-frontend --format='Frontend: {{.State.Health.Status}}' 2>/dev/null || echo "Frontend: No health status"
echo ""

echo "📊 Backend Logs (last 30 lines):"
echo "=================================="
docker-compose logs backend --tail=30
echo ""

echo "📊 Frontend Logs (last 30 lines):"
echo "==================================="
docker-compose logs frontend --tail=30
echo ""

echo "🔌 Port Check:"
echo "==============="
echo "Checking if ports are accessible..."
nc -zv localhost 5000 2>&1 | grep -q succeeded && echo "✅ Backend port 5000: OPEN" || echo "❌ Backend port 5000: CLOSED"
nc -zv localhost 3000 2>&1 | grep -q succeeded && echo "✅ Frontend port 3000: OPEN" || echo "❌ Frontend port 3000: CLOSED"
echo ""

echo "🌐 HTTP Endpoint Tests:"
echo "========================"
echo -n "Backend health: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health 2>/dev/null || echo "FAILED"
echo ""
echo -n "Frontend: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "FAILED"
echo ""
echo ""

echo "💾 Docker Images:"
echo "=================="
docker images | grep soundplus
echo ""

echo "📂 Docker Volumes:"
echo "=================="
docker volume ls | grep soundplus
echo ""

echo "🌉 Docker Networks:"
echo "==================="
docker network ls | grep soundplus
echo ""
