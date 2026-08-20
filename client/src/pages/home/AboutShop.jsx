import React from 'react';
import { FiCheckCircle, FiAward, FiShield, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AboutShop = () => {
  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left: Store Image & Experience Badge */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(11, 61, 145, 0.15)',
              position: 'relative',
              height: '420px'
            }}>
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                alt="New Navnath Electricals Store"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10, 25, 47, 0.85) 0%, transparent 60%)'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: '24px',
                color: '#FFFFFF'
              }}>
                <div style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                  NEW NAVNATH ELECTRONICS & ELECTRICALS
                </div>
                <div style={{ fontSize: '0.88rem', color: '#CBD5E1', marginTop: '4px' }}>
                  Manmad's Premier Wholesale Electricals & Service Destination
                </div>
              </div>
            </div>

            {/* Experience Floating Badge */}
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '-16px',
              backgroundColor: 'var(--accent-yellow)',
              color: '#0F172A',
              padding: '16px 22px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(255, 193, 7, 0.4)',
              fontWeight: 800,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', lineHeight: '1' }}>15+</div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Years of Trust
              </div>
            </div>
          </div>

          {/* Right: Story & Value Props */}
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '12px' }}>
              ABOUT OUR STORE
            </span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '18px', color: 'var(--text-primary)' }}>
              100% Genuine Electricals with Certified Electrician Support
            </h2>
            <p style={{
              fontSize: '1.02rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              marginBottom: '24px'
            }}>
              Founded with a commitment to electrical safety and uncompromising quality, <strong>New Navnath Electronics & Electricals</strong> (Proprietor: <strong>Mayur Dadaji Chaudhari</strong>) is a trusted distributor for Havells, Polycab, Anchor Roma, Crompton, and Schneider Electric in Maharashtra. Whether you're building your dream home, upgrading industrial panels, or require emergency repair, our certified team is ready to serve.
            </p>

            {/* 4 Pillars Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <FiAward style={{ color: 'var(--primary-blue)', fontSize: '1.6rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Authorized Partner</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Direct from Havells & Polycab</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <FiUsers style={{ color: 'var(--primary-blue)', fontSize: '1.6rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Certified Technicians</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Licensed electricians for home visits</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <FiShield style={{ color: 'var(--primary-blue)', fontSize: '1.6rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Genuine Warranty</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Official brand replacement support</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <FiCheckCircle style={{ color: 'var(--primary-blue)', fontSize: '1.6rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Same-Day Dispatch</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fast delivery across Manmad</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                Explore Products Catalog
              </Link>
              <Link to="/contact" className="btn btn-outline" style={{ padding: '12px 24px' }}>
                Visit Our Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutShop;
