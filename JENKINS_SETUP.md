# Jenkins CI/CD Setup Guide for SoundPlus++

## Overview
This guide walks through setting up Jenkins to automatically build, test, and deploy SoundPlus++ using Docker Compose with environment-specific configurations.

## Prerequisites
- Jenkins installed and running
- Docker and Docker Compose installed on Jenkins host
- GitHub repository access
- Docker Hub account (for pushing images)
- Git installed on Jenkins host

---

## Step 1: Add Jenkins to Docker Group (Required)

On the **Jenkins host machine**, run these commands as root/sudo:

```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Verify jenkins user is in docker group
id jenkins
# Output should include: groups=...docker

# Restart Jenkins to apply group changes
sudo systemctl restart jenkins

# Verify Jenkins can run docker
sudo -u jenkins docker ps
```

**Expected output:** List of containers (or empty list), NOT a permission error.

---

## Step 2: Create Docker Hub Credentials in Jenkins

1. **In Jenkins Web UI**, go to:
   - **Manage Jenkins** → **Manage Credentials** → **System** → **Global credentials**

2. **Click "Add Credentials"** and fill in:
   - **Kind:** Username with password
   - **Username:** `your-dockerhub-username`
   - **Password:** `your-dockerhub-password` (or Personal Access Token)
   - **ID:** `dockerhub-username` (MUST match the Jenkinsfile reference)
   - **Description:** "Docker Hub credentials for image push"
   - Click **Create**

3. **Add a second credential for password:**
   - **Kind:** Secret text
   - **Secret:** `your-dockerhub-password`
   - **ID:** `dockerhub-password`
   - **Description:** "Docker Hub password/token"
   - Click **Create**

**Note:** The credential IDs (`dockerhub-username`, `dockerhub-password`) must match the `Jenkinsfile` environment variables exactly.

---

## Step 3: Configure Docker Hub Credentials in Jenkinsfile

The updated `Jenkinsfile` includes:

```groovy
environment {
    DOCKER_USERNAME = credentials('dockerhub-username')
    DOCKER_PASSWORD = credentials('dockerhub-password')
    BACKEND_IMAGE = "${DOCKER_USERNAME}/soundplus-backend"
    FRONTEND_IMAGE = "${DOCKER_USERNAME}/soundplus-frontend"
}
```

This automatically injects your Docker Hub credentials during pipeline execution.

---

## Step 4: Understand Environment-Specific Builds

### Compose File Selection Logic

The pipeline automatically selects the correct compose file based on the Git branch:

```groovy
if [ "$GIT_BRANCH" = "origin/main" ] || [ "$GIT_BRANCH" = "main" ]; then
    COMPOSE_FILE="docker-compose.yml"         # Production
    ENV_LABEL="production"
else
    COMPOSE_FILE="docker-compose.dev.yml"     # Development
    ENV_LABEL="development"
fi
```

- **`docker-compose.yml`** (main branch) → Production build & push to Docker Hub
- **`docker-compose.dev.yml`** (other branches) → Development build (no push)

### Create `docker-compose.dev.yml` (if not exists)

Copy your production compose file and modify for development:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: soundplus-backend-dev
    restart: unless-stopped
    ports:
      - "5001:5000"  # Different port for dev
    environment:
      - NODE_ENV=development
      - PORT=5000
    networks:
      - soundplus-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: soundplus-frontend-dev
    restart: unless-stopped
    ports:
      - "3001:3000"  # Different port for dev
    environment:
      - VITE_API_URL=http://localhost:5001
      - NODE_ENV=development
    depends_on:
      - backend
    networks:
      - soundplus-network

networks:
  soundplus-network:
    driver: bridge
```

---

## Step 5: Pipeline Stages Explained

### Stage Breakdown

| Stage | Purpose | Runs On |
|-------|---------|---------|
| **Checkout** | Clone repo from GitHub | All branches |
| **Pre-flight Check** | Verify Docker, permissions, cleanup | All branches |
| **Setup Environment** | Create `.env` files from `.env.example` | All branches |
| **Build Images** | Build backend & frontend, select compose file | All branches |
| **Start Services** | Start containers, wait for health checks | All branches |
| **Verify Services** | Test endpoints, check logs | All branches |
| **Run Tests** | Run any test suites (placeholder) | All branches |
| **Push to Docker Hub** | Tag & push images to Docker Hub | Only `main` branch |
| **Deploy** | Deployment success message | All branches |

### Docker Hub Push Details

**Runs only on `main` branch** (prevents accidental pushes from dev branches):

```groovy
when {
    branch 'main'
}
```

Images are tagged with:
- `latest` → Always points to newest main build
- `${BUILD_NUMBER}-${GIT_COMMIT_SHORT}` → Specific build+commit tag (e.g., `42-a1b2c3d`)

---

## Step 6: Run the Pipeline

### Option A: Manual Trigger
1. Go to Jenkins → SoundPlus-CI-CD job
2. Click **Build Now**
3. Watch real-time progress in **Console Output**

### Option B: Automatic on Git Push (Webhook)
1. In GitHub repo settings → **Webhooks**
2. Add webhook:
   - **Payload URL:** `http://your-jenkins-url/github-webhook/`
   - **Content type:** `application/json`
   - **Events:** "Push events" + "Pull requests"
3. Jenkins will automatically trigger on push

### Option C: Poll SCM (Fallback)
1. In Jenkins job → **Configure**
2. **Build Triggers** → Check **Poll SCM**
3. Schedule: `H/15 * * * *` (check every 15 minutes)

---

## Step 7: Monitor & Debug

### View Build Logs
```bash
# On Jenkins host
tail -f /var/log/jenkins/jenkins.log

# Or in Jenkins UI: Job → Build #XX → Console Output
```

### Check Running Containers
```bash
# On Jenkins host
docker ps

# Check specific container
docker logs soundplus-backend
docker logs soundplus-frontend
```

### Verify Docker Hub Push
```bash
# Check if images exist in Docker Hub
curl https://hub.docker.com/v2/repositories/YOUR_USERNAME/soundplus-backend/tags/

# Example: List recent tags
docker search YOUR_USERNAME/soundplus-backend
```

---

## Step 8: Troubleshooting

### Docker Permission Denied
**Error:** `permission denied while trying to connect to the Docker daemon`

**Fix:**
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Docker Hub Login Failed
**Error:** `Error response from daemon: invalid username/password`

**Fix:**
1. Verify credentials in Jenkins Credentials store
2. If using 2FA, generate a Personal Access Token instead of password
3. Update Jenkins credentials with the new token

### Containers Fail Health Check
**Error:** `Container failed health check`

**Fix:**
1. Check container logs: `docker-compose logs backend`
2. Ensure `.env` files exist and have correct values
3. Verify MongoDB connection string (if applicable)
4. Check port conflicts (run `netstat` to see bound ports)

### Git Branch Not Detected
**Error:** Pipeline always uses `docker-compose.dev.yml`

**Fix:**
1. Check `$GIT_BRANCH` environment variable: add `echo $GIT_BRANCH` to pipeline
2. Branch name might be `origin/main` vs `main` — pipeline handles both

---

## Step 9: Credentials Reference

### Required Credentials in Jenkins
| ID | Type | Value | Usage |
|----|------|-------|-------|
| `dockerhub-username` | Username | Your Docker Hub username | Image registry namespace |
| `dockerhub-password` | Secret | Docker Hub password/token | Authentication for push |

### How to Generate Docker Hub Token
1. Go to https://hub.docker.com/settings/security
2. Click **New Access Token**
3. Give it a name (e.g., "Jenkins Pipeline")
4. Copy the token (only shown once)
5. Use token as password in Jenkins credentials

---

## Step 10: Verify Everything Works

### Local Test (Before Jenkins)
```bash
# On your machine
cd "/mnt/d/Docker project/SoundPlus++"

# Test compose file
docker-compose -f docker-compose.yml config

# Build images locally
docker-compose -f docker-compose.yml build

# Start services
docker-compose -f docker-compose.yml up -d

# Verify
curl http://localhost:3000
curl http://localhost:5000/health
```

### Jenkins Test
1. Go to Jenkins → SoundPlus-CI-CD
2. Click **Build Now**
3. Wait for completion
4. Check **Console Output** for success message:
   ```
   ✓ Pipeline completed successfully!
   ```
5. Verify images on Docker Hub:
   ```
   https://hub.docker.com/r/YOUR_USERNAME/soundplus-backend
   https://hub.docker.com/r/YOUR_USERNAME/soundplus-frontend
   ```

---

## Common Commands

### View Pipeline Status
```bash
# Check Jenkins URL (running jobs)
curl http://localhost:8080/queue

# View specific job
curl http://localhost:8080/job/SoundPlus-CI-CD/lastBuild/api/json
```

### Restart Jenkins
```bash
sudo systemctl restart jenkins
```

### Check Docker Group
```bash
groups jenkins
```

### View Docker Images
```bash
docker images | grep soundplus
```

### Manually Push Images (if needed)
```bash
docker login -u YOUR_USERNAME
docker tag soundplus-backend:latest YOUR_USERNAME/soundplus-backend:latest
docker push YOUR_USERNAME/soundplus-backend:latest
```

---

## Next Steps

1. ✅ Complete Step 1: Add Jenkins to docker group
2. ✅ Complete Step 2: Create Docker Hub credentials
3. ✅ Create `docker-compose.dev.yml` (Step 4)
4. ✅ Run first pipeline (Step 6)
5. Monitor and debug as needed (Step 7-8)

---

## Support & Help

For issues, check:
1. Console Output in Jenkins UI
2. Docker logs: `docker-compose logs`
3. Jenkins logs: `/var/log/jenkins/jenkins.log`
4. GitHub Actions (for comparison if using)

---

**Created:** 2025-11-11
**Last Updated:** 2025-11-11
**Version:** 1.0
