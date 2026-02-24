# V Bank - Banking Simulation Application

V Bank is a full-stack banking simulation application built with Node.js, Express.js, MySQL, and ReactJS. It features secure JWT authentication, transaction management, and a modern minimal UI.

## Features

- **User Authentication**: Secure Signup and Login using JWT and HttpOnly cookies.
- **Account Management**: View unique account number and current balance.
- **Transactions**:
  - Deposit Money safely.
  - Send Money to other users transactionally.
- **Security**:
  - SHA-256 (bcrypt) password hashing.
  - SQL Injection prevention using parameterized queries.
  - SSL-enforced database connection.
  - Protected routes via Middleware.

## Tech Stack

**Backend:**
- Node.js & Express.js
- MySQL (Aiven Cloud) - SSL Required
- JWT (JSON Web Tokens)
- bcrypt (Password Hashing)

**Frontend:**
- ReactJS (Vite)
- Axios (API Requests)
- CSS3 (Minimal Modern Theme)

## Setup Instructions

### Prerequisites
- Node.js installed (v14+ recommended)
- Git

### 1. Clone the Repository
```bash
git clone <repository_url>
cd "V Bank"
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Start the backend server:
```bash
npm start
# or
node server.js
```
The server will run on `http://localhost:5000`.
It will automatically attempt to create the necessary database tables on the first run.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Environment Variables
The backend is pre-configured with a `.env` file for this simulation.
- `PORT`: 5000
- `DATABASE_URL`: (Pre-filled)
- `JWT_SECRET`: (Pre-filled)
- `FRONTEND_URL`: http://localhost:5173 (Adjust if Vite uses a different port)

## Usage
1. Open the frontend URL in your browser.
2. Sign up for a new account.
3. Login with your credentials.
4. Use the dashboard to Deposit money or Send money to another account ID.
