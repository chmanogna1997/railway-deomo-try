# Tesellate

A full-stack practice project for interview preparation. Build and deploy a real web application using React, Node.js, Express, and Postgres.

## What is Tesellate?

Tesellate is a **Physician Directory** application with a favorites feature. Users can browse physicians and save their favorites.

**The App:** A full-stack web application for interview practice. It has:

- **Frontend** — React app built with Vite
- **Backend** — Node.js/Express API server
- **Database** — Postgres for data persistence
- **Deployment** — Ready to ship to production with Railway

**The Feature:** Build a "Save Favorites" feature where users can mark physicians as favorites and view their saved list.

The goal is to build real features end-to-end: schema design, API endpoints, UI components, and deployment — all in one project.

## Project Structure

```
Tesellate/
├── Frontend/          # React + Vite app
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── Backend/           # Express server
│   ├── server.js
│   └── package.json
└── README.md
```

## Getting Started

### 1. Start the Backend

```bash
cd Backend
npm install
npm start
```

Server runs on `http://localhost:3000`

### 2. Start the Frontend

```bash
cd Frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

## What's Next?

- Build features on the frontend (components, pages, state)
- Add API endpoints on the backend
- Connect frontend to backend with fetch/API calls
- Add database tables and queries
- Deploy when ready

## Tech Stack

- **Frontend:** React 18, Vite, JavaScript
- **Backend:** Node.js, Express, Postgres
- **Deployment:** Railway
- **Version Control:** Git + GitHub

Start building! 🚀
