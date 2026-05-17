# Mobi Mart

Full-stack mobile store website with a React + Vite frontend and an Express + MongoDB backend.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, Multer, Cloudinary

## Project Structure

```text
frontend/   React application
backend/    Express API and backend services
```

## Setup

### Backend

Create `backend/.env` with:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_long_random_secret
ADMIN_ID=your_admin_username
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Install and run:

```bash
cd backend
npm install
npm run dev
```

### Frontend

Create `frontend/.env` only if you want to override defaults:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=919000000000
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

## Production

Build the frontend:

```bash
cd frontend
npm run build
```

Start the backend:

```bash
cd backend
npm start
```

## Notes

- Static uploads are served from `backend/uploads` at `/uploads`.
- If `VITE_API_BASE_URL` is not set, the frontend uses `http://localhost:5000/api` during Vite dev and `/api` outside Vite dev.
