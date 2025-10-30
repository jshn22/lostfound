# Lost & Found Hub — Frontend

This is a React + Vite + Tailwind CSS frontend for the Lost & Found Hub.

Setup

1. Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend (e.g., http://localhost:5000)
2. Install dependencies:

```bash
npm install
```

3. Run dev server:

```bash
npm run dev
```

Features

- Pages: Home, Login, Register, Add Item, Item Details, Profile
- Axios configured to use `VITE_API_URL`
- Tailwind CSS styling
- JWT stored in localStorage
- React Toastify for notifications

Notes

- The project expects the backend endpoints as implemented in the `backend/` folder.
- For deployment, set `VITE_API_URL` in your hosting provider environment variables.
Deployment

Vercel
1. Create a new project in Vercel and link your repository.
2. Set environment variable `VITE_API_URL` to your backend URL (e.g., https://your-backend.onrender.com).
3. Vercel will run `npm run build` and serve the `dist/` folder (see `vercel.json`).

Netlify
1. Create a new site on Netlify and link your repo.
2. Set build command `npm run build` and publish directory `dist`.
3. Set `VITE_API_URL` in Netlify environment variables. `netlify.toml` is included for convenience.

Local build
```bash
npm install
npm run build
npm run preview
```
 - If the backend is configured with Cloudinary, image uploads from the Add Item page will be stored remotely and displayed using the returned Cloudinary `imageUrl`.
 - The Profile page supports deleting your items (this will also remove the remote Cloudinary image if present).
