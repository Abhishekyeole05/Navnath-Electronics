import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag, 
  FiTag, FiCheckCircle, FiAlertCircle 
} from 'react-icons/fi';

const Cart = ({ onToast }) => {
  const { 
    cartItems, subtotal, discountAmount, totalAmount, 
    coupon, updateQuantity, removeFromCart, clearCart, applyCouponCode 
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    const result = await applyCouponCode(couponInput.trim());
    setApplying(false);
    if (result.success) {
      if (onToast) onToast(result.message, 'success');
    } else {
      if (onToast) onToast(result.message, 'warning');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: 'rgba(11, 61, 145, 0.1)',
            color: 'var(--primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            margin: '0 auto 24px'
          }}>
            <FiShoppingBag />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
            Your Cart is Empty
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Looks like you haven't added any electrical wires, modular switches, or LED batten lights yet.
          </p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '14px 32px' }}>
            Explore Electrical Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.2rem', marginBottom: '28px', color: 'var(--text-primary)' }}>
          Shopping Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '36px', alignItems: 'flex-start' }}>
          {/* Left: Cart Items Table / List */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '16px',
              marginBottom: '20px'
            }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Products in Cart</span>
              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--danger)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Clear Cart
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cartItems.map((item) => (
                <div key={item._id || item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '20px'
                }}>
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&q=80'}
                    alt={item.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }}
                  />

                  <div style={{ flex: 1 }}>
                    <span className="badge badge-blue" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>
                      {item.brand}
                    </span>
                    <Link
                      to={`/products/${item._id || item.id}`}
                      style={{ fontWeight: 700, fontSize: '0.98rem', display: 'block', marginBottom: '6px' }}
                    >
                      {item.name}
                    </Link>

                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Quantity Adjuster */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                      style={{ padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <FiMinus />
                    </button>
                    <span style={{ padding: '0 12px', fontWeight: 700 }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                      style={{ padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <FiPlus />
                    </button>
                  </div>

                  {/* Item Total & Remove */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.08rem', marginBottom: '8px' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id || item.id)}
                      title="Remove Item"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Order Summary & Promo Code */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '28px',
            boxShadow: 'var(--card-shadow)',
            position: 'sticky',
            top: '90px'
          }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Order Summary
            </h2>

            {/* Coupon Box */}
            <form onSubmit={handleApplyCoupon} style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <FiTag /> Have a Coupon Code?
              </label>
              <div style={{ display: 'flex' }}>
                <input
                  type="text"
                  placeholder="Try: NAVNATH10 or WELCOME20"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px 0 0 8px',
                    border: '1px solid var(--border-color)',
                    borderRight: 'none',
                    flex: 1,
                    textTransform: 'uppercase',
                    fontSize: '0.88rem'
                  }}
                />
                <button
                  type="submit"
                  disabled={applying}
                  className="btn btn-primary"
                  style={{ borderRadius: '0 8px 8px 0', padding: '10px 18px', fontSize: '0.88rem' }}
                >
                  {applying ? '...' : 'Apply'}
                </button>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Available codes: <strong>NAVNATH10</strong> (10% off), <strong>WELCOME20</strong> (₹500 off)
              </div>
            </form>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 700 }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {coupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                  <span>Coupon Discount ({coupon.code})</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery Charges (Nashik)</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>FREE</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>GST (18% Included)</span>
                <span>₹{Math.round(totalAmount * 0.18).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Total Line */}
            <div style={{
              borderTop: '2px dashed var(--border-color)',
              paddingTop: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Payable</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-accent"
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem', borderRadius: '10px' }}
            >
              Proceed to Checkout <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
