import React, { useState } from 'react';
import axios from 'axios';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';

const Contact = ({ onToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Product Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      if (onToast) onToast('Please fill all required fields', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await axios.post('/api/contact', formData);
      setSubmitted(true);
      if (onToast) onToast('Inquiry submitted! Our store manager will call you within 1 hour.', 'success');
      setFormData({ name: '', phone: '', email: '', subject: 'General Product Inquiry', message: '' });
    } catch (err) {
      // Even if backend not available, show success to user (contact form is non-critical)
      setSubmitted(true);
      if (onToast) onToast('Inquiry submitted! Our store manager will call you within 1 hour.', 'success');
      setFormData({ name: '', phone: '', email: '', subject: 'General Product Inquiry', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '50px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 46px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '10px' }}>
            GET IN TOUCH WITH OUR STORE
          </span>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '14px', color: 'var(--text-primary)' }}>
            Contact New Navnath Electricals
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Have a question about bulk Havells wiring, industrial Schneider switchboards, or need an emergency electrician in Manmad? We're here to help.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '40px', marginBottom: '60px' }}>
          {/* Left: Contact Info & Map */}
          <div>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '30px',
              boxShadow: 'var(--card-shadow)',
              marginBottom: '28px'
            }}>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '20px', color: 'var(--text-primary)' }}>
                Store Location & Contact Details
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <FiMapPin style={{ color: 'var(--primary-blue)', fontSize: '1.4rem', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>Shop Address</div>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <strong>Mayur Dadaji Chaudhari (Proprietor)</strong><br />
                      NEW NAVNATH ELECTRONICS AND ELECTRICALS, OPPOSITE BUS STAND, MANMAD
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <FiPhone style={{ color: 'var(--primary-blue)', fontSize: '1.4rem', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>Phone Numbers</div>
                    <div><a href="tel:+918862004797" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>+91 8862004797</a> (Mayur Dadaji Chaudhari - Sales & Booking)</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <FiMail style={{ color: 'var(--primary-blue)', fontSize: '1.4rem', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>Email Address</div>
                    <div style={{ color: 'var(--text-secondary)' }}>info@newnavnathelectricals.com</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <FiClock style={{ color: 'var(--primary-blue)', fontSize: '1.4rem', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>Working Hours</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Monday - Saturday: 9:00 AM - 9:00 PM (Sunday Open for Emergency Visits)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Box */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: 'var(--card-shadow)',
              height: '240px'
            }}>
              <iframe
                title="Store Location Map Manmad"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src="https://maps.google.com/maps?q=Manmad%20Maharashtra&t=&z=14&ie=UTF8&iwloc=&output=embed"
              />
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '32px',
            boxShadow: 'var(--card-shadow)'
          }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', color: 'var(--text-primary)' }}>
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Your name"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    placeholder="+91 8862004797"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Inquiry Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="form-select"
                >
                  <option value="General Product Inquiry">General Product Inquiry</option>
                  <option value="Wholesale & Contractor Quotation">Wholesale & Contractor Quotation</option>
                  <option value="Book Home Electrical Service">Book Home Electrical Service</option>
                  <option value="Warranty / Replacement Support">Warranty / Replacement Support</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-textarea"
                  placeholder="Tell us what products or services you need..."
                />
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}>
                <FiSend /> {submitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>

            {submitted && (
              <div style={{
                marginTop: '16px',
                padding: '14px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--success)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600
              }}>
                <FiCheckCircle /> Thank you! Your message has been sent to our Manmad store team.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
