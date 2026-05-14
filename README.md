# Streaming Platform

A Netflix-inspired streaming platform built as an undergraduate research project. Supports video streaming, watch history, favorites, real-time Watch Together sessions, and role-based access control.

## Tech Stack

**Backend:** Java 21, Spring Boot, Spring Security (JWT), WebSocket (STOMP), PostgreSQL, Redis

**Frontend:** React, Vite, Tailwind CSS

**Infrastructure:** Docker, Nginx, Let's Encrypt, GitHub Actions CI/CD

## Features

- User registration with email verification (Gmail SMTP)
- Login via email or phone number
- Password reset flow with token-based email links
- Video streaming with progress tracking and resume
- Watch Together sessions with real-time sync via WebSocket
- Favorites with visual indicators on media cards
- Admin API for managing users and media
- Role-based authorization (User / Admin)
- Responsive UI with genre-based browsing and search

## Running Locally

**Prerequisites:** Docker, Node 20+, Java 21

1. Start the databases:
   ```bash
   docker compose up -d
   ```

2. Start the backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

3. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The app runs at `http://localhost:3000`.

## Testing

```bash
# Backend (requires PostgreSQL and Redis running)
cd backend
./mvnw test -Dspring.profiles.active=test

# Frontend
cd frontend
npm test
```

## Production Deployment

```bash
cp .env.example .env
# Fill in real values in .env
docker compose -f docker-compose.prod.yml up -d
```

Pushes to `main` trigger CI/CD: tests run, then auto-deploy to EC2 via SSH.

## Demo Accounts

| Email | Phone | Password | Role |
|-------|-------|----------|------|
| alice@example.com | +30 6911111111 | Testing1! | User |
| bob@example.com | +44 7911222333 | Testing1! | User |
| admin@example.com | +1 5551234567 | Testing1! | Admin |