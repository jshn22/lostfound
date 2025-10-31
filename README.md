# Lost & Found Hub
# 🧭 Lost & Found Hub

A lightweight full-stack app to post, discover and manage lost & found items in your community.

---

## 🔍 Overview
Lost & Found Hub lets users register, post items they lost or found (with optional images), and browse/search items posted by others. It's built to be simple, mobile-friendly, and easy to deploy.

## ✨ Features
- User registration & login (JWT)
- Create / Read / Update / Delete items
- Image uploads (local; Cloudinary optional)
- Search and basic filtering
- Profile page with user's posts
- Responsive React + Tailwind frontend

## 🧰 Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: bcryptjs, jsonwebtoken (JWT)
- File uploads: multer (Cloudinary integration optional)
- Frontend: React (Vite) + Tailwind CSS
- HTTP client: Axios

---

## ⚙️ Installation (Local)

Prerequisites:
- Node.js (16+)
- npm or yarn
- MongoDB (Atlas or local)

1) Clone the repo

```bash
git clone <your-repo-url>
cd "lost found"
```

2) Server setup

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET, (optional) Cloudinary keys, PORT
npm install
npm run dev
```

By default the server runs on: `http://localhost:5000`

3) Frontend setup

```bash
cd ../frontend
cp .env.example .env
# If needed set VITE_API_URL to http://localhost:5000
npm install
npm run dev
```

Open the site at: `http://localhost:3000`

---

## 🧭 Usage
- Register a new account or login with existing credentials
- Click "Add Item" to post a lost or found item (title, description, category, image)
- Browse the feed, use search to find items, click an item to view details
- Edit or delete items from your Profile page (owner-only actions)

---

## 📡 API Endpoints
Base URL: `http://localhost:5000/api`

Auth
- POST `/auth/register` — Register (name, email, password)
- POST `/auth/login` — Login (email, password)

Items
- GET `/items` — List items (supports pagination & filters)
- GET `/items/:id` — Get single item
- POST `/items` — Create item (authenticated; multipart/form-data)
- PUT `/items/:id` — Update item (authenticated, owner only)
- DELETE `/items/:id` — Delete item (authenticated, owner only)

Protected endpoints require the header: `Authorization: Bearer <token>`

---

## 🧾 License
MIT — see the `LICENSE` file for full details.

## 👤 Author
Your Name — your.email@example.com

---
