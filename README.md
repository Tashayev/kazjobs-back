Readme · MDCopyKazJobs API
A RESTful backend API for a job board platform built with Node.js, Express, and MongoDB.
Tech Stack

Runtime — Node.js
Framework — Express.js
Database — MongoDB + Mongoose
Authentication — JWT (Access + Refresh Tokens)
Password Hashing — bcrypt
Environment Variables — dotenv

Features

JWT authentication with access and refresh tokens
Role based access control (employer / seeker)
Full CRUD for job listings
Job application system
Ownership validation on all protected operations
MongoDB transactions on user registration
Nested population for relational data

Getting Started
Prerequisites

Node.js 18+
MongoDB Atlas account or local MongoDB

Installation
bash# Clone the repo
git clone https://github.com/yourusername/kazjobs-api.git
cd kazjobs-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env
Environment Variables
Create a .env file in the root directory:
envPORT=4000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret
Run
bash# Development
npm run dev

# Production
npm start
Server runs on http://localhost:4000
Project Structure
src/
├── controllers/
│   ├── user.controller.js
│   ├── job.controller.js
│   └── application.controller.js
├── models/
│   ├── user.model.js
│   ├── job.model.js
│   └── application.model.js
├── routes/
│   ├── user.routes.js
│   ├── job.routes.js
│   └── application.routes.js
├── middlewares/
│   ├── auth.middleware.js
│   └── role.middleware.js
├── services/
│   └── token.service.js
├── config/
│   └── database.js
└── app.js
API Endpoints
Base URL: http://localhost:4000/api/v1

# Api Documentation
To view the API documentation, open `api-docs.html` in your browser.

Access tokens expire in 15 minutes. Use the refresh token endpoint to get a new one.
License
MIT# kazjobs-back
