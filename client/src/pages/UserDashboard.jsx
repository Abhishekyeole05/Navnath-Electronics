import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';
import { 
  FiPackage, FiCalendar, FiHeart, FiShoppingCart, FiUser, FiLogOut, 
  FiCheckCircle, FiClock, FiAlertCircle, FiTrash2, FiArrowRight, FiZap,
  FiStar, FiMessageSquare, FiX
} from 'react-icons/fi';

const UserDashboard = ({ onToast }) => {
  const { user, logout, loading: authLoading } = useAuth();
  const { cartItems, subtotal, totalAmount, removeFromCart, updateQuantity } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'cart');
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [myReviews, setMyReviews] = useState([]);

  // Feedback modal state
  const [feedbackModal, setFeedbackModal] = useState(null); // { orderId, items }
  const [feedbackProductId, setFeedbackProductId] = useState('');
  const [feedbackProductName, setFeedbackProductName] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());

  useEffect(() => {
    const tabParam = queryParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [location.search]);

  // Fetch orders & bookings
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingData(true);
      try {
        const [ordRes, bookRes, revRes] = await Promise.all([
          axios.get('/api/orders/myorders').catch(() => ({ data: { success: false, orders: [] } })),
          axios.get('/api/services/mybookings').catch(() => ({ data: { success: false, bookings: [] } })),
          axios.get('/api/reviews/my-reviews').catch(() => ({ data: { success: false, reviews: [] } }))
        ]);
        if (ordRes.data.success) setOrders(ordRes.data.orders);
        if (bookRes.data.success) setBookings(bookRes.data.bookings);
        if (revRes.data.success) {
          setMyReviews(revRes.data.reviews);
          setReviewedProducts(new Set(revRes.data.reviews.map(r => String(r.productId))));
        }

        // Fetch Wishlist products
        if (wishlist.length > 0) {
          const wRes = await axios.get('/api/products');
          if (wRes.data.success) {
            setWishlistProducts(wRes.data.products.filter(p => wishlist.includes(p._id || p.id)));
          }
        } else {
          setWishlistProducts([]);
        }
      } catch (err) {
        console.warn('Failed to load dashboard data');
      } finally {
        setLoadingData(false);
      }
    };
    fetchUserData();
  }, [wishlist]);

  if (authLoading) {
    return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Loading user profile...</div>;
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Please Sign In</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Sign in to view your cart, orders, service bookings, and wishlist.
        </p>
        <Link to="/login" className="btn btn-primary">Sign In to Account</Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const st = (status || 'Processing').toLowerCase();
    if (st === 'delivered' || st === 'completed' || st === 'confirmed') {
      return <span className="badge badge-green">{status}</span>;
    }
    return <span className="badge badge-yellow">{status}</span>;
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackComment.trim() || !feedbackProductId) return;
    setFeedbackSubmitting(true);
    try {
      const res = await axios.post(`/api/products/${feedbackProductId}/reviews`, {
        rating: feedbackRating,
        comment: feedbackComment
      });
      if (res.data.success) {
        setReviewedProducts(prev => new Set([...prev, String(feedbackProductId)]));
        setMyReviews(prev => [res.data.review, ...prev]);
        setFeedbackModal(null);
        setFeedbackComment('');
        setFeedbackRating(5);
        if (onToast) onToast('Thank you! Your review has been posted.', 'success');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to submit review';
      if (onToast) onToast(msg, 'error');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  const openFeedbackModal = (order) => {
    const items = order.items || order.orderItems || [];
    if (items.length === 1) {
      const item = items[0];
      setFeedbackProductId(item.productId || '');
      setFeedbackProductName(item.name || 'Product');
    } else {
      setFeedbackProductId(items[0]?.productId || '');
      setFeedbackProductName(items[0]?.name || 'Product');
    }
    setFeedbackRating(5);
    setFeedbackComment('');
    setFeedbackModal({ orderId: order.orderId || order._id, items });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
          My Customer Dashboard
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Welcome back, <strong>{user.name}</strong>! Track your shopping cart, electrical orders, technician visits, and favorites.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', alignItems: 'flex-start' }}>
          {/* Left Sidebar Menu */}
          <aside style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-blue)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{user.email}</div>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('cart')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeTab === 'cart' ? 'var(--primary-blue)' : 'transparent',
                  color: activeTab === 'cart' ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FiShoppingCart /> My Cart ({cartItems.length})
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeTab === 'orders' ? 'var(--primary-blue)' : 'transparent',
                  color: activeTab === 'orders' ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FiPackage /> My Orders ({orders.length})
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeTab === 'bookings' ? 'var(--primary-blue)' : 'transparent',
                  color: activeTab === 'bookings' ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FiCalendar /> Electrician Bookings ({bookings.length})
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeTab === 'wishlist' ? 'var(--primary-blue)' : 'transparent',
                  color: activeTab === 'wishlist' ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FiHeart /> Wishlist ({wishlist.length})
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeTab === 'reviews' ? 'var(--primary-blue)' : 'transparent',
                  color: activeTab === 'reviews' ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FiStar /> My Reviews ({myReviews.length})
              </button>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    color: '#B45309',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  ⚡ Admin Portal
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--danger)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: '12px'
                }}
              >
                <FiLogOut /> Sign Out
              </button>
            </nav>
          </aside>

          {/* Right Main Content */}
          <main style={{ flex: 1 }}>
            {/* 1. CART TAB */}
            {activeTab === 'cart' && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '28px',
                boxShadow: 'var(--card-shadow)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.4rem' }}>Products in My Cart ({cartItems.length})</h2>
                  {cartItems.length > 0 && (
                    <Link to="/checkout" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Proceed to Checkout <FiArrowRight />
                    </Link>
                  )}
                </div>

                {cartItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                    Your cart is currently empty. <Link to="/products" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>Browse Electrical Products</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {cartItems.map((item) => (
                      <div key={item._id || item.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-secondary)',
                        flexWrap: 'wrap',
                        gap: '14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'}
                            alt=""
                            style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                              Brand: {item.brand || 'Electricals'} | Unit Price: ₹{(item.price || 0).toLocaleString('en-IN')}
                            </div>
                            <div style={{ fontWeight: 800, color: 'var(--primary-blue)', marginTop: '4px' }}>
                              Subtotal: ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Qty: {item.quantity}</span>
                          <button
                            onClick={() => removeFromCart(item._id || item.id)}
                            className="btn btn-outline btn-sm"
                            style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '6px 12px' }}
                          >
                            <FiTrash2 /> Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Cart Summary Footer */}
                    <div style={{
                      marginTop: '20px',
                      paddingTop: '20px',
                      borderTop: '2px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Payable Amount:</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                          ₹{(totalAmount || subtotal || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/cart" className="btn btn-outline">
                          View Full Cart
                        </Link>
                        <Link to="/checkout" className="btn btn-accent" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FiZap /> Checkout Now
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '28px',
                boxShadow: 'var(--card-shadow)'
              }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>My Orders ({orders.length})</h2>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                    No orders placed yet. <Link to="/products" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>Shop products</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map((ord) => {
                      const orderItems = ord.items || ord.orderItems || [];
                      const total = ord.totalAmount || ord.totalPrice || ord.subtotal || 0;
                      const orderCode = ord.orderId || ord._id || ord.id;
                      const status = ord.orderStatus || ord.status || 'Processing';

                      return (
                        <div key={ord._id || ord.id} style={{
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-blue)' }}>
                                Order #{orderCode}
                              </span>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Placed on: {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            {getStatusBadge(status)}
                          </div>

                          {/* Items */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {orderItems.map((item, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <img 
                                    src={item.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'} 
                                    alt="" 
                                    style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} 
                                  />
                                  <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                      Qty: {item.quantity || item.qty} × ₹{(item.price || 0).toLocaleString('en-IN')}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ fontWeight: 700 }}>
                                  ₹{((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString('en-IN')}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total: </span>
                              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary-blue)' }}>
                                ₹{total.toLocaleString('en-IN')}
                              </span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '10px' }}>
                                Payment: {ord.paymentMethod ? ord.paymentMethod.toUpperCase() : 'COD'} ({ord.paymentStatus || 'Pending'})
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              {/* Feedback Button for Delivered Orders */}
                              {status.toLowerCase() === 'delivered' && (() => {
                                const orderItems = ord.items || ord.orderItems || [];
                                const allReviewed = orderItems.every(item =>
                                  reviewedProducts.has(String(item.productId || ''))
                                );
                                return allReviewed ? (
                                  <span style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '7px 14px', borderRadius: '8px',
                                    backgroundColor: 'rgba(16,185,129,0.12)',
                                    color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem'
                                  }}>
                                    <FiCheckCircle /> Reviewed ✓
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => openFeedbackModal(ord)}
                                    className="btn btn-outline btn-sm"
                                    style={{ borderColor: 'var(--accent-yellow)', color: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', gap: '6px' }}
                                  >
                                    <FiStar /> Leave Feedback
                                  </button>
                                );
                              })()}
                              <Link to={`/order-success/${orderCode}`} className="btn btn-outline btn-sm">
                                View Receipt / Invoice
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '28px',
                boxShadow: 'var(--card-shadow)'
              }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>My Electrician Bookings ({bookings.length})</h2>

                {bookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                    No service bookings yet. <Link to="/services" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>Book home electrician</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {bookings.map((bk) => (
                      <div key={bk._id || bk.id} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px'
                      }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                            {bk.serviceName || bk.serviceTitle || 'Home Electrical Service'}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            📅 Date: {bk.preferredDate || bk.date} {bk.message ? `| 📝 ${bk.message}` : ''}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            📍 Location: {bk.address}
                          </div>
                          {bk.technicianName && bk.technicianName !== 'Pending Assignment' && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, marginTop: '4px' }}>
                              👨‍🔧 Assigned: {bk.technicianName}
                            </div>
                          )}
                        </div>
                        {getStatusBadge(bk.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--text-primary)' }}>
                  My Wishlist ({wishlistProducts.length})
                </h2>

                {wishlistProducts.length === 0 ? (
                  <div style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    padding: '40px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                  }}>
                    Your wishlist is empty.
                  </div>
                ) : (
                  <div className="grid-cols-3">
                    {wishlistProducts.map((prod) => (
                      <ProductCard key={prod._id || prod.id} product={prod} onToast={onToast} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. MY REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '28px',
                boxShadow: 'var(--card-shadow)'
              }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiStar style={{ color: 'var(--accent-yellow)' }} /> My Reviews & Feedback ({myReviews.length})
                </h2>

                {myReviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                    <FiMessageSquare style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.4 }} />
                    <div>You haven't left any reviews yet.</div>
                    <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>Reviews can be left after a product is delivered.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {myReviews.map((rev, i) => (
                      <div key={rev._id || i} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '18px 20px',
                        backgroundColor: 'var(--bg-secondary)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                              {rev.productName || 'Product Review'}
                            </div>
                            <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
                              {[1,2,3,4,5].map(n => (
                                <FiStar key={n} style={{
                                  fill: n <= rev.rating ? 'var(--accent-yellow)' : 'none',
                                  color: n <= rev.rating ? 'var(--accent-yellow)' : 'var(--border-color)',
                                  fontSize: '1rem'
                                }} />
                              ))}
                              <span style={{ marginLeft: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{rev.rating}/5</span>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.date || new Date(rev.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                          &quot;{rev.comment}&quot;
                        </p>
                        <div style={{ marginTop: '8px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiCheckCircle /> Verified Purchase Review
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Feedback Modal Overlay */}
      {feedbackModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setFeedbackModal(null)}>
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              padding: '36px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setFeedbackModal(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.4rem', color: 'var(--text-secondary)'
              }}
            ><FiX /></button>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '6px', color: 'var(--text-primary)' }}>
              Leave Feedback
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Order #{feedbackModal.orderId}
            </p>

            {/* Product Selector (if multiple items) */}
            {feedbackModal.items.length > 1 && (
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Select Product to Review</label>
                <select
                  className="form-select"
                  value={feedbackProductId}
                  onChange={e => {
                    const selected = feedbackModal.items.find(it => it.productId === e.target.value);
                    setFeedbackProductId(e.target.value);
                    setFeedbackProductName(selected?.name || 'Product');
                  }}
                >
                  {feedbackModal.items.map((item, i) => (
                    <option key={i} value={item.productId || ''}>{item.name}</option>
                  ))}
                </select>
              </div>
            )}

            {feedbackModal.items.length === 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                backgroundColor: 'var(--bg-secondary)', padding: '12px 16px',
                borderRadius: '10px', marginBottom: '20px'
              }}>
                <img
                  src={feedbackModal.items[0].image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'}
                  alt=""
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{feedbackProductName}</div>
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit}>
              {/* Star Rating */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Your Rating</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      onMouseEnter={() => setFeedbackHoverRating(star)}
                      onMouseLeave={() => setFeedbackHoverRating(0)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '2rem', padding: '2px',
                        transition: 'transform 0.15s'
                      }}
                    >
                      <FiStar style={{
                        fill: star <= (feedbackHoverRating || feedbackRating) ? 'var(--accent-yellow)' : 'none',
                        color: star <= (feedbackHoverRating || feedbackRating) ? 'var(--accent-yellow)' : 'var(--border-color)',
                        fontSize: '2rem',
                        transition: 'all 0.15s'
                      }} />
                    </button>
                  ))}
                  <span style={{ alignSelf: 'center', fontWeight: 700, fontSize: '1rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][feedbackHoverRating || feedbackRating]}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Your Review</label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  placeholder="How was the product quality? Was delivery on time? Would you recommend it?"
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={feedbackSubmitting || !feedbackComment.trim()}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <FiStar />
                {feedbackSubmitting ? 'Posting Review...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
