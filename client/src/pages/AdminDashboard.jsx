import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiDollarSign, FiShoppingBag, FiCalendar, FiUsers, 
  FiPlus, FiTrash2, FiEdit2, FiCheckCircle, FiX, FiRefreshCw 
} from 'react-icons/fi';

const AdminDashboard = ({ onToast }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRevenue: 124500,
    totalOrders: 28,
    totalProducts: 12,
    pendingBookings: 5
  });

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    brand: 'Havells',
    category: 'wires-cables',
    price: '',
    originalPrice: '',
    stock: 50,
    description: '',
    image: ''
  });
  const [submittingProd, setSubmittingProd] = useState(false);

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
      const [prodRes, ordRes, bookRes, kpiRes] = await Promise.all([
        axios.get('/api/products').catch(() => ({ data: { success: false, products: [] } })),
        axios.get('/api/admin/orders').catch(() => ({ data: { success: false, orders: [] } })),
        axios.get('/api/admin/bookings').catch(() => ({ data: { success: false, bookings: [] } })),
        axios.get('/api/admin/stats').catch(() => ({ data: { success: false, stats: null } }))
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (ordRes.data.success) setOrders(ordRes.data.orders);
      if (bookRes.data.success) setBookings(bookRes.data.bookings);
      if (kpiRes.data.success && kpiRes.data.stats) setStats(kpiRes.data.stats);
    } catch (err) {
      console.warn('Failed to sync admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) {
      if (onToast) onToast('Please enter product name and price', 'warning');
      return;
    }
    setSubmittingProd(true);
    try {
      const payload = {
        ...newProd,
        price: Number(newProd.price),
        originalPrice: Number(newProd.originalPrice || newProd.price),
        images: [newProd.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80']
      };
      const res = await axios.post('/api/admin/products', payload);
      if (res.data.success) {
        setProducts([res.data.product, ...products]);
        setIsAddModalOpen(false);
        setNewProd({ name: '', brand: 'Havells', category: 'wires-cables', price: '', originalPrice: '', stock: 50, description: '', image: '' });
        if (onToast) onToast('Product created successfully!', 'success');
      }
    } catch (err) {
      if (onToast) onToast('Failed to create product', 'error');
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

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '88vh', padding: '40px 0' }}>
      <div className="container">
        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-yellow" style={{ marginBottom: '6px' }}>
              ADMINISTRATIVE CONTROL
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>
              New Navnath Admin Portal
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={fetchAdminData} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiRefreshCw /> Refresh Data
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiPlus /> Add New Product
            </button>
          </div>
        </div>

        {/* 1. KPI Stat Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '36px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
              <FiDollarSign />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>TOTAL REVENUE</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹{Number(stats.totalRevenue || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(11, 61, 145, 0.1)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
              <FiShoppingBag />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>TOTAL ORDERS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {stats.totalOrders || 0}
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(255, 193, 7, 0.2)', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
              <FiCalendar />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>SERVICE BOOKINGS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {stats.pendingBookings || 0}
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
              <FiUsers />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>CATALOG PRODUCTS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {products.length}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Admin Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '2px solid var(--border-color)',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              color: activeTab === 'products' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'products' ? '3px solid var(--primary-blue)' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            📦 Products Catalog ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              color: activeTab === 'orders' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'orders' ? '3px solid var(--primary-blue)' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            🛒 Customer Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              color: activeTab === 'bookings' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'bookings' ? '3px solid var(--primary-blue)' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            ⚡ Electrician Visits ({bookings.length})
          </button>
        </div>

        {/* 3. TAB 1: MANAGE PRODUCTS */}
        {activeTab === 'products' && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
            overflowX: 'auto'
          }}>
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
                    <td style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={prod.images && prod.images[0]} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                      <span style={{ fontWeight: 700 }}>{prod.name}</span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>{prod.brand}</td>
                    <td style={{ padding: '14px 12px' }}>{prod.category}</td>
                    <td style={{ padding: '14px 12px', fontWeight: 800 }}>₹{prod.price.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span className={prod.stock > 0 ? 'badge badge-green' : 'badge badge-yellow'}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteProduct(prod._id || prod.id)}
                        className="btn btn-outline btn-sm"
                        style={{ borderColor: 'var(--danger)', color: 'var(--danger)', padding: '6px 12px' }}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. TAB 2: MANAGE ORDERS */}
        {activeTab === 'orders' && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {orders.map((ord) => (
                <div key={ord._id || ord.id} style={{
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
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      Order #{ord._id || ord.id} • ₹{(ord.totalPrice || 0).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Customer: {ord.shippingAddress?.fullName} | Phone: {ord.shippingAddress?.phone}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Address: {ord.shippingAddress?.street}, {ord.shippingAddress?.city}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <select
                      value={ord.status || 'Processing'}
                      onChange={(e) => handleUpdateOrderStatus(ord._id || ord.id, e.target.value)}
                      className="form-select"
                      style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. TAB 3: MANAGE SERVICE BOOKINGS */}
        {activeTab === 'bookings' && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)'
          }}>
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
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary-blue)' }}>
                      {bk.serviceTitle}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                      Customer: {bk.name} ({bk.phone})
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      📅 {bk.date} | ⏰ {bk.timeSlot} | 📍 {bk.address}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <select
                      value={bk.status || 'Pending'}
                      onChange={(e) => handleUpdateBookingStatus(bk._id || bk.id, e.target.value)}
                      className="form-select"
                      style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed (Technician Assigned)</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              maxWidth: '520px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <FiX />
              </button>

              <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Add Electrical Product</h2>

              <form onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Havells Life Line Copper Wire 90m"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <select
                      value={newProd.brand}
                      onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                      className="form-select"
                    >
                      <option value="Havells">Havells</option>
                      <option value="Polycab">Polycab</option>
                      <option value="Anchor by Panasonic">Anchor by Panasonic</option>
                      <option value="Crompton">Crompton</option>
                      <option value="Schneider Electric">Schneider Electric</option>
                      <option value="Philips">Philips</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                      className="form-select"
                    >
                      <option value="wires-cables">Wires & Cables</option>
                      <option value="switches-sockets">Switches & Sockets</option>
                      <option value="lighting-leds">Lighting & LEDs</option>
                      <option value="fans-appliances">Fans & Appliances</option>
                      <option value="motors-pumps">Motors & Pumps</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      className="form-input"
                      placeholder="e.g. 2450"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Original MRP (₹)</label>
                    <input
                      type="number"
                      value={newProd.originalPrice}
                      onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                      className="form-input"
                      placeholder="e.g. 2900"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    value={newProd.image}
                    onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                    className="form-input"
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={2}
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    className="form-textarea"
                    placeholder="Technical details, gauge, insulation..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingProd}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  {submittingProd ? 'Creating...' : 'Add to Catalog'}
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
