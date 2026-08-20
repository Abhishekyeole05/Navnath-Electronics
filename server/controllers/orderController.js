const { Order, Coupon, Product, dbHelper } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { 
      customerName, email, mobile, items, shippingAddress, 
      paymentMethod, couponApplied, discountAmount, subtotal, totalAmount 
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = await dbHelper.create('orders', Order, {
      orderId,
      userId: req.user.id,
      customerName,
      email,
      mobile,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Processing',
      couponApplied: couponApplied || null,
      discountAmount: discountAmount || 0,
      subtotal,
      totalAmount
    });

    // Reduce stock for ordered items
    for (const item of items) {
      const prod = await dbHelper.findById('products', Product, item.productId);
      if (prod && prod.stock > 0) {
        await dbHelper.findByIdAndUpdate('products', Product, item.productId, {
          stock: Math.max(0, prod.stock - (item.quantity || 1))
        });
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
    const orders = await dbHelper.find('orders', Order, { userId: req.user.id });
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await dbHelper.findOne('orders', Order, { orderId: id });
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

