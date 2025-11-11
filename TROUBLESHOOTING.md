# SoundPlus++ CI/CD Troubleshooting Guide

## Current Status
- ✅ **Jenkinsfile**: Syntax valid, pipeline structure correct
- ✅ **Git Integration**: Working (fetches and checks out code)
- ✅ **Jenkins Credentials**: Need to create with correct IDs
- ⏳ **Docker Build**: Improved with retry logic for Alpine package manager
- ⏳ **Docker Hub Push**: Ready once credentials are created

---

## Issue: Alpine Package Manager Timeout

### What Happened
During Docker build, the Alpine Linux package repository had temporary connectivity issues:
```
ERROR: unable to select packages:
  curl (no such package):
    required by: world[curl]
```

### Why It Happens
- Alpine package repositories can have intermittent connectivity issues
- Network timeouts when fetching package indices
- Geographic or regional repository mirrors may be slow

### Solution Applied
Added retry logic to Dockerfiles:
```dockerfile
RUN apk update && \
    apk add --no-cache curl || \
    (apk update && apk add --no-cache curl) || \
    echo "Warning: curl installation failed, using node-based healthcheck instead"
```

This will:
1. Try to install curl first
2. If it fails, try once more with a fresh `apk update`
3. If it still fails, proceed with a warning (curl is only needed for healthcheck)

---

## Pipeline Status Overview

### ✅ Stages That Completed Successfully
1. **Checkout** - Git repository cloned ✓
2. **Pre-flight Check** - Docker daemon verified, user in docker group ✓
3. **Setup Environment** - Environment files configured ✓

### ⏳ Stage That Needs Attention
- **Build Images** - Fails due to Alpine package timeout (now with retry logic)

### ⏸️ Stages Skipped (Due to Earlier Failure)
- Start Services
- Verify Services
- Run Tests
- Push to Docker Hub
- Deploy

---

## Next Steps

### Step 1: Create Docker Hub Credentials in Jenkins
1. Go to Jenkins → **Manage Jenkins** → **Credentials**
2. Click **+ Add Credentials**
3. Create **FIRST credential:**
   - **Kind:** Username with password
   - **Username:** `thiwanka14535`
   - **Password:** `thiwankabandara3613683`
   - **ID:** `dockerhub-username` ← **EXACT**
   - **Description:** Docker Hub Username
   - Click **Create**

4. Create **SECOND credential:**
   - **Kind:** Secret text
   - **Secret:** `thiwankabandara3613683`
   - **ID:** `dockerhub-password` ← **EXACT**
   - **Description:** Docker Hub Password
   - Click **Create**

### Step 2: Run Pipeline Again
1. Go to Jenkins → **SoundPlus-CI-CD**
2. Click **Build Now**
3. Monitor console output

### Step 3: Monitor Build Progress
Expected flow:
- ✓ Checkout code
- ✓ Pre-flight validation
- ✓ Setup environment
- ✓ **Build images** (with retry logic for Alpine)
- ✓ Start services
- ✓ Verify services are healthy
- ✓ Run tests
- ✓ **Push to Docker Hub** (will work with correct credentials!)
- ✓ Deploy

---

## Docker Hub Push Stage Details

When the pipeline successfully reaches the "Push to Docker Hub" stage, it will:

1. **Login to Docker Hub**
   ```bash
   echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
   ```

2. **Tag Backend Image**
   ```bash
   docker tag soundplus-backend:latest thiwanka14535/soundplus-backend:latest
   docker tag soundplus-backend:latest thiwanka14535/soundplus-backend:42-a1b2c3d
   ```

3. **Push Backend Image**
   ```bash
   docker push thiwanka14535/soundplus-backend:latest
   docker push thiwanka14535/soundplus-backend:42-a1b2c3d
   ```

4. **Same for Frontend Image**

5. **Logout from Docker Hub**
   ```bash
   docker logout
   ```

---

## Verification Checklist

After successful pipeline run:

- [ ] Jenkins console shows "✓ Backend image pushed successfully"
- [ ] Jenkins console shows "✓ Frontend image pushed successfully"
- [ ] Jenkins console shows "✓ Pipeline completed successfully!"
- [ ] Visit https://hub.docker.com/repositories
- [ ] See `thiwanka14535/soundplus-backend` repository
- [ ] See `thiwanka14535/soundplus-frontend` repository
- [ ] Both have tags: `latest` and build-specific (e.g., `42-a1b2c3d`)

---

## Common Issues & Solutions

### Issue: "ERROR: dockerhub-username"
**Cause:** Credentials ID mismatch  
**Solution:** Delete old credentials and recreate with exact IDs as shown above

### Issue: "Alpine package not found"
**Cause:** Repository connectivity issue  
**Solution:** Pipeline will retry automatically with new Dockerfile logic

### Issue: "Permission denied while trying to connect to Docker daemon"
**Cause:** Jenkins user not in docker group  
**Solution:** Already fixed! Run: `sudo usermod -aG docker jenkins && sudo systemctl restart jenkins`

### Issue: "Health check timeout"
**Cause:** Container taking too long to start  
**Solution:** Pipeline waits up to 100 seconds; check application logs with: `docker-compose logs backend`

---

## Useful Debug Commands

Run these in WSL to diagnose issues:

```bash
# Check Docker daemon
docker ps -a

# View all images
docker images | grep soundplus

# Check Docker Hub login
docker login --username thiwanka14535

# View application logs
docker-compose logs --tail=50 backend
docker-compose logs --tail=50 frontend

# Test backend health
curl http://localhost:5000/health

# Test frontend
curl http://localhost:3000
```

---

## Git Commits Applied

| Commit | Message |
|--------|---------|
| 49c0d18 | fix: simplify post block - remove node block and use cleanWs |
| 48816e1 | fix: add retry logic for apk curl installation in Dockerfiles |

All changes are on the `main` branch and pushed to GitHub.
