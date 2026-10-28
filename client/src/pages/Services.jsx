import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from '../components/common/ServiceCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiX, FiZap, 
  FiShield, FiUserCheck, FiPhone, FiArrowRight 
} from 'react-icons/fi';

const Services = ({ onToast }) => {
  const { user } = useAuth();
  const { t, tService } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const todayStr = new Date().toISOString().split('T')[0];

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [bookingSuccessModal, setBookingSuccessModal] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: user ? user.name : '',
    phone: user ? user.phone || '' : '',
    address: 'NEW NAVNATH ELECTRONICS AND ELECTRICALS, OPPOSITE BUS STAND, MANMAD',
    date: todayStr,
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
        phone: user.phone || '',
        date: todayStr
      }));
    } else {
      setBookingForm(prev => ({
        ...prev,
        date: todayStr
      }));
    }
    setBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.address) {
      if (onToast) onToast('Please fill all required booking fields (Name, Phone, Address).', 'warning');
      return;
    }

    // Date Validation: Disallow past dates
    if (!bookingForm.date || bookingForm.date < todayStr) {
      if (onToast) onToast(`Preferred service date cannot be in the past (${bookingForm.date}). Please select today (${todayStr}) or a future date.`, 'warning');
      return;
    }

    setSubmittingBooking(true);
    try {
      const res = await axios.post('/api/services/book', {
        serviceId: activeService._id || activeService.id,
        serviceName: activeService.title,
        ...bookingForm
      });

      if (res.data.success) {
        setBookingModalOpen(false);
        setBookingSuccessModal(res.data.booking);
        if (onToast) onToast('Service request submitted! Admin will assign an electrician shortly.', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit service booking';
      if (onToast) onToast(msg, 'error');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const categories = [
    { id: 'all', label: t('cat_all_services', 'All 4 Electrical Services') },
    { id: 'Installation', label: t('cat_install', '⚡ Install Electrical Systems') },
    { id: 'Maintenance', label: t('cat_maintain', '🛡️ Maintain Electrical Systems') },
    { id: 'Repair', label: t('cat_repair', '🔧 Repair Electrical Systems') },
    { id: 'Testing', label: t('cat_test', '🔬 Test Electrical Systems') }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '50px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <span className="badge badge-yellow" style={{ marginBottom: '10px' }}>
            {t('services_badge', '⚡ LICENSED ELECTRICIAN DISPATCH IN MANMAD')}
          </span>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
            {t('services_title', 'Need an Electrician for Services?')}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {t('services_subtitle', 'Book licensed professional electrical services across 4 essential areas: Install, Maintain, Repair, and Test electrical systems. Once your booking is approved, the assigned technician’s direct contact details will be shared with you immediately.')}
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
              style={{ borderRadius: '30px', padding: '10px 22px', fontSize: '0.88rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid (4 options) */}
        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {services.map((svc) => (
              <ServiceCard
                key={svc._id || svc.id || svc.slug}
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
              <FiShield /> 100% SAFETY & PROFESSIONAL GUARANTEE
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
              Direct Technician Assignment & Transparent Pricing
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.95rem' }}>
              Submit your requirement. The store manager assigns a certified worker with their mobile number, so you can contact them directly before they visit.
            </p>
          </div>
          <a href="tel:+918862004797" className="btn btn-accent" style={{ padding: '14px 28px', fontSize: '1.02rem' }}>
            Call Store Manager: +91 8862004797
          </a>
        </div>

        {/* Booking Form Modal */}
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
              maxWidth: '540px',
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
                <span className="badge badge-yellow">DIRECT TECHNICIAN BOOKING</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                {activeService.title}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Estimated Service Charge: <strong>{activeService.priceEstimate}</strong> ({activeService.duration})
              </p>

              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label className="form-label">{t('full_name', 'Full Name *')}</label>
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
                  <label className="form-label">Phone Number (For technician to contact you) *</label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    className="form-input"
                    placeholder="e.g. +91 98220 12345"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('service_address', 'Service Address (Manmad) *')}</label>
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
                    <label className="form-label">{t('preferred_date', 'Preferred Date *')}</label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={bookingForm.date}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && val < todayStr) {
                          if (onToast) onToast(`You cannot select a past date (${val}). Today is ${todayStr}.`, 'warning');
                          setBookingForm({ ...bookingForm, date: todayStr });
                        } else {
                          setBookingForm({ ...bookingForm, date: val });
                        }
                      }}
                      className="form-input"
                    />
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {t('earliest_today', 'Earliest: Today')} ({todayStr})
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('time_slot', 'Time Slot *')}</label>
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
                  <label className="form-label">{t('notes_label', 'Special Notes / Issue Details (Optional)')}</label>
                  <input
                    type="text"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    className="form-input"
                    placeholder={t('notes_placeholder', 'e.g. New 3-phase DB installation or tripping repair')}
                  />
                </div>

                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {t('booking_note', 'ℹ️ Once your request is submitted, our store manager will assign a technician and their direct contact phone number will be provided on your booking status.')}
                </div>

                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="btn btn-accent"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                >
                  {submittingBooking ? t('submitting_btn', 'Submitting Request...') : t('submit_booking_btn', '⚡ Request Electrician Visit')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Post-Booking Confirmation Modal */}
        {bookingSuccessModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2100,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              maxWidth: '500px',
              width: '100%',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.35)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--success)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '16px'
              }}>
                <FiCheckCircle />
              </div>

              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                Electrician Request Sent!
              </h2>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '14px' }}>
                Booking Reference: #{bookingSuccessModal.bookingId || bookingSuccessModal._id}
              </div>

              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
                fontSize: '0.88rem',
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                <div><strong>Service:</strong> {bookingSuccessModal.serviceName}</div>
                <div><strong>Scheduled Date:</strong> {bookingSuccessModal.preferredDate}</div>
                <div><strong>Location:</strong> {bookingSuccessModal.address}</div>
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', color: 'var(--success)', fontWeight: 600 }}>
                  👨‍🔧 Status: Awaiting Admin Approval & Technician Assignment
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
                The admin will approve this request and assign a certified worker. You will receive the worker's direct contact phone number right on your dashboard so you can speak with him directly.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setBookingSuccessModal(null);
                    navigate('/dashboard?tab=bookings');
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <FiUserCheck /> View My Bookings <FiArrowRight />
                </button>
                <button
                  onClick={() => setBookingSuccessModal(null)}
                  className="btn btn-outline"
                  style={{ padding: '12px 20px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
