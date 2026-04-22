# 🛒 BuyFresh – Full-Stack Grocery Application

> A modern, full-stack grocery shopping application built with Next.js, TypeScript, MongoDB Atlas, and Tailwind CSS. Features a seamless end-to-end shopping experience with real-time cart management, order placement, and a polished responsive UI.

---

## ✨ Features

- 🔍 **Product Listing** — Browse products with category filtering and live search
- 🛒 **Cart Management** — Add, update quantity, and remove items with instant feedback
- 💳 **Checkout & Order Placement** — Smooth checkout flow with order confirmation
- 📦 **Order History** — View past orders with item-level detail
- 📱 **Responsive UI** — Mobile-first design that works across all screen sizes
- 🌙 **Dark / Light Mode** — System-aware theming with a manual toggle, zero flash
- 🔔 **Toast Notifications** — Real-time success/error feedback on all user actions
- ⏳ **Skeleton Loaders** — Polished loading states for every data-fetching scenario

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| **Frontend** | Next.js 14 (App Router), React 18 |
| **Language** | TypeScript                         |
| **Styling**  | Tailwind CSS                       |
| **Backend**  | Next.js API Routes (REST)          |
| **Database** | MongoDB Atlas + Mongoose           |
| **Icons**    | Heroicons                          |
| **Notifications** | react-hot-toast              |

---

## 📁 Project Structure

```
buyfresh/
├── app/
│   ├── api/              # REST API routes (cart, products, orders)
│   ├── cart/             # Cart page
│   ├── checkout/         # Checkout page
│   ├── orders/           # Order history page
│   ├── product/          # Product detail page
│   ├── layout.tsx        # Root layout with Navbar, Footer & providers
│   └── page.tsx          # Home / product listing page
├── components/           # Reusable UI components (Navbar, Footer, Cards, etc.)
├── context/              # Cart context (global state)
├── lib/                  # MongoDB connection helper
├── models/               # Mongoose data models (Product, Order, Cart)
├── public/               # Static assets
├── .env.example          # Environment variable template
└── tailwind.config.ts    # Tailwind configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18.x`
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier works)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Rashmiranjantandia/BuyFresh.git
cd BuyFresh

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your MongoDB Atlas connection string

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root (use `.env.example` as a template):

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# Optional: App name used in metadata
NEXT_PUBLIC_APP_NAME=BuyFresh
```

> ⚠️ **Never commit your `.env.local` file.** It is already excluded via `.gitignore`.

---

## 📸 Screenshots

| Home Page | Cart | Orders |
|-----------|------|--------|
| Product grid with filters and search | Cart with quantity controls | Full order history |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Fetch all products |
| `GET` | `/api/products/:id` | Fetch a single product |
| `GET` | `/api/cart` | Get current cart |
| `POST` | `/api/cart` | Add item to cart |
| `PATCH` | `/api/cart` | Update item quantity |
| `DELETE` | `/api/cart` | Remove item from cart |
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders` | Fetch order history |

---

## 🔮 Future Improvements

- 🔐 **Authentication** — User accounts with [NextAuth.js](https://next-auth.js.org/)
- 💳 **Payments** — Razorpay / Stripe integration
- 📍 **Real-time Order Tracking** — Live delivery status updates
- 🔎 **Advanced Search** — Elastic search or full-text MongoDB search
- 📊 **Admin Dashboard** — Product & order management panel

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ using <strong>Next.js</strong> & <strong>MongoDB Atlas</strong>
</p>
