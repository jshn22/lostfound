# Lost & Found Hub - Backend

This is a Node.js + Express backend for the Lost & Found Hub project. It uses MongoDB (Atlas) via Mongoose and JWT for authentication.

Environment

- Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection URI and JWT secret.

API Endpoints

- POST /api/auth/register -> register new user
- POST /api/auth/login -> login and get JWT
- POST /api/items -> create item (authenticated, multipart/form-data allowed for image)
- GET /api/items -> list items (filters: status, location, category, q, page, limit)
- GET /api/items/:id -> get single item
- DELETE /api/items/:id -> delete item (owner only)
- PUT /api/items/:id -> edit item (owner only)

Run

Install dependencies:

```bash
npm install
```

Run dev:

```bash
npm run dev
```

Notes

- Image uploads are stored in `/uploads` (local) by default. For production, consider Cloudinary.
- Make sure to set `MONGO_URI` and `JWT_SECRET` in environment variables.
 - To enable Cloudinary uploads, set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in your environment (or `CLOUDINARY_URL`). When present, image uploads will be stored remotely and the returned `imageUrl` will be a secure Cloudinary URL.

Examples (curl)

- Register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Test User","email":"test@example.com","password":"secret123"}'
```

- Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"test@example.com","password":"secret123"}'
```

- Create item (with image):

```bash
curl -X POST http://localhost:5000/api/items \
	-H "Authorization: Bearer <TOKEN>" \
	-F "title=Black Wallet" \
	-F "description=Lost near library" \
	-F "status=lost" \
	-F "location=Main Library" \
	-F "image=@/path/to/image.jpg"
```

Deployment notes (Render)

- Use a private service or web service on Render and set environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) in the Render dashboard.
- For file uploads: Render's filesystem is ephemeral. Use Cloudinary (or S3) in production for persistent image storage.
- Start command: `npm start` (or set build and start steps per Render documentation).

Deployment

Render
1. Create a new Web Service on Render.
2. Connect your GitHub/Git repo and select the `backend/` folder (or root if this is the repo root).
3. Set environment variables in the Render dashboard: `MONGO_URI`, `JWT_SECRET`, (optional) Cloudinary vars, and `PORT`.
4. Build command: `npm install && npm run build` (if you have a build step) or leave blank for Node apps.
5. Start command: `npm start`.

Docker
You can build and run the backend via Docker:

```bash
docker build -t lost-found-backend .
docker run -e MONGO_URI="your_uri" -e JWT_SECRET="your_secret" -p 5000:5000 lost-found-backend
```
