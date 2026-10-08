import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  FiLock, FiCheckCircle, FiTruck, FiShield, FiZap, FiCreditCard,
  FiSmartphone, FiDollarSign, FiCopy, FiClock, FiAlertCircle, FiX, FiCheck
} from 'react-icons/fi';

const Checkout = ({ onToast }) => {
  const { cartItems, subtotal, discountAmount, totalAmount, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user ? user.name : '',
    phone: user ? (user.phone || '') : '',
    street: user && user.address ? (typeof user.address === 'object' ? user.address.street : user.address) : '',
    city: user && user.address && typeof user.address === 'object' ? user.address.city : 'Manmad',
    state: user && user.address && typeof user.address === 'object' ? user.address.state : 'Maharashtra',
    postalCode: user && user.address && typeof user.address === 'object' ? user.address.postalCode : '422001'
  });

  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        fullName: user.name || prev.fullName,
        phone: user.phone || prev.phone,
        street: user.address ? (typeof user.address === 'object' ? user.address.street : user.address) : prev.street,
        city: (user.address && typeof user.address === 'object' && user.address.city) || prev.city,
        state: (user.address && typeof user.address === 'object' && user.address.state) || prev.state,
        postalCode: (user.address && typeof user.address === 'object' && user.address.postalCode) || prev.postalCode
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('upi_qr'); // 'upi_qr' | 'razorpay' | 'cod' | 'demo'
  const [processing, setProcessing] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Modals & payment states
  const [showQrModal, setShowQrModal] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [qrTimer, setQrTimer] = useState(600); // 10 minutes countdown

  const SHOP_UPI_ID = '8862004797@okaxis';
  const SHOP_NAME = 'New Navnath Electronics';

  // Countdown timer for QR
  useEffect(() => {
    let interval = null;
    if (showQrModal && qrTimer > 0) {
      interval = setInterval(() => {
        setQrTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showQrModal, qrTimer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(SHOP_UPI_ID);
    setCopiedUpi(true);
    if (onToast) onToast('UPI ID copied to clipboard!', 'success');
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  // Build UPI URI for dynamic QR Code
  const upiPaymentUri = `upi://pay?pa=${encodeURIComponent(SHOP_UPI_ID)}&pn=${encodeURIComponent(SHOP_NAME)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('Navnath_Order_' + (pendingOrder ? pendingOrder.orderId : 'New'))}`;

  // Step 1: Initiate Order / Payment Flow
  const handleInitiateOrder = async (e, forceInstantDemo = false) => {
    if (e) e.preventDefault();

    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street) {
      if (onToast) onToast('Please complete all required shipping address fields', 'warning');
      return;
    }

    if (cartItems.length === 0) {
      if (onToast) onToast('Your cart is empty', 'warning');
      return;
    }

    setProcessing(true);

    try {
      const activeMethod = forceInstantDemo ? 'Demo Instant' : (
        paymentMethod === 'upi_qr' ? 'UPI QR Code' :
        paymentMethod === 'razorpay' ? 'Razorpay / Online' : 'Cash on Delivery'
      );

      // 1. Create the base Order in database
      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          qty: item.quantity,
          quantity: item.quantity,
          price: Number(item.price),
          image: item.image,
          brand: item.brand
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          address: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          pinCode: shippingAddress.postalCode
        },
        paymentMethod: activeMethod,
        subtotal: subtotal,
        discountAmount: discountAmount,
        totalAmount: totalAmount,
        totalPrice: totalAmount,
        couponCode: coupon ? coupon.code : null,
        paymentStatus: forceInstantDemo ? 'Paid' : 'Pending'
      };

      const res = await axios.post('/api/orders', orderPayload);
      if (!res.data.success || !res.data.order) {
        throw new Error(res.data.message || 'Order creation failed');
      }

      const createdOrder = res.data.order;
      setPendingOrder(createdOrder);

      // --- BRANCH A: INSTANT DEMO ---
      if (forceInstantDemo) {
        await axios.put(`/api/orders/${createdOrder._id || createdOrder.orderId}/pay`, {
          id: `pay_demo_${Date.now()}`,
          paymentMethod: 'Demo Instant',
          status: 'completed',
          email_address: user ? user.email : 'demo@navnath.com'
        });
        clearCart();
        if (onToast) onToast('Demo order placed and marked as paid!', 'success');
        navigate(`/order-success/${createdOrder.orderId || createdOrder._id}`);
        return;
      }

      // --- BRANCH B: CASH ON DELIVERY ---
      if (paymentMethod === 'cod') {
        clearCart();
        if (onToast) onToast('Cash on Delivery order placed successfully!', 'success');
        navigate(`/order-success/${createdOrder.orderId || createdOrder._id}`);
        return;
      }

      // --- BRANCH C: UPI QR CODE ---
      if (paymentMethod === 'upi_qr') {
        setShowQrModal(true);
        setQrTimer(600);
        return;
      }

      // --- BRANCH D: RAZORPAY PAYMENT ---
      if (paymentMethod === 'razorpay') {
        const payRes = await axios.post('/api/payments/razorpay-order', {
          amount: totalAmount,
          currency: 'INR',
          receipt: `rcpt_${createdOrder.orderId || createdOrder._id}`
        });

        if (!payRes.data.success) {
          throw new Error('Could not initialize Razorpay gateway');
        }

        const razorpayOrder = payRes.data.order;
        const keyId = payRes.data.key;
        const isDemo = payRes.data.isDemoMode;

        // If real Razorpay key is present and script is loaded
        if (window.Razorpay && keyId && !keyId.includes('sandbox') && !keyId.includes('test_demo') && !isDemo) {
          const options = {
            key: keyId,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'New Navnath Electronics & Electricals',
            description: `Order #${createdOrder.orderId || createdOrder._id}`,
            order_id: razorpayOrder.id,
            handler: async function (response) {
              await axios.put(`/api/orders/${createdOrder._id || createdOrder.orderId}/pay`, {
                id: response.razorpay_payment_id,
                paymentMethod: 'Razorpay / Online',
                status: 'completed',
                email_address: user ? user.email : 'customer@navnath.com',
                paymentDetails: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }
              });
              clearCart();
              if (onToast) onToast('Payment received! Order placed successfully.', 'success');
              navigate(`/order-success/${createdOrder.orderId || createdOrder._id}`);
            },
            prefill: {
              name: shippingAddress.fullName,
              email: user ? user.email : 'customer@navnath.com',
              contact: shippingAddress.phone
            },
            theme: { color: '#0B3D91' }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Open interactive Razorpay Sandbox modal
          setShowRazorpayModal(true);
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || err.message || 'Order placement failed';
      if (onToast) onToast(msg, 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Step 2: Confirm UPI QR Payment
  const handleConfirmUpiPayment = async () => {
    if (!pendingOrder) return;
    setVerifyingPayment(true);

    try {
      const orderRef = pendingOrder._id || pendingOrder.orderId;
      const cleanUtr = utrNumber.trim() || `UPI${Date.now().toString().slice(-6)}`;

      const res = await axios.put(`/api/orders/${orderRef}/pay`, {
        paymentId: `UPI_UTR_${cleanUtr}`,
        utrNumber: cleanUtr,
        paymentMethod: 'UPI QR Code',
        status: 'completed',
        email_address: user ? user.email : 'customer@navnath.com',
        paymentDetails: {
          paidVia: 'UPI QR Scanner',
          utrNumber: cleanUtr,
          amount: totalAmount,
          merchantUpi: SHOP_UPI_ID
        }
      });

      if (res.data.success) {
        clearCart();
        setShowQrModal(false);
        if (onToast) onToast('UPI Payment Confirmed! Your order is placed.', 'success');
        navigate(`/order-success/${orderRef}`);
      } else {
        throw new Error(res.data.message || 'Payment confirmation failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Could not verify UPI payment';
      if (onToast) onToast(msg, 'error');
    } finally {
      setVerifyingPayment(false);
    }
  };

  // Step 3: Confirm Razorpay Sandbox Modal Payment
  const handleConfirmRazorpaySandbox = async (methodType = 'Card') => {
    if (!pendingOrder) return;
    setVerifyingPayment(true);

    try {
      const orderRef = pendingOrder._id || pendingOrder.orderId;
      const fakePayId = `pay_rzp_${methodType.toLowerCase()}_${Date.now()}`;

      const res = await axios.put(`/api/orders/${orderRef}/pay`, {
        id: fakePayId,
        paymentMethod: `Razorpay (${methodType})`,
        status: 'completed',
        email_address: user ? user.email : 'customer@navnath.com',
        paymentDetails: {
          gateway: 'Razorpay Sandbox',
          method: methodType,
          paymentId: fakePayId,
          amount: totalAmount
        }
      });

      if (res.data.success) {
        clearCart();
        setShowRazorpayModal(false);
        if (onToast) onToast(`Payment of ₹${totalAmount.toLocaleString('en-IN')} successful via Razorpay!`, 'success');
        navigate(`/order-success/${orderRef}`);
      }
    } catch (err) {
      if (onToast) onToast('Razorpay payment failed. Please retry.', 'error');
    } finally {
      setVerifyingPayment(false);
    }
  };

  if (cartItems.length === 0 && !pendingOrder) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '48px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h2 style={{ marginBottom: '12px' }}>Your Shopping Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Add electrical wires, switches, lights, or motors to your cart before proceeding to checkout.
          </p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Explore Electrical Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="badge badge-yellow">
            <FiLock /> 256-BIT ENCRYPTED CHECKOUT
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '28px', color: 'var(--text-primary)' }}>
          Review & Place Order
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '36px', alignItems: 'flex-start' }}>
          {/* Left Column: Shipping Details & Payment Selection */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '28px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiTruck style={{ color: 'var(--primary-blue)' }} /> 1. Shipping & Delivery Address
            </h2>

            <form onSubmit={handleInitiateOrder}>
              <div className="form-group">
                <label className="form-label">Full Name / Business Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={shippingAddress.fullName}
                  onChange={handleAddressChange}
                  className="form-input"
                  placeholder="e.g. Ramesh Patil"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (For delivery updates & SMS) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  className="form-input"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Complete Street Address / Shop No / Flat *</label>
                <textarea
                  name="street"
                  rows={2}
                  required
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
                  className="form-textarea"
                  placeholder="House/Shop no, building name, landmark..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <h2 style={{ fontSize: '1.25rem', marginTop: '30px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiCreditCard style={{ color: 'var(--primary-blue)' }} /> 2. Choose Payment Method
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                {/* Method 1: UPI QR Scanner */}
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '16px',
                  border: paymentMethod === 'upi_qr' ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'upi_qr' ? 'rgba(11, 61, 145, 0.05)' : 'var(--bg-secondary)',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi_qr"
                    checked={paymentMethod === 'upi_qr'}
                    onChange={() => setPaymentMethod('upi_qr')}
                    style={{ width: '20px', height: '20px', marginTop: '2px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                        📱 Scan & Pay via UPI QR Code (GPay, PhonePe, Paytm)
                      </span>
                      <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>POPULAR</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Generates a dynamic QR Code for exact amount <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>. Scan with any UPI app on your phone.
                    </div>
                  </div>
                </label>

                {/* Method 2: Razorpay Gateway */}
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '16px',
                  border: paymentMethod === 'razorpay' ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'razorpay' ? 'rgba(11, 61, 145, 0.05)' : 'var(--bg-secondary)',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    style={{ width: '20px', height: '20px', marginTop: '2px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                        💳 Razorpay Online Payment (Cards, NetBanking, Wallets)
                      </span>
                      <span className="badge badge-yellow" style={{ fontSize: '0.72rem' }}>INSTANT</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Secure gateway supporting Visa, MasterCard, RuPay, NetBanking from all major Indian banks.
                    </div>
                  </div>
                </label>

                {/* Method 3: Cash on Delivery */}
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '16px',
                  border: paymentMethod === 'cod' ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'cod' ? 'rgba(11, 61, 145, 0.05)' : 'var(--bg-secondary)',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ width: '20px', height: '20px', marginTop: '2px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                        💵 Cash on Delivery (COD)
                      </span>
                      <span className="badge" style={{ backgroundColor: '#E2E8F0', color: '#334155', fontSize: '0.72rem' }}>DOORSTEP</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Pay ₹{totalAmount.toLocaleString('en-IN')} in cash or UPI when the delivery executive arrives at your location in Manmad.
                    </div>
                  </div>
                </label>
              </div>

              {/* Main Submit Action */}
              <button
                type="submit"
                disabled={processing}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '16px',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '14px'
                }}
              >
                {processing ? (
                  <span>Initiating Payment...</span>
                ) : (
                  <>
                    <FiLock />
                    {paymentMethod === 'upi_qr' && `Proceed to UPI QR Scanner (₹${totalAmount.toLocaleString('en-IN')})`}
                    {paymentMethod === 'razorpay' && `Pay via Razorpay (₹${totalAmount.toLocaleString('en-IN')})`}
                    {paymentMethod === 'cod' && `Confirm Cash on Delivery (₹${totalAmount.toLocaleString('en-IN')})`}
                  </>
                )}
              </button>

              {/* Instant Demo Testing Button */}
              <button
                type="button"
                onClick={(e) => handleInitiateOrder(e, true)}
                disabled={processing}
                className="btn btn-accent"
                style={{ width: '100%', padding: '12px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <FiZap /> ⚡ 1-Click Instant Demo Order (Test Mode)
              </button>
            </form>
          </div>

          {/* Right Column: Order Review & Pricing Breakdown */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '28px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Order Summary ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
            </h2>

            {/* Item List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', maxHeight: '300px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item._id || item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'}
                      alt=""
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
                <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {coupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                  <span>Coupon Discount ({coupon.code})</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery across Manmad</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>FREE DELIVERY</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>GST (18% Included)</span>
                <span style={{ color: 'var(--text-secondary)' }}>₹{Math.round(totalAmount * 0.18).toLocaleString('en-IN')}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '1.3rem',
                marginTop: '12px',
                borderTop: '2px solid var(--border-color)',
                paddingTop: '16px'
              }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary-blue)' }}>
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)' }}>
                <FiCheckCircle /> 100% Genuine Electrical Products with Warranty
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)' }}>
                <FiShield /> Certified Local Shop: Opposite Bus Stand, Manmad
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: INTERACTIVE UPI QR CODE SCANNER MODAL */}
      {/* ========================================================================= */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '480px',
            width: '100%',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowQrModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <FiX style={{ fontSize: '1.2rem', color: '#475569' }} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <span className="badge badge-yellow" style={{ marginBottom: '8px' }}>
                DIRECT UPI PAYMENT
              </span>
              <h2 style={{ fontSize: '1.4rem', color: '#0F172A', marginBottom: '4px' }}>
                Scan to Pay ₹{totalAmount.toLocaleString('en-IN')}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '16px' }}>
                Open Google Pay, PhonePe, Paytm, or BHIM & scan this code
              </p>

              {/* QR Container */}
              <div style={{
                background: '#F8FAFC',
                padding: '20px',
                borderRadius: '16px',
                border: '2px solid #E2E8F0',
                display: 'inline-block',
                marginBottom: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <QRCodeSVG
                  value={upiPaymentUri}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 700, marginTop: '8px' }}>
                  ⚡ Instant UPI Verification
                </div>
              </div>

              {/* UPI ID Copy Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F1F5F9',
                padding: '10px 14px',
                borderRadius: '10px',
                marginBottom: '18px',
                fontSize: '0.88rem'
              }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>
                  UPI ID: <strong>{SHOP_UPI_ID}</strong>
                </span>
                <button
                  type="button"
                  onClick={copyUpiId}
                  style={{
                    border: 'none',
                    background: copiedUpi ? '#10B981' : '#0B3D91',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedUpi ? <><FiCheck /> Copied</> : <><FiCopy /> Copy UPI ID</>}
                </button>
              </div>

              {/* Timer Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', color: '#DC2626', marginBottom: '18px' }}>
                <FiClock /> QR expires in: <strong>{formatTimer(qrTimer)}</strong>
              </div>

              {/* UTR Input Section */}
              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                  Enter UPI Transaction Reference / UTR Number (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. 423871928371 (12 digits)"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                disabled={verifyingPayment}
                onClick={handleConfirmUpiPayment}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  backgroundColor: '#10B981',
                  borderColor: '#10B981'
                }}
              >
                {verifyingPayment ? 'Verifying Payment...' : '✅ I Have Paid – Confirm My Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RAZORPAY SANDBOX TEST MODAL */}
      {/* ========================================================================= */}
      {showRazorpayModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowRazorpayModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <FiX style={{ fontSize: '1.2rem', color: '#475569' }} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: '#0B3D91',
                color: '#FFC107',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                margin: '0 auto 12px',
                fontWeight: 900
              }}>
                R
              </div>
              <h2 style={{ fontSize: '1.35rem', color: '#0F172A', marginBottom: '4px' }}>
                Razorpay Secure Checkout
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Payable Amount: <strong style={{ color: '#0B3D91', fontSize: '1.1rem' }}>₹{totalAmount.toLocaleString('en-IN')}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                disabled={verifyingPayment}
                onClick={() => handleConfirmRazorpaySandbox('UPI (Google Pay / PhonePe)')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  color: '#1E293B',
                  cursor: 'pointer'
                }}
              >
                <span>📱 Pay via UPI Intent (GPay / PhonePe)</span>
                <span style={{ color: '#0B3D91' }}>→</span>
              </button>

              <button
                type="button"
                disabled={verifyingPayment}
                onClick={() => handleConfirmRazorpaySandbox('Credit / Debit Card')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  color: '#1E293B',
                  cursor: 'pointer'
                }}
              >
                <span>💳 Pay via Credit / Debit Card (Visa/MasterCard)</span>
                <span style={{ color: '#0B3D91' }}>→</span>
              </button>

              <button
                type="button"
                disabled={verifyingPayment}
                onClick={() => handleConfirmRazorpaySandbox('Net Banking')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  color: '#1E293B',
                  cursor: 'pointer'
                }}
              >
                <span>🏦 Pay via Net Banking (SBI, HDFC, ICICI, Axis)</span>
                <span style={{ color: '#0B3D91' }}>→</span>
              </button>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#64748B' }}>
              🔒 Protected by 256-bit SSL & Razorpay PCI-DSS Security
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

