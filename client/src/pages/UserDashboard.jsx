import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';
import { 
  FiPackage, FiCalendar, FiHeart, FiUser, FiLogOut, 
  FiCheckCircle, FiClock, FiAlertCircle 
} from 'react-icons/fi';

const UserDashboard = ({ onToast }) => {
  const { user, logout, loading: authLoading } = useAuth();
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'orders');
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const tabParam = queryParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [location.search]);

  // Fetch orders & bookings
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingData(true);
      try {
        const [ordRes, bookRes] = await Promise.all([
          axios.get('/api/orders/myorders').catch(() => ({ data: { success: false, orders: [] } })),
          axios.get('/api/services/mybookings').catch(() => ({ data: { success: false, bookings: [] } }))
        ]);
        if (ordRes.data.success) setOrders(ordRes.data.orders);
        if (bookRes.data.success) setBookings(bookRes.data.bookings);

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
          Sign in to view your orders, service bookings, and wishlist.
        </p>
        <Link to="/" className="btn btn-primary">Go to Home Page</Link>
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

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
          My Dashboard
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Welcome back, <strong>{user.name}</strong>! Track your electrical orders, technician visits, and favorites.
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
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{user.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{user.email}</div>
              </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                <FiCalendar /> Service Bookings ({bookings.length})
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
            {/* 1. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '28px',
                boxShadow: 'var(--card-shadow)'
              }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Order History</h2>

                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                    No orders placed yet. <Link to="/products" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>Shop products</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map((ord) => (
                      <div key={ord._id || ord.id} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Order #{ord._id || ord.id}</span>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              Placed on: {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN')}
                            </div>
                          </div>
                          {getStatusBadge(ord.status)}
                        </div>

                        {/* Items */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          {(ord.orderItems || []).map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '8px' }}>
                              <img src={item.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Qty: {item.qty}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-blue)' }}>
                            ₹{(ord.totalPrice || 0).toLocaleString('en-IN')}
                          </span>
                          <Link to={`/order-success/${ord._id || ord.id}`} className="btn btn-outline btn-sm">
                            View Receipt
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '28px',
                boxShadow: 'var(--card-shadow)'
              }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>My Electrician Bookings</h2>

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
                          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {bk.serviceTitle}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            📅 {bk.date} | ⏰ {bk.timeSlot}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            📍 {bk.address}
                          </div>
                        </div>
                        {getStatusBadge(bk.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. WISHLIST TAB */}
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
