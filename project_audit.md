# 🔍 Project Audit Report — New Navnath Electronics & Electricals

> **Audit Date:** October 7, 2026 | **Branch:** `samartha` | **Read-only — No files were modified.**

---

## STEP 1 — Project Summary

**New Navnath Electronics & Electricals** is a full-stack e-commerce + home-services website for a real electrical goods shop in Manmad, Maharashtra. It sells branded electrical products (Havells, Polycab, Anchor, Schneider) and lets customers book certified home electricians. It supports UPI QR, Razorpay, and Cash-on-Delivery payments, has a full admin portal for managing products/orders/bookings, and a multi-language (English/Marathi) UI with dark/light theme. The backend is Node.js/Express with MongoDB Atlas (with a zero-config in-memory fallback for demo mode).

---

## STEP 2 — Completed & Working

| # | Feature / File | What it does | Confidence |
|---|---|---|---|
| 1 | **Navbar** — `Navbar.jsx` | Full nav with live search (debounced), cart/wishlist badge counts, theme toggle, language switcher (EN/MR), user menu, mobile hamburger, demo login buttons | ✅ Fully working |
| 2 | **HeroBanner** — `HeroBanner.jsx` | 3-slide Swiper carousel with autoplay, fade, category links | ✅ Fully working |
| 3 | **ProductCategoriesGrid** — `ProductCategoriesGrid.jsx` | Category grid with icons and product links | ✅ Fully working |
| 4 | **FeaturedProducts** — `FeaturedProducts.jsx` | API-connected featured product section | ✅ Fully working |
| 5 | **AboutShop / WhyChooseUs / StatisticsCounter / BrandPartners / CustomerReviews / CallToAction** — `home/` | All home section components built and assembled | ✅ Fully working |
| 6 | **Home Page** — `Home.jsx` | Assembles all home sections | ✅ Fully working |
| 7 | **Products Page** — `Products.jsx` | Full product listing with search, filter by category/brand, sort, pagination, API-connected | ✅ Fully working |
| 8 | **Product Details** — `ProductDetails.jsx` | Full page with specs, add-to-cart, wishlist, review submission (API) | ✅ Fully working |
| 9 | **Cart** — `Cart.jsx` | Item list, quantity update, remove, coupon apply, subtotal calculation | ✅ Fully working |
| 10 | **Checkout** — `Checkout.jsx` | Full multi-step checkout: address form, UPI QR modal with countdown timer, Razorpay modal, COD, demo instant mode, payment verification, order creation | ✅ Fully working |
| 11 | **OrderSuccess / Receipt** — `OrderSuccess.jsx` | Post-order confirmation with PDF invoice generation (jsPDF) via `/api/orders/:id` | ✅ Fully working |
| 12 | **Login** — `Login.jsx` | Email/password login + demo admin/customer buttons, JWT-based | ✅ Fully working |
| 13 | **Register** — `Register.jsx` | Name, email, phone, password registration | ✅ Fully working |
| 14 | **Forgot Password** — `ForgotPassword.jsx` | Sends reset email via `/api/auth/forgot-password` | ✅ Fully working |
| 15 | **Reset Password** — `ResetPassword.jsx` | Token-based password reset via `/api/auth/reset-password/:token` | ✅ Fully working |
| 16 | **User Dashboard** — `UserDashboard.jsx` | Tabs: My Cart, My Orders, Electrician Bookings, Wishlist | ✅ Fully working |
| 17 | **Admin Dashboard** — `AdminDashboard.jsx` | Stats cards, product CRUD, order status management, booking status management | ✅ Fully working |
| 18 | **Services Page** — `Services.jsx` | List services, booking form (API-connected) | ✅ Fully working |
| 19 | **Contact Page** — `Contact.jsx` | Form + real store info + Google Maps embed | ⚠️ Looks working but **form does not actually submit to any API/email** |
| 20 | **Policy Pages** — `PrivacyPolicy.jsx`, `TermsConditions.jsx`, `ReturnRefund.jsx`, `ShippingDelivery.jsx` | Static legal/policy text pages | ✅ Fully working |
| 21 | **Footer** — `Footer.jsx` | Links to all pages including policy pages | ✅ Fully working |
| 22 | **AuthContext** — `AuthContext.jsx` | JWT login/logout/register, profile sync, demo helpers | ✅ Fully working |
| 23 | **CartContext** — `CartContext.jsx` | localStorage-backed cart, coupon apply, subtotal/total computed | ✅ Fully working |
| 24 | **WishlistContext** — `WishlistContext.jsx` | localStorage + server-synced wishlist toggle | ✅ Fully working |
| 25 | **LanguageContext** — `LanguageContext.jsx` | Full EN/MR translation dictionary + switcher | ✅ Fully working |
| 26 | **ThemeContext** — `ThemeContext.jsx` | Dark/light theme toggle | ✅ Fully working |
| 27 | **Common components** — `ProductCard`, `ServiceCard`, `SkeletonLoader`, `Toast`, `FloatingButtons`, `ScrollProgressBar` | All utility components built | ✅ Fully working |
| 28 | **Server Auth Routes** — `authController.js` | Register, login, profile, address update, wishlist toggle, forgot/reset password | ✅ Fully working |
| 29 | **Server Product Routes** — `productController.js` | Get all, filter/search, get by ID, add review | ✅ Fully working |
| 30 | **Server Order Routes** — `orderController.js` | Create order, user orders, get by ID, cancel, apply coupon, mark paid | ✅ Fully working |
| 31 | **Server Payment Routes** — `paymentController.js` | Razorpay config, create order, verify payment (HMAC), UPI UTR verify | ✅ Fully working |
| 32 | **Server Admin Routes** — `adminController.js` | Stats, product CRUD, all orders, all bookings, all users, coupon CRUD | ✅ Fully working |
| 33 | **Auth Middleware** — `authMiddleware.js` | JWT `protect`, `optionalAuth`, `adminOnly` guards | ✅ Fully working |
| 34 | **DB Dual Mode** — `db.js` + `memoryStore.js` | Auto-falls back to in-memory store if no MongoDB URI | ✅ Fully working |
| 35 | **Seed Data** — `seedData.js` | Auto-seeds products, categories, services, coupons, demo users on startup | ✅ Fully working |
| 36 | **App Routing** — `App.jsx` | All 18 routes wired, toast system global | ✅ Fully working |

---

## STEP 3 — Partially Done / Incomplete

| # | File | What's Missing |
|---|---|---|
| 1 | **`authController.js` L39** | **Passwords stored in plaintext** — comment says *"In production, hash with bcrypt"* — bcrypt is installed but unused. This is a critical security issue. |
| 2 | **`ForgotPassword.jsx` L25** | Uses `fetch('http://localhost:5000/api/auth/forgot-password')` — **hardcoded absolute URL** instead of relative `/api/`. Will break in any deployed environment. |
| 3 | **`ResetPassword.jsx` L39** | Same issue — `fetch('http://localhost:5000/api/auth/reset-password/...')` — **hardcoded localhost URL**. |
| 4 | **`authController.js` L186** | Reset link hardcoded as `http://localhost:5173/reset-password/${token}` — this is the **link emailed to users**. Will be dead link on any deployment. |
| 5 | **`Contact.jsx` handleSubmit** | Form sets `submitted = true` and shows a toast, but **does NOT call any API or send any email**. Inquiry goes nowhere. |
| 6 | **`adminController.js` L20-28** | `monthlyRevenue` chart data is **completely hardcoded static dummy data** (Jan-Jun figures are fake). Only July uses real `totalRevenue`. |
| 7 | **`adminController.js` L36** | `bestSellingProducts.sales` uses `Math.floor(20 + Math.random() * 50)` — **random fake sales numbers** every request. |
| 8 | **`Checkout.jsx` L17-24** | Shipping address is **pre-filled with hardcoded demo values** (`'Sanjay Patil'`, `'Opposite Bus Stand'`, `'Manmad'`). Not pulled from user's saved address. |
| 9 | **`server/.env.example`** — no actual `.env` file | EMAIL_USER and EMAIL_PASS for nodemailer are **missing from .env.example**. Forgot-password email will always fail without these configured. |
| 10 | **`AdminDashboard.jsx`** | Admin can **delete products** but there is no **Edit Product** UI — only add/delete. No image URL validation. |
| 11 | **`AdminDashboard.jsx`** | **No coupon management UI** — backend supports creating/listing coupons but the admin panel has no tab for it. |
| 12 | **`UserDashboard.jsx` Cart tab** | Quantity is shown but **update quantity buttons are missing** (only a Remove button). `updateQuantity` is imported but not used in this view. |
| 13 | **`server/server.js` CORS** | `app.use(cors())` uses **wildcard CORS** (allows all origins). Not safe for production. |

---

## STEP 4 — Not Started / Missing

| # | Missing Feature | Notes |
|---|---|---|
| 1 | **Password hashing (bcrypt)** | Installed but never called. Plain-text passwords in DB is a critical P0 risk. |
| 2 | **Environment variable for frontend API base URL** | `VITE_API_BASE_URL` is not used — the Vite proxy only works locally. No production API config. |
| 3 | **Email configuration (nodemailer)** | `EMAIL_USER` / `EMAIL_PASS` not in `.env.example`. Forgot-password flow is dead without this. |
| 4 | **Order/contact form email notifications** | No confirmation email sent to customer after order placement. |
| 5 | **Image upload system** | Products use external Unsplash URLs. No actual image upload (no Cloudinary, S3, or multer). |
| 6 | **Input validation (server-side)** | No express-validator or Joi used. All routes trust `req.body` directly. |
| 7 | **Rate limiting** | No rate limiting on auth routes (`/auth/login`, `/auth/register`). Brute-force vulnerable. |
| 8 | **Deployment configuration** | No `Procfile`, no `render.yaml`, no `vercel.json`, no Docker. Can't be deployed as-is. |
| 9 | **SEO meta tags** | `index.html` has only a basic title. No Open Graph, Twitter cards, or per-page meta descriptions. |
| 10 | **404 Page** | No catch-all route in `App.jsx` — invalid URLs result in a blank page. |
| 11 | **Protected route wrapper** | No `<ProtectedRoute>` component — `/dashboard` and `/admin` redirect logic is inside each page, not a reusable guard. |
| 12 | **Admin Edit Product** | Create and delete exist; update/edit product form is missing from admin UI (backend PUT route exists). |
| 13 | **Coupon admin UI** | Backend coupon routes exist but no UI in AdminDashboard to list/create coupons. |
| 14 | **Pagination on admin lists** | Orders and bookings lists have no pagination — will become very slow with large data. |
| 15 | **Stock validation at checkout** | Cart doesn't check live stock — a user could checkout with 0-stock items. |

---

## STEP 5 — Issues & Risks

| Severity | Issue | File | Risk |
|---|---|---|---|
| 🔴 CRITICAL | **Passwords stored in plaintext** | `authController.js:39` | Data breach if DB is exposed |
| 🔴 CRITICAL | **Hardcoded `localhost:5000` URLs in pages** | `ForgotPassword.jsx:25`, `ResetPassword.jsx:39` | Password reset completely broken on deployed site |
| 🔴 CRITICAL | **Hardcoded reset link URL in email** | `authController.js:186` | Every password reset email links to localhost — unusable |
| 🟠 HIGH | **Contact form is fake** | `Contact.jsx:14-23` | Customers submit inquiries that go nowhere |
| 🟠 HIGH | **Wildcard CORS** | `server.js:15` | Any website can make cross-origin requests to your API |
| 🟠 HIGH | **No server-side input validation** | All controllers | Malformed data can crash routes or pollute DB |
| 🟠 HIGH | **EMAIL_USER/PASS not documented** | `.env.example` | Forgot-password feature silently fails |
| 🟡 MEDIUM | **Monthly revenue chart is fake data** | `adminController.js:20-28` | Admin sees wrong business metrics |
| 🟡 MEDIUM | **Checkout pre-fills fake address** | `Checkout.jsx:17-24` | Logged-in users must manually correct every field |
| 🟡 MEDIUM | **No rate limiting on auth** | `server.js` / `api.js` | Brute-force login attacks possible |
| 🟡 MEDIUM | **No 404 page** | `App.jsx` | Invalid URLs show blank page |
| 🟡 MEDIUM | **No ProtectedRoute component** | `App.jsx` | Auth guards duplicated in each page |
| 🟡 MEDIUM | **No stock check at checkout** | `Checkout.jsx` | Overselling possible |
| 🟢 LOW | **Admin dashboard stats partially hardcoded** | `adminController.js` | Minor inaccuracy in analytics |
| 🟢 LOW | **No image upload** | Admin dashboard | Product images can only be external URLs |
| 🟢 LOW | **No SEO meta tags** | `index.html` | Poor search engine discoverability |
| 🟢 LOW | **Admin Edit Product missing from UI** | `AdminDashboard.jsx` | Admin can't update existing products from UI |
| 🟢 LOW | **Cart in UserDashboard has no quantity update** | `UserDashboard.jsx` | Minor UX gap |

---

## STEP 6 — Prioritized Remaining Task List

### 🔴 P0 — Blocks the site from working correctly

| # | Task | Effort | Files |
|---|---|---|---|
| 1 | **Hash passwords with bcrypt** on register; compare on login | Small | `authController.js` |
| 2 | **Fix hardcoded localhost URLs** in ForgotPassword and ResetPassword to use relative `/api/` (handled by Vite proxy in dev; needs env var for prod) | Small | `ForgotPassword.jsx`, `ResetPassword.jsx` |
| 3 | **Fix hardcoded reset link in email** — use `process.env.FRONTEND_URL` (add to `.env.example`) | Small | `authController.js`, `.env.example` |
| 4 | **Add EMAIL_USER + EMAIL_PASS to `.env.example`** and document setup | Small | `.env.example` |

### 🟠 P1 — Important for a complete, production-ready product

| # | Task | Effort | Files |
|---|---|---|---|
| 5 | **Wire Contact form to real backend** — POST to `/api/contact` or send via nodemailer | Medium | `Contact.jsx`, `api.js`, `serviceController.js` |
| 6 | **Auto-fill checkout address from user's saved addresses** | Small | `Checkout.jsx`, `AuthContext.jsx` |
| 7 | **Add `<ProtectedRoute>` wrapper** for `/dashboard` and `/admin` | Small | `App.jsx`, new `ProtectedRoute.jsx` |
| 8 | **Add a 404 page** and catch-all route | Small | `App.jsx`, new `NotFound.jsx` |
| 9 | **Restrict CORS** to specific origin(s) | Small | `server.js` |
| 10 | **Add server-side input validation** (express-validator or Joi) on auth + order routes | Medium | All controllers |
| 11 | **Add rate limiting** on `/auth/login` and `/auth/register` (use `express-rate-limit`) | Small | `server.js` or `api.js` |
| 12 | **Add Edit Product UI** in Admin Dashboard | Medium | `AdminDashboard.jsx` |
| 13 | **Add Coupon management tab** in Admin Dashboard | Medium | `AdminDashboard.jsx` |
| 14 | **Fix monthly revenue chart** to use real aggregated data per month | Medium | `adminController.js` |
| 15 | **Add stock check at checkout** before order creation | Small | `Checkout.jsx`, `orderController.js` |

### 🟢 P2 — Polish and nice-to-have

| # | Task | Effort | Files |
|---|---|---|---|
| 16 | **Add quantity update buttons** in UserDashboard Cart tab | Small | `UserDashboard.jsx` |
| 17 | **Add per-page SEO meta tags** (title, description, Open Graph) | Medium | `index.html` + all page files |
| 18 | **Add image upload** (Cloudinary or similar) for admin product creation | Large | `AdminDashboard.jsx`, new upload utility |
| 19 | **Add deployment config** (`render.yaml` or `vercel.json`) | Small | root directory |
| 20 | **Add order confirmation email** to customer after successful order | Medium | `orderController.js`, nodemailer |
| 21 | **Add pagination** to admin orders and bookings list | Small | `AdminDashboard.jsx`, `adminController.js` |

---

## Summary Table

| Feature | Status | Notes |
|---|---|---|
| Homepage | ✅ Done | All sections complete |
| Products listing + filter | ✅ Done | API-connected |
| Product detail + reviews | ✅ Done | API-connected |
| Cart (full) | ✅ Done | localStorage + coupon |
| Checkout (UPI, Razorpay, COD) | ✅ Done | Full payment flow |
| Order success + PDF invoice | ✅ Done | jsPDF working |
| Login / Register | ✅ Done | JWT auth |
| Forgot + Reset Password | ⚠️ Partial | Flow works locally; **broken in production** (hardcoded `localhost` URLs) |
| Password hashing (bcrypt) | ❌ Missing | **CRITICAL** — passwords stored plaintext |
| User Dashboard | ✅ Done | Minor: no qty update in cart tab |
| Admin Dashboard | ⚠️ Partial | Missing: Edit Product, Coupon UI, real chart data |
| Services + Booking | ✅ Done | API-connected |
| Contact Form | ⚠️ Partial | UI done but **form submits nowhere** |
| Policy pages | ✅ Done | Static, complete |
| Navbar + theme + language | ✅ Done | Full EN/MR + dark/light |
| Backend API (all routes) | ✅ Done | All endpoints implemented |
| MongoDB + In-memory fallback | ✅ Done | Dual-mode working |
| Email integration | ⚠️ Partial | Nodemailer configured; EMAIL creds not documented |
| CORS security | ❌ Missing | Wildcard, unsafe for prod |
| Rate limiting | ❌ Missing | Auth routes unprotected |
| Input validation (server) | ❌ Missing | No validation middleware |
| SEO | ❌ Missing | No per-page meta |
| 404 page | ❌ Missing | Blank page on bad URL |
| Deployment config | ❌ Missing | No deploy files |

---

> **⚡ Recommended next step:** Fix **P0 items first** — especially **bcrypt password hashing** and **removing hardcoded localhost URLs** from ForgotPassword and ResetPassword pages. These are the only things currently blocking the site from being safely usable.
