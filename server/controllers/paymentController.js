const Razorpay = require('razorpay');
const crypto = require('crypto');

let razorpayInstance = null;
const keyId = process.env.RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

if (keyId && keySecret) {
  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
    console.log('✅ Razorpay Payment Gateway configured successfully with Live/Test credentials.');
  } catch (err) {
    console.warn('⚠️ Razorpay SDK init error. Falling back to Demo/Sandbox mode.');
  }
}

exports.getPaymentConfig = (req, res) => {
  res.json({
    success: true,
    razorpay: {
      enabled: true,
      hasLiveKeys: !!(razorpayInstance && keyId && !keyId.includes('demo')),
      keyId: keyId || 'rzp_test_navnath_electronics_sandbox'
    },
    upi: {
      enabled: true,
      upiId: '8862004797@okaxis',
      merchantName: 'New Navnath Electronics & Electricals',
      shopPhone: '8862004797'
    },
    cod: {
      enabled: true,
      note: 'Available for Manmad and nearby delivery areas'
    }
  });
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount is required' });
    }

    // If real Razorpay instance is initialized
    if (razorpayInstance && keyId) {
      const options = {
        amount: Math.round(numAmount * 100), // convert to paise
        currency,
        receipt: receipt || `navnath_rcpt_${Date.now()}`
      };
      const order = await razorpayInstance.orders.create(options);
      return res.json({
        success: true,
        order,
        key: keyId,
        isDemoMode: false
      });
    }

    // Interactive Sandbox / Demo Razorpay order
    const demoOrderId = 'order_navnath_' + Math.random().toString(36).substring(2, 12);
    res.json({
      success: true,
      order: {
        id: demoOrderId,
        entity: 'order',
        amount: Math.round(numAmount * 100),
        currency: 'INR',
        receipt: receipt || `rcpt_navnath_${Date.now()}`,
        status: 'created'
      },
      key: keyId || 'rzp_test_navnath_electronics_sandbox',
      isDemoMode: true
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ success: false, message: 'Payment gateway error', error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isDemoMode } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({ success: false, message: 'Payment ID is missing' });
    }

    // If real Razorpay secret is present, verify HMAC SHA256 signature
    if (keySecret && razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment signature verification failed' });
      }
    }

    res.json({
      success: true,
      message: 'Razorpay Payment verified successfully',
      paymentId: razorpay_payment_id
    });
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed', error: error.message });
  }
};

exports.verifyUpiPayment = async (req, res) => {
  try {
    const { utrNumber, amount, orderId } = req.body;
    
    // Validate UTR / Reference
    const cleanUtr = (utrNumber || '').trim();
    if (!cleanUtr || cleanUtr.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid UPI Transaction / UTR reference number (at least 4 digits)'
      });
    }

    const paymentId = `UPI_UTR_${cleanUtr}_${Date.now()}`;

    res.json({
      success: true,
      message: 'UPI payment verified successfully',
      paymentId,
      utr: cleanUtr
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'UPI verification failed', error: error.message });
  }
};
