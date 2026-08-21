const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const serviceController = require('../controllers/serviceController');
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController');
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ==========================================
// Authentication Routes
// ==========================================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', protect, authController.getProfile);
router.put('/auth/address', protect, authController.updateAddresses);
router.post('/auth/wishlist', protect, authController.toggleWishlist);

// ==========================================
// Products & Categories Routes
// ==========================================
router.get('/products', productController.getProducts);
router.get('/products/brands', productController.getAllBrands);
router.get('/products/:id', productController.getProductById);
router.post('/products/:productId/reviews', protect, productController.addReview);
router.get('/categories', serviceController.getCategories);

// ==========================================
// Services & Bookings Routes
// ==========================================
router.get('/services', serviceController.getServices);
router.post('/bookings', serviceController.bookService);
router.post('/services/book', serviceController.bookService);
router.get('/bookings/my-bookings', protect, serviceController.getUserBookings);
router.get('/services/mybookings', protect, serviceController.getUserBookings);

// ==========================================
// Orders & Coupons Routes
// ==========================================
router.post('/orders', protect, orderController.createOrder);
router.get('/orders/my-orders', protect, orderController.getUserOrders);
router.get('/orders/myorders', protect, orderController.getUserOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id/cancel', protect, orderController.cancelOrder);
router.put('/orders/:id/pay', orderController.updateOrderToPaid);
router.post('/coupons/apply', orderController.applyCoupon);

// ==========================================
// Razorpay Payment Routes
// ==========================================
router.post('/payments/create-order', paymentController.createRazorpayOrder);
router.post('/payments/razorpay-order', paymentController.createRazorpayOrder);
router.post('/payments/verify', paymentController.verifyPayment);


// ==========================================
// Secure Admin Routes
// ==========================================
router.get('/admin/stats', protect, adminOnly, adminController.getDashboardStats);

// Admin - Products
router.post('/admin/products', protect, adminOnly, adminController.createProduct);
router.put('/admin/products/:id', protect, adminOnly, adminController.updateProduct);
router.delete('/admin/products/:id', protect, adminOnly, adminController.deleteProduct);

// Admin - Orders & Bookings
router.get('/admin/orders', protect, adminOnly, adminController.getAllOrders);
router.put('/admin/orders/:id/status', protect, adminOnly, adminController.updateOrderStatus);
router.get('/admin/bookings', protect, adminOnly, adminController.getAllBookings);
router.put('/admin/bookings/:id/status', protect, adminOnly, adminController.updateBookingStatus);

// Admin - Users & Coupons
router.get('/admin/users', protect, adminOnly, adminController.getAllUsers);
router.get('/admin/coupons', protect, adminOnly, adminController.getAllCoupons);
router.post('/admin/coupons', protect, adminOnly, adminController.createCoupon);

// ==========================================
// Contact / Inquiry Route
// ==========================================
router.post('/contact', (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Name, phone and message are required' });
  }
  // Log inquiry to console (wire up email/SMS service here later)
  console.log(`📩 [Contact Inquiry] From: ${name} | Phone: ${phone} | Subject: ${subject || 'General'} | Msg: ${message}`);
  res.json({ success: true, message: 'Inquiry received. Our team will contact you shortly.' });
});

module.exports = router;
