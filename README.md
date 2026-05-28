# AI Assessment Generator

AI-powered assessment generation platform for educators built with:

- Next.js
- TypeScript
- Express.js
- MongoDB
- BullMQ
- Redis
- Socket.IO
- Groq AI

---

# Features

## AI Question Paper Generation

Generate structured question papers using AI with:

- Subject-specific questions
- Difficulty balancing
- Multiple question types
- Marks distribution
- Export-ready layouts

---

## Real-time Generation Pipeline

Implemented using:

- BullMQ job queues
- Redis
- Socket.IO realtime updates

Generation jobs are processed asynchronously and pushed to the frontend instantly upon completion.

---

## Professional UI/UX

- Modern dashboard
- Responsive layouts
- Structured assessment cards
- PDF export support
- Elegant loading states
- Clean typography and spacing

---

# Tech Stack

## Frontend

- Next.js App Router
- TypeScript
- TailwindCSS
- Axios
- Socket.IO Client

## Backend

- Express.js
- MongoDB + Mongoose
- BullMQ
- Redis
- Groq SDK
- Socket.IO

---

# Architecture

Frontend submits generation request
↓
BullMQ creates async job
↓
Worker processes AI generation
↓
MongoDB stores generated output
↓
Socket.IO emits completion event
↓
Frontend redirects to generated paper

---

# Installation

## 1. Clone Repository

```bash
git clone <repo-url>
```

## 2. Backend Setup

```bash
cd backend
npm install
```

- Create .env

```env
PORT=5000
MONGO_URI=your_mongo_uri
REDIS_URL=redis://127.0.0.1:6379
GROQ_API_KEY=your_groq_api_key
```

- Run backend:
```bash
npm run dev
```

## 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
## Redis Requirement

- BullMQ requires Redis server running locally.
- Start Redis:
```bash
redis-server
```
---

# Future Improvements

- Assignment regeneration
- Authentication
- Multi-teacher collaboration
- Assignment analytics
- Saved templates
- Role-based dashboards
