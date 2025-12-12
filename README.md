# Full-Stack Authentication App

Authentication system built with NestJS, React, and MongoDB.

## Tech Stack

- **Backend:** NestJS, MongoDB, Passport JWT, Swagger
- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Infrastructure:** Docker, Docker Compose

## Features

- Signup and signin endpoints
- JWT authentication
- Protected route (accessible only with valid JWT)
- Password hashing (bcrypt)
- Rate limiting
- NoSQL injection protection
- Helmet security headers
- Input validation

**Logging**
- Built-in NestJS Logger across all services
- Configurable log levels (log, debug, warn, error, verbose)
- Contextual logging with service name tagging
- User activity logging (login, signup, validation)

**Testing**
- Unit tests with Jest
- Service-level test coverage
- Mocked dependencies for isolated testing

**CI/CD**
- GitHub Actions workflow
- Automated linting, testing, and builds
- Parallel jobs for backend and frontend


## Setup

### Manual Setup

**Prerequisites:** Node.js 18+, MongoDB

**Backend:**
```bash
cd backend
npm install
```

Create `backend/.env` from the example file:
```bash
cp .env.example .env
```

Then edit `.env` with your values (see `backend/.env.example` for all options).

```bash
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
```

Create `frontend/.env` from the example file:
```bash
cp .env.example .env
```

Then edit `.env` with your values (see `frontend/.env.example` for all options).

```bash
npm run dev
```

### Docker Setup

```bash
docker-compose up -d
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| MONGODB_URI | MongoDB connection string (local or Atlas) |
| PORT | Backend server port |
| NODE_ENV | Environment (development/production) |
| JWT_SECRET | Secret key for JWT signing |

**MongoDB URI Examples:**
- Local: `mongodb://localhost:27017/app`
- Atlas: `mongodb+srv://<user>:<password>@cluster.mongodb.net/<database>`

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL (default: http://localhost:3000) |

**API URL Examples:**
- Development: `http://localhost:3000`
- Production: `https://api.yourdomain.com`

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| API Docs | http://localhost:3000/api-docs |

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/signup | Register user | No |
| POST | /auth/signin | Login user | No |
| GET | /users/me | Get profile | Yes |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── signup.dto.ts
│   │   │   │   └── signin.dto.ts
│   │   │   └── schemas/
│   │   │       └── user.schema.ts
│   │   ├── common/
│   │   │   └── pipes/
│   │   │       └── nosql-sanitizer.pipe.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── lib/
│   │   │   └── axios.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
└── docker-compose.yml
```
