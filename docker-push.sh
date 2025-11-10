#!/bin/bash

echo "======================================"
echo "Push SoundPlus++ to Docker Hub"
echo "======================================"
echo ""

# Check if username is provided
if [ -z "$1" ]; then
    echo "❌ Error: Docker Hub username required!"
    echo ""
    echo "Usage: ./docker-push.sh YOUR_DOCKERHUB_USERNAME"
    echo "Example: ./docker-push.sh thiwankabanadara"
    exit 1
fi

DOCKER_USERNAME=$1

echo "📝 Docker Hub Username: $DOCKER_USERNAME"
echo ""

# Step 1: Login to Docker Hub
echo "🔐 Step 1: Login to Docker Hub"
echo "================================"
docker login
if [ $? -ne 0 ]; then
    echo "❌ Login failed! Please check your credentials."
    exit 1
fi
echo "✅ Login successful!"
echo ""

# Step 2: Build images
echo "🏗️  Step 2: Building images..."
echo "================================"
docker-compose build
echo "✅ Images built!"
echo ""

# Step 3: Tag images
echo "🏷️  Step 3: Tagging images..."
echo "================================"
docker tag soundplus-backend $DOCKER_USERNAME/soundplus-backend:latest
docker tag soundplus-frontend $DOCKER_USERNAME/soundplus-frontend:latest
echo "✅ Images tagged!"
echo ""

# Step 4: Push images
echo "⬆️  Step 4: Pushing to Docker Hub..."
echo "================================"
echo "Pushing backend..."
docker push $DOCKER_USERNAME/soundplus-backend:latest
echo ""
echo "Pushing frontend..."
docker push $DOCKER_USERNAME/soundplus-frontend:latest
echo ""

echo "======================================"
echo "✅ SUCCESS! Images pushed to Docker Hub"
echo "======================================"
echo ""
echo "🌐 View your images at:"
echo "   https://hub.docker.com/r/$DOCKER_USERNAME/soundplus-backend"
echo "   https://hub.docker.com/r/$DOCKER_USERNAME/soundplus-frontend"
echo ""
echo "🚀 Anyone can now pull and run your app with:"
echo "   docker pull $DOCKER_USERNAME/soundplus-backend:latest"
echo "   docker pull $DOCKER_USERNAME/soundplus-frontend:latest"
echo ""
