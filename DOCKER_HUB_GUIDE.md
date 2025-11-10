# Docker Hub Deployment Guide - SoundPlus++

Complete guide to push your SoundPlus++ application to Docker Hub.

## 📚 What is Docker Hub?

**Docker Hub** = **GitHub for Docker Images**

- GitHub stores **source code**
- Docker Hub stores **ready-to-run applications** (Docker images)

## 🎯 Benefits

✅ Share your app with anyone
✅ Deploy to any server instantly
✅ Automatic builds from GitHub
✅ Version control for Docker images
✅ Free hosting for public images

---

## 🚀 Quick Start (3 Steps)

### Step 1: Sign Up to Docker Hub

1. Visit: https://hub.docker.com/signup
2. Create free account
3. Remember your username (example: `thiwankabanadara`)

### Step 2: Login from WSL

```bash
docker login
```

Enter your Docker Hub username and password.

### Step 3: Run the Push Script

```bash
cd "/mnt/d/Docker project/SoundPlus++"

# Make script executable
chmod +x docker-push.sh

# Run it (replace with YOUR Docker Hub username)
./docker-push.sh YOUR_DOCKERHUB_USERNAME
```

**Example:**
```bash
./docker-push.sh thiwankabanadara
```

That's it! Your app is now on Docker Hub! 🎉

---

## 📖 Detailed Step-by-Step

### 1. Sign Up & Login

**Sign up:**
- Go to https://hub.docker.com/signup
- Fill in details
- Verify email

**Login from terminal:**
```bash
docker login
# Username: your_username
# Password: your_password
```

### 2. Build Your Images

```bash
cd "/mnt/d/Docker project/SoundPlus++"
docker-compose build
```

### 3. Tag Your Images

**Format:** `username/image-name:version`

```bash
# Replace YOUR_USERNAME with your Docker Hub username
docker tag soundplus-backend YOUR_USERNAME/soundplus-backend:latest
docker tag soundplus-frontend YOUR_USERNAME/soundplus-frontend:latest
```

**Example:**
```bash
docker tag soundplus-backend thiwankabanadara/soundplus-backend:latest
docker tag soundplus-frontend thiwankabanadara/soundplus-frontend:latest
```

### 4. Push to Docker Hub

```bash
docker push YOUR_USERNAME/soundplus-backend:latest
docker push YOUR_USERNAME/soundplus-frontend:latest
```

### 5. Verify on Docker Hub

1. Go to https://hub.docker.com
2. Login
3. Click **Repositories**
4. You should see:
   - `soundplus-backend`
   - `soundplus-frontend`

---

## 🔄 Automatic Builds from GitHub

### Connect GitHub to Docker Hub

1. **Push code to GitHub:**
   ```bash
   cd "/mnt/d/Docker project/SoundPlus++"
   git init
   git add .
   git commit -m "SoundPlus++ Docker setup"
   git remote add origin https://github.com/YOUR_USERNAME/soundplus.git
   git push -u origin main
   ```

2. **Create Docker Hub Repository:**
   - Go to Docker Hub
   - Click **Create Repository**
   - Name: `soundplus-backend`
   - Visibility: Public
   - Click **Create**

3. **Link GitHub (Optional - Automated Builds):**
   - Click repository → **Builds** tab
   - Click **Link to GitHub**
   - Select your repository
   - Configure build rules
   - Save

Now every GitHub push triggers automatic Docker Hub builds!

---

## 🌐 How Others Use Your Images

Once pushed, anyone can run your app with:

```bash
# Pull images
docker pull YOUR_USERNAME/soundplus-backend:latest
docker pull YOUR_USERNAME/soundplus-frontend:latest

# Run backend
docker run -d -p 5000:5000 \
  -e MONGODB_URI="your_mongo_uri" \
  YOUR_USERNAME/soundplus-backend:latest

# Run frontend
docker run -d -p 3000:3000 \
  -e VITE_API_URL="http://localhost:5000" \
  YOUR_USERNAME/soundplus-frontend:latest
```

Or with docker-compose:

```yaml
version: '3.8'
services:
  backend:
    image: YOUR_USERNAME/soundplus-backend:latest
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}

  frontend:
    image: YOUR_USERNAME/soundplus-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000
```

---

## 📊 Image Versions/Tags

You can push different versions:

```bash
# Latest version
docker tag soundplus-backend YOUR_USERNAME/soundplus-backend:latest

# Specific version
docker tag soundplus-backend YOUR_USERNAME/soundplus-backend:v1.0.0
docker tag soundplus-backend YOUR_USERNAME/soundplus-backend:v1.0.1

# Push all versions
docker push YOUR_USERNAME/soundplus-backend:latest
docker push YOUR_USERNAME/soundplus-backend:v1.0.0
```

---

## 🔒 Private vs Public Repositories

**Public (Free):**
- ✅ Anyone can pull your images
- ✅ Good for open-source projects
- ✅ Unlimited pulls

**Private (Free for 1 repo):**
- ✅ Only you can access
- ✅ Good for commercial projects
- ✅ Requires authentication to pull

To make repository private:
1. Go to Docker Hub → Repository
2. Click **Settings**
3. Change **Visibility** to **Private**

---

## 🛠️ Common Commands

```bash
# Login
docker login

# Logout
docker logout

# List local images
docker images

# Remove local image
docker rmi YOUR_USERNAME/soundplus-backend:latest

# Pull image from Docker Hub
docker pull YOUR_USERNAME/soundplus-backend:latest

# Search for images
docker search soundplus

# View image details on Docker Hub
# https://hub.docker.com/r/YOUR_USERNAME/soundplus-backend
```

---

## 📝 Update docker-compose.yml to Use Docker Hub Images

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: YOUR_USERNAME/soundplus-backend:latest
    container_name: soundplus-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    networks:
      - soundplus-network

  frontend:
    image: YOUR_USERNAME/soundplus-frontend:latest
    container_name: soundplus-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000
    depends_on:
      - backend
    networks:
      - soundplus-network

networks:
  soundplus-network:
    driver: bridge
```

Run with:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🎯 Complete Workflow

```
1. Code Changes
   ↓
2. Build Locally (docker-compose build)
   ↓
3. Test Locally (docker-compose up)
   ↓
4. Tag Images (docker tag)
   ↓
5. Push to Docker Hub (docker push)
   ↓
6. Deploy Anywhere (docker pull + docker run)
```

---

## 🚨 Troubleshooting

### "denied: requested access to the resource is denied"
- Make sure you're logged in: `docker login`
- Check image name includes your username

### "unauthorized: authentication required"
- Login again: `docker login`
- Check credentials

### "push access denied"
- Repository doesn't exist on Docker Hub
- Create repository first on Docker Hub website

---

## 📚 Additional Resources

- Docker Hub: https://hub.docker.com
- Docker Documentation: https://docs.docker.com
- Your SoundPlus++ Images: https://hub.docker.com/u/YOUR_USERNAME

---

**🎉 Congratulations! Your app is now on Docker Hub!**
