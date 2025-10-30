# Lost & Found Hub

This repository contains two folders:

- `backend/` — Node.js, Express, MongoDB backend
- `frontend/` — React + Vite + Tailwind frontend

Quick local run

1. Backend

```bash
cd backend
cp .env.example .env
# edit .env with MONGO_URI and JWT_SECRET
npm install
npm run dev
```

2. Frontend

```bash
cd frontend
cp .env.example .env
# set VITE_API_URL to backend (e.g. http://localhost:5000)
npm install
npm run dev
```

Deployment

- Backend: Render, Docker (see `backend/Dockerfile` and `backend/README.md`)
- Frontend: Vercel or Netlify (see `frontend/README.md`)

*** End of README
