# Shopshee

Full-stack ecommerce app built with React (Vite), Node.js (Express), and MongoDB.

## Tech Stack

- Client: React 19, Vite, React Router, Axios
- Server: Node.js, Express, Mongoose
- Database: MongoDB

## Project Structure

```text
Shopshee/
  Client/   # React frontend
  Server/   # Express backend + Mongo models + scripts
```

## Features

- User registration and login (JWT auth)
- Product listing and product details modal
- Place orders and view order history
- Admin panel for:
  - Dashboard metrics
  - Product add/update/delete
  - Order status update
  - User management

## Prerequisites

- Node.js 18+
- MongoDB (local or cloud)

## Environment Variables

Server uses:

- `MONGODB_URI` (optional)
  - Default: `mongodb://127.0.0.1:27017/shopshee`
- `PORT` (optional)
  - Default: `5000`
- `JWT_SECRET` (recommended)

Client uses:

- `VITE_API_BASE_URL` (optional)
  - Default: `http://localhost:5000/api`

## Setup

Install dependencies:

```bash
cd Server
npm install

cd ../Client
npm install
```

## Run Locally

Start backend:

```bash
cd Server
npm run dev
```

Start frontend:

```bash
cd Client
npm run dev
```

App URLs:

- Client: `http://localhost:5173`
- API health: `http://localhost:5000/api/health`

## Useful Server Scripts

From `Server/`:

```bash
# Seed products
npm run seed:products

# Normalize existing products
npm run normalize:products

# Promote existing user to admin
npm run make-admin -- user@example.com
```

Note: if `npm run make-admin -- user@example.com` does not pass the email in your shell, run:

```bash
node scripts/makeAdmin.js user@example.com
```

## Build Frontend

```bash
cd Client
npm run build
npm run preview
```
