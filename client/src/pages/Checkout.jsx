import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiCheckCircle, FiTruck, FiShield, FiZap, FiCreditCard } from 'react-icons/fi';

const Checkout = ({ onToast }) => {
  const { cartItems, subtotal, discountAmount, totalAmount, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user ? user.name : 'Sanjay Patil',
    phone: user ? user.phone || '8862004797' : '8862004797',
    street: 'NEW NAVNATH ELECTRONICS AND ELECTRICALS, OPPOSITE BUS STAND',
    city: 'Manmad',
    state: 'Maharashtra',
    postalCode: '422001'
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e, isDemoInstant = false) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street) {
      if (onToast) onToast('Please complete shipping address fields', 'warning');
      return;
    }

    setProcessing(true);
    try {
      // 1. Create Order
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          product: item._id || item.id,
          name: item.name,
          qty: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingAddress,
        paymentMethod: isDemoInstant ? 'demo_instant' : paymentMethod,
        itemsPrice: subtotal,
        taxPrice: Math.round(totalAmount * 0.18),
        shippingPrice: 0,
        totalPrice: totalAmount,
        couponCode: coupon ? coupon.code : null
      };

      const res = await axios.post('/api/orders', orderPayload);
      if (!res.data.success) {
        throw new Error('Order creation failed');
      }

      const order = res.data.order;

      // 2. Handle Payment Flow
      if (isDemoInstant || paymentMethod === 'cod') {
        // Mark payment in demo
        if (isDemoInstant) {
          await axios.put(`/api/orders/${order._id || order.id}/pay`, {
            id: `pay_demo_${Date.now()}`,
            status: 'completed',
            email_address: user ? user.email : 'demo@navnath.com'
          });
        }
        clearCart();
        if (onToast) onToast('Order placed successfully!', 'success');
        navigate(`/order-success/${order._id || order.id}`);
        return;
      }

      // 3. Razorpay Payment
      if (paymentMethod === 'razorpay') {
        const payRes = await axios.post('/api/payments/razorpay-order', {
          amount: totalAmount,
          currency: 'INR',
          receipt: `rcpt_${order._id || order.id}`
        });

        if (!payRes.data.success) {
          throw new Error('Razorpay initialization failed');
        }

        const razorpayOrder = payRes.data.order;
        const keyId = payRes.data.keyId;

        // If Razorpay SDK is present or using Demo mode
        if (window.Razorpay && keyId && keyId !== 'rzp_test_demo_key') {
          const options = {
            key: keyId,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'New Navnath Electronics & Electricals',
            description: `Order #${order._id || order.id}`,
            order_id: razorpayOrder.id,
            handler: async function (response) {
              await axios.put(`/api/orders/${order._id || order.id}/pay`, {
                id: response.razorpay_payment_id,
                status: 'completed',
                email_address: user ? user.email : 'customer@navnath.com'
              });
              clearCart();
              if (onToast) onToast('Payment received! Order placed successfully.', 'success');
              navigate(`/order-success/${order._id || order.id}`);
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
          // Fallback demo payment completion
          await axios.put(`/api/orders/${order._id || order.id}/pay`, {
            id: `pay_demo_${Date.now()}`,
            status: 'completed',
            email_address: user ? user.email : 'demo@navnath.com'
          });
          clearCart();
          if (onToast) onToast('Demo Payment successful! Order created.', 'success');
          navigate(`/order-success/${order._id || order.id}`);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Order placement failed';
      if (onToast) onToast(msg, 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.2rem', marginBottom: '28px', color: 'var(--text-primary)' }}>
          Secure Checkout
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '36px', alignItems: 'flex-start' }}>
          {/* Left: Shipping Form */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '28px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiTruck /> Shipping & Delivery Address
            </h2>

            <form onSubmit={(e) => handlePlaceOrder(e, false)}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={shippingAddress.fullName}
                  onChange={handleAddressChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (For delivery updates) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Street Address / Society / Flat No. *</label>
                <textarea
                  name="street"
                  rows={2}
                  required
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
                  className="form-textarea"
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
                  <label className="form-label">Postal Code *</label>
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

              {/* Payment Selection */}
              <h3 style={{ fontSize: '1.15rem', marginTop: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCreditCard /> Select Payment Method
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  border: paymentMethod === 'razorpay' ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'razorpay' ? 'rgba(11, 61, 145, 0.05)' : 'transparent'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700 }}>Razorpay Secure Online Payment</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>UPI (GPay/PhonePe), Credit & Debit Cards, NetBanking</div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  border: paymentMethod === 'cod' ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'cod' ? 'rgba(11, 61, 145, 0.05)' : 'transparent'
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700 }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pay cash or UPI when order arrives at your doorstep</div>
                  </div>
                </label>
              </div>

              {/* Standard Submit */}
              <button
                type="submit"
                disabled={processing}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginBottom: '14px' }}
              >
                {processing ? 'Processing Order...' : `Pay & Place Order (₹${totalAmount.toLocaleString('en-IN')})`}
              </button>

              {/* 1-Click Instant Demo Button */}
              <button
                type="button"
                onClick={(e) => handlePlaceOrder(e, true)}
                disabled={processing}
                className="btn btn-accent"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
              >
                <FiZap /> ⚡ Instant Demo Order (Bypass Payment)
              </button>
            </form>
          </div>

          {/* Right: Summary List */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '28px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Order Review
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', maxHeight: '320px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item._id || item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={item.image} alt="" style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Items Total</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {coupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                  <span>Coupon ({coupon.code})</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery (Manmad)</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>FREE</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--primary-blue)' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ marginTop: '24px', padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <FiShield style={{ fontSize: '1.4rem', color: 'var(--primary-blue)', flexShrink: 0 }} />
              <span>Your payment is protected by 256-bit SSL encryption and Razorpay PCI-DSS standards.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
