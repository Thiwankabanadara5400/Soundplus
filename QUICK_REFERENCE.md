# SoundPlus++ Quick Reference Guide

## Development Setup

### Local Development (Using docker-compose.dev.yml)

```bash
# Navigate to project
cd "/mnt/d/Docker project/SoundPlus++"

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker-compose -f docker-compose.dev.yml down
```

**Development URLs:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:5001/health

---

## Production Setup

### Local Production (Using docker-compose.yml)

```bash
# Navigate to project
cd "/mnt/d/Docker project/SoundPlus++"

# Start production environment
docker-compose -f docker-compose.yml up -d

# View status
docker-compose -f docker-compose.yml ps

# Stop production environment
docker-compose -f docker-compose.yml down
```

**Production URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/health

---

## Docker Commands

### Build Images
```bash
# Development
docker-compose -f docker-compose.dev.yml build --no-cache

# Production
docker-compose -f docker-compose.yml build --no-cache
```

### View Running Containers
```bash
docker ps
docker ps -a  # Include stopped containers
```

### View Container Logs
```bash
# Specific container
docker logs soundplus-backend
docker logs soundplus-frontend

# Follow logs in real-time
docker logs -f soundplus-backend

# Last N lines
docker logs --tail 50 soundplus-backend
```

### Execute Commands in Container
```bash
# Open shell in backend
docker exec -it soundplus-backend sh

# Run npm command
docker exec soundplus-backend npm list
```

### Clean Up
```bash
# Stop and remove containers
docker-compose down

# Remove all unused images
docker image prune -a

# Remove all unused volumes
docker volume prune
```

---

## Jenkins Pipeline

### Trigger Build Manually
```bash
# Using curl
curl -X POST http://localhost:8080/job/SoundPlus-CI-CD/build \
  -u username:password

# Or use Jenkins Web UI: Click "Build Now"
```

### View Build History
```bash
curl http://localhost:8080/job/SoundPlus-CI-CD/api/json | jq '.builds[].number'
```

### Check Last Build Status
```bash
curl http://localhost:8080/job/SoundPlus-CI-CD/lastBuild/api/json | jq '.result'
# Returns: SUCCESS, FAILURE, UNSTABLE, ABORTED
```

---

## Git Commands

### Commit and Push
```bash
# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Your commit message"

# Push to main (triggers Jenkins build)
git push origin main

# Push to development branch (uses dev compose)
git push origin develop
```

### View Git Log
```bash
git log --oneline -10
git log --graph --all --oneline
```

---

## Environment Variables

### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
DB_NAME=Sound_lk
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000
```

---

## Docker Hub Operations

### Login to Docker Hub
```bash
docker login -u your-username
# Enter password when prompted
```

### Push Image Manually
```bash
# Tag image
docker tag soundplus-backend:latest your-username/soundplus-backend:latest

# Push
docker push your-username/soundplus-backend:latest

# Logout
docker logout
```

### Pull Image from Docker Hub
```bash
docker pull your-username/soundplus-backend:latest
```

---

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs container-name

# Inspect container
docker inspect container-name

# Check if port is in use
netstat -an | grep 5000
```

### Permission Denied Error
```bash
# Jenkins user setup
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Verify
sudo -u jenkins docker ps
```

### Out of Disk Space
```bash
# Clean up Docker
docker system prune -a

# Remove stopped containers
docker container prune

# Remove unused volumes
docker volume prune
```

### Network Issues
```bash
# Check network
docker network ls

# Inspect network
docker network inspect soundplus_soundplus-network

# Check container network
docker inspect --format='{{.NetworkSettings.Networks}}' soundplus-backend
```

---

## Performance Tips

### Reduce Build Time
- Use `.dockerignore` to exclude unnecessary files
- Cache layers properly in Dockerfile
- Use `--no-cache` only when needed

### Reduce Image Size
- Use alpine base images
- Multi-stage builds
- Remove unnecessary dependencies

### Monitoring
```bash
# Check resource usage
docker stats

# Check image sizes
docker images --format "table {{.Repository}}\t{{.Size}}"
```

---

## Useful Aliases

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
alias dc='docker-compose'
alias dcdev='docker-compose -f docker-compose.dev.yml'
alias dcprod='docker-compose -f docker-compose.yml'
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'
alias dcps='docker-compose ps'
alias dcbuild='docker-compose build --no-cache'
```

Then use: `dcdev up` instead of `docker-compose -f docker-compose.dev.yml up -d`

---

## Windows PowerShell Commands

```powershell
# WSL commands
wsl -d Ubuntu -- docker ps
wsl -d Ubuntu -- docker-compose ps

# Check WSL IP
wsl -d Ubuntu -- hostname -I

# SSH into WSL
wsl -d Ubuntu

# Check port forwarding
netsh interface portproxy show all
```

---

## Useful Links

- Docker Hub: https://hub.docker.com
- Jenkins: http://localhost:8080
- GitHub: https://github.com/Thiwankabanadara5400/Soundplus
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

---

**Last Updated:** 2025-11-11
**Version:** 1.0
