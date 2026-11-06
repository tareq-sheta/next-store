# Cyber — Tech E-commerce Store

A full-stack e-commerce platform for browsing, purchasing, and managing tech products. Built with Next.js 16 App Router and TypeScript on the frontend, MongoDB + Mongoose on the backend, and NextAuth.js (supporting credentials and Google OAuth) for authentication. Designed for three user roles — **customer**, **seller**, and **admin** — each with a tailored experience: customers shop and track orders, sellers manage their product catalog through a dedicated dashboard, and admins oversee the entire platform including users, all orders, and analytics.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Available Scripts](#available-scripts)
7. [API Overview](#api-overview)
8. [Project Structure](#project-structure)
9. [Roadmap](#roadmap)
10. [Contributing](#contributing)
11. [License](#license)

---

## Overview

Cyber follows a **monolithic Next.js architecture** where both the frontend and backend live in a single codebase. API routes under `app/api/` serve as the REST backend, accessed by client-side fetch helpers in `lib/api/`. Server-side auth guards (`lib/auth-guard.ts`) and an RBAC module (`lib/rbac/`) enforce role and ownership rules on every protected endpoint. Data is persisted in MongoDB via Mongoose models. Global UI state (cart, session) is managed with Zustand and cached on the client with TanStack React Query. Image uploads are handled through Cloudinary via `next-cloudinary`.

---

## Features

- 🛍️ Product browsing, searching, and filtering by category
- 🛒 Shopping cart with persistent client state (Zustand + localStorage)
- 🔐 Authentication via credentials **and** Google OAuth (NextAuth.js)
- 👥 Role-based access control — `customer` / `seller` / `admin`
- 📦 Order placement and order history per user
- 🧑‍💼 Seller dashboard with product and order management
- 📊 Admin dashboard with analytics (Recharts) and user management
- ❤️ Favorites / wishlist page
- 🖼️ Image uploads via Cloudinary
- ✅ Input validation with Zod schemas and React Hook Form
- 📄 Pagination on product listings
- 🔔 Toast notifications via Sonner
- 📱 Fully responsive design (Tailwind CSS v4)
- 🧪 Jest test suite for API routes

---

## Tech Stack

| Layer                | Technology                                                |
| -------------------- | --------------------------------------------------------- |
| Framework            | Next.js 16 (App Router)                                   |
| Language             | TypeScript 5                                              |
| Styling              | Tailwind CSS v4                                           |
| Database             | MongoDB + Mongoose 9                                      |
| Auth                 | NextAuth.js v4 (credentials + Google OAuth, JWT sessions) |
| State Management     | Zustand v5                                                |
| Server State / Cache | TanStack React Query v5                                   |
| Forms                | React Hook Form v7                                        |
| Validation           | Zod v4                                                    |
| Image Hosting        | Cloudinary (`next-cloudinary`)                            |
| Charts               | Recharts v3                                               |
| Notifications        | Sonner v2                                                 |
| Icons                | React Icons v5                                            |
| 3D Models            | `@google/model-viewer`                                    |
| Rate Limiting        | `lru-cache`                                               |
| Hashing              | `bcryptjs`                                                |
| Slugs                | `slugify`                                                 |
| Image Processing     | `sharp`                                                   |
| Testing              | Jest v30 + `ts-jest` + `node-mocks-http`                  |

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- A **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A **Google Cloud** project with OAuth 2.0 credentials (for Google sign-in)
- A **Cloudinary** account (for image uploads)

### Installation

```bash
git clone https://github.com/tareq-sheta/next-store.git
cd next-store
npm install
```

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local   # or create .env.local manually — see below
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# ── NextAuth ──────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000          # Full URL of your app
NEXTAUTH_SECRET=                           # openssl rand -base64 32

# ── Database ──────────────────────────────────────────────
MONGODB_URI=                               # e.g. mongodb://localhost:27017/next-store

# ── Google OAuth ──────────────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── Cloudinary ────────────────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=         # Exposed to the browser
CLOUDINARY_API_KEY=                        # Server-side only
CLOUDINARY_API_SECRET=                     # Server-side only
```

> **Never commit `.env.local` to version control.** It is already included in `.gitignore`.

---

## Available Scripts

All scripts are run from the project root with `npm run <script>`.

| Script       | Description                                          |
| ------------ | ---------------------------------------------------- |
| `dev`        | Start the Next.js development server                 |
| `build`      | Create a production build                            |
| `start`      | Start the production server (requires `build` first) |
| `lint`       | Run ESLint across the codebase                       |
| `test`       | Run the Jest test suite (verbose)                    |
| `test:watch` | Run Jest in interactive watch mode                   |

---

## API Overview

All routes are prefixed with `/api`. Protected routes enforce authentication and/or role checks server-side via `lib/auth-guard.ts` and `lib/rbac/`.

### Auth

| Method | Endpoint                  | Auth Required | Description                                                 |
| ------ | ------------------------- | ------------- | ----------------------------------------------------------- |
| POST   | `/api/auth/register`      | No            | Register a new user (credentials)                           |
| `*`    | `/api/auth/[...nextauth]` | —             | NextAuth.js handler (sign-in, sign-out, session, callbacks) |

### Products

| Method | Endpoint             | Auth Required          | Description                                       |
| ------ | -------------------- | ---------------------- | ------------------------------------------------- |
| GET    | `/api/products`      | No                     | List products (supports search & category filter) |
| POST   | `/api/products`      | Admin / Seller         | Create a new product                              |
| GET    | `/api/products/[id]` | No                     | Get a single product by ID                        |
| PATCH  | `/api/products/[id]` | Admin / Seller (owner) | Update a product                                  |
| DELETE | `/api/products/[id]` | Admin                  | Delete a product                                  |
| GET    | `/api/products/top`  | No                     | Get top/featured products                         |

### Users

| Method | Endpoint          | Auth Required | Description      |
| ------ | ----------------- | ------------- | ---------------- |
| GET    | `/api/users`      | Admin         | List all users   |
| GET    | `/api/users/[id]` | Owner / Admin | Get a user by ID |
| PATCH  | `/api/users/[id]` | Owner / Admin | Update a user    |
| DELETE | `/api/users/[id]` | Admin         | Delete a user    |

### Cart

| Method | Endpoint         | Auth Required | Description                  |
| ------ | ---------------- | ------------- | ---------------------------- |
| GET    | `/api/cart`      | Authenticated | Get the current user's cart  |
| POST   | `/api/cart`      | Authenticated | Add an item to the cart      |
| DELETE | `/api/cart/[id]` | Authenticated | Remove an item from the cart |

### Categories

| Method | Endpoint               | Auth Required | Description          |
| ------ | ---------------------- | ------------- | -------------------- |
| GET    | `/api/categories`      | No            | List all categories  |
| POST   | `/api/categories`      | Admin         | Create a category    |
| GET    | `/api/categories/[id]` | No            | Get a category by ID |
| PATCH  | `/api/categories/[id]` | Admin         | Update a category    |
| DELETE | `/api/categories/[id]` | Admin         | Delete a category    |

### Orders

| Method | Endpoint           | Auth Required | Description                                     |
| ------ | ------------------ | ------------- | ----------------------------------------------- |
| GET    | `/api/orders`      | Authenticated | List orders (customers see own; admins see all) |
| POST   | `/api/orders`      | Authenticated | Place a new order                               |
| GET    | `/api/orders/[id]` | Owner / Admin | Get an order by ID                              |
| PATCH  | `/api/orders/[id]` | Admin         | Update order status                             |

### Admin Utilities

| Method | Endpoint                  | Auth Required  | Description                   |
| ------ | ------------------------- | -------------- | ----------------------------- |
| GET    | `/api/admin/products`     | Admin          | Admin product management view |
| GET    | `/api/admin/users`        | Admin          | Admin user management view    |
| GET    | `/api/dashboard/products` | Admin / Seller | Dashboard product stats       |

---

## Project Structure

```
next-store/
├── .env.local                      ← never commit this
├── .gitignore
├── README.md
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── jest.config.ts
├── jest.setup.ts
├── package.json
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    ← Home (Server Component)
│   ├── globals.css
│   ├── favicon.ico
│   │
│   ├── login/page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── payment/page.tsx
│   ├── profile/page.tsx
│   ├── favorites/page.tsx
│   ├── about/page.tsx
│   ├── [...catchall]/              ← 404 catch-all
│   │
│   ├── dashboard/                  ← Role-gated dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── analytics/
│   │   ├── orders/page.tsx
│   │   ├── products/page.tsx
│   │   └── users/page.tsx
│   │
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts
│       │   └── register/route.ts
│       ├── products/
│       │   ├── route.ts
│       │   ├── [id]/route.ts
│       │   └── top/route.ts
│       ├── users/
│       │   ├── route.ts            ← GET list (Admin only)
│       │   └── [id]/route.ts
│       ├── cart/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── categories/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── orders/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── admin/
│       │   ├── products/route.ts
│       │   └── users/route.ts
│       └── dashboard/
│           └── products/route.ts
│
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   ├── ProductSkeleton.tsx
│   ├── ProductsPageContent.tsx
│   ├── CategoryMain.tsx
│   ├── SalePanner.tsx
│   ├── LayoutContent.tsx
│   ├── AddToCartButton.tsx
│   ├── AnimatedHumburgerMenu.tsx
│   ├── Pagination.tsx
│   ├── SearchAndFilter.tsx
│   ├── TopProducts.tsx
│   └── dashboard/
│       ├── AdminAnalytics.tsx
│       ├── AdminOverview.tsx
│       ├── SellerAnalytics.tsx
│       ├── SellerOverview.tsx
│       ├── SectionHeader.tsx
│       ├── dashboard-shared.tsx
│       └── sidebar.tsx
│
├── lib/
│   ├── auth.ts                     ← NextAuth config (credentials + Google)
│   ├── auth-guard.ts               ← requireAuth() / requireRole() helpers
│   ├── database.ts                 ← MongoDB connection (singleton)
│   ├── store.ts                    ← Zustand stores (cart, etc.)
│   ├── data.ts                     ← Server-side data fetching helpers
│   ├── dto.ts                      ← Data Transfer Object mappings
│   ├── rate-limiting.ts            ← LRU-cache based rate limiter
│   ├── index.ts                    ← Barrel exports
│   ├── api/                        ← Client-side fetch helpers
│   │   ├── users.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   └── categories.ts
│   ├── actions/
│   │   └── users.actions.ts        ← Next.js Server Actions
│   ├── rbac/                       ← Role-based access control
│   │   ├── roles.ts
│   │   ├── ownership.ts
│   │   └── scope.ts
│   ├── services/
│   │   └── users.service.ts
│   └── validations/                ← Zod schemas
│       ├── users.ts
│       ├── products.ts
│       ├── cart.ts
│       ├── orders.ts
│       └── categories.ts
│
├── models/                         ← Mongoose models
│   ├── users.ts
│   ├── products.ts
│   ├── categories.ts
│   ├── cart.ts
│   ├── cartItem.ts
│   ├── orders.ts
│   └── orderItem.ts
│
├── types/
│   ├── index.ts                    ← Barrel exports
│   ├── users.ts
│   ├── products.ts
│   ├── cart.ts
│   ├── orders.ts
│   ├── categories.ts
│   ├── next-auth.d.ts              ← NextAuth type extensions
│   └── css.d.ts
│
├── hooks/
│   ├── useIsLogged.tsx
│   ├── useRequireAuth.ts
│   └── users/
│       ├── useGetUsers.ts
│       ├── useGetOneUser.ts
│       ├── useCreateUser.ts
│       ├── useUpdateUser.ts
│       └── useDeleteUser.ts
│
├── utils/
│   ├── ErrorHandler.ts
│   ├── general.ts
│   └── mongoose.ts
│
├── __tests__/
│   ├── api/
│   │   └── orders/
│   │       ├── route.test.ts
│   │       └── [id]/route.test.ts
│   ├── helpers/
│   │   ├── mock-auth.ts
│   │   └── mock-data.ts
│   ├── lib/
│   └── utils/
│
└── public/
    └── assets/
        ├── images/
        └── imgs/
```

---

## Roadmap

Based on the current state of the codebase, the following items are planned or identified as missing:

- [ ] **Payment integration** — the `/payment` page exists as a placeholder but no payment gateway (Stripe, PayPal, etc.) is connected
- [ ] **Expand test coverage** — only `/api/orders` routes have tests; products, users, cart, and categories routes need coverage
- [ ] **Email notifications** — no transactional email (e.g., order confirmation) is implemented
- [ ] **Product reviews & ratings** — no review model or UI currently exists
- [ ] **Address book** — profile page exists but structured multi-address management is not yet implemented
- [ ] **Stock / inventory tracking** — products have no quantity/stock field currently enforced at checkout
- [ ] **Seller product image upload via Cloudinary** — `next-cloudinary` is installed but the upload flow in the seller dashboard may need hardening
- [ ] **CI/CD pipeline** — no GitHub Actions or deployment workflow defined
- [ ] **End-to-end tests** — no Playwright or Cypress setup
- [ ] **Internationalisation (i18n)** — single-language only

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Commit your changes**: `git commit -m "feat: add your feature"`
4. **Push to your branch**: `git push origin feature/your-feature-name`
5. **Open a Pull Request** and describe what you changed and why

Please follow the existing code style (ESLint config is enforced). Make sure all existing tests pass before submitting:

```bash
npm run lint
npm run test
```

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with ❤️ using Next.js · Made by <a href="https://github.com/tareq-sheta">tareq-sheta</a></p>

## Features

- Product browsing & filtering by category
- Shopping cart with persistent state (Zustand + localStorage)
- User authentication (credentials-based with bcrypt)
- Role-based access control (admin / seller / customer)
- Order management
- User profiles & address book
- Responsive design

## Tech Stack

| Layer     | Technology                   |
| --------- | ---------------------------- |
| Framework | Next.js 16 (App Router)      |
| Language  | TypeScript                   |
| Styling   | Tailwind CSS v4              |
| Database  | MongoDB + Mongoose           |
| Auth      | NextAuth.js (JWT)            |
| State     | Zustand                      |
| Forms     | React Hook Form              |
| Images    | Cloudinary (next-cloudinary) |

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

| Method | Endpoint            | Auth Required  | Description       |
| ------ | ------------------- | -------------- | ----------------- |
| GET    | `/api/products`     | No             | List all products |
| GET    | `/api/products/:id` | No             | Get product by id |
| POST   | `/api/products`     | Admin / Seller | Create product    |
| PATCH  | `/api/products/:id` | Admin / Seller | Update product    |
| DELETE | `/api/products/:id` | Admin          | Delete product    |
| POST   | `/api/users`        | No             | Register          |
| POST   | `/api/auth/login`   | No             | Login             |
| GET    | `/api/users`        | Admin          | List all users    |
| GET    | `/api/users/:id`    | Owner / Admin  | Get user          |
| PATCH  | `/api/users/:id`    | Owner / Admin  | Update user       |
| DELETE | `/api/users/:id`    | Admin          | Delete user       |
| GET    | `/api/cart`         | Owner / Admin  | Get cart          |
| POST   | `/api/cart`         | Authenticated  | Add to cart       |
| GET    | `/api/orders`       | Authenticated  | Get orders        |
| POST   | `/api/orders`       | Authenticated  | Place order       |

## Project Structure

<!--
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
``` -->

next-store/
├── .env.example
├── .env.local ← never commit this
├── .gitignore
├── README.md
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── package.json
│
├── app/
│ ├── layout.tsx
│ ├── page.tsx ← Server Component (no "use client")
│ ├── globals.css
│ ├── favicon.ico
│ │
│ ├── login/
│ │ └── page.tsx
│ ├── products/
│ │ ├── page.tsx
│ │ └── [id]/
│ │ └── page.tsx
│ ├── cart/
│ │ └── page.tsx
│ ├── checkout/
│ │ └── page.tsx
│ ├── payment/
│ │ └── page.tsx
│ ├── profile/
│ │ └── page.tsx
│ ├── about/
│ │ └── page.tsx
│ │
│ └── api/
│ ├── auth/
│ │ ├── [...nextauth]/
│ │ │ └── route.ts ← NextAuth handler
│ │ └── login/
│ │ └── route.ts
│ ├── products/
│ │ ├── route.ts
│ │ └── [id]/
│ │ └── route.ts
│ ├── users/
│ │ ├── route.ts
│ │ └── [id]/
│ │ └── route.ts
│ ├── cart/
│ │ ├── route.ts
│ │ └── [id]/
│ │ └── route.ts
│ ├── categories/
│ │ ├── route.ts
│ │ └── [id]/
│ │ └── route.ts
│ └── orders/
│ ├── route.ts
│ └── [id]/
│ └── route.ts
│
├── components/
│ ├── Header.tsx
│ ├── Footer.tsx
│ ├── Hero.tsx
│ ├── ProductCard.tsx
│ ├── CategoryMain.tsx
│ ├── SalePanner.tsx
│ ├── LayoutContent.tsx
│ └── ProductsPageContent.tsx
│
├── lib/
│ ├── auth.ts ← NextAuth config
│ ├── authGuard.ts ← requireAuth() helper
│ ├── database.ts ← MongoDB connection
│ ├── store.ts ← Zustand stores
│ └── api/ ← client-side fetch helpers
│ ├── users.ts
│ ├── products.ts
│ ├── cart.ts
│ ├── orders.ts
│ └── categories.ts
│
├── models/
│ ├── users.ts
│ ├── products.ts
│ ├── cart.ts
│ ├── cartItem.ts
│ ├── orders.ts
│ ├── orderItem.ts
│ └── categories.ts
│
├── types/
│ ├── index.ts ← barrel exports
│ ├── users.ts
│ ├── products.ts
│ ├── cart.ts
│ ├── orders.ts
│ ├── categories.ts
│ └── next-auth.d.ts ← NextAuth type extensions
│
├── hooks/
│ ├── useIsLogged.tsx
│ └── users/
│ ├── useGetUsers.ts
│ ├── useGetOneUser.ts
│ ├── useCreateUser.ts
│ ├── useUpdateUser.ts
│ └── useDeleteUser.ts
│
├── handlers/ ← re-exports of lib/api for components
│ ├── users.ts
│ └── products.ts
│
├── utils/
│ └── ErrorHandler.ts
│
└── public/
└── assets/
├── images/ ← keep (used in components)
└── imgs/ ← keep (used in components)
