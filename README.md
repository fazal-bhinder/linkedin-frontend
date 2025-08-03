# LinkedIn-like Community Platform

A modern, responsive community platform built with Next.js, Node.js, and PostgreSQL. Features user authentication, public post feeds, profile pages, and stunning UI with animations.

## 🚀 Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Prisma** - Database ORM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

### Database

- **PostgreSQL** - Primary database
- **Prisma** - Database client and migrations

## ✨ Features

- 🔐 **User Authentication**

  - Register/Login with email & password
  - JWT-based authentication
  - Protected routes

- 👤 **User Profiles**

  - Customizable profile with name, email, bio
  - Profile picture support
  - View other users' profiles

- 📝 **Public Post Feed**

  - Create, read, and display text posts
  - Home feed with author info and timestamps
  - Like and comment functionality
  - Real-time updates

- 🎨 **Stunning UI/UX**
  - Responsive design for all devices
  - Smooth animations with Framer Motion
  - Modern, clean interface
  - Dark/Light mode support

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb linkedin_community

# Run database migrations
cd backend
npx prisma migrate dev
npx prisma generate
```

### 3. Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env)**

```env
DATABASE_URL="postgresql://username:password@localhost:5432/linkedin_community"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run the Application

```bash
# Start backend server
cd backend
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 👥 Demo Users

You can use these demo accounts to test the application:

**Admin User:**

- Email: `admin@demo.com`
- Password: `admin123`

**Regular User:**

- Email: `user@demo.com`
- Password: `user123`

## 🎯 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user profile

## 🎨 UI Components

The application uses Shadcn/ui components for a consistent and beautiful design:

- Cards, buttons, inputs, and forms
- Responsive navigation
- Toast notifications
- Loading states and skeletons
- Modal dialogs

## 🎭 Animations

Framer Motion is used throughout the application for:

- Page transitions
- Component mounting/unmounting
- Hover effects
- Loading animations
- Smooth scrolling

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔧 Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

MIT License - feel free to use this project for your own purposes!
