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
  const [coupons, setCoupons] = useState([]);
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

  // Coupon State
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 10,
    maxDiscount: 500,
    minOrderValue: 500,
    isActive: true
  });

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
      const [prodRes, ordRes, bookRes, coupRes, kpiRes] = await Promise.all([
        axios.get('/api/products').catch(() => ({ data: { success: false, products: [] } })),
        axios.get('/api/admin/orders').catch(() => ({ data: { success: false, orders: [] } })),
        axios.get('/api/admin/bookings').catch(() => ({ data: { success: false, bookings: [] } })),
        axios.get('/api/admin/coupons').catch(() => ({ data: { success: false, coupons: [] } })),
        axios.get('/api/admin/stats').catch(() => ({ data: { success: false, stats: null } }))
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (ordRes.data.success) setOrders(ordRes.data.orders);
      if (bookRes.data.success) setBookings(bookRes.data.bookings);
      if (coupRes.data.success) setCoupons(coupRes.data.coupons || []);
      if (kpiRes.data.success && kpiRes.data.stats) setStats(kpiRes.data.stats);
    } catch (err) {
      console.warn('Failed to sync admin data');
    } finally {
      setLoading(false);
    }
  };

  const exportOrdersCSV = () => {
    if (orders.length === 0) {
      if (onToast) onToast('No orders to export', 'warning');
      return;
    }
    const headers = ['Order ID', 'Customer Name', 'Mobile', 'Amount', 'Payment Method', 'Payment Status', 'Order Status', 'Date'];
    const rows = orders.map(ord => [
      ord.orderId || ord._id,
      `"${ord.customerName || ord.shippingAddress?.fullName || 'Customer'}"`,
      `"${ord.mobile || ord.shippingAddress?.phone || ''}"`,
      ord.totalAmount || ord.totalPrice || 0,
      `"${ord.paymentMethod || 'COD'}"`,
      `"${ord.paymentStatus || 'Pending'}"`,
      `"${ord.orderStatus || ord.status || 'Processing'}"`,
      `"${new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `navnath_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onToast) onToast('Orders CSV exported successfully!', 'success');
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      if (onToast) onToast('Please enter coupon code', 'warning');
      return;
    }
    try {
      const res = await axios.post('/api/admin/coupons', newCoupon);
      if (res.data.success) {
        setCoupons([res.data.coupon, ...coupons]);
        setIsAddCouponModalOpen(false);
        setNewCoupon({ code: '', discountPercent: 10, maxDiscount: 500, minOrderValue: 500, isActive: true });
        if (onToast) onToast(`Coupon "${res.data.coupon.code}" created!`, 'success');
      }
    } catch (err) {
      if (onToast) onToast('Failed to create coupon', 'error');
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

  const handleUpdateBookingStatus = async (bookingId, newStatus, technicianName) => {
    try {
      await axios.put(`/api/admin/bookings/${bookingId}/status`, { status: newStatus, technicianName });
      setBookings(prev => prev.map(b => (b._id || b.id) === bookingId ? { ...b, status: newStatus, technicianName: technicianName || b.technicianName } : b));
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

          <button
            onClick={() => setActiveTab('coupons')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              color: activeTab === 'coupons' ? 'var(--primary-blue)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'coupons' ? '3px solid var(--primary-blue)' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            🎟️ Promo Coupons ({coupons.length})
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
                      {prod.stock < 10 ? (
                        <span className="badge badge-yellow" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', fontWeight: 800 }}>
                          ⚠️ Low Stock: {prod.stock} left
                        </span>
                      ) : (
                        <span className="badge badge-green">
                          {prod.stock} units
                        </span>
                      )}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>Manage Customer Orders</h2>
              <button onClick={exportOrdersCSV} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                📥 Export Orders CSV
              </button>
            </div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No customer orders found in the database.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {orders.map((ord) => {
                  const orderCode = ord.orderId || ord._id || ord.id;
                  const total = ord.totalAmount || ord.totalPrice || ord.subtotal || 0;
                  const items = ord.items || ord.orderItems || [];
                  const addr = ord.shippingAddress || {};
                  const customerName = ord.customerName || addr.fullName || 'Customer';
                  const mobile = ord.mobile || addr.phone || addr.mobile || 'N/A';
                  const addressStr = addr.address || addr.street || `${addr.city || 'Nashik'}, ${addr.state || 'MH'}`;
                  const currentStatus = ord.orderStatus || ord.status || 'Processing';

                  return (
                    <div key={ord._id || ord.id} style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      backgroundColor: 'var(--bg-secondary)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                            Order #{orderCode} • <span style={{ color: 'var(--primary-blue)' }}>₹{total.toLocaleString('en-IN')}</span>
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            👤 <strong>{customerName}</strong> | 📞 {mobile} | ✉️ {ord.email || 'N/A'}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            📍 Delivery: {addressStr}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
                          <select
                            value={currentStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord._id || ord.id, e.target.value)}
                            className="form-select"
                            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem', fontWeight: 700 }}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items Row */}
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {items.map((item, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: 'var(--bg-card)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.82rem'
                          }}>
                            {item.image && (
                              <img src={item.image} alt="" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
                            )}
                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>× {item.quantity || item.qty}</span>
                            <span style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>₹{((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No electrician bookings found in the database.
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
                    gap: '16px',
                    backgroundColor: 'var(--bg-secondary)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.08rem', color: 'var(--primary-blue)' }}>
                        {bk.serviceName || bk.serviceTitle || 'Electrical Service Visit'} (#{bk.bookingId || bk._id})
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                        👤 Customer: <strong>{bk.name}</strong> | 📞 {bk.mobile || bk.phone}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        📅 Date: {bk.preferredDate || bk.date} {bk.message ? `| 📝 ${bk.message}` : ''} | 📍 {bk.address}
                      </div>
                      {bk.technicianName && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, marginTop: '4px' }}>
                          👨‍🔧 Electrician: {bk.technicianName}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Technician Name & Phone"
                        defaultValue={bk.technicianName || ''}
                        onBlur={(e) => {
                          if (e.target.value !== bk.technicianName) {
                            handleUpdateBookingStatus(bk._id || bk.id, bk.status || 'Pending', e.target.value);
                          }
                        }}
                        style={{ padding: '8px 12px', fontSize: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
                      />
                      <select
                        value={bk.status || 'Pending'}
                        onChange={(e) => handleUpdateBookingStatus(bk._id || bk.id, e.target.value, bk.technicianName)}
                        className="form-select"
                        style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem', fontWeight: 700 }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Technician Assigned">Technician Assigned</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. TAB 4: MANAGE PROMO COUPONS */}
        {activeTab === 'coupons' && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>Active Promo Coupons & Offers</h2>
              <button onClick={() => setIsAddCouponModalOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiPlus /> Create New Coupon
              </button>
            </div>

            {coupons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No promo coupons created yet. Click "Create New Coupon" to add discount codes for customers.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <th style={{ padding: '12px' }}>Coupon Code</th>
                      <th style={{ padding: '12px' }}>Discount</th>
                      <th style={{ padding: '12px' }}>Max Savings</th>
                      <th style={{ padding: '12px' }}>Min Order</th>
                      <th style={{ padding: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c, i) => (
                      <tr key={c._id || i} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.92rem' }}>
                        <td style={{ padding: '14px 12px', fontWeight: 800, color: 'var(--primary-blue)' }}>
                          <span style={{ backgroundColor: 'rgba(11, 61, 145, 0.1)', padding: '4px 10px', borderRadius: '6px', letterSpacing: '1px' }}>
                            {c.code}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: 700 }}>{c.discountPercent || c.discountAmount}% OFF</td>
                        <td style={{ padding: '14px 12px' }}>₹{c.maxDiscount || 500}</td>
                        <td style={{ padding: '14px 12px' }}>₹{c.minOrderValue || 0}</td>
                        <td style={{ padding: '14px 12px' }}>
                          <span className={c.isActive !== false ? 'badge badge-green' : 'badge badge-yellow'}>
                            {c.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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

        {/* Add Coupon Modal */}
        {isAddCouponModalOpen && (
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
              maxWidth: '480px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <button
                onClick={() => setIsAddCouponModalOpen(false)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <FiX />
              </button>

              <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Create Promo Coupon</h2>

              <form onSubmit={handleCreateCoupon}>
                <div className="form-group">
                  <label className="form-label">Coupon Code (Uppercase) *</label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    className="form-input"
                    placeholder="e.g. NAVNATH10 or FESTIVE20"
                    style={{ textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Discount (%) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={newCoupon.discountPercent}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Savings (₹)</label>
                    <input
                      type="number"
                      value={newCoupon.maxDiscount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: Number(e.target.value) })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Minimum Order Value (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrderValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })}
                    className="form-input"
                    placeholder="e.g. 500"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  Create Coupon Code
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
