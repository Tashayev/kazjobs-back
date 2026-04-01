# KazJobs API

RESTful backend for [KazJobs](https://kazjobs-front.vercel.app) — a job board platform built for Kazakhstan.

[![Live API](https://img.shields.io/badge/API-Live-green)](https://kazjobs-back-production.up.railway.app)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black)](https://kazjobs-front.vercel.app)

---

## Tech Stack

| | |
|--|--|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT — access + refresh tokens with rotation |
| Password Hashing | bcrypt |
| Deployment | Railway |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Tashayev/kazjobs-back.git
cd kazjobs-back
npm install
```

### 2. Environment variables

Create a `.env` file in the root:

```env
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/kazjobs?retryWrites=true&w=majority
ACCESS_TOKEN=your_access_token_secret_min_32_chars
REFRESH_TOKEN=your_refresh_token_secret_min_32_chars
CLIENT_URL=http://localhost:3000
```

> For production set `CLIENT_URL` to your deployed frontend URL.

### 3. Run

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:4000`

---

## MongoDB Atlas Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user under **Database Access**
3. Go to **Network Access** → Add IP Address → Allow from Anywhere (`0.0.0.0/0`) for Railway deployment
4. Get your connection string under **Connect** → **Compass** or **Drivers**
5. Replace `<user>` and `<password>` in `MONGODB_URI`

---

## Project Structure

```
src/
├── app.js                    — Express app, CORS, middleware
├── server.js                 — Entry point, DB connection
├── config/
│   └── database.js           — MongoDB connection
├── controllers/
│   ├── user.controller.js
│   ├── job.controller.js
│   └── application.controller.js
├── services/
│   ├── auth.service.js
│   ├── job.service.js
│   ├── application.service.js
│   └── token.service.js
├── routes/
│   ├── user.route.js
│   ├── job.routes.js
│   └── application.routes.js
├── middlewares/
│   ├── auth.middleware.js    — JWT verification
│   └── role.middleware.js    — Role based access
└── models/
    ├── user.module.js
    ├── job.module.js
    └── application.module.js
```

---

## API Reference

**Base URL (production):** `https://kazjobs-back-production.up.railway.app/api/v1`  
**Base URL (local):** `http://localhost:4000/api/v1`

Protected routes require:
```
Authorization: Bearer <accessToken>
```

---

### Users

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/users/register` | — | — | Register new account |
| POST | `/users/login` | — | — | Login |
| POST | `/users/logout` | — | — | Logout (clears refresh token) |
| POST | `/users/refresh` | — | — | Get new access token |
| GET | `/users/profile` | ✅ | Any | Get own profile |
| PATCH | `/users/profile` | ✅ | Any | Update username |
| POST | `/users/change-password` | ✅ | Any | Change password |
| GET | `/users` | — | — | Get all users (optional ?role=seeker\|employer) |

**Register body:**
```json
{
  "username": "john",
  "email": "john@email.com",
  "password": "123456",
  "role": "seeker"
}
```

**Login body:**
```json
{
  "email": "john@email.com",
  "password": "123456"
}
```

**Login / Register response:**
```json
{
  "user": { "id": "...", "username": "john", "email": "john@email.com", "role": "seeker" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

---

### Jobs

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/jobs` | — | — | Get all jobs |
| GET | `/jobs/:id` | — | — | Get single job |
| GET | `/jobs/employer` | ✅ | Employer | Get own posted jobs |
| POST | `/jobs` | ✅ | Employer | Create job |
| PATCH | `/jobs/:id` | ✅ | Employer | Update job |
| DELETE | `/jobs/:id` | ✅ | Employer | Delete job |

**GET /jobs query params:**
```
?type=full-time|part-time|remote
?category=it-technology|finance|...
?location=Almaty
```

**Create job body:**
```json
{
  "title": "Backend Developer",
  "description": "We are looking for...",
  "location": "Almaty",
  "salary": 500000,
  "type": "full-time",
  "category": "it-technology",
  "skills": ["Node.js", "MongoDB"],
  "deadline": "2026-06-01"
}
```

**Job categories:**
`it-technology` · `sales-business-development` · `marketing-pr` · `healthcare-pharma` · `engineering-manufacturing` · `education-science` · `retail-ecommerce` · `accounting-finance` · `legal` · `logistics-transportation` · `construction-real-estate` · `administrative-staff` · `hospitality-tourism` · `design-creative` · `security` · `skilled-labor`

---

### Applications

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/applications` | ✅ | Seeker | Apply to a job |
| GET | `/applications` | ✅ | Seeker | My applications |
| GET | `/applications/:id` | ✅ | Any | Single application |
| PATCH | `/applications/:id` | ✅ | Employer | Update status |
| DELETE | `/applications/:id` | ✅ | Any | Delete application |
| GET | `/applications/job/:id` | ✅ | Employer | All applicants for a job |

**Apply body:**
```json
{
  "job": "jobId",
  "CV": "https://your-cv-url.com"
}
```

**Update status body:**
```json
{
  "status": "accepted"
}
```

Status values: `pending` · `accepted` · `rejected`

---

## Auth Flow

```
1. POST /users/register or /users/login
   → returns accessToken (1h) + refreshToken (7d)

2. Store both tokens client side

3. Every request:
   Authorization: Bearer <accessToken>

4. On 401 response:
   POST /users/refresh { refreshToken }
   → returns new accessToken + refreshToken

5. On refresh failure:
   Clear tokens → redirect to login
```

---

## Roles

| Role | Can do |
|------|--------|
| `seeker` | Browse jobs, apply, track applications, manage profile |
| `employer` | Post/edit/delete jobs, view applicants, update application status |

---

## Deployment (Railway)

1. Push repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select `kazjobs-back` repo
4. Add environment variables in Railway dashboard
5. Railway auto-detects Node.js and runs `npm start`

Set these in Railway Variables:
```
PORT=4000
MONGODB_URI=...
ACCESS_TOKEN=...
REFRESH_TOKEN=...
CLIENT_URL=https://kazjobs-front.vercel.app
```