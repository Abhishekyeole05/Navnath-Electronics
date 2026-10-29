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
      // In-memory mode: full reset for local development
      memoryStore.users = [
        {
          _id: memoryStore.generateId(),
          id: 'admin_samarth',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...adminUserData
        }
      ];

      memoryStore.categories = initialCategories.map(c => ({
        _id: memoryStore.generateId(),
        id: c.slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...c
      }));

      memoryStore.products = initialProducts.map(p => ({
        _id: memoryStore.generateId(),
        id: p.slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...p
      }));

      memoryStore.services = initialServices.map(s => ({
        _id: memoryStore.generateId(),
        id: s.slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...s
      }));

      memoryStore.workers = initialWorkers.map(w => ({
        _id: memoryStore.generateId(),
        id: w.workerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...w
      }));

      memoryStore.coupons = initialCoupons.map(c => ({
        _id: memoryStore.generateId(),
        id: c.code,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...c
      }));

      memoryStore.orders = [];
      memoryStore.bookings = [];
      memoryStore.reviews = [];
      memoryStore.isSeeded = true;

      memoryStore.saveToDisk();
    } else {
      // ============================================================
      // MongoDB Mode — Smart Idempotent Seed (safe for production)
      // NEVER deletes customer accounts, orders, bookings, or reviews
      // Only creates data that does not already exist
      // ============================================================

      // 1. Upsert admin account only — never touch other users
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (existingAdmin) {
        existingAdmin.name = adminUserData.name;
        existingAdmin.password = adminHash;
        existingAdmin.role = 'admin';
        existingAdmin.phone = adminUserData.phone;
        if (!existingAdmin.addresses || existingAdmin.addresses.length === 0) {
          existingAdmin.addresses = adminUserData.addresses;
        }
        await existingAdmin.save();
        console.log('✅ [Seed] Admin account verified/updated.');
      } else {
        await User.create(adminUserData);
        console.log('✅ [Seed] Admin account created.');
      }

      // 2. Seed categories only if collection is empty
      const categoryCount = await Category.countDocuments();
      if (categoryCount === 0) {
        await Category.insertMany(initialCategories);
        console.log(`✅ [Seed] Inserted ${initialCategories.length} categories.`);
      } else {
        console.log(`ℹ️  [Seed] Categories already seeded (${categoryCount}), skipping.`);
      }

      // 3. Seed products only if collection is empty
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        await Product.insertMany(initialProducts);
        console.log(`✅ [Seed] Inserted ${initialProducts.length} products.`);
      } else {
        console.log(`ℹ️  [Seed] Products already seeded (${productCount}), skipping.`);
      }

      // 4. Seed services only if collection is empty
      const serviceCount = await Service.countDocuments();
      if (serviceCount === 0) {
        await Service.insertMany(initialServices);
        console.log(`✅ [Seed] Inserted ${initialServices.length} services.`);
      } else {
        console.log(`ℹ️  [Seed] Services already seeded (${serviceCount}), skipping.`);
      }

      // 5. Seed workers only if collection is empty
      const workerCount = await Worker.countDocuments();
      if (workerCount === 0) {
        await Worker.insertMany(initialWorkers);
        console.log(`✅ [Seed] Inserted ${initialWorkers.length} workers.`);
      } else {
        console.log(`ℹ️  [Seed] Workers already seeded (${workerCount}), skipping.`);
      }

      // 6. Seed coupons only if collection is empty
      const couponCount = await Coupon.countDocuments();
      if (couponCount === 0) {
        await Coupon.insertMany(initialCoupons);
        console.log(`✅ [Seed] Inserted ${initialCoupons.length} coupons.`);
      } else {
        console.log(`ℹ️  [Seed] Coupons already seeded (${couponCount}), skipping.`);
      }

      // NOTE: Orders, Bookings, and Reviews are NEVER modified.
      // Customer accounts are NEVER deleted. Production-safe.
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
