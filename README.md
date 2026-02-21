# Landslide Monitoring System

A production-ready Landslide Monitoring System with a Node.js + Express + PostgreSQL backend, React + Tailwind frontend, and a Python FastAPI ML Service stub.

## Project Structure

- `client/` - React frontend (Vite, Tailwind, Shadcn UI)
  - `src/pages/dashboard.tsx` - Main sensor dashboard
  - `src/pages/map.tsx` - Interactive risk map using Leaflet
  - `src/pages/alerts.tsx` - Real-time alerts using Socket.io
- `server/` - Node.js + Express backend
  - `routes.ts` - REST APIs and Socket.io event handling
  - `storage.ts` - Drizzle ORM database operations
  - `db.ts` - PostgreSQL connection
- `shared/` - Shared TypeScript schemas and API contracts
- `ml_service/` - Python FastAPI stub for the ML model

## Setup Instructions

### 1. Database Setup
The system uses PostgreSQL. Environment variables (`DATABASE_URL`) are automatically configured in the Replit environment. To push the schema to the database:
```bash
npm run db:push
```

### 2. Running the Main Application (Node.js + React)
To start the backend and frontend servers:
```bash
npm run dev
```

### 3. Running the ML Service (Python)
The backend expects the ML service to be running on `localhost:5001`. If it's not running, the backend will automatically use a fallback dummy risk assessment logic.

To run the ML service:
```bash
# Install dependencies
pip install -r ml_service/requirements.txt

# Start the FastAPI server
python ml_service/main.py
```

## Environment Variables
- `DATABASE_URL` - Connection string for the PostgreSQL database (Auto-provisioned)
- `SESSION_SECRET` - Secret key for sessions (Auto-provisioned)

## Architecture
- **Frontend**: Clean, modern dashboard built with React, styled with Tailwind CSS and Shadcn UI components. Uses React Query for data fetching and Socket.io client for real-time updates.
- **Backend**: Scalable Express server using Drizzle ORM for type-safe database interactions. Implements modular routing and real-time broadcasting via Socket.io.
- **ML Service**: A lightweight Python FastAPI stub designed to accept sensor data and return a risk percentage and level, ready to be replaced with a real trained ML model.
