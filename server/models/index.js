const mongoose = require('mongoose');
const { getUseMemoryStore, memoryStore } = require('../config/db');

// ==========================================
// Mongoose Schemas & Models
// ==========================================

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  addresses: [{
    fullName: String,
    mobile: String,
    email: String,
    address: String,
    city: String,
    state: String,
    pinCode: String,
    isDefault: { type: Boolean, default: false }
  }],
  wishlist: [{ type: String }], // Array of product IDs
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, default: 10, required: true },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 12 },
  description: { type: String, required: true },
  specifications: [{ key: String, value: String }],
  images: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  sku: { type: String, default: '' },
  warranty: { type: String, default: '1 Year Brand Warranty' }
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: 'FiCpu' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  productCount: { type: Number, default: 0 }
}, { timestamps: true });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: 'Electrical Repair' },
  priceEstimate: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'FiTool' },
  duration: { type: String, default: '2-3 Hours' },
  features: [{ type: String }]
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  userId: { type: String, default: null },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  preferredDate: { type: String, required: true },
  message: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Technician Assigned', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  technicianName: { type: String, default: 'Pending Assignment' },
  estimatedCharge: { type: String, default: 'As per inspection' }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    brand: String
  }],
  shippingAddress: {
    address: String,
    city: String,
    state: String,
    pinCode: String
  },
  paymentMethod: { type: String, enum: ['COD', 'Razorpay', 'UPI', 'Card'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  razorpayPaymentId: { type: String, default: null },
  razorpayOrderId: { type: String, default: null },
  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Out for Delivery', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  couponApplied: { type: String, default: null },
  discountAmount: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  totalAmount: { type: Number, required: true }
}, { timestamps: true });

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  maxDiscount: { type: Number, default: 500 },
  minOrderValue: { type: Number, default: 100 },
  expiryDate: { type: String, default: '2027-12-31' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

// Safely register or retrieve models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

// Helper wrapper to interact with either MongoDB or Local Memory Store
const dbHelper = {
  async find(collectionName, model, filter = {}) {
    if (getUseMemoryStore()) {
      return memoryStore.find(collectionName, filter);
    }
    return await model.find(filter).lean();
  },
  async findOne(collectionName, model, filter = {}) {
    if (getUseMemoryStore()) {
      return memoryStore.findOne(collectionName, filter);
    }
    return await model.findOne(filter).lean();
  },
  async findById(collectionName, model, id) {
    if (getUseMemoryStore()) {
      return memoryStore.findById(collectionName, id);
    }
    return await model.findById(id).lean();
  },
  async create(collectionName, model, data) {
    if (getUseMemoryStore()) {
      return memoryStore.create(collectionName, data);
    }
    const doc = await model.create(data);
    return doc.toObject();
  },
  async findByIdAndUpdate(collectionName, model, id, updateData) {
    if (getUseMemoryStore()) {
      return memoryStore.findByIdAndUpdate(collectionName, id, updateData);
    }
    return await model.findByIdAndUpdate(id, updateData, { new: true }).lean();
  },
  async findByIdAndDelete(collectionName, model, id) {
    if (getUseMemoryStore()) {
      return memoryStore.findByIdAndDelete(collectionName, id);
    }
    return await model.findByIdAndDelete(id).lean();
  }
};

module.exports = {
  User,
  Product,
  Category,
  Service,
  Booking,
  Order,
  Coupon,
  Review,
  dbHelper
};
