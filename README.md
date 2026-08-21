# ⚡ New Navnath Electronics & Electricals

An e-commerce and electrical service-booking website for **New Navnath Electronics & Electricals**. The platform allows customers to browse and purchase electronic/electrical products, book electrical services, track orders and service requests, while administrators manage products, categories, orders, users and services.

## 🌐 Website


---

## 📌 Project Overview

New Navnath Electronics & Electricals is designed as a complete digital platform for an electrical and electronics business.

The website provides two major flows:

- **Customer Flow** – Product shopping, service booking, account management, order tracking and support.
- **Admin Flow** – Dashboard, product/category management, order management, user management, service management and reports.

The goal is to provide customers with a convenient online shopping and service-booking experience while giving the business an efficient administration system.

---

## ✨ Key Features

### 👤 Customer Features

- User Registration and Login
- User Profile
- Browse Products
- Search and Filter Products
- Product Categories
- Product Details
- Add to Cart
- Wishlist
- Checkout
- Multiple Payment Methods
  - Cash on Delivery
  - UPI
  - Card
- Order Confirmation
- Order Tracking
- Invoice/Receipt
- Electrical Service Booking
- Service Request Tracking
- Technician Visit and Service Completion
- Contact Form
- Address and Map
- Call / WhatsApp Support

### 🛠️ Admin Features

- Secure Admin Login
- Admin Dashboard
- Business Overview and Analytics
- Product Management
  - Add Product
  - Edit Product
  - Delete Product
  - Update Price
  - Manage Stock
- Category Management
- Order Management
  - View Orders
  - Accept / Reject Orders
  - Ship / Deliver Orders
- User Management
  - View Customers
  - Order History
- Service Management
  - View Service Requests
  - Accept / Reject Requests
  - Mark Services Completed
- Reports and Analytics
  - Sales Graph
  - Revenue
  - Best-Selling Products
- Admin Logout

---

## 🏗️ System Flow

### Customer Flow

```text
Visit Website
      ↓
Browse Products / Services
      ↓
Login / Register
      ↓
Browse Products
      ↓
Product Details
      ↓
Add to Cart / Wishlist
      ↓
Checkout
      ↓
Fill Delivery Details
      ↓
Choose Payment Method
      ↓
Place Order
      ↓
Order Confirmation
      ↓
Track Order
      ↓
Order Delivered
```

### Service Booking Flow

```text
View Service List
      ↓
Select Service
      ↓
Fill Booking Form
      ↓
Submit Request
      ↓
Service Confirmation
      ↓
Technician Visit
      ↓
Service Completed
```

### Admin Flow

```text
Admin Login
      ↓
Admin Dashboard
      ↓
Manage Products / Categories
      ↓
Manage Orders / Users / Services
      ↓
View Reports & Analytics
      ↓
Logout
```

---

## 💻 Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend |
| Node.js | Backend Runtime |
| Express.js | Backend/API |
| MongoDB | Database |
| Razorpay | Online Payments |
| Cloudinary | Image Storage |
| Vercel / Render | Deployment |

### Frontend

- React.js
- Responsive UI
- Component-based architecture
- Search and filtering
- Shopping cart
- Wishlist
- Customer account

### Backend

- Node.js
- Express.js
- REST APIs
- Authentication and authorization
- Product and order management
- Service booking management

### Database

- MongoDB
- Stores users, products, categories, orders and service requests

---

## 💳 Payment Integration

The website supports multiple payment options:

- Cash on Delivery
- UPI
- Credit/Debit Card
- Razorpay payment gateway

Payment integration should be configured using environment variables rather than storing credentials directly in source code.

---

## ☁️ Image Storage

**Cloudinary** is used for managing and storing product/service images.

This allows images to be uploaded and served efficiently without storing large image files directly inside the project repository.

---

## 📱 Responsive Design

The website is designed to work across:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile
- 📱 Tablet

The interface focuses on a clean, modern and user-friendly shopping experience.

---

## 🌙 Additional UI Features

- Dark Mode
- Responsive Design
- Search & Filters
- Wishlist
- Order Tracking
- Invoice Download
- Live Support / WhatsApp
- Modern Dashboard
- Sales and Revenue Analytics

---

## 📂 Project Structure

A typical project structure is:

```text
Navnath-Electronics/
│
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/                 # Node.js / Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── ...
│
├── .gitignore
├── README.md
└── package.json
```

> The exact folder structure may vary depending on the current implementation.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Abhishekyeole05/Navnath-Electronics.git
```

```bash
cd Navnath-Electronics
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal or go back to the project root:

```bash
cd ../server
npm install
```

### 4. Configure Environment Variables

Create `.env` files according to the environment variables required by the project.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Never upload `.env` files or secret API keys to GitHub.**

### 5. Start the Backend

```bash
cd server
npm run dev
```

or, depending on the project configuration:

```bash
npm start
```

### 6. Start the Frontend

In another terminal:

```bash
cd client
npm run dev
```

The frontend will normally be available at the local development address shown by Vite/React.

---

## 🔐 Security

The project should follow these security practices:

- Passwords must be securely hashed.
- Authentication should use secure tokens/sessions.
- Admin routes must require authorization.
- API keys and database credentials must be stored in environment variables.
- Sensitive information must not be committed to GitHub.
- Payment verification should be performed on the backend.

---

## 📊 Admin Dashboard

The admin dashboard provides an overview of business activity, including:

- Total Sales
- Revenue
- Orders
- Customers
- Service Requests
- Best-Selling Products
- Sales Graphs

---

## 🛒 E-Commerce Module

The e-commerce module allows customers to:

1. Browse products.
2. Search and filter products.
3. View product specifications and pricing.
4. Add products to the cart.
5. Add products to the wishlist.
6. Complete checkout.
7. Make payment.
8. Receive order confirmation.
9. Track their order.

---

## 🔧 Electrical Service Module

Customers can book electrical services such as:

- Repair
- Installation
- Maintenance
- Other electrical services

The service workflow includes:

```text
Service Selection
       ↓
Booking Form
       ↓
Request Submission
       ↓
Confirmation
       ↓
Technician Visit
       ↓
Service Completion
```

---

## 📞 Customer Support

Customers can contact the business through:

- Contact Form
- Phone Call
- WhatsApp
- Address / Map
- Quick Support

---

## 🚀 Deployment

The application can be deployed using:

- **Frontend:** Vercel
- **Backend:** Render / other Node.js hosting
- **Database:** MongoDB Atlas
- **Images:** Cloudinary
- **Payments:** Razorpay

---

## 🔮 Future Enhancements

Possible future improvements include:

- Product reviews and ratings
- Advanced recommendation system
- Coupon and discount management
- Push/email/SMS notifications
- Advanced inventory management
- Customer loyalty program
- Technician live tracking
- Automated invoice generation
- Advanced sales analytics
- AI-powered product recommendations

---

## 👨‍💻 Development

This project is developed for **New Navnath Electronics & Electricals** to digitize product sales and electrical service bookings.

### Main Modules

- Customer Authentication
- Product Management
- Category Management
- Shopping Cart
- Wishlist
- Checkout & Payments
- Order Management
- Service Booking
- User Management
- Admin Dashboard
- Reports & Analytics
- Customer Support

---

## 📄 License

This project is developed for **New Navnath Electronics & Electricals**. All rights reserved unless otherwise specified by the project owner.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**New Navnath Electronics & Electricals**  
_E-Commerce & Electrical Service Booking Platform_
