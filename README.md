# Cyber — Tech E-commerce Store

A full-stack e-commerce application built with Next.js 16, TypeScript, Tailwind CSS, and MongoDB.

## Features

- Product browsing & filtering by category
- Shopping cart with persistent state (Zustand + localStorage)
- User authentication (credentials-based with bcrypt)
- Role-based access control (admin / seller / customer)
- Order management
- User profiles & address book
- Responsive design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js (JWT) |
| State | Zustand |
| Forms | React Hook Form |
| Images | Cloudinary (next-cloudinary) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

```bash
git clone https://github.com/tareq-sheta/next-store.git
cd next-store
npm install
cp .env.example .env.local
```

Fill in your `.env.local` values, then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
MONGODB_URI=           # MongoDB connection string
NEXTAUTH_SECRET=       # Random secret (run: openssl rand -base64 32)
NEXTAUTH_URL=          # Your app URL (http://localhost:3000 for dev)
NEXT_PUBLIC_BASE_URL=  # Same as NEXTAUTH_URL
```

## API Overview

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| GET | `/api/products` | No | List all products |
| GET | `/api/products/:id` | No | Get product by id |
| POST | `/api/products` | Admin / Seller | Create product |
| PATCH | `/api/products/:id` | Admin / Seller | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/users` | No | Register |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Owner / Admin | Get user |
| PATCH | `/api/users/:id` | Owner / Admin | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |
| GET | `/api/cart` | Owner / Admin | Get cart |
| POST | `/api/cart` | Authenticated | Add to cart |
| GET | `/api/orders` | Authenticated | Get orders |
| POST | `/api/orders` | Authenticated | Place order |

## Project Structure

```
├── app/
│   ├── api/          # API routes
│   ├── (pages)/      # Page components
│   └── layout.tsx
├── components/        # Shared UI components
├── handlers/          # Re-exports for lib/api (client usage)
├── hooks/             # Custom React hooks
├── lib/
│   ├── auth.ts        # NextAuth config
│   ├── authGuard.ts   # Server-side auth helper
│   ├── database.ts    # MongoDB connection
│   ├── store.ts       # Zustand stores
│   └── api/           # Client-side fetch helpers
├── models/            # Mongoose models
├── types/             # TypeScript types & DTOs
└── utils/             # Shared utilities
```
