import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiDollarSign, FiShoppingBag, FiCalendar, FiUsers, 
  FiPlus, FiTrash2, FiEdit2, FiCheckCircle, FiX, FiRefreshCw, FiTag 
} from 'react-icons/fi';

const EMPTY_PROD = { name: '', brand: 'Havells', category: 'wires-cables', price: '', originalPrice: '', stock: 50, description: '', image: '' };

const AdminDashboard = ({ onToast }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalRevenue: 124500, totalOrders: 28, totalProducts: 12, pendingBookings: 5 });
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Modal State (shared for Add & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState(null); // null = Add mode, object = Edit mode
  const [prodForm, setProdForm] = useState(EMPTY_PROD);
  const [submittingProd, setSubmittingProd] = useState(false);

  // New Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxUses: 100 });
  const [submittingCoupon, setSubmittingCoupon] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, bookRes, kpiRes, usersRes, couponsRes] = await Promise.all([
        axios.get('/api/products').catch(() => ({ data: { success: false, products: [] } })),
        axios.get('/api/admin/orders').catch(() => ({ data: { success: false, orders: [] } })),
        axios.get('/api/admin/bookings').catch(() => ({ data: { success: false, bookings: [] } })),
        axios.get('/api/admin/stats').catch(() => ({ data: { success: false, stats: null } })),
        axios.get('/api/admin/users').catch(() => ({ data: { success: false, users: [] } })),
        axios.get('/api/admin/coupons').catch(() => ({ data: { success: false, coupons: [] } }))
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (ordRes.data.success) setOrders(ordRes.data.orders);
      if (bookRes.data.success) setBookings(bookRes.data.bookings);
      if (kpiRes.data.success && kpiRes.data.stats) setStats(kpiRes.data.stats);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (couponsRes.data.success) setCoupons(couponsRes.data.coupons);
    } catch (err) {
      console.warn('Failed to sync admin data');
    } finally {
      setLoading(false);
    }
  };

  // Open Add modal
  const openAddModal = () => {
    setEditingProd(null);
    setProdForm(EMPTY_PROD);
    setIsModalOpen(true);
  };

  // Open Edit modal pre-filled
  const openEditModal = (prod) => {
    setEditingProd(prod);
    setProdForm({
      name: prod.name || '',
      brand: prod.brand || 'Havells',
      category: prod.category || 'wires-cables',
      price: prod.price || '',
      originalPrice: prod.originalPrice || '',
      stock: prod.stock || 0,
      description: prod.description || '',
      image: (prod.images && prod.images[0]) || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price) {
      if (onToast) onToast('Please enter product name and price', 'warning');
      return;
    }
    setSubmittingProd(true);
    try {
      const payload = {
        ...prodForm,
        price: Number(prodForm.price),
        originalPrice: Number(prodForm.originalPrice || prodForm.price),
        images: [prodForm.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80']
      };

      if (editingProd) {
        // EDIT existing product
        const id = editingProd._id || editingProd.id;
        const res = await axios.put(`/api/admin/products/${id}`, payload);
        if (res.data.success) {
          setProducts(prev => prev.map(p => (p._id || p.id) === id ? res.data.product : p));
          if (onToast) onToast('Product updated successfully!', 'success');
        }
      } else {
        // ADD new product
        const res = await axios.post('/api/admin/products', payload);
        if (res.data.success) {
          setProducts([res.data.product, ...products]);
          if (onToast) onToast('Product created successfully!', 'success');
        }
      }
      setIsModalOpen(false);
      setProdForm(EMPTY_PROD);
      setEditingProd(null);
    } catch (err) {
      if (onToast) onToast(editingProd ? 'Failed to update product' : 'Failed to create product', 'error');
    } finally {
      setSubmittingProd(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from catalog?')) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
      if (onToast) onToast('Product deleted', 'info');
    } catch (err) {
      if (onToast) onToast('Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => (o._id || o.id) === orderId ? { ...o, status: newStatus } : o));
      if (onToast) onToast(`Order status updated to ${newStatus}`, 'success');
    } catch (err) {
      if (onToast) onToast('Failed to update status', 'error');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`/api/admin/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev => prev.map(b => (b._id || b.id) === bookingId ? { ...b, status: newStatus } : b));
      if (onToast) onToast(`Booking updated to ${newStatus}`, 'success');
    } catch (err) {
      if (onToast) onToast('Failed to update booking', 'error');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.code) {
      if (onToast) onToast('Coupon code is required', 'warning');
      return;
    }
    setSubmittingCoupon(true);
    try {
      const res = await axios.post('/api/admin/coupons', couponForm);
      if (res.data.success) {
        setCoupons(prev => [res.data.coupon, ...prev]);
        setIsCouponModalOpen(false);
        setCouponForm({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxUses: 100 });
        if (onToast) onToast('Coupon created!', 'success');
      }
    } catch (err) {
      if (onToast) onToast('Failed to create coupon', 'error');
    } finally {
      setSubmittingCoupon(false);
    }
  };

  const cardStyle = {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    padding: '24px',
    boxShadow: 'var(--card-shadow)',
    display: 'flex',
    alignItems: 'center',
    gap: '18px'
  };

  const iconBoxStyle = (bg, color) => ({
    width: '56px', height: '56px', borderRadius: '14px',
    backgroundColor: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem'
  });

  const tabBtnStyle = (active) => ({
    padding: '12px 24px', border: 'none', background: 'none', fontWeight: 700, fontSize: '0.95rem',
    color: active ? 'var(--primary-blue)' : 'var(--text-secondary)',
    borderBottom: active ? '3px solid var(--primary-blue)' : '3px solid transparent',
    cursor: 'pointer'
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '88vh', padding: '40px 0' }}>
      <div className="container">
        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/logo.jpg"
              alt="New Navnath Logo"
              style={{
                width: '52px',
                height: '52px',
                objectFit: 'contain',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                padding: '2px',
                boxShadow: '0 4px 12px rgba(11, 61, 145, 0.2)',
                border: '1.5px solid var(--primary-blue)'
              }}
            />
            <div>
              <span className="badge badge-yellow" style={{ marginBottom: '4px' }}>ADMINISTRATIVE CONTROL</span>
              <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', margin: 0 }}>New Navnath Admin Portal</h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={fetchAdminData} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiRefreshCw /> Refresh
            </button>
            <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiPlus /> Add Product
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '36px' }}>
          <div style={cardStyle}>
            <div style={iconBoxStyle('rgba(16, 185, 129, 0.15)', 'var(--success)')}><FiDollarSign /></div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>TOTAL REVENUE</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>₹{Number(stats.totalRevenue || 0).toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={iconBoxStyle('rgba(11, 61, 145, 0.1)', 'var(--primary-blue)')}><FiShoppingBag /></div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>TOTAL ORDERS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalOrders || 0}</div>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={iconBoxStyle('rgba(255, 193, 7, 0.2)', '#B45309')}><FiCalendar /></div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>BOOKINGS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.pendingBookings || 0}</div>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={iconBoxStyle('rgba(59, 130, 246, 0.15)', 'var(--info)')}><FiUsers /></div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>PRODUCTS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{products.length}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid var(--border-color)', marginBottom: '28px', flexWrap: 'wrap' }}>
          {[
            { id: 'products', label: `📦 Products (${products.length})` },
            { id: 'orders', label: `🛒 Orders (${orders.length})` },
            { id: 'bookings', label: `⚡ Bookings (${bookings.length})` },
            { id: 'users', label: `👤 Users (${users.length})` },
            { id: 'coupons', label: `🏷️ Coupons (${coupons.length})` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabBtnStyle(activeTab === tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: PRODUCTS */}
        {activeTab === 'products' && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px', boxShadow: 'var(--card-shadow)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px' }}>Product</th>
                  <th style={{ padding: '12px' }}>Brand</th>
                  <th style={{ padding: '12px' }}>Category</th>
                  <th style={{ padding: '12px' }}>Price</th>
                  <th style={{ padding: '12px' }}>Stock</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id || prod.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.92rem' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={prod.images && prod.images[0]} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                        <span style={{ fontWeight: 700 }}>{prod.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 12px' }}>{prod.brand}</td>
                    <td style={{ padding: '14px 12px' }}>{prod.category}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 800 }}>₹{prod.price.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={prod.stock > 0 ? 'badge badge-green' : 'badge badge-yellow'}>{prod.stock} units</span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEditModal(prod)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px 12px' }}
                        >
                          <FiEdit2 /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id || prod.id)}
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '6px 12px' }}
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No orders yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {orders.map((ord) => (
                  <div key={ord._id || ord.id} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                        Order #{(ord._id || ord.id).toString().slice(-8)} • ₹{(ord.totalPrice || 0).toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Customer: {ord.shippingAddress?.fullName} | Phone: {ord.shippingAddress?.phone}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Address: {ord.shippingAddress?.street}, {ord.shippingAddress?.city}
                      </div>
                    </div>
                    <select
                      value={ord.status || 'Processing'}
                      onChange={(e) => handleUpdateOrderStatus(ord._id || ord.id, e.target.value)}
                      className="form-select"
                      style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No service bookings yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {bookings.map((bk) => (
                  <div key={bk._id || bk.id} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-blue)' }}>{bk.serviceTitle}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '4px' }}>Customer: {bk.name} ({bk.phone})</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        📅 {bk.date} | ⏰ {bk.timeSlot} | 📍 {bk.address}
                      </div>
                    </div>
                    <select
                      value={bk.status || 'Pending'}
                      onChange={(e) => handleUpdateBookingStatus(bk._id || bk.id, e.target.value)}
                      className="form-select"
                      style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed (Technician Assigned)</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: USERS */}
        {activeTab === 'users' && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px', boxShadow: 'var(--card-shadow)', overflowX: 'auto' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Registered Users</h2>
            {users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No users found.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id || u.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.92rem' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{u.name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '12px' }}>{u.phone || '—'}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={u.role === 'admin' ? 'badge badge-yellow' : 'badge badge-blue'}>{u.role || 'user'}</span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        {new Date(u.createdAt || Date.now()).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB: COUPONS */}
        {activeTab === 'coupons' && (
          <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '24px', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>Discount Coupons</h2>
              <button onClick={() => setIsCouponModalOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiPlus /> New Coupon
              </button>
            </div>
            {coupons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No coupons yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {coupons.map((c) => (
                  <div key={c._id || c.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(255,193,7,0.15)', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        <FiTag />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '1px', color: 'var(--primary-blue)' }}>{c.code}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                          {c.minOrderAmount > 0 && ` • Min order ₹${c.minOrderAmount}`}
                        </div>
                      </div>
                    </div>
                    <span className={c.isActive !== false ? 'badge badge-green' : 'badge badge-yellow'}>
                      {c.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== PRODUCT ADD/EDIT MODAL ===== */}
        {isModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', maxWidth: '520px', width: '100%', padding: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <FiX />
              </button>

              <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
                {editingProd ? '✏️ Edit Product' : '➕ Add Electrical Product'}
              </h2>

              <form onSubmit={handleSaveProduct}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input type="text" required value={prodForm.name} onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} className="form-input" placeholder="e.g. Havells Life Line Copper Wire 90m" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <select value={prodForm.brand} onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })} className="form-select">
                      {['Havells', 'Polycab', 'Anchor by Panasonic', 'Crompton', 'Schneider Electric', 'Philips'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })} className="form-select">
                      {[['wires-cables', 'Wires & Cables'], ['switches-sockets', 'Switches & Sockets'], ['lighting-leds', 'Lighting & LEDs'], ['fans-appliances', 'Fans & Appliances'], ['motors-pumps', 'Motors & Pumps']].map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Selling Price (₹) *</label>
                    <input type="number" required value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })} className="form-input" placeholder="e.g. 2450" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original MRP (₹)</label>
                    <input type="number" value={prodForm.originalPrice} onChange={(e) => setProdForm({ ...prodForm, originalPrice: e.target.value })} className="form-input" placeholder="e.g. 2900" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input type="number" value={prodForm.stock} onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input type="url" value={prodForm.image} onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })} className="form-input" placeholder="https://..." />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea rows={2} value={prodForm.description} onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} className="form-textarea" placeholder="Technical details, gauge, insulation..." />
                </div>

                <button type="submit" disabled={submittingProd} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  {submittingProd ? 'Saving...' : (editingProd ? 'Save Changes' : 'Add to Catalog')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ===== COUPON CREATE MODAL ===== */}
        {isCouponModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border-color)', maxWidth: '440px', width: '100%', padding: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', position: 'relative' }}>
              <button onClick={() => setIsCouponModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <FiX />
              </button>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>🏷️ Create Coupon</h2>
              <form onSubmit={handleCreateCoupon}>
                <div className="form-group">
                  <label className="form-label">Coupon Code *</label>
                  <input type="text" required value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} className="form-input" placeholder="e.g. DIWALI20" style={{ textTransform: 'uppercase' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Discount Type</label>
                    <select value={couponForm.discountType} onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })} className="form-select">
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount Value</label>
                    <input type="number" value={couponForm.discountValue} onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })} className="form-input" placeholder="10" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Min Order (₹)</label>
                    <input type="number" value={couponForm.minOrderAmount} onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: Number(e.target.value) })} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Uses</label>
                    <input type="number" value={couponForm.maxUses} onChange={(e) => setCouponForm({ ...couponForm, maxUses: Number(e.target.value) })} className="form-input" />
                  </div>
                </div>
                <button type="submit" disabled={submittingCoupon} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  {submittingCoupon ? 'Creating...' : 'Create Coupon'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
