# SoundPlus++ 🎧

Premium audio equipment e-commerce platform built with the MERN stack and Docker.

![SoundPlus++ Logo](https://via.placeholder.com/800x200/0A0A0A/FFD700?text=SoundPlus%2B%2B)

## 🌟 Features

- **Beautiful UI**: Modern design with yellow, tech blue, black, gray, and white color theme
- **Product Management**: Browse headphones, earbuds, and earphones
- **User Authentication**: Secure login and registration
- **Shopping Cart**: Add/remove items with quantity management
- **Order Management**: Track your orders
- **Admin Dashboard**: Manage products and inventory
- **Image Upload**: Product images stored with Multer
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Docker Support**: Full containerization with Docker Compose

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- React Icons
- React Toastify
- Swiper (for sliders)

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Multer (image upload)
- JWT (authentication)
- Bcrypt (password hashing)

### DevOps
- Docker
- Docker Compose
- GitHub Actions (CI/CD)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/) (v18 or higher) - Optional for local development
- [Git](https://git-scm.com/)

## 🚀 Quick Start with Docker

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd SoundPlus++
```

### 2. Start with Docker Compose

```bash
docker-compose up --build
```

This will:
- Build both frontend and backend images
- Start the MongoDB Atlas connection
- Launch the application

### 3. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

### 4. Stop the application

```bash
docker-compose down
```

To remove volumes as well:

```bash
docker-compose down --volumes
```

## 💻 Local Development (Without Docker)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your MongoDB credentials:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.wtz0zfg.mongodb.net/Sound_lk?retryWrites=true&w=majority
DB_NAME=Sound_lk
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

## 🗄️ MongoDB Atlas Setup

The application uses MongoDB Atlas cloud database:

- **Database Name**: Sound_lk
- **Collection Name**: Sound_lk
- **Connection String**: Already configured in the project

## 🔑 Default Admin Account

To create an admin account, register through the frontend and then manually update the user's role in the MongoDB database:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## 📁 Project Structure

```
SoundPlus++/
├── backend/
│   ├── index.js              # Main server file
│   ├── package.json          # Backend dependencies
│   ├── Dockerfile            # Backend Docker configuration
│   ├── .dockerignore         # Docker ignore file
│   ├── .env                  # Environment variables
│   └── uploads/              # Product images
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── App.jsx           # Main App component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   ├── Dockerfile            # Frontend Docker configuration
│   ├── .dockerignore         # Docker ignore file
│   ├── vite.config.js        # Vite configuration
│   └── index.html            # HTML template
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # This file
```

## 🐳 Docker Commands

### Build and start containers
```bash
docker-compose up --build
```

### Start containers (already built)
```bash
docker-compose up
```

### Start in detached mode
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### Stop containers
```bash
docker-compose down
```

### Remove all containers, networks, and volumes
```bash
docker-compose down --volumes --remove-orphans
```

### Rebuild a specific service
```bash
docker-compose build backend
docker-compose build frontend
```

## 🔄 CI/CD with GitHub Actions

The project includes a GitHub Actions workflow for automated deployment:

1. Push code to GitHub repository
2. GitHub Actions builds Docker images
3. Images are pushed to Docker Hub
4. Can be deployed to AWS EC2

See `.github/workflows/deploy.yml` for configuration.

## 🌐 API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `POST /add-product` - Add product (Admin)
- `PUT /update-product/:id` - Update product (Admin)
- `DELETE /delete-product/:id` - Delete product (Admin)

### Cart
- `GET /cart/:userId` - Get user cart
- `POST /add-to-cart` - Add to cart
- `PUT /cart/:userId/:productId` - Update cart item
- `DELETE /cart/:userId/:productId` - Remove from cart

### Orders
- `GET /orders/:userId` - Get user orders
- `POST /orders` - Create order
- `PUT /orders/:orderId` - Update order status (Admin)

## 🎨 Color Theme

- **Primary Yellow**: #FFD700
- **Tech Blue**: #00D4FF
- **Black**: #0A0A0A
- **Dark Gray**: #1A1A1A
- **Medium Gray**: #2A2A2A
- **Light Gray**: #B0B0B0
- **White**: #FFFFFF

## 📦 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
DB_NAME=Sound_lk
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- React Team for the amazing framework
- MongoDB for the database
- Docker for containerization
- All open-source contributors

---

**Note**: This is an educational project. For production use, ensure proper security measures, environment variable management, and error handling.
