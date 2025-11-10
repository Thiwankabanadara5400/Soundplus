# Docker & Deployment Setup Guide for SoundPlus++

Complete guide for containerizing and deploying the SoundPlus++ application.

## Table of Contents
- [Docker Installation](#docker-installation)
- [Running with Docker Compose](#running-with-docker-compose)
- [Docker Commands Reference](#docker-commands-reference)
- [GitHub Setup](#github-setup)
- [Docker Hub Setup](#docker-hub-setup)
- [AWS EC2 Deployment](#aws-ec2-deployment)
- [Troubleshooting](#troubleshooting)

## Docker Installation

### Windows (WSL2)

1. **Uninstall conflicting packages** (if any):
```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

2. **Install Docker**:
```bash
# Add Docker's official GPG key
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
```

3. **Install Docker packages**:
```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

4. **Verify installation**:
```bash
sudo docker run hello-world
```

5. **Add user to docker group** (to run without sudo):
```bash
sudo usermod -aG docker $USER
newgrp docker
```

## Running with Docker Compose

### First Time Setup

1. **Navigate to project directory**:
```bash
cd "D:\Docker project\SoundPlus++"
```

2. **Build and start all services**:
```bash
docker-compose up --build
```

This will:
- Build backend and frontend images
- Create containers for both services
- Connect to MongoDB Atlas
- Start the application

### Subsequent Runs

```bash
# Start services
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down --volumes
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Docker Commands Reference

### Container Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# View container logs
docker logs <container_id>

# Follow container logs
docker logs -f <container_id>

# Execute command in running container
docker exec -it <container_id> /bin/sh
```

### Image Management

```bash
# List images
docker images

# Remove an image
docker rmi <image_id>

# Remove unused images
docker image prune

# Build an image
docker build -t image_name:tag .
```

### Docker Compose Commands

```bash
# Build services
docker-compose build

# Build specific service
docker-compose build backend

# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Rebuild and start
docker-compose up --build

# Remove everything
docker-compose down --volumes --remove-orphans
```

## GitHub Setup

### 1. Create GitHub Repository

```bash
# Initialize git
git init

# Add remote
git remote add origin https://github.com/yourusername/soundplus.git

# Add files
git add .

# Commit
git commit -m "Initial commit: SoundPlus++ MERN Stack Application"

# Push to GitHub
git push -u origin main
```

### 2. Configure GitHub Secrets

Go to **Repository → Settings → Secrets and variables → Actions** and add:

- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password/access token
- `AWS_ACCESS_KEY_ID`: AWS access key (for EC2 deployment)
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region (e.g., us-east-1)
- `EC2_SSH_PRIVATE_KEY`: SSH private key for EC2
- `EC2_HOST`: EC2 instance public IP
- `EC2_USER`: EC2 username (usually ubuntu or ec2-user)

## Docker Hub Setup

### 1. Create Docker Hub Account
Sign up at https://hub.docker.com

### 2. Create Repositories
- Create `soundplus-backend` repository
- Create `soundplus-frontend` repository

### 3. Login to Docker Hub
```bash
docker login
```

### 4. Tag and Push Images
```bash
# Tag images
docker tag soundplus-backend:latest yourusername/soundplus-backend:latest
docker tag soundplus-frontend:latest yourusername/soundplus-frontend:latest

# Push to Docker Hub
docker push yourusername/soundplus-backend:latest
docker push yourusername/soundplus-frontend:latest
```

## AWS EC2 Deployment

### 1. Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose Ubuntu Server 22.04 LTS
3. Instance type: t2.medium or higher
4. Configure security group:
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80) from anywhere
   - Allow HTTPS (port 443) from anywhere
   - Allow Custom TCP (port 3000) from anywhere
   - Allow Custom TCP (port 5000) from anywhere

### 2. Connect to EC2

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### 3. Install Docker on EC2

```bash
# Update packages
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Clone and Run Application

```bash
# Clone repository
git clone https://github.com/yourusername/soundplus.git
cd soundplus

# Pull images from Docker Hub
docker-compose pull

# Start application
docker-compose up -d
```

### 5. Configure Nginx (Optional)

```bash
# Install Nginx
sudo apt-get install nginx

# Configure reverse proxy
sudo nano /etc/nginx/sites-available/soundplus
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/soundplus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## CI/CD Pipeline Flow

```
┌────────────┐      git push        ┌─────────────┐     build + push      ┌────────────┐
│ Developer   │ ───────────────────► │   GitHub    │ ────────────────────► │ Docker Hub │
└────────────┘                       │  CI / CD    │                      └────────────┘
         ▲                            └─────▲──────┘                             │
         │ terraform apply                  │ deploy Docker image                │ pull image
         │                            ┌─────┴──────┐                             ▼
   ┌───────────────┐                  │   AWS EC2  │  ◄──────────────┐   ┌───────────────┐
   │ Terraform     │                  │ (container) │                 │   │ End User      │
   └───────────────┘                  └─────────────┘                 │   └───────────────┘
```

## Troubleshooting

### Issue: Port already in use

```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### Issue: Docker permission denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Issue: Container keeps restarting

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check health
docker ps
```

### Issue: MongoDB connection error

1. Verify MongoDB Atlas credentials in `.env`
2. Whitelist IP address in MongoDB Atlas
3. Check network connectivity

### Issue: Cannot access application

1. Verify containers are running: `docker ps`
2. Check container logs: `docker-compose logs`
3. Verify ports are exposed correctly
4. Check firewall settings

## Monitoring

### View Container Stats
```bash
docker stats
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Check
```bash
curl http://localhost:5000/health
```

## Backup and Restore

### Backup MongoDB Data
```bash
# Using MongoDB Atlas, backups are automatic
# For local MongoDB:
docker exec <mongo_container> mongodump --out /backup
docker cp <mongo_container>:/backup ./backup
```

### Backup Uploaded Images
```bash
docker cp <backend_container>:/usr/src/app/uploads ./uploads_backup
```

## Production Considerations

1. **Use environment variables**: Never commit `.env` files
2. **Enable HTTPS**: Use Let's Encrypt with Nginx
3. **Set up monitoring**: Use tools like Prometheus, Grafana
4. **Regular backups**: Automate MongoDB and file backups
5. **Update regularly**: Keep Docker images and dependencies updated
6. **Security**: Use Docker secrets, scan images for vulnerabilities
7. **Scaling**: Use Docker Swarm or Kubernetes for scaling

---

For more information, refer to the main [README.md](README.md)
