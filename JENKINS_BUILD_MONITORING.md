# Jenkins Build Monitoring Guide

## ✅ Code Pushed Successfully!

Your code has been pushed to GitHub main branch. Jenkins will automatically trigger within 1-2 minutes.

**Commit Hash:** `443728d`  
**Timestamp:** November 12, 2025  
**Branch:** `main`

---

## 🔍 How to Monitor the Build

### **Option 1: Jenkins Web UI (If Running Locally)**

1. Open your browser and go to:
   ```
   http://localhost:8080
   ```
   *(Or ask your Jenkins admin for the URL)*

2. Look for the **"SoundPlus CI-CD"** project

3. Click on the job to see:
   - Build history
   - Current build status
   - Console output in real-time

4. Watch for these stages to complete:
   - ✅ Checkout
   - ✅ Pre-flight Check
   - ✅ Setup Environment
   - ✅ Build Images
   - ✅ Start Services
   - ✅ Verify Services
   - ✅ Run Tests
   - ✅ Push to Docker Hub
   - ✅ Deploy

---

## 📊 What to Expect

### **Successful Build (Green)**
```
✓ All 9 stages complete
✓ Status: SUCCESS
✓ Build took: ~5-10 minutes
✓ Images pushed to Docker Hub
```

### **Failed Build (Red)**
```
✗ One or more stages failed
✗ Status: FAILURE
✗ Check console output for error details
```

---

## 🐳 Verify Docker Hub Upload

After successful build, check Docker Hub:

1. Go to: https://hub.docker.com/r/thiwanka14535

2. You should see:
   - **soundplus-backend** repository
   - **soundplus-frontend** repository
   - Both with `latest` tag
   - Build timestamp matching Jenkins job

3. Pull commands available:
   ```bash
   docker pull thiwanka14535/soundplus-backend:latest
   docker pull thiwanka14535/soundplus-frontend:latest
   ```

---

## 🚨 Troubleshooting Build Failures

### **Common Issues & Solutions**

#### 1. **"Docker Hub credentials not found"**
- **Cause:** Credentials not configured in Jenkins
- **Fix:** Check Jenkins → Manage Credentials → Add dockerhub credential

#### 2. **"Failed to build image"**
- **Cause:** npm install failed, missing files, or bad Dockerfile
- **Fix:** Check console output → look for npm errors → fix locally → push new commit

#### 3. **"Services failed to start"**
- **Cause:** Port conflicts, missing .env, or container issues
- **Fix:** Check docker-compose.yml → verify ports are available → check service logs

#### 4. **"Health check failed"**
- **Cause:** Service not responding to health checks in time
- **Fix:** Already simplified in this pipeline - shouldn't happen

---

## 📋 Jenkins Stages Explained

### **Stage 1: Checkout**
- Clones your GitHub repository
- Expected time: 10-30 seconds

### **Stage 2: Pre-flight Check**
- Validates Docker installation
- Checks system resources
- Lists existing containers
- Expected time: 5-10 seconds

### **Stage 3: Setup Environment**
- Creates .env files with configuration
- Sets up database connection strings
- Expected time: 5-10 seconds

### **Stage 4: Build Images**
- Runs: `docker-compose build`
- Builds backend image (Node.js + dependencies)
- Builds frontend image (Vite + assets)
- Expected time: 3-5 minutes ⏱️ (longest stage)

### **Stage 5: Start Services**
- Runs: `docker-compose up -d`
- Starts backend on port 5000
- Starts frontend on port 3000
- Waits 30 seconds for stabilization
- Expected time: 45 seconds

### **Stage 6: Verify Services**
- Tests backend health endpoint: `GET /health`
- Tests frontend availability
- Checks container logs
- Expected time: 10-20 seconds

### **Stage 7: Run Tests**
- Placeholder stage (can add unit tests here)
- Expected time: 5 seconds

### **Stage 8: Push to Docker Hub**
- Authenticates with Docker Hub
- Pushes `soundplus-backend` image
- Pushes `soundplus-frontend` image
- Tags with build number and commit hash
- Expected time: 30-60 seconds 🚀

### **Stage 9: Deploy**
- Confirmation stage
- Shows deployment completion
- Expected time: 5 seconds

---

## 📱 Real-Time Monitoring Commands

If you have Jenkins CLI access, monitor builds with:

```bash
# Watch build progress
curl -s http://localhost:8080/job/SoundPlus\ CI-CD/lastBuild/api/json | jq '.result'

# Get console output
curl -s http://localhost:8080/job/SoundPlus\ CI-CD/lastBuild/consoleText
```

---

## ✨ Success Checklist

After build completes, verify:

- [ ] Jenkins job shows **BLUE checkmark** (success)
- [ ] All 9 stages show ✓ in console
- [ ] **Build took 5-10 minutes** (approximately)
- [ ] Docker Hub shows new images
- [ ] Images have `latest` tag
- [ ] Images have build number tag (e.g., `15-443728d`)

---

## 🎯 Next Steps After Successful Build

1. **Pull images locally:**
   ```bash
   docker pull thiwanka14535/soundplus-backend:latest
   docker pull thiwanka14535/soundplus-frontend:latest
   ```

2. **Run production version:**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Access your application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

4. **Deploy to cloud** (optional):
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

---

## 📞 Need Help?

If the build fails:

1. **Check Jenkins console output** for specific error
2. **Review the error message** in the failed stage
3. **Fix locally** (update files, test, commit)
4. **Push to GitHub** again
5. **Jenkins will automatically trigger** new build

**Common fix workflow:**
```bash
# Local testing
docker build -t soundplus-backend ./backend
docker build -t soundplus-frontend ./frontend
docker-compose up -d

# If works, push to trigger Jenkins
git add .
git commit -m "Fix: [describe fix]"
git push origin main
```

---

**Generated:** November 12, 2025  
**Project:** SoundPlus++ CI/CD Pipeline  
**Status:** ✅ Waiting for automatic Jenkins trigger
