# SoundPlus++ Project Structure

## Complete File Tree

```
SoundPlus++/
│
├── .github/
│   └── workflows/
│       └── deploy.yml                 # GitHub Actions CI/CD workflow
│
├── backend/
│   ├── uploads/                       # Product images directory
│   │   └── .gitkeep
│   ├── .dockerignore                  # Docker ignore file
│   ├── .env                           # Environment variables (DO NOT COMMIT)
│   ├── .env.example                   # Example environment file
│   ├── Dockerfile                     # Backend Docker configuration
│   ├── index.js                       # Main server file
│   ├── package.json                   # Backend dependencies
│   └── package-lock.json              # Locked dependencies
│
├── frontend/
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── components/                # React components
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.css
│   │   │   ├── Hero.jsx
│   │   │   ├── Hero.css
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductCard.css
│   │   │
│   │   ├── pages/                     # Page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   ├── Login.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Products.css
│   │   │   └── Register.jsx
│   │   │
│   │   ├── App.jsx                    # Main App component
│   │   ├── App.css                    # App-specific styles
│   │   ├── index.css                  # Global styles with theme
│   │   └── main.jsx                   # Entry point
│   │
│   ├── .dockerignore                  # Docker ignore file
│   ├── .env                           # Environment variables
│   ├── .env.example                   # Example environment file
│   ├── .gitignore                     # Git ignore file
│   ├── Dockerfile                     # Frontend Docker configuration
│   ├── eslint.config.js               # ESLint configuration
│   ├── index.html                     # HTML template
│   ├── package.json                   # Frontend dependencies
│   ├── package-lock.json              # Locked dependencies
│   └── vite.config.js                 # Vite configuration
│
├── .gitignore                         # Root Git ignore file
├── docker-compose.yml                 # Docker Compose configuration
├── DOCKER_SETUP.md                    # Docker setup guide
├── PROJECT_STRUCTURE.md               # This file
└── README.md                          # Main documentation

```

## Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **UI Icons**: React Icons
- **Notifications**: React Toastify
- **Slider**: Swiper

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT + Bcrypt
- **File Upload**: Multer
- **Environment**: dotenv
- **Security**: CORS, Cookie Parser

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Registry**: Docker Hub
- **Deployment**: AWS EC2

## Key Features by Component

### Backend (index.js)
- MongoDB connection with Mongoose
- User authentication (register, login, logout)
- Product CRUD operations
- Shopping cart management
- Order processing
- Image upload with Multer
- JWT middleware for protected routes
- Admin role-based access control

### Frontend Components

#### Navbar
- Responsive navigation
- User authentication state
- Shopping cart indicator
- Mobile menu
- Search functionality
- User dropdown menu

#### Hero
- Image slider with auto-play
- Navigation controls
- Category-based CTAs
- Responsive design
- Beautiful animations

#### ProductCard
- Product image display
- Price with discount
- Rating system
- Add to cart button
- Category badges
- Hover effects

#### Footer
- Company information
- Quick links
- Social media links
- Contact information
- Responsive layout

### Frontend Pages

#### Home
- Hero slider
- Featured products
- Category showcase
- Features section
- Call-to-action
- Responsive grid layout

#### Products
- Product listing
- Category filtering
- Search functionality
- Responsive grid
- Loading states

#### ProductDetail
- Full product information
- Image display
- Add to cart
- Product specifications
- Responsive layout

#### Cart
- Cart items list
- Quantity management
- Total calculation
- Remove items
- Checkout button

#### Orders
- Order history
- Order status
- Order details
- Responsive cards

#### AdminDashboard
- Product management
- Add new products
- Edit products
- Delete products
- Image upload
- Admin-only access

#### Login/Register
- User authentication
- Form validation
- Error handling
- Beautiful design
- Responsive forms

## Color Theme

```css
/* Primary Colors */
--primary-yellow: #FFD700;
--secondary-yellow: #FFC700;
--tech-blue: #00D4FF;
--dark-blue: #0099CC;

/* Neutral Colors */
--black: #0A0A0A;
--dark-gray: #1A1A1A;
--medium-gray: #2A2A2A;
--light-gray: #B0B0B0;
--white: #FFFFFF;
--off-white: #F5F5F5;
```

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout

### Products
- `GET /products` - Get all products (with filters)
- `GET /products/:id` - Get single product
- `POST /add-product` - Add product (Admin)
- `PUT /update-product/:id` - Update product (Admin)
- `DELETE /delete-product/:id` - Delete product (Admin)

### Cart
- `GET /cart/:userId` - Get user cart
- `POST /add-to-cart` - Add item to cart
- `PUT /cart/:userId/:productId` - Update cart item
- `DELETE /cart/:userId/:productId` - Remove from cart
- `DELETE /cart/:userId` - Clear cart

### Orders
- `GET /orders/:userId` - Get user orders
- `GET /orders` - Get all orders (Admin)
- `POST /orders` - Create new order
- `PUT /orders/:orderId` - Update order status (Admin)

### Health
- `GET /health` - Health check endpoint

## Database Schema

### User
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date
}
```

### Product
```javascript
{
  name: String (required),
  image: String (required),
  price: Number (required),
  description: String (required),
  category: String (required),
  available: Number,
  discount: String,
  brand: String (required),
  model: String (required),
  connectivity: String (required),
  features: [String],
  color: String,
  batteryLife: String,
  noiseCancellation: Boolean,
  microphone: Boolean,
  rating: Number,
  reviews: Number,
  createdAt: Date
}
```

### Cart
```javascript
{
  userId: ObjectId (ref: User),
  productId: ObjectId (ref: Product),
  quantity: Number,
  createdAt: Date
}
```

### Order
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String
  },
  createdAt: Date
}
```

## Docker Configuration

### Backend Dockerfile
- Base: node:18-alpine
- Working Directory: /usr/src/app
- Port: 5000
- Health Check: Yes

### Frontend Dockerfile
- Base: node:18-alpine
- Working Directory: /usr/app
- Port: 3000
- Health Check: Yes

### Docker Compose
- **Services**: backend, frontend
- **Networks**: soundplus-network (bridge)
- **Volumes**: uploads
- **Health Checks**: Configured for both services

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=<connection_string>
DB_NAME=Sound_lk
JWT_SECRET=<secret_key>
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Development Workflow

1. **Local Development**
   ```bash
   # Backend
   cd backend && npm install && npm start

   # Frontend
   cd frontend && npm install && npm run dev
   ```

2. **Docker Development**
   ```bash
   docker-compose up --build
   ```

3. **Git Workflow**
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```

4. **Automated Deployment**
   - Push triggers GitHub Actions
   - Builds Docker images
   - Pushes to Docker Hub
   - Deploys to AWS EC2

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- CORS configuration
- Input validation
- MongoDB injection protection
- File type validation for uploads
- Role-based access control

## Performance Optimizations

- Image lazy loading
- Code splitting with Vite
- Gzip compression
- Docker layer caching
- MongoDB indexing
- React memo optimization
- CSS minification
- Tree shaking

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search and filters
- [ ] Product recommendations
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] PWA support
- [ ] Real-time chat support

---

For setup instructions, see [README.md](README.md)
For Docker deployment, see [DOCKER_SETUP.md](DOCKER_SETUP.md)
