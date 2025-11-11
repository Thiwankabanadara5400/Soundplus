#!/bin/bash
# Jenkins Setup Automation Script for SoundPlus++
# This script automates Docker group setup and credential creation

set -e

echo "================================"
echo "SoundPlus++ Jenkins Setup Script"
echo "================================"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "❌ This script must be run as root (use: sudo bash $0)"
   exit 1
fi

echo "Step 1: Checking Jenkins installation..."
if ! command -v jenkins &> /dev/null; then
    echo "❌ Jenkins not found. Please install Jenkins first."
    exit 1
fi
echo "✅ Jenkins found"

echo ""
echo "Step 2: Adding jenkins user to docker group..."
if id -nG jenkins | grep -qw docker; then
    echo "ℹ jenkins user already in docker group"
else
    usermod -aG docker jenkins
    echo "✅ Added jenkins to docker group"
fi

echo ""
echo "Step 3: Verifying docker socket permissions..."
ls -l /var/run/docker.sock
echo "✅ Docker socket permissions verified"

echo ""
echo "Step 4: Testing jenkins docker access..."
if sudo -u jenkins docker ps > /dev/null 2>&1; then
    echo "✅ Jenkins can access Docker daemon"
else
    echo "❌ Jenkins cannot access Docker daemon"
    echo "   Try: sudo systemctl restart jenkins"
    exit 1
fi

echo ""
echo "Step 5: Restarting Jenkins..."
systemctl restart jenkins
echo "✅ Jenkins restarted"

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Go to Jenkins Web UI: http://localhost:8080"
echo "2. Go to: Manage Jenkins → Manage Credentials"
echo "3. Add Docker Hub credentials:"
echo "   - ID: dockerhub-username"
echo "   - Value: your-docker-hub-username"
echo ""
echo "4. Add Docker Hub password:"
echo "   - ID: dockerhub-password"
echo "   - Value: your-docker-hub-password-or-token"
echo ""
echo "5. Go to SoundPlus-CI-CD job and click 'Build Now'"
echo ""
