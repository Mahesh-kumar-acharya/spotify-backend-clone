# 🎵 Spotify Backend Clone

A RESTful backend API for a music streaming platform, inspired by Spotify. Built with **Node.js** and **Express 5**, it handles user authentication, role-based access control (users & artists), audio file uploads to cloud storage, and album/music management — all backed by **MongoDB** with **Mongoose**.

---

## ✨ Features

### 🔐 Authentication & Authorization

- **User registration & login** — users can sign up or log in with either a **username or email**.
- **JWT-based authentication** — signed JSON Web Tokens are stored in an **HTTP-only cookie** after login/registration.
- **Password hashing** — passwords are hashed with **bcrypt** (10 salt rounds) before being saved to the database.
- **Role-based access control (RBAC)** — users have a `role` of either `user` or `artist`. Only **artists** can upload music or create albums; unauthorized roles receive a `403 Forbidden` response.
- **Duplicate prevention** — registration rejects users whose username or email already exists (`409 Conflict`).
- **Protected routes** — music and album creation endpoints verify the JWT token before proceeding (`401` if missing/invalid).

### 🎧 Music Management

- **Upload music** — artists can upload an audio file (via `multipart/form-data`) along with a title; the file is stored in the cloud and its URL is saved in MongoDB.
- **Get all music** — anyone can fetch the full catalog of uploaded tracks.

### 💿 Album Management

- **Create albums** — artists can group previously uploaded tracks into an album (linked by music IDs).
- **Get all albums** — fetch all albums in the catalog.

### ☁️ Cloud Storage Integration

- **ImageKit integration** — uploaded audio files are streamed to ImageKit cloud storage and served via a public CDN URL, so media never lives on the server's disk (in-memory multer storage keeps the app stateless).

### 🗄️ Database

- **MongoDB + Mongoose** — three relational-style schemas:
  - **User** — `username`, `email`, `password` (hashed), `role` (`user` | `artist`), with unique constraints on username & email.
  - **Music** — `uri` (CDN link), `title`, and a reference to the uploading artist.
  - **Album** — `title`, a reference to the owning artist, and an array of referenced music tracks.
- **Graceful startup** — the server validates required environment variables before booting and exits cleanly if the database connection fails.

---

## 🛠️ Tech Stack

| Category       | Technology                                     |
| -------------- | ---------------------------------------------- |
| Runtime        | Node.js                                        |
| Framework      | Express 5                                      |
| Database       | MongoDB                                        |
| ODM            | Mongoose 9                                     |
| Authentication | JSON Web Tokens (jsonwebtoken) + cookie-parser |
| Security       | bcryptjs (password hashing)                    |
| File Uploads   | Multer (in-memory storage)                     |
| Cloud Storage  | ImageKit (`@imagekit/nodejs`)                  |
| Config         | dotenv                                         |
| Dev Server     | Nodemon                                        |

---

## 📁 Project Structure

```
spotify-backend-clone/
├── server.js                      # Entry point — env validation, DB connection, server start
├── src/
│   ├── app.js                     # Express app — middleware & route mounting
│   ├── database/
│   │   └── db.js                  # MongoDB connection logic
│   ├── models/
│   │   ├── user.model.js          # User schema (auth + roles)
│   │   ├── music.model.js         # Music schema (track metadata)
│   │   └── album.model.js         # Album schema (track collections)
│   ├── controllers/
│   │   ├── auth.controllers.js    # Register / login logic
│   │   └── music.controllers.js   # Music & album CRUD + auth checks
│   ├── routes/
│   │   ├── auth.routes.js         # /api/auth endpoints
│   │   └── music.routes.js        # /api/music endpoints (with multer upload)
│   └── services/
│       └── storage.services.js    # ImageKit cloud upload service
└── .env                           # Environment variables (not committed)
```

---

## 🔌 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint    | Access | Description                                                             |
| ------ | ----------- | ------ | ----------------------------------------------------------------------- |
| POST   | `/register` | Public | Create an account (username, email, password). Returns JWT in a cookie. |
| POST   | `/login`    | Public | Log in with username _or_ email + password. Returns JWT in a cookie.    |

### Music — `/api/music`

| Method | Endpoint  | Access       | Description                                                                  |
| ------ | --------- | ------------ | ---------------------------------------------------------------------------- |
| POST   | `/upload` | Artist (JWT) | Upload an audio file (`multipart/form-data`, field name: `music`) + `title`. |
| POST   | `/album`  | Artist (JWT) | Create an album with a `title` and an array of `musicIds`.                   |
| GET    | `/`       | Public       | Fetch all music tracks.                                                      |
| GET    | `/albums` | Public       | Fetch all albums.                                                            |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- An [ImageKit](https://imagekit.io) account (for audio uploads)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/spotify-backend-clone.git
   cd spotify-backend-clone
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root with the following variables:

   ```env
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

The server will start on **http://localhost:3000** 🎉

---

## 🧪 Example Requests

**Register a user:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "email": "john@example.com", "password": "secret123"}'
```

**Upload a track (as an artist):**

```bash
curl -X POST http://localhost:3000/api/music/upload \
  -H "Cookie: token=<your_jwt>" \
  -F "title=My First Track" \
  -F "music=@/path/to/song.mp3"
```

---

## 🔮 Roadmap / Future Enhancements

- [ ] Logout endpoint (clear auth cookie)
- [ ] Artist onboarding (upgrade a `user` to `artist`)
- [ ] Middleware-based auth instead of inline checks
- [ ] Album cover image uploads (ImageKit already supports it)
- [ ] Playlists, likes & play counts
- [ ] Search & pagination for the music catalog
- [ ] Rate limiting & helmet for security hardening
- [ ] Unit/integration tests (Jest / Supertest)

---

## 📄 License

Licensed under the [ISC License](https://opensource.org/licenses/ISC).
