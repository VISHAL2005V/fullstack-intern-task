# TemplateHub — Mini SaaS Template Store

> **Fullstack MERN Stack SaaS Template Store Application**

---

## 👤 Author & Contact Information

- **Name:** Vishal RS
- **Contact Number:** +91 8072439647
- **Email Address:** [rishivishal2005@gmail.com](mailto:rishivishal2005@gmail.com)
- **Role:** Fullstack Developer Intern Candidate

---

## 🛠️ Tech Stack Used

### Frontend
- **React.js 18** — Component-driven user interface built with Vite
- **JavaScript (ES6+)** — Modern asynchronous and modular logic
- **React Router DOM v6** — Single-page client-side routing & protected route guards
- **Tailwind CSS v3** — Utility-first modern responsive styling and design system
- **Axios** — Centralized HTTP client configured with request/response interceptors
- **React Context API** (`AuthContext`) — Global state management for user authentication & favorites
- **Lucide React** — Modern, accessible SVG iconography
- **React Hot Toast** — Elegant, interactive notifications and user feedback alerts

### Backend
- **Node.js 22 & Express.js 4** — Fast, decoupled RESTful API server
- **MongoDB & Mongoose 8** — Cloud-hosted NoSQL database on MongoDB Atlas
- **JSON Web Token (JWT)** — Stateless authentication and bearer token authorization
- **bcryptjs** — Secure password hashing using cryptographic salt rounds
- **cors** — Cross-Origin Resource Sharing middleware
- **dotenv** — Environment configuration isolation
- **express-validator** — Comprehensive request payload validation and sanitization

---

## 🚀 Setup Instructions (How to Run Backend & Frontend)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v22.x recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: MongoDB Atlas Cluster connection or local MongoDB instance

---

### 2. Environment Configuration

#### Backend Configuration (`server/.env`)
Ensure `server/.env` exists and contains your credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://rishivishal2005_db_user:Vishal123@cluster0.g6fhcvs.mongodb.net/
JWT_SECRET=templatehub_super_secure_jwt_secret_key_2026_vishal
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend Configuration (`client/.env`)
Ensure `client/.env` points to the backend server:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Dependency Installation

#### Install Backend Dependencies:
```bash
cd server
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../client
npm install
```

---

### 4. Database Seeding (Sample Templates)

Seed the database with 8 realistic, production-ready template records (idempotent, safe to re-run):
```bash
cd server
npm run seed
```

**Output:**
```
[Seed] Connecting to MongoDB...
[Seed] Connected successfully.
[Seed] Upserting 8 realistic template records...
  -> Seeded/Updated: "Creative Portfolio" (Portfolio)
  -> Seeded/Updated: "Modern Storefront" (E-commerce)
  -> Seeded/Updated: "Analytics Dashboard" (SaaS Dashboard)
  -> Seeded/Updated: "Product Launch" (Landing Page)
  -> Seeded/Updated: "Editorial Journal" (Blog)
  -> Seeded/Updated: "Restaurant Showcase" (Restaurant)
  -> Seeded/Updated: "Online Learning Platform" (Education)
  -> Seeded/Updated: "Digital Agency" (Agency)
[Seed] Successfully seeded 8 templates!
```

---

### 5. Running the Application

#### Option A: Running in Separate Terminals (Recommended)

**Terminal 1 (Backend Server):**
```bash
cd server
npm start
# or for live reloading with nodemon:
npm run dev
```
*Backend runs on:* `http://localhost:5000`

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

#### Option B: Running from Root Directory
```bash
npm run server    # Starts Express backend on port 5000
npm run client    # Starts Vite frontend on port 5173
```

---

### 6. Local Application URLs
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ✨ Main Features

- **User Authentication & Session Management**:
  - Secure registration and login with input validation (`express-validator`).
  - Passwords hashed using `bcryptjs` with salt rounds.
  - Stateless JSON Web Token (JWT) stored in `localStorage`.
  - Token verification route (`GET /api/auth/me`) ensuring persistent sessions across browser refreshes.
  - Seamless logout clearing client-side credentials.
- **Template Catalog & Discovery**:
  - Live search across template titles, tags, and descriptions.
  - Multi-category filtering (Portfolio, SaaS Dashboard, E-commerce, Landing Page, Blog, Restaurant, Education, Agency).
  - Sorting options: Newest First, Oldest First, Alphabetical (A-Z / Z-A), and Top Rated.
  - Responsive card grid with graceful fallback handling for image loading errors.
- **Personal Favorites Management**:
  - Authenticated users can bookmark/favorite templates.
  - Real-time MongoDB persistence using a dedicated `Favorite` model with a unique compound index `(user, template)`.
  - Prevents duplicate favoriting per user while allowing independent favoriting across users.
  - Instant UI synchronization between Navbar counter, Templates catalog, Template Details page, and Favorites list.
  - Optimistic UI updates with rollback handling on network errors.
- **Detailed Template Inspection**:
  - Deep-dive template view with feature checklists, pricing, tags, rating, and demo links.
  - Proper error and empty state handling for non-existent IDs.
- **Polished SaaS Design & Aesthetics**:
  - Modern typography using Google Font *Plus Jakarta Sans*.
  - Curated Slate/Indigo color palette with smooth micro-transitions and hover states.

---

## 📁 Project Structure

```
fullstack-intern-task/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── TemplateCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Favorites.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── TemplateDetails.jsx
│   │   │   └── Templates.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── favoriteService.js
│   │   │   └── templateService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── favoriteController.js
│   │   └── templateController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Favorite.js
│   │   ├── Template.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── favoriteRoutes.js
│   │   └── templateRoutes.js
│   ├── scripts/
│   │   └── seedTemplates.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── test-backend.js
├── package.json
└── README.md
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | Health check confirming API status |
| **POST** | `/api/auth/register` | Public | Register a new user (`name`, `email`, `password`) |
| **POST** | `/api/auth/login` | Public | Login with `email` and `password`, returns JWT |
| **GET** | `/api/auth/me` | Protected | Get authenticated user profile (via Bearer token) |
| **GET** | `/api/templates` | Public | List templates with `?search=`, `?category=`, `?sort=` |
| **GET** | `/api/templates/:id` | Public | Retrieve detailed template by MongoDB ObjectId |
| **GET** | `/api/favorites` | Protected | Fetch current user's populated favorites list |
| **GET** | `/api/favorites/ids`| Protected | Fetch array of favorite template IDs for fast lookup |
| **POST** | `/api/favorites/:templateId` | Protected | Add template to user's favorites |
| **DELETE**| `/api/favorites/:templateId` | Protected | Remove template from user's favorites |

---

## 🧪 Testing & Verification

An automated verification test script `test-backend.js` is included in the project root. It verifies 20 distinct assertions across registration, login, token authentication, template discovery, filtering, search, and user-isolated favorites.

Run the test suite:
```bash
node test-backend.js
```

**Expected Result:**
```
================================
SUMMARY: 20 PASSED, 0 FAILED
================================
```

---

## 🛡️ Security & Architecture Notes

- **Password Hashing**: Salted hashes generated via `bcryptjs` (cost factor 10).
- **Stateless Tokens**: Signed with `jsonwebtoken` and verified via express middleware.
- **Input Sanitization**: Request bodies validated with `express-validator` to prevent injection.
- **Duplicate Prevention**: Compound unique MongoDB index `{ user: 1, template: 1 }` prevents duplicate favorites.
- **CORS Configuration**: Restricted to allowed frontend origins specified in `.env`.

---

## 🛠️ Troubleshooting

1. **MongoDB Connection Fails:**
   - Verify that your IP address is whitelisted in MongoDB Atlas Network Access (`0.0.0.0/0` for development).
   - Ensure the `MONGODB_URI` in `server/.env` is formatted properly.
2. **Port 5000 Already In Use:**
   - Change `PORT=5001` in `server/.env` and update `VITE_API_URL=http://localhost:5001/api` in `client/.env`.
3. **CORS Errors:**
   - Ensure `CLIENT_URL=http://localhost:5173` matches the port where Vite is running.
