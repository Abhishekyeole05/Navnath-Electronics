const { Order, Coupon, Product, dbHelper } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { 
      customerName, email, mobile, items, orderItems, shippingAddress, 
      paymentMethod, couponApplied, couponCode, discountAmount, 
      subtotal, itemsPrice, totalAmount, totalPrice 
    } = req.body;

    const rawItems = items || orderItems;
    if (!rawItems || rawItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const normalizedItems = rawItems.map(item => ({
      productId: item.productId || item.product || item._id || item.id,
      name: item.name,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || item.qty || 1),
      image: item.image || (item.images && item.images[0]) || '',
      brand: item.brand || ''
    }));

    const finalSubtotal = Number(subtotal || itemsPrice || 0);
    const finalTotal = Number(totalAmount || totalPrice || finalSubtotal);
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    let normPaymentMethod = 'COD';
    if (paymentMethod) {
      const pm = String(paymentMethod).toLowerCase();
      if (pm.includes('razorpay') || pm.includes('online')) normPaymentMethod = 'Razorpay';
      else if (pm.includes('upi')) normPaymentMethod = 'UPI';
      else if (pm.includes('card')) normPaymentMethod = 'Card';
      else if (pm.includes('instant') || pm.includes('demo')) normPaymentMethod = 'Demo Instant';
      else normPaymentMethod = 'COD';
    }

    const isPaid = (normPaymentMethod !== 'COD' && normPaymentMethod !== 'cod');

    const newOrder = await dbHelper.create('orders', Order, {
      orderId,
      userId: req.user.id,
      customerName: customerName || (shippingAddress && shippingAddress.fullName) || req.user.name,
      email: email || req.user.email || 'customer@navnath.com',
      mobile: mobile || (shippingAddress && shippingAddress.phone) || req.user.phone || '',
      items: normalizedItems,
      shippingAddress: {
        fullName: (shippingAddress && shippingAddress.fullName) || customerName || req.user.name,
        phone: (shippingAddress && shippingAddress.phone) || mobile || req.user.phone || '',
        address: (shippingAddress && (shippingAddress.address || shippingAddress.street)) || '',
        street: (shippingAddress && (shippingAddress.street || shippingAddress.address)) || '',
        city: (shippingAddress && shippingAddress.city) || 'Manmad',
        state: (shippingAddress && shippingAddress.state) || 'Maharashtra',
        pinCode: (shippingAddress && (shippingAddress.pinCode || shippingAddress.postalCode)) || '422001',
        postalCode: (shippingAddress && (shippingAddress.postalCode || shippingAddress.pinCode)) || '422001'
      },
      paymentMethod: normPaymentMethod,
      paymentStatus: isPaid ? 'Paid' : 'Pending',
      orderStatus: 'Processing',
      couponApplied: couponApplied || couponCode || null,
      discountAmount: discountAmount || 0,
      subtotal: finalSubtotal,
      totalAmount: finalTotal
    });

    // Reduce stock for ordered items
    for (const item of normalizedItems) {
      if (item.productId) {
        const prod = await dbHelper.findById('products', Product, item.productId);
        if (prod && prod.stock > 0) {
          await dbHelper.findByIdAndUpdate('products', Product, item.productId, {
            stock: Math.max(0, prod.stock - item.quantity)
          });
        }
      }
    }

    res.status(201).json({
      success: true,
      order: newOrder
    });
  } catch (error) {
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
    res.json({ success: true, orders });
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
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await dbHelper.findOne('orders', Order, { orderId: id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: `Cannot cancel an order that is already ${order.orderStatus}` });
    }

    const updatedOrder = await dbHelper.findByIdAndUpdate('orders', Order, order._id || order.id, {
      orderStatus: 'Cancelled'
    });

    res.json({ success: true, order: updatedOrder });
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
    const { id: paymentId, status, email_address } = req.body;
    let order = await dbHelper.findOne('orders', Order, { orderId: id });
    if (!order) {
      order = await dbHelper.findById('orders', Order, id);
    }
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updatedOrder = await dbHelper.findByIdAndUpdate('orders', Order, order._id || order.id, {
      paymentStatus: 'Paid',
      paymentMethod: order.paymentMethod || 'Razorpay/Online',
      paymentDetails: {
        paymentId: paymentId || `pay_${Date.now()}`,
        status: status || 'completed',
        email_address: email_address || order.email
      }
    });

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order payment status' });
  }
};

