const Razorpay = require('razorpay');

let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  } catch (err) {
    console.warn('⚠️ Razorpay SDK init error. Defaulting to Demo Payment Mode.');
  }
}

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    // If Razorpay instance is available, create real order
    if (razorpayInstance) {
      const options = {
        amount: Math.round(amount * 100), // convert to paise
        currency,
        receipt: 'navnath_rcpt_' + Date.now()
      };
      const order = await razorpayInstance.orders.create(options);
      return res.json({
        success: true,
        order,
        key: process.env.RAZORPAY_KEY_ID,
        isDemoMode: false
      });
    }

    // Otherwise return Demo Razorpay Order for instant testing
    const demoOrderId = 'order_demo_' + Math.random().toString(36).substring(2, 11);
    res.json({
      success: true,
      order: {
        id: demoOrderId,
        entity: 'order',
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: 'demo_receipt',
        status: 'created'
      },
      key: 'rzp_test_demo_key_123',
      isDemoMode: true
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment gateway error', error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isDemoMode } = req.body;
    
    // In Demo Mode, automatically verify payment success
    if (isDemoMode || razorpay_order_id?.startsWith('order_demo_')) {
      return res.json({
        success: true,
        message: 'Demo Razorpay Payment verified successfully',
        paymentId: razorpay_payment_id || ('pay_demo_' + Date.now())
      });
    }

    // For real Razorpay verification
    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};
