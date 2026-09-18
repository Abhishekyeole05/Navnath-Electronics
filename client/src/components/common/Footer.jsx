import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiFacebook, FiInstagram,
  FiTwitter, FiZap, FiShield, FiCheckCircle
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { t } = useLanguage();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer style={{
      backgroundColor: 'var(--navnath-dark-blue)',
      color: '#CBD5E1',
      paddingTop: '60px',
      borderTop: '4px solid var(--accent-yellow)'
    }}>
      <div className="container">
        <div className="grid-cols-4" style={{ marginBottom: '40px' }}>
          {/* Col 1: Shop Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'var(--accent-yellow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}>
                N
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.2rem',
                color: '#FFFFFF'
              }}>
                NEW NAVNATH
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px', color: '#94A3B8' }}>
              {t('our_legacy')} - {t('genuine_products')}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <FiFacebook />
              </a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <FiInstagram />
              </a>
              <a href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.05rem', borderBottom: '2px solid var(--accent-yellow)', display: 'inline-block', paddingBottom: '4px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Electrical Products Catalog</Link></li>
              <li><Link to="/services">Book Home Electrician Service</Link></li>
              <li><Link to="/contact">Contact Shop & Map</Link></li>
              <li><Link to="/dashboard">My Dashboard & Order Tracking</Link></li>
              <li><Link to="/admin" style={{ color: 'var(--accent-yellow)' }}>⚡ Admin Portal (Demo)</Link></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.05rem', borderBottom: '2px solid var(--accent-yellow)', display: 'inline-block', paddingBottom: '4px' }}>
              Top Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/products?category=wires-cables">Wires & Cables (Havells, Polycab)</Link></li>
              <li><Link to="/products?category=switches-sockets">Switches & Sockets (Anchor Roma)</Link></li>
              <li><Link to="/products?category=lighting-leds">Lighting & LEDs (Philips, Havells)</Link></li>
              <li><Link to="/products?category=fans-appliances">BLDC Fans & Appliances (Crompton)</Link></li>
              <li><Link to="/products?category=motors-pumps">Water Pumps & Motors (Kirloskar)</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.05rem', borderBottom: '2px solid var(--accent-yellow)', display: 'inline-block', paddingBottom: '4px' }}>
              Contact Shop
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <FiMapPin style={{ color: 'var(--accent-yellow)', marginTop: '4px', flexShrink: 0 }} />
                <span>
                  <strong>Mayur Dadaji Chaudhari (Proprietor)</strong><br />
                  NEW NAVNATH ELECTRONICS AND ELECTRICALS, OPPOSITE BUS STAND, MANMAD
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiPhone style={{ color: 'var(--accent-yellow)' }} />
                <a href="tel:+918862004797">+91 8862004797</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiMail style={{ color: 'var(--accent-yellow)' }} />
                <span>info@newnavnathelectricals.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiClock style={{ color: 'var(--accent-yellow)' }} />
                <span>Mon - Sun: 9:00 AM - 9:00 PM</span>
              </div>
            </div>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} style={{ display: 'flex' }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px 0 0 6px',
                  border: 'none',
                  flex: 1,
                  fontSize: '0.85rem'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--accent-yellow)',
                  color: '#0F172A',
                  border: 'none',
                  borderRadius: '0 6px 6px 0',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                <FiSend />
              </button>
            </form>
            {subscribed && (
              <div style={{ fontSize: '0.78rem', color: 'var(--success)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiCheckCircle /> Thank you for subscribing!
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '24px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.82rem',
          color: '#94A3B8'
        }}>
          <div>
            © {new Date().getFullYear()} <strong>New Navnath Electronics & Electricals</strong>. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
  <span>🔒 SSL Secured Checkout</span>
  <span>⚡ Genuine Warranty Guaranteed</span>

  <Link to="/privacy-policy">Privacy Policy</Link>
  <Link to="/terms-conditions">Terms & Conditions</Link>
  <Link to="/return-refund">Return & Refund</Link>
  <Link to="/shipping-delivery">Shipping & Delivery</Link>
</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
