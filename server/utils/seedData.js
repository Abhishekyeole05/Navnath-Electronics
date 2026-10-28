const { 
  User, Product, Category, Service, Booking, Worker, Order, Coupon, Review, dbHelper 
} = require('../models');
const { getUseMemoryStore, memoryStore } = require('../config/db');
const bcrypt = require('bcryptjs');
const { initialCategories, initialProducts } = require('./catalogData');

const initialServices = [
  {
    title: 'Install Electrical Systems',
    slug: 'install-electrical-systems',
    category: 'Installation',
    priceEstimate: '₹699 onwards',
    description: 'Professional installation of new electrical setups, distribution boards, wiring conduits, switches, lighting systems, inverters, and heavy machinery connections.',
    icon: 'FiTool',
    duration: '2-4 Hours',
    features: [
      'New home & commercial wiring installation',
      'Distribution board (DB) & MCB installation',
      'Appliance & heavy load connections',
      'Certified electrician with post-installation check'
    ]
  },
  {
    title: 'Maintain Electrical Systems',
    slug: 'maintain-electrical-systems',
    category: 'Maintenance',
    priceEstimate: '₹499 onwards',
    description: 'Preventive and scheduled maintenance for residential, commercial, and industrial electrical systems to prevent fire hazards, loose connections, and power wastage.',
    icon: 'FiShield',
    duration: '1-3 Hours',
    features: [
      'Comprehensive switchboard & panel inspection',
      'Thermal spark check & terminal tightening',
      'Earthing health & load distribution audit',
      'Preventive maintenance report & safety certification'
    ]
  },
  {
    title: 'Repair Electrical Systems',
    slug: 'repair-electrical-systems',
    category: 'Repair',
    priceEstimate: '₹299 onwards',
    description: 'Fast troubleshooting and emergency repair for short circuits, power trips, sparking switchboards, damaged cabling, and faulty electrical fixtures.',
    icon: 'FiSliders',
    duration: '1-2 Hours',
    features: [
      'Rapid fault identification & isolation',
      'Burnt switch, socket & MCB repair/replacement',
      'Short circuit resolution & emergency rewiring',
      '30-Day service warranty on all repairs'
    ]
  },
  {
    title: 'Test Electrical Systems',
    slug: 'test-electrical-systems',
    category: 'Inspection & Testing',
    priceEstimate: '₹399 onwards',
    description: 'Standardized electrical safety testing, load analysis, insulation resistance measurement, and earth resistance verification by licensed technicians.',
    icon: 'FiActivity',
    duration: '1-2 Hours',
    features: [
      'Digital earth electrode resistance test (Ohms)',
      'Megger insulation resistance & leakage current test',
      'Three-phase voltage & load balancing test',
      'Detailed electrical inspection & compliance report'
    ]
  }
];

const initialWorkers = [
  {
    workerId: 'WRK-101',
    name: 'Rajesh Sharma',
    phone: '+91 98220 12345',
    email: 'rajesh.electrician@navnath.com',
    specialization: 'Master Electrician (Install, Maintain, Repair, Test)',
    experience: '8+ Years',
    status: 'Active',
    rating: 4.9,
    totalJobs: 42
  }
];

const initialCoupons = [
  {
    code: 'NAVNATH10',
    discountPercentage: 10,
    maxDiscount: 1000,
    minOrderValue: 500,
    expiryDate: '2027-12-31',
    isActive: true
  },
  {
    code: 'FESTIVE20',
    discountPercentage: 20,
    maxDiscount: 2000,
    minOrderValue: 2000,
    expiryDate: '2027-12-31',
    isActive: true
  },
  {
    code: 'ELEC15',
    discountPercentage: 15,
    maxDiscount: 1500,
    minOrderValue: 1000,
    expiryDate: '2027-12-31',
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🔄 [New Navnath Seed] Synchronizing database catalog and administrator account...');

    // 1. Prepare Admin Account
    const adminEmail = 'samarthsonawane2006@gmail.com';
    const adminHash = await bcrypt.hash('Samartha@017', 10);
    const adminUserData = {
      name: 'Samarth Sonawane (Store Owner & Administrator)',
      email: adminEmail,
      password: adminHash,
      phone: '+91 8862004797',
      role: 'admin',
      addresses: [{
        fullName: 'Samarth Sonawane',
        mobile: '8862004797',
        email: adminEmail,
        address: 'Shop No. 5, Main Electrical Market, Shivaji Nagar',
        city: 'Manmad',
        state: 'Maharashtra',
        pinCode: '423104',
        isDefault: true
      }],
      wishlist: []
    };

    if (getUseMemoryStore()) {
      // Clean all user accounts and establish ONLY the admin account
      memoryStore.users = [
        {
          _id: memoryStore.generateId(),
          id: 'admin_samarth',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...adminUserData
        }
      ];

      // Overwrite categories with all 10 categories
      memoryStore.categories = initialCategories.map(c => ({
        _id: memoryStore.generateId(),
        id: c.slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...c
      }));

      // Overwrite products with all 100 products across 10 companies
      memoryStore.products = initialProducts.map(p => ({
        _id: memoryStore.generateId(),
        id: p.slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...p
      }));

      // Set services
      memoryStore.services = initialServices.map(s => ({
        _id: memoryStore.generateId(),
        id: s.slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...s
      }));

      // Set workers
      memoryStore.workers = initialWorkers.map(w => ({
        _id: memoryStore.generateId(),
        id: w.workerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...w
      }));

      // Set coupons
      memoryStore.coupons = initialCoupons.map(c => ({
        _id: memoryStore.generateId(),
        id: c.code,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...c
      }));

      // Reset orders, bookings, and reviews for clean state
      memoryStore.orders = [];
      memoryStore.bookings = [];
      memoryStore.reviews = [];
      memoryStore.isSeeded = true;

      // Save to disk (dev_store.json)
      memoryStore.saveToDisk();
    } else {
      // MongoDB Mode
      await User.deleteMany({ email: { $ne: adminEmail } });
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (existingAdmin) {
        existingAdmin.name = adminUserData.name;
        existingAdmin.password = adminHash;
        existingAdmin.role = 'admin';
        existingAdmin.phone = adminUserData.phone;
        existingAdmin.addresses = adminUserData.addresses;
        await existingAdmin.save();
      } else {
        await User.create(adminUserData);
      }

      // Re-sync categories
      await Category.deleteMany({});
      await Category.insertMany(initialCategories);

      // Re-sync products
      await Product.deleteMany({});
      await Product.insertMany(initialProducts);

      // Re-sync services
      await Service.deleteMany({});
      await Service.insertMany(initialServices);

      // Re-sync workers
      await Worker.deleteMany({});
      await Worker.insertMany(initialWorkers);

      // Re-sync coupons
      await Coupon.deleteMany({});
      await Coupon.insertMany(initialCoupons);

      // Reset old orders, bookings, and reviews
      await Order.deleteMany({});
      await Booking.deleteMany({});
      await Review.deleteMany({});
    }

    console.log('✅ [New Navnath Seed] Complete setup successful! 100 Products across 10 Companies, 10 Categories, 4 Services, 3 Coupons, and single Admin account (samarthsonawane2006@gmail.com) ready.');
  } catch (error) {
    console.error('❌ [New Navnath Seed] Error during seed:', error);
  }
};

module.exports = {
  seedDatabase,
  initialProducts,
  initialCategories,
  initialServices,
  initialCoupons
};

if (require.main === module) {
  seedDatabase().then(() => {
    console.log('🏁 Seed process complete.');
    process.exit(0);
  });
}
