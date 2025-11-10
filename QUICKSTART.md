# SoundPlus++ Quick Start Guide 🚀

Get your SoundPlus++ application running in 5 minutes!

## Prerequisites Check ✅

Before starting, verify you have:
- [ ] Docker Desktop installed and running
- [ ] Git installed (optional, for version control)
- [ ] 8GB RAM available
- [ ] 10GB free disk space

## Option 1: Docker (Recommended) 🐳

### Step 1: Navigate to Project
```bash
cd "D:\Docker project\SoundPlus++"
```

### Step 2: Start Application
```bash
docker-compose up --build
```

Wait for the build to complete (2-5 minutes first time).

### Step 3: Access Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000/health

### Step 4: Create Admin Account
1. Go to http://localhost:3000/register
2. Register with your details
3. Connect to MongoDB Atlas and update user role to 'admin'

### Step 5: Start Using!
- Browse products at http://localhost:3000/products
- Access admin panel at http://localhost:3000/admin (if admin)

## Option 2: Local Development 💻

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Start server
npm start
```

Backend runs on http://localhost:5000

### Frontend Setup (New Terminal)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Frontend runs on http://localhost:3000

## Common Commands 📝

### Docker Commands
```bash
# Start application
docker-compose up

# Start in background
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild everything
docker-compose up --build --force-recreate
```

### Check Status
```bash
# View running containers
docker ps

# Check container health
docker inspect <container_id>

# View logs
docker logs soundplus-backend
docker logs soundplus-frontend
```

## Troubleshooting 🔧

### Port Already in Use
```bash
# Windows: Find and kill process
netstat -ano | findstr :3000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac: Find and kill process
lsof -ti :3000 | xargs kill -9
lsof -ti :5000 | xargs kill -9
```

### Docker Not Starting
1. Ensure Docker Desktop is running
2. Restart Docker Desktop
3. Check Docker resources (increase RAM/CPU if needed)

### MongoDB Connection Error
1. Verify `.env` file has correct MongoDB URI
2. Check internet connection
3. Whitelist your IP in MongoDB Atlas

### Cannot Access Frontend
1. Clear browser cache
2. Try incognito mode
3. Check if port 3000 is free
4. Check Docker logs: `docker-compose logs frontend`

### Cannot Access Backend
1. Check if port 5000 is free
2. Verify MongoDB connection
3. Check Docker logs: `docker-compose logs backend`

## First-Time Setup Guide 📋

### 1. Create Test Products (Admin)

Once logged in as admin, add some test products:

```
Product 1:
- Name: Sony WH-1000XM5
- Brand: Sony
- Price: 399.99
- Category: headphones
- Connectivity: wireless
- Description: Premium noise-canceling headphones

Product 2:
- Name: Apple AirPods Pro
- Brand: Apple
- Price: 249.99
- Category: earbuds
- Connectivity: bluetooth
- Description: True wireless earbuds with ANC

Product 3:
- Name: Razer Kraken V3
- Brand: Razer
- Price: 129.99
- Category: gaming
- Connectivity: wired
- Description: Gaming headset with RGB
```

### 2. Test User Flow

1. **Register**: Create a user account
2. **Browse**: View products on homepage
3. **Filter**: Use category filters
4. **View Details**: Click on a product
5. **Add to Cart**: Add products to cart
6. **Checkout**: View cart and place order
7. **Track**: View your orders

### 3. Test Admin Flow

1. **Login as Admin**: Login with admin account
2. **Add Products**: Use admin dashboard to add products
3. **Upload Images**: Test image upload functionality
4. **Manage Products**: Edit and delete products
5. **View Orders**: Monitor all orders

## Environment Configuration 🔧

### Backend Environment (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://thiwankaofficial5400_db_user:AbSaPGrmL6tFbgKa@cluster0.wtz0zfg.mongodb.net/Sound_lk?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=Sound_lk
JWT_SECRET=soundplus_secret_key_2025
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment (.env)
```env
VITE_API_URL=http://localhost:5000
```

## Development Tips 💡

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes auto-refresh
- Backend: Uses nodemon for auto-restart

### Database Access
MongoDB Atlas Dashboard:
- Login at https://cloud.mongodb.com
- Navigate to Sound_lk database
- Use Collections tab to view/edit data

### API Testing
Test API endpoints using:
- Browser: http://localhost:5000/health
- Postman: Import endpoints
- cURL: Command line testing

### Debugging
```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# All logs
docker-compose logs -f
```

## Next Steps 🎯

After setup:

1. **Customize Theme**: Edit `frontend/src/index.css`
2. **Add Products**: Use admin dashboard
3. **Configure Email**: Set up email notifications
4. **Deploy**: Follow DOCKER_SETUP.md for deployment
5. **Backup**: Set up MongoDB backups

## Quick Reference 📚

| Component | URL | Port |
|-----------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend | http://localhost:5000 | 5000 |
| Health Check | http://localhost:5000/health | 5000 |
| MongoDB | Atlas Cloud | - |

## Support & Documentation 📖

- **Full Documentation**: [README.md](README.md)
- **Docker Setup**: [DOCKER_SETUP.md](DOCKER_SETUP.md)
- **Project Structure**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

## Success Checklist ✅

- [ ] Docker containers running
- [ ] Frontend accessible at :3000
- [ ] Backend health check passes
- [ ] MongoDB connection successful
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can view products
- [ ] Admin can add products
- [ ] Can add items to cart
- [ ] Can view orders

## Getting Help 🆘

If you encounter issues:

1. Check troubleshooting section above
2. Review logs: `docker-compose logs`
3. Verify environment variables
4. Check MongoDB connection
5. Restart Docker: `docker-compose restart`
6. Rebuild: `docker-compose up --build`

---

**Congratulations! 🎉** You're now ready to use SoundPlus++!
