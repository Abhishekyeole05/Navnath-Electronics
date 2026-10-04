const { Order, Coupon, Product, dbHelper } = require('../models');

// Helper to normalize an order object so frontend always gets both naming formats
const normalizeOrder = (order) => {
  if (!order) return null;
  const items = order.items || order.orderItems || [];
  const total = Number(order.totalAmount || order.totalPrice || order.subtotal || 0);
  const sub = Number(order.subtotal || order.itemsPrice || total);
  const isPaid = (order.paymentStatus === 'Paid' || order.isPaid === true);

  return {
    ...order,
    items,
    orderItems: items,
    totalAmount: total,
    totalPrice: total,
    subtotal: sub,
    itemsPrice: sub,
    isPaid,
    shippingAddress: order.shippingAddress || {}
  };
};

exports.createOrder = async (req, res) => {
  try {
    const { 
      customerName, email, mobile, items, orderItems, shippingAddress, 
      paymentMethod, paymentStatus, paymentDetails, couponApplied, couponCode, discountAmount, 
      subtotal, itemsPrice, totalAmount, totalPrice 
    } = req.body;

    const rawItems = items || orderItems;
    if (!rawItems || rawItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const normalizedItems = rawItems.map(item => ({
      productId: item.productId || item.product || item._id || item.id,
      name: item.name || 'Electrical Item',
      price: Number(item.price || 0),
      quantity: Number(item.quantity || item.qty || 1),
      qty: Number(item.quantity || item.qty || 1),
      image: item.image || (item.images && item.images[0]) || '',
      brand: item.brand || 'Navnath'
    }));

    const computedSubtotal = normalizedItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const finalSubtotal = Number(subtotal || itemsPrice || computedSubtotal || 0);
    const finalDiscount = Number(discountAmount || 0);
    const finalTotal = Math.max(0, Number(totalAmount || totalPrice || (finalSubtotal - finalDiscount)));
    
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    let normPaymentMethod = 'Cash on Delivery';
    if (paymentMethod) {
      const pm = String(paymentMethod).toLowerCase();
      if (pm.includes('razorpay') || pm.includes('online')) normPaymentMethod = 'Razorpay / Online';
      else if (pm.includes('qr') || pm.includes('upi')) normPaymentMethod = 'UPI QR Code';
      else if (pm.includes('card')) normPaymentMethod = 'Card';
      else if (pm.includes('instant') || pm.includes('demo')) normPaymentMethod = 'Demo Instant';
      else if (pm.includes('cod') || pm.includes('cash')) normPaymentMethod = 'Cash on Delivery';
      else normPaymentMethod = paymentMethod;
    }

    const isPaid = (paymentStatus === 'Paid' || (normPaymentMethod !== 'Cash on Delivery' && paymentDetails?.paymentId));
    const finalPaymentStatus = isPaid ? 'Paid' : (paymentStatus || 'Pending');

    const newOrder = await dbHelper.create('orders', Order, {
      orderId,
      userId: (req.user && req.user.id) ? req.user.id : (req.body.userId || 'guest_user'),
      customerName: customerName || (shippingAddress && shippingAddress.fullName) || (req.user && req.user.name) || 'Customer',
      email: email || (req.user && req.user.email) || 'customer@navnath.com',
      mobile: mobile || (shippingAddress && shippingAddress.phone) || (req.user && req.user.phone) || '8862004797',
      items: normalizedItems,
      shippingAddress: {
        fullName: (shippingAddress && shippingAddress.fullName) || customerName || (req.user && req.user.name) || 'Customer',
        phone: (shippingAddress && shippingAddress.phone) || mobile || (req.user && req.user.phone) || '8862004797',
        address: (shippingAddress && (shippingAddress.address || shippingAddress.street)) || 'Opposite Bus Stand, Manmad',
        street: (shippingAddress && (shippingAddress.street || shippingAddress.address)) || 'Opposite Bus Stand, Manmad',
        city: (shippingAddress && shippingAddress.city) || 'Manmad',
        state: (shippingAddress && shippingAddress.state) || 'Maharashtra',
        pinCode: (shippingAddress && (shippingAddress.pinCode || shippingAddress.postalCode)) || '422001',
        postalCode: (shippingAddress && (shippingAddress.postalCode || shippingAddress.pinCode)) || '422001'
      },
      paymentMethod: normPaymentMethod,
      paymentStatus: finalPaymentStatus,
      orderStatus: 'Processing',
      couponApplied: couponApplied || couponCode || null,
      discountAmount: finalDiscount,
      subtotal: finalSubtotal,
      totalAmount: finalTotal,
      totalPrice: finalTotal,
      paymentDetails: paymentDetails || (isPaid ? {
        paymentId: `pay_${Date.now()}`,
        status: 'completed',
        method: normPaymentMethod
      } : null)
    });

    // Reduce stock for ordered items
    for (const item of normalizedItems) {
      if (item.productId) {
        try {
          const prod = await dbHelper.findById('products', Product, item.productId);
          if (prod && prod.stock > 0) {
            await dbHelper.findByIdAndUpdate('products', Product, item.productId, {
              stock: Math.max(0, prod.stock - item.quantity)
            });
          }
        } catch (e) {
          // Non-blocking stock reduction
        }
      }
    }

    res.status(201).json({
      success: true,
      order: normalizeOrder(newOrder)
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    let orders = await dbHelper.find('orders', Order, { userId: req.user.id });
    if (!orders || orders.length === 0) {
      orders = await dbHelper.find('orders', Order, { email: req.user.email });
    }
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, orders: orders.map(normalizeOrder) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = await dbHelper.findOne('orders', Order, { orderId: id });
    if (!order) {
      order = await dbHelper.findById('orders', Order, id);
    }
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order: normalizeOrder(order) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    let order = await dbHelper.findOne('orders', Order, { orderId: id });
    if (!order) {
      order = await dbHelper.findById('orders', Order, id);
    }
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: `Cannot cancel an order that is already ${order.orderStatus}` });
    }

    const updatedOrder = await dbHelper.findByIdAndUpdate('orders', Order, order._id || order.id, {
      orderStatus: 'Cancelled'
    });

    res.json({ success: true, order: normalizeOrder(updatedOrder) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide coupon code' });
    }

    const coupon = await dbHelper.findOne('coupons', Coupon, { code: code.toUpperCase() });
    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon` 
      });
    }

    const discountAmount = Math.min(
      Math.round((cartTotal * coupon.discountPercentage) / 100),
      coupon.maxDiscount
    );

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        discountAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to apply coupon' });
  }
};

exports.updateOrderToPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: paymentId, paymentMethod, utrNumber, status, email_address, paymentDetails } = req.body;
    let order = await dbHelper.findOne('orders', Order, { orderId: id });
    if (!order) {
      order = await dbHelper.findById('orders', Order, id);
    }
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const finalPaymentId = paymentId || (utrNumber ? `UPI_UTR_${utrNumber}` : `pay_${Date.now()}`);

    const updatedOrder = await dbHelper.findByIdAndUpdate('orders', Order, order._id || order.id, {
      paymentStatus: 'Paid',
      paymentMethod: paymentMethod || order.paymentMethod || 'Razorpay / Online',
      paymentDetails: {
        ...(order.paymentDetails || {}),
        ...(paymentDetails || {}),
        paymentId: finalPaymentId,
        utrNumber: utrNumber || null,
        status: status || 'completed',
        email_address: email_address || order.email,
        paidAt: new Date().toISOString()
      }
    });

    res.json({ success: true, order: normalizeOrder(updatedOrder) });
  } catch (error) {
    console.error('Update Order Paid Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order payment status' });
  }
};


