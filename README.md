# GroceryGap Project

A full-stack recipe and grocery management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

The project is divided into two main parts:
- **recipe-backend**: The Node.js/Express server API.
- **recipe-frontend**: The React client application (built with Vite).

## Tech Stack

- **Frontend:** React, Vite, Material UI, Tailwind CSS, Framer Motion, React Query, Axios, Formik/Yup.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JSONWebToken (JWT), Bcrypt.js.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (Local or AtlasURI)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd grocerygap-project
```

### 2. Backend Setup

Navigate to the backend directory, install dependencies, and start the server.

```bash
cd recipe-backend
npm install

# Create a .env file with your variables (PORT, MONGO_URI, JWT_SECRET, etc.)
# cp .env.example .env

npm run dev
```
The backend server will typically run on `http://localhost:5000` (check your server console).

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, install dependencies, and start the development server.

```bash
cd recipe-frontend
npm install
npm run dev
```
The frontend will typically run on `http://localhost:5173`.

## Features
- User Authentication (Login/Register)
- Recipe Management
- Grocery List Generation
- Interactive UI with Animations

## Scripts

**Backend:**
- `npm run dev`: Runs the server with Nodemon (auto-restart).
- `npm start`: Runs the server in production mode.

**Frontend:**
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.
