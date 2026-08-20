const { 
  User, Product, Category, Service, Booking, Order, Coupon, Review, dbHelper 
} = require('../models');
const { getUseMemoryStore, memoryStore } = require('../config/db');

const initialCategories = [
  {
    name: 'Wires & Cables',
    slug: 'wires-cables',
    icon: 'FiActivity',
    description: 'High quality copper & FR PVC insulated wires for domestic & industrial wiring',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    productCount: 3
  },
  {
    name: 'Switches & Sockets',
    slug: 'switches-sockets',
    icon: 'FiToggleRight',
    description: 'Modular switches, sockets, MCBs, and heavy-duty distribution panels',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    productCount: 3
  },
  {
    name: 'Lighting & LEDs',
    slug: 'lighting-leds',
    icon: 'FiSun',
    description: 'Energy-saving LED batten tubes, ceiling downlights, and smart bulbs',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80',
    productCount: 3
  },
  {
    name: 'Fans & Appliances',
    slug: 'fans-appliances',
    icon: 'FiWind',
    description: 'BLDC high speed ceiling fans, exhaust fans, and home stabilizers',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    productCount: 2
  },
  {
    name: 'Motors & Pumps',
    slug: 'motors-pumps',
    icon: 'FiSliders',
    description: 'Submersible pumps, monoblock water pumps, and industrial electric motors',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    productCount: 2
  },
  {
    name: 'Industrial Electricals',
    slug: 'industrial-electricals',
    icon: 'FiCpu',
    description: 'Three-phase starters, contactors, overload relays, and industrial switchgears',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    productCount: 1
  },
  {
    name: 'Smart Home Devices',
    slug: 'smart-home',
    icon: 'FiHome',
    description: 'Smart Wi-Fi plugs, home automation relays, and voice-controlled lighting',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    productCount: 1
  }
];

const initialProducts = [
  {
    name: 'Havells Life Line Copper Wire 2.5 sq mm (90 Meter Red)',
    slug: 'havells-lifeline-copper-wire-2-5-sqmm',
    brand: 'Havells',
    category: 'wires-cables',
    price: 3450,
    originalPrice: 4200,
    discount: 18,
    stock: 25,
    rating: 4.8,
    reviewsCount: 42,
    description: 'Havells Life Line HRFR insulated copper conductor cable designed for superior electrical safety and fire resistance. High conductivity electrolytic grade copper ensure minimum power loss.',
    specifications: [
      { key: 'Length', value: '90 Meters' },
      { key: 'Conductor Material', value: 'Electrolytic Grade Copper' },
      { key: 'Insulation Type', value: 'Heat Resistant Flame Retardant (HRFR)' },
      { key: 'Voltage Grade', value: '1100V' },
      { key: 'Core Type', value: 'Single Core' }
    ],
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    sku: 'HVL-CBL-25R',
    warranty: '10 Years Brand Warranty'
  },
  {
    name: 'Polycab Green FR PVC House Wire 1.5 sq mm (90m Yellow)',
    slug: 'polycab-green-fr-wire-1-5-sqmm',
    brand: 'Polycab',
    category: 'wires-cables',
    price: 2150,
    originalPrice: 2600,
    discount: 17,
    stock: 40,
    rating: 4.7,
    reviewsCount: 38,
    description: 'Polycab Green eco-friendly PVC insulated single core house wire with high tensile strength and flame retardancy for domestic circuit wiring.',
    specifications: [
      { key: 'Length', value: '90 Meters' },
      { key: 'Conductor Size', value: '1.5 sq mm' },
      { key: 'Color', value: 'Yellow' },
      { key: 'Standard', value: 'IS:694' }
    ],
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    sku: 'PLY-CBL-15Y',
    warranty: '5 Years Brand Warranty'
  },
  {
    name: 'Finolex Flame Retardant Copper House Wire 4.0 sq mm',
    slug: 'finolex-fr-copper-wire-4-0-sqmm',
    brand: 'Finolex',
    category: 'wires-cables',
    price: 5200,
    originalPrice: 6100,
    discount: 15,
    stock: 18,
    rating: 4.9,
    reviewsCount: 29,
    description: 'Heavy duty Finolex 4.0 sq mm copper wire ideal for AC circuits, geysers, and high-current domestic appliances.',
    specifications: [
      { key: 'Length', value: '90 Meters' },
      { key: 'Conductor Size', value: '4.0 sq mm' },
      { key: 'Color', value: 'Black' }
    ],
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    sku: 'FNX-CBL-40B',
    warranty: '7 Years Brand Warranty'
  },
  {
    name: 'Anchor Roma Classic 12-Module Modular Switch Board Complete',
    slug: 'anchor-roma-12-module-switch-board',
    brand: 'Anchor by Panasonic',
    category: 'switches-sockets',
    price: 1290,
    originalPrice: 1650,
    discount: 22,
    stock: 35,
    rating: 4.8,
    reviewsCount: 56,
    description: 'Complete Anchor Roma 12-module switchboard set including 6A smooth switches, 16A power socket, fan regulator, and glossy white frame plate.',
    specifications: [
      { key: 'Modules', value: '12 Module Plate' },
      { key: 'Switches Included', value: '6 x 6A Switches, 1 x 16A Socket, 1 x Step Regulator' },
      { key: 'Material', value: 'Fire Retardant Polycarbonate' },
      { key: 'Color', value: 'Glossy White' }
    ],
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    sku: 'ANC-RMA-12M',
    warranty: '10 Years Brand Replacement Warranty'
  },
  {
    name: 'Schneider Electric Acti9 32A C-Curve Double Pole MCB',
    slug: 'schneider-electric-acti9-32a-mcb',
    brand: 'Schneider Electric',
    category: 'switches-sockets',
    price: 850,
    originalPrice: 1100,
    discount: 23,
    stock: 50,
    rating: 4.9,
    reviewsCount: 64,
    description: 'High precision industrial grade double pole MCB for protecting electrical circuits against overload and short circuits. Ideal for main DB boards.',
    specifications: [
      { key: 'Current Rating', value: '32 Amps' },
      { key: 'Poles', value: 'Double Pole (DP)' },
      { key: 'Curve Type', value: 'C-Curve' },
      { key: 'Breaking Capacity', value: '10 kA' }
    ],
    images: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    sku: 'SCH-MCB-32DP',
    warranty: '3 Years Warranty'
  },
  {
    name: 'Legrand Mylinc 16A Heavy Duty Power Socket with Shutter',
    slug: 'legrand-mylinc-16a-power-socket',
    brand: 'Legrand',
    category: 'switches-sockets',
    price: 320,
    originalPrice: 420,
    discount: 24,
    stock: 60,
    rating: 4.6,
    reviewsCount: 22,
    description: 'Premium child-safe shuttered power socket from Legrand Mylinc series, designed for refrigerators, microwaves, and air conditioners.',
    specifications: [
      { key: 'Rating', value: '16 Amp / 6 Amp Combo' },
      { key: 'Safety', value: 'Inbuilt Safety Shutter' },
      { key: 'Finish', value: 'Matt White' }
    ],
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    sku: 'LGR-SOC-16A',
    warranty: '5 Years Brand Warranty'
  },
  {
    name: 'Philips T5 20W LED Batten Light (Cool Daylight, Pack of 2)',
    slug: 'philips-t5-20w-led-batten-light',
    brand: 'Philips',
    category: 'lighting-leds',
    price: 749,
    originalPrice: 999,
    discount: 25,
    stock: 75,
    rating: 4.8,
    reviewsCount: 89,
    description: 'Super bright 20W Philips LED tube light with uniform illumination and surge protection up to 3.5kV. EyeComfort technology eliminates flicker.',
    specifications: [
      { key: 'Wattage', value: '20 Watts' },
      { key: 'Color Temperature', value: '6500K Cool Daylight' },
      { key: 'Lumens Output', value: '2000 Lumens' },
      { key: 'Surge Protection', value: '3.5 kV' }
    ],
    images: [
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    sku: 'PHP-LED-20W',
    warranty: '2 Years Manufacturer Warranty'
  },
  {
    name: 'Havells Adore 12W LED Bulb (6500K Cool White, Pack of 4)',
    slug: 'havells-adore-12w-led-bulb-pack-4',
    brand: 'Havells',
    category: 'lighting-leds',
    price: 549,
    originalPrice: 799,
    discount: 31,
    stock: 100,
    rating: 4.7,
    reviewsCount: 110,
    description: 'Energy-saving Havells LED bulbs with B22 base. Delivers high brightness with 85% energy savings compared to incandescent bulbs.',
    specifications: [
      { key: 'Wattage', value: '12 Watts per bulb' },
      { key: 'Base Type', value: 'B22 Indian Pin Type' },
      { key: 'Pack Size', value: '4 Bulbs' }
    ],
    images: [
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    sku: 'HVL-LED-12W4',
    warranty: '2 Years Replacement Warranty'
  },
  {
    name: 'Crompton SilentPro BLDC Ceiling Fan with Remote (1200mm)',
    slug: 'crompton-silentpro-bldc-ceiling-fan',
    brand: 'Crompton',
    category: 'fans-appliances',
    price: 3890,
    originalPrice: 5500,
    discount: 29,
    stock: 20,
    rating: 4.9,
    reviewsCount: 74,
    description: 'Ultra energy-efficient 5-star BLDC ceiling fan from Crompton. Consumes only 35W at top speed and operates with RF remote control.',
    specifications: [
      { key: 'Sweep Size', value: '1200 mm (48 Inch)' },
      { key: 'Motor Type', value: 'ActivBLDC 5-Star' },
      { key: 'Power Consumption', value: '35 Watts' },
      { key: 'Air Delivery', value: '240 CMM' },
      { key: 'Remote Control', value: 'Included (Timer & Sleep mode)' }
    ],
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    sku: 'CRM-FAN-BLDC',
    warranty: '5 Years Motor Warranty'
  },
  {
    name: 'Crompton 1 HP Submersible Water Pump with Digital Control Panel',
    slug: 'crompton-1-hp-submersible-water-pump',
    brand: 'Crompton',
    category: 'motors-pumps',
    price: 11500,
    originalPrice: 14200,
    discount: 19,
    stock: 12,
    rating: 4.8,
    reviewsCount: 33,
    description: 'Heavy duty 1 HP stainless steel submersible pump for borewells and overhead water tanks. Comes with auto cutoff digital starter box.',
    specifications: [
      { key: 'Motor Power', value: '1.0 HP (0.75 kW)' },
      { key: 'Max Head', value: '150 Feet' },
      { key: 'Discharge', value: '3000 Liters / Hour' },
      { key: 'Winding', value: '100% Pure Copper' },
      { key: 'Control Panel', value: 'Digital Starter Box Included' }
    ],
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    sku: 'CRM-PMP-1HP',
    warranty: '2 Years Manufacturer Warranty'
  },
  {
    name: 'Kirloskar Chhotu 0.5 HP Domestic Monoblock Water Pump',
    slug: 'kirloskar-chhotu-0-5-hp-pump',
    brand: 'Kirloskar',
    category: 'motors-pumps',
    price: 3450,
    originalPrice: 4200,
    discount: 18,
    stock: 15,
    rating: 4.7,
    reviewsCount: 45,
    description: 'India\'s most trusted domestic water pump for home water lifting from underground sump to overhead tank.',
    specifications: [
      { key: 'Motor Power', value: '0.5 HP' },
      { key: 'Max Head', value: '80 Feet' },
      { key: 'Pipe Size', value: '25mm x 25mm' }
    ],
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    sku: 'KIR-PMP-05HP',
    warranty: '1.5 Years Warranty'
  },
  {
    name: 'L&T Three Phase Motor Starter with Overload Protection',
    slug: 'lnt-three-phase-motor-starter',
    brand: 'L&T Electricals',
    category: 'industrial-electricals',
    price: 2450,
    originalPrice: 2950,
    discount: 17,
    stock: 15,
    rating: 4.8,
    reviewsCount: 19,
    description: 'Industrial grade DOL starter for three phase induction motors and agricultural pumps with adjustable thermal overload relay.',
    specifications: [
      { key: 'Phase Type', value: 'Three Phase 415V' },
      { key: 'Relay Range', value: '9A - 14A' },
      { key: 'Enclosure', value: 'Dust & Splash Resistant Metal Case' }
    ],
    images: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    sku: 'LNT-IND-DOL3',
    warranty: '1 Year Industrial Warranty'
  }
];

const initialServices = [
  {
    title: 'Home Electrical Repair & Fault Diagnosis',
    slug: 'home-electrical-repair',
    category: 'Home Electrical Repair',
    priceEstimate: '₹299 onwards',
    description: 'Comprehensive troubleshooting of power trips, short circuits, switchboard sparks, and domestic wiring faults by certified technicians.',
    icon: 'FiTool',
    duration: '1-2 Hours',
    features: ['Fault tracking & isolation', 'Switch & socket repair', 'Complete safety check', '30-Day Service Warranty']
  },
  {
    title: 'Motor Installation & Alignment',
    slug: 'motor-installation',
    category: 'Motor Installation',
    priceEstimate: '₹799 onwards',
    description: 'Professional mechanical alignment and electrical wiring for agricultural, domestic, and commercial electric motors.',
    icon: 'FiSliders',
    duration: '2-3 Hours',
    features: ['Laser/mechanical alignment', 'Starter connection', 'Vibration test', 'Load balancing']
  },
  {
    title: 'Submersible & Monoblock Pump Installation',
    slug: 'pump-installation',
    category: 'Pump Installation',
    priceEstimate: '₹999 onwards',
    description: 'Complete installation of borewell submersible pumps and monoblock water pumps including pipeline fitting and starter box wiring.',
    icon: 'FiDroplet',
    duration: '3-4 Hours',
    features: ['Depth measurement & lowering', 'Waterproof cable jointing', 'Digital starter commissioning', 'Water flow test']
  },
  {
    title: 'Industrial Three-Phase Wiring & Cable Pulling',
    slug: 'industrial-wiring',
    category: 'Industrial Wiring',
    priceEstimate: '₹2,499 onwards',
    description: 'Heavy industrial cable laying, armored wire routing, factory shed electrification, and machinery power line installations.',
    icon: 'FiCpu',
    duration: 'Full Day / Custom',
    features: ['Armored cable glanding', 'Heavy duty earthing', 'Load distribution', 'Electrical inspector compliance']
  },
  {
    title: 'Chandelier, LED Strip & Decorative Lighting Installation',
    slug: 'lighting-installation',
    category: 'Lighting Installation',
    priceEstimate: '₹499 onwards',
    description: 'Expert ceiling chandelier hanging, profile LED strip mounting, garden lighting, and commercial showroom lighting installation.',
    icon: 'FiSun',
    duration: '2 Hours',
    features: ['Secure ceiling anchoring', 'Concealed wiring', 'Driver power supply setup', 'Dimmer/remote configuration']
  },
  {
    title: 'Electrical Panel & Distribution Board Assembly',
    slug: 'panel-installation',
    category: 'Panel Installation',
    priceEstimate: '₹1,499 onwards',
    description: 'Custom assembly and installation of main distribution boards (DB), changeover switches, RCCB safety breakers, and sub-panels.',
    icon: 'FiGrid',
    duration: '3-5 Hours',
    features: ['Neat wire dressing', 'MCB/RCCB load segregation', 'Voltage indicator lights', 'Safety labeling']
  },
  {
    title: 'Annual Electrical Maintenance & Safety Audit',
    slug: 'electrical-maintenance',
    category: 'Electrical Maintenance',
    priceEstimate: '₹1,999 / Year',
    description: 'Preventive electrical maintenance for residential societies, shops, and workshops to prevent fire hazards and energy waste.',
    icon: 'FiShield',
    duration: 'Scheduled Visits',
    features: ['Quarterly inspection', 'Earthing pit watering & testing', 'Thermal spark scan', 'Priority emergency repair']
  }
];

const initialCoupons = [
  {
    code: 'NAVNATH10',
    discountPercentage: 10,
    maxDiscount: 500,
    minOrderValue: 200,
    expiryDate: '2027-12-31',
    isActive: true
  },
  {
    code: 'WELCOME20',
    discountPercentage: 20,
    maxDiscount: 750,
    minOrderValue: 500,
    expiryDate: '2027-12-31',
    isActive: true
  },
  {
    code: 'ELEC15',
    discountPercentage: 15,
    maxDiscount: 600,
    minOrderValue: 300,
    expiryDate: '2027-12-31',
    isActive: true
  }
];

const seedDatabase = async () => {
  console.log('🌱 [New Navnath Seed] Starting automatic seeding...');

  try {
    // 1. Seed Categories
    for (const cat of initialCategories) {
      const exists = await dbHelper.findOne('categories', Category, { slug: cat.slug });
      if (!exists) {
        await dbHelper.create('categories', Category, cat);
      }
    }

    // 2. Seed Products
    for (const prod of initialProducts) {
      const exists = await dbHelper.findOne('products', Product, { slug: prod.slug });
      if (!exists) {
        const created = await dbHelper.create('products', Product, prod);
        // Add sample reviews
        await dbHelper.create('reviews', Review, {
          productId: created._id || created.id,
          userId: 'demo_user_1',
          userName: 'Rajesh Patil (Electrical Contractor)',
          rating: 5,
          comment: 'Excellent original product from New Navnath Electricals. Very fast delivery and genuine warranty stamp on the box!',
          date: '2026-07-20'
        });
        await dbHelper.create('reviews', Review, {
          productId: created._id || created.id,
          userId: 'demo_user_2',
          userName: 'Sunil Shinde',
          rating: 5,
          comment: 'Best price in Nashik market. Highly recommended store for home electrical fittings.',
          date: '2026-07-23'
        });
      }
    }

    // 3. Seed Services
    for (const srv of initialServices) {
      const exists = await dbHelper.findOne('services', Service, { slug: srv.slug });
      if (!exists) {
        await dbHelper.create('services', Service, srv);
      }
    }

    // 4. Seed Coupons
    for (const coupon of initialCoupons) {
      const exists = await dbHelper.findOne('coupons', Coupon, { code: coupon.code });
      if (!exists) {
        await dbHelper.create('coupons', Coupon, coupon);
      }
    }

    // 5. Seed Demo Users (Admin & Customer)
    const adminExists = await dbHelper.findOne('users', User, { email: 'admin@navnath.com' });
    if (!adminExists) {
      await dbHelper.create('users', User, {
        name: 'Navnath Admin (Store Manager)',
        email: 'admin@navnath.com',
        password: 'admin123', // Plain for demo ease
        phone: '+91 9876543210',
        role: 'admin',
        addresses: [{
          fullName: 'New Navnath Store Office',
          mobile: '9876543210',
          email: 'admin@navnath.com',
          address: 'Shop No. 5, Main Electrical Market, Shivaji Nagar',
          city: 'Nashik',
          state: 'Maharashtra',
          pinCode: '422001',
          isDefault: true
        }]
      });
    }

    const userExists = await dbHelper.findOne('users', User, { email: 'user@navnath.com' });
    if (!userExists) {
      await dbHelper.create('users', User, {
        name: 'Omkesh Bhamare',
        email: 'user@navnath.com',
        password: 'user123',
        phone: '+91 9123456789',
        role: 'customer',
        addresses: [{
          fullName: 'Omkesh Bhamare',
          mobile: '9123456789',
          email: 'user@navnath.com',
          address: 'Plot 42, Anand Nagar, Gangapur Road',
          city: 'Nashik',
          state: 'Maharashtra',
          pinCode: '422005',
          isDefault: true
        }]
      });
    }

    // 6. Seed a sample order & booking for instant Admin dashboard statistics!
    const sampleOrderExists = await dbHelper.findOne('orders', Order, { orderId: 'ORD-DEMO-1001' });
    if (!sampleOrderExists) {
      await dbHelper.create('orders', Order, {
        orderId: 'ORD-DEMO-1001',
        userId: 'demo_user_1',
        customerName: 'Omkesh Bhamare',
        email: 'user@navnath.com',
        mobile: '9123456789',
        items: [
          {
            productId: 'demo_p1',
            name: 'Havells Life Line Copper Wire 2.5 sq mm (90m Red)',
            price: 3450,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
            brand: 'Havells'
          },
          {
            productId: 'demo_p2',
            name: 'Anchor Roma Classic 12-Module Modular Switch Board',
            price: 1290,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
            brand: 'Anchor'
          }
        ],
        shippingAddress: {
          address: 'Plot 42, Anand Nagar, Gangapur Road',
          city: 'Nashik',
          state: 'Maharashtra',
          pinCode: '422005'
        },
        paymentMethod: 'COD',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        subtotal: 8190,
        totalAmount: 8190,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      });

      await dbHelper.create('orders', Order, {
        orderId: 'ORD-DEMO-1002',
        userId: 'demo_user_2',
        customerName: 'Sanjay Wagh',
        email: 'sanjay@gmail.com',
        mobile: '9822012345',
        items: [
          {
            productId: 'demo_p3',
            name: 'Crompton SilentPro BLDC Ceiling Fan with Remote',
            price: 3890,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80',
            brand: 'Crompton'
          }
        ],
        shippingAddress: {
          address: 'Flat 102, Shanti Heights, College Road',
          city: 'Nashik',
          state: 'Maharashtra',
          pinCode: '422005'
        },
        paymentMethod: 'Razorpay',
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        subtotal: 7780,
        totalAmount: 7780,
        createdAt: new Date().toISOString()
      });
    }

    const sampleBookingExists = await dbHelper.findOne('bookings', Booking, { bookingId: 'BOOK-DEMO-501' });
    if (!sampleBookingExists) {
      await dbHelper.create('bookings', Booking, {
        bookingId: 'BOOK-DEMO-501',
        userId: 'demo_user_1',
        name: 'Omkesh Bhamare',
        mobile: '9123456789',
        address: 'Plot 42, Anand Nagar, Gangapur Road, Nashik',
        serviceId: 'home-electrical-repair',
        serviceName: 'Home Electrical Repair & Fault Diagnosis',
        preferredDate: '2026-07-28',
        message: 'Main distribution board MCB tripping frequently when AC turns on.',
        status: 'Technician Assigned',
        technicianName: 'Prakash Kadam (Sr. Electrician)',
        estimatedCharge: '₹350 + Parts'
      });
    }

    memoryStore.isSeeded = true;
    console.log('✅ [New Navnath Seed] Seeding completed successfully! 12 Products, 7 Categories, 7 Services, 3 Coupons, 2 Demo Orders, and Demo Accounts ready.');
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
