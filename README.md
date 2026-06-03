# AgentFlow — MERN Stack Machine Test

A full-stack admin panel for managing agents and distributing CSV task lists equally across agents. Built with MongoDB, Express.js, React.js, and Node.js.

---

## Features

- **Admin Login** — JWT-based authentication with protected routes
- **Agent Management** — Create agents with name, email, mobile (with country code), and password
- **CSV Upload & Distribution** — Upload CSV/XLSX/XLS files and auto-distribute tasks equally among agents
- **Distributed Task View** — Per-agent task grid displayed on the dashboard

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)

---

## Environment Variables

### Backend — `server/.env`

Create a file at `server/.env` with the following:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.epbfjnd.mongodb.net/
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend — `client/.env`

Create a file at `client/.env` with the following:

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/AnyxByte/-AgentFlow-Studio.git
cd agentflow
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

---

## Running the Application

### Start the backend server

```bash
cd backend
npm run dev
```

> Server runs at **http://localhost:5000**

### Start the frontend (in a new terminal)

```bash
cd frontend
npm run dev
```

> Frontend runs at **http://localhost:5173**

---

## Seeding the Admin User

Before logging in for the first time, seed the default admin account by running:

```bash
cd backend
npm run seed
```

This creates the following admin account in MongoDB:

| Field    | Value               |
|----------|---------------------|
| Name     | System Admin        |
| Email    | admin@agentflow.io  |
| Password | Admin@123           |

> If an admin already exists in the database, the seed script will skip creation and log the existing account's email.

---

## Usage Guide

### 1. Login
- Navigate to **http://localhost:5173**
- Log in with the seeded admin credentials
- On success you are redirected to the dashboard

### 2. Create Agents
- Click **"New Agent"** on the dashboard
- Fill in: Name, Email, Mobile Number (with country code), Password

### 3. Upload & Distribute CSV
- Click the upload zone in **"Import File"**
- Upload a `.csv`, `.xlsx`, or `.xls` file
- Required columns (any casing accepted):

| Column      | Type   | Example          |
|-------------|--------|------------------|
| `FirstName` | Text   | Alice Johnson    |
| `Phone`     | Number | 9876543210       |
| `Notes`     | Text   | Follow up Monday |

- Click **"Process & Distribute Tasks"**
- Tasks are split equally — remainder rows go to agents sequentially (round-robin)

### 4. View Distributed Lists
- Scroll down to **"Agent Distribution Grid"**
- Each agent card shows their assigned task count and full task list

---

## Sample CSV

A sample file is provided at `client/src/assets/sample_tasks.csv`.

```csv
FirstName,Phone,Notes
Alice Johnson,9876543210,Interested in premium plan
Bob Smith,8765432109,Follow up next week
Carol White,7654321098,Needs product demo
...
```

---

## API Endpoints

### Auth
| Method | Endpoint          | Description | Auth |
|--------|-------------------|-------------|------|
| POST   | `/api/auth/login` | Admin login | ✗    |

### Agents
| Method | Endpoint        | Description      | Auth |
|--------|-----------------|------------------|------|
| GET    | `/api/agents`   | Get all agents   | ✓    |
| POST   | `/api/agents`   | Create new agent | ✓    |

### Tasks
| Method | Endpoint                 | Description                  | Auth |
|--------|--------------------------|------------------------------|------|
| POST   | `/api/tasks/upload`      | Upload & distribute CSV rows | ✓    |
| GET    | `/api/tasks/distributed` | Get all agents with tasks    | ✓    |

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js, Vite, Tailwind CSS, Axios |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB, Mongoose                   |
| Auth       | JSON Web Tokens (JWT), bcryptjs     |
| File Parse | xlsx (client-side, no Multer)       |
| UI Extras  | Lucide React, React Hot Toast       |

---

## Key Design Decisions

- **Client-side CSV parsing** — Files are parsed in the browser using the `xlsx` library. Raw JSON rows are sent to the backend as `{ parsedRows: [...] }`. No file is stored on the server or in the cloud.
- **Round-robin distribution** — Tasks are assigned using `index % totalAgents` ensuring equal distribution with sequential remainder handling.
- **JWT in localStorage** — Token is stored in `localStorage` and attached to every protected request via `Authorization: Bearer <token>` header.

---

## Troubleshooting

**"No active agents found"**
→ Create agents from the dashboard before uploading a CSV.

**"0 rows parsed" / button stays disabled**
→ Check your CSV column headers. They must contain `FirstName`, `Phone`, and `Notes` (any casing accepted). Open the browser console — the detected headers are logged automatically.

**CORS error in browser**
→ Make sure `CLIENT_URL` in `server/.env` matches exactly where your frontend is running (`http://localhost:5173`).

---

## Video Demonstration

[Watch on Google Drive](#) — *(replace this link with your actual Drive link)*

