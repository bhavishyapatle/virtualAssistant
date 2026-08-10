# Marvel VA — Voice-Controlled Virtual Assistant

A full-stack, voice-controlled virtual assistant with a custom Marvel-themed avatar, natural language command handling, and AI-powered responses.

**Live Demo:**https://virtualassistant-ipih.onrender.com/

> Note: the app is hosted on Render's free tier, so the backend may take 30–60 seconds to spin up on first load if it's been idle.

---

## Overview

Marvel VA lets a user sign up, pick (or upload) an avatar for their personal assistant, name it, and then talk to it out loud in the browser. The assistant listens for its own name, sends the spoken command to Google's Gemini API for intent classification, and responds with synthesized speech — while also handling real actions like opening a Google search, playing something on YouTube, or reading out the current time and date.

---

## Features

- **Voice interaction** — continuous speech recognition that wakes on the assistant's name, and text-to-speech replies
- **AI-powered intent parsing** — Gemini classifies each command into a structured type (search, YouTube, weather, time/date, general Q&A, etc.) and generates a natural spoken response
- **Command routing** — automatically opens Google/YouTube/Instagram/Facebook searches or a calculator based on detected intent
- **Custom assistant identity** — choose from preset Marvel-styled avatars or upload your own image, and give the assistant a name
- **Authentication** — secure signup/signin with hashed passwords and JWT stored in an HTTP-only cookie
- **Command history** — every spoken command is saved per user and viewable in a side panel
- **Image uploads** — custom avatar images are uploaded and served via Cloudinary
- **Responsive UI** — mobile-friendly layout with a slide-out menu

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router DOM
- Tailwind CSS
- Axios
- react-icons
- Web Speech API (`SpeechRecognition` + `SpeechSynthesis`)

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- JWT (`jsonwebtoken`) for authentication
- `bcryptjs` for password hashing
- `cookie-parser` + HTTP-only cookies for session handling
- Multer for handling multipart file uploads
- Cloudinary for image storage/CDN
- Google Gemini API for natural language understanding
- `moment` for date/time formatting
- CORS configured for cross-origin frontend/backend communication

**Deployment**
- Render (frontend + backend)
- MongoDB Atlas (database)

---

## How It Works

1. **Sign up / sign in** — credentials are validated, the password is hashed with bcrypt, and a JWT is issued and stored as an HTTP-only cookie.
2. **Customize** — the user picks a preset avatar or uploads their own (stored via Cloudinary) and names their assistant.
3. **Home** — the browser's `SpeechRecognition` API listens continuously. When the transcript contains the assistant's name, the command is sent to the backend.
4. **Backend processing** — the command, along with the user's name and assistant's name, is sent to Gemini with a structured prompt asking for a JSON response containing an intent `type`, the cleaned `userInput`, and a short spoken `response`.
5. **Response & action** — the backend returns the parsed result; the frontend speaks the response aloud via `SpeechSynthesis` and performs any associated action (opening a search tab, etc.). The command is also saved to the user's history.

---

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── assets/          # avatar images, gifs, background
│   │   ├── components/      # Card.jsx
│   │   ├── context/         # UserContext.jsx (global state)
│   │   ├── pages/           # SignIn, SignUp, Customize, Customize2, Home
│   │   ├── App.jsx          # route definitions + auth guards
│   │   └── main.jsx
│   └── index.html
│
└── backend/
    ├── config/               # db.js, token.js, cloudinary.js
    ├── controllers/          # authControllers.js, userControllers.js
    ├── middlewares/          # isAuth.js, multer.js
    ├── models/                # userModel.js
    ├── routes/                # authRoutes.js, userRoutes.js
    ├── gemini.js              # Gemini prompt + API call
    └── index.js                # Express app entry point
```

---

## API Routes

| Method | Route                     | Auth required | Description                                  |
|--------|----------------------------|:--------------:|-----------------------------------------------|
| POST   | `/api/auth/signup`         | No             | Create a new account                          |
| POST   | `/api/auth/signin`         | No             | Log in and receive a session cookie           |
| GET    | `/api/auth/logout`         | No             | Clear the session cookie                      |
| GET    | `/api/user/current`        | Yes            | Get the logged-in user's data                 |
| POST   | `/api/user/update`         | Yes            | Update assistant name/image                   |
| POST   | `/api/user/asktoassistant` | Yes            | Send a voice command, get an AI-routed reply  |

---

## Getting Started (Local Setup)

**1. Clone the repo**
```bash
git clone <[your-repo-url](https://github.com/bhavishyapatle/virtualAssistant/)>
cd <your-repo-folder>
```

**2. Backend setup**
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_URL=your_gemini_api_endpoint
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

```bash
npm run dev
```

**3. Frontend setup**
```bash
cd frontend
npm install
npm run dev
```

Update `serverUrl` in `src/context/UserContext.jsx` to point to your backend (defaults to `http://localhost:8000`).

The app will be running at `http://localhost:5173`.

---

## Future Improvements

- Move `serverUrl` and CORS origins to environment variables for easier environment switching
- Add input validation (e.g. Zod/Joi) on auth routes
- Add rate limiting on authentication endpoints
- Replace filename-based Multer storage with unique filenames to avoid collisions
- Add automated tests for controllers and command routing

---

## Author

Built by [Bhavishya Patle] — feel free to connect or reach out with feedback.
