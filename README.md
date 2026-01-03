# Groove

Groove is a full-stack music streaming web application built with the MERN-style architecture, utilizing Supabase for authentication, database management, and cloud storage.

## Features

### User Features

- **Authentication**: Secure email/password login and registration via Supabase Auth.
- **Music Discovery**: Browse tracks and podcast collections by category.
- **Audio Playback**: Persistent mini-player allowing seamless navigation while listening.
- **Playlist Management**: Create, rename, and delete personal playlists; add or remove tracks.
- **History Tracking**: Automatically track recently played music.
- **Search**: Global search for both tracks and podcast collections.

### Admin Features

- **Role-Based Access**: Exclusive dashboard accessible only to users with the admin role.
- **Category Management**: Create and delete categories for organizing content.
- **Track Upload**: Upload audio files and cover art for music tracks.
- **Podcast Management**: Create podcast collections and upload individual episodes.
- **Secure Backend**: Admin actions are protected by middleware verifying specific metadata roles.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, shadcn/ui, React Router, Context API.
- **Backend**: Node.js, Express, Supabase Admin SDK, Multer.
- **Database & Storage**: Supabase (PostgreSQL, Storage Buckets).

## Architecture Overview

The project is structured as a monorepo-style setup with separate frontend and backend directories.

```text
groove/
├─ backend/
│  ├─ controllers/
│  ├─ routes/
│  ├─ middlewares/
│  ├─ lib/
│  ├─ server.js
│  └─ setAdmin.js
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ hooks/
│  │  ├─ pages/
│  │  └─ layouts/
└─ README.md
```

## Environment Variables

### Backend (.env)

- `PORT`: The port on which the Express server will run (default: 5000).
- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_SERVICE_KEY`: The service_role key for administrative actions (Keep this secret).

### Frontend (.env)

- `VITE_SUPABASE_URL`: Your Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous public key.
- `VITE_API_BASE_URL`: The URL of the backend API (e.g., `http://localhost:5000/api`).

## Supabase Setup Notes

To ensure the application functions correctly, the following Storage buckets must be created manually in your Supabase project and set to **Public**:

1. `tracks`: For storing music audio files.
2. `covers`: For storing track and collection cover images.
3. `podcasts`: For storing podcast episode audio files.

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/mdfaizan0/groove.git
cd groove
```

### 2. Setup Backend

```bash
cd backend
npm install
# Create .env and add backend variables
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
# Create .env and add frontend variables
npm run dev
```

## Admin Access Setup

Authentication and role management are handled by Supabase. By default, new users do not have administrative privileges. To assign an admin role to a user:

1. Register a user via the frontend signup page.
2. Run the provided admin script from the `backend` directory:
   ```bash
   node setAdmin.js your-email@example.com
   ```
3. Log out and log back in on the frontend to refresh the session metadata.

## Notes & Limitations

- **Admin Signup**: There is no public UI for creating admin accounts; they must be promoted via the CLI script.
- **Storage**: Audio and image uploads are held in memory temporarily before being buffered to Supabase Storage.
- **Browser Compatibility**: Audio detection for duration relies on the HTML5 Audio API.
