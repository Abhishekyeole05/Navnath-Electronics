import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/common/ServiceCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiX, FiZap, FiShield } from 'react-icons/fi';

const Services = ({ onToast }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: user ? user.name : '',
    phone: user ? user.phone || '' : '',
    address: 'NEW NAVNATH ELECTRONICS AND ELECTRICALS, OPPOSITE BUS STAND, MANMAD',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM - 12:00 PM',
    notes: ''
  });
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const url = selectedCategory === 'all' 
          ? '/api/services' 
          : `/api/services?category=${selectedCategory}`;
        const res = await axios.get(url);
        if (res.data.success) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.warn('Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedCategory]);

  const handleOpenBooking = (service) => {
    setActiveService(service);
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        name: user.name,
        phone: user.phone || ''
      }));
    }
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.address) {
      if (onToast) onToast('Please fill all required booking fields', 'warning');
      return;
    }

    setSubmittingBooking(true);
    try {
      const res = await axios.post('/api/services/book', {
        serviceId: activeService._id || activeService.id,
        ...bookingForm
      });
      if (res.data.success) {
        setBookingModalOpen(false);
        if (onToast) onToast(`Service booked successfully! Booking ID: ${res.data.booking.id}`, 'success');
        navigate('/dashboard?tab=bookings');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book service';
      if (onToast) onToast(msg, 'error');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Electrical Services' },
    { id: 'Residential', label: '🏠 Home & Residential' },
    { id: 'Industrial', label: '🏭 Industrial & MIDC' },
    { id: 'Emergency', label: '🚨 Emergency Repairs' },
    { id: 'Maintenance', label: '🔧 Annual Maintenance' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '50px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
          <span className="badge badge-yellow" style={{ marginBottom: '10px' }}>
            LICENSED ELECTRICIAN DISPATCH IN MANMAD
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Book Certified Electrical Services
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            From residential switchboard sparking & inverter wiring to SATPUR MIDC industrial control panel commissioning. Transparent charges starting at ₹299.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ borderRadius: '30px', padding: '10px 22px', fontSize: '0.9rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <div className="grid-cols-3">
            {services.map((svc) => (
              <ServiceCard
                key={svc._id || svc.id}
                service={svc}
                onBookNow={handleOpenBooking}
              />
            ))}
          </div>
        )}

        {/* Assurance Banner */}
        <div style={{
          marginTop: '60px',
          backgroundColor: 'var(--navnath-dark-blue)',
          borderRadius: '20px',
          padding: '36px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          border: '2px solid var(--accent-yellow)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-yellow)', fontWeight: 700, marginBottom: '6px' }}>
              <FiShield /> 100% SAFETY GUARANTEED
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
              Need Custom Wiring for Society or Factory?
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.95rem' }}>
              We offer free site inspection and wholesale quotation for complete electrical contracting.
            </p>
          </div>
          <a href="tel:+918862004797" className="btn btn-accent" style={{ padding: '14px 28px', fontSize: '1.02rem' }}>
            Call Mayur Dadaji Chaudhari: +91 8862004797
          </a>
        </div>

        {/* Booking Modal */}
        {bookingModalOpen && activeService && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <button
                onClick={() => setBookingModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <FiX />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span className="badge badge-yellow">INSTANT BOOKING</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                {activeService.title}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Estimated Charge: <strong>{activeService.priceEstimate}</strong> ({activeService.duration})
              </p>

              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Sanjay Patil"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number (Manmad contact) *</label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    className="form-input"
                    placeholder="e.g. +91 8862004797"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Address (Manmad) *</label>
                  <textarea
                    rows={2}
                    required
                    value={bookingForm.address}
                    onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                    className="form-textarea"
                    placeholder="House No, Apartment, Landmark in Manmad..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Time Slot *</label>
                    <select
                      value={bookingForm.timeSlot}
                      onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                      className="form-select"
                    >
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                      <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                      <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                      <option value="EMERGENCY (Within 1 Hour)">🚨 EMERGENCY (Within 1 Hour)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Special Notes (Optional)</label>
                  <input
                    type="text"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    className="form-input"
                    placeholder="e.g. 3rd floor switchboard sparking"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="btn btn-accent"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
                >
                  {submittingBooking ? 'Confirming Booking...' : '⚡ Confirm Technician Visit'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
