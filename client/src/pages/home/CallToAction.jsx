import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhoneCall, FiZap, FiArrowRight } from 'react-icons/fi';

const CallToAction = () => {
  return (
    <section style={{
      padding: '70px 0',
      background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--navnath-navy) 100%)',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '30px'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 193, 7, 0.2)',
            color: 'var(--accent-yellow)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 800,
            marginBottom: '16px'
          }}>
            <FiZap /> NEED EMERGENCY ELECTRICIAN OR BULK WIRING?
          </div>

          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px', lineHeight: '1.25' }}>
            Get Same-Day Service & Wholesale Contractor Rates
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', lineHeight: '1.6' }}>
            Have a project in Manmad? Call Mayur Dadaji Chaudhari or book a licensed technician home visit in under 60 seconds.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            to="/services"
            className="btn btn-accent"
            style={{ padding: '14px 28px', fontSize: '1.02rem', borderRadius: '10px' }}
          >
            Book Technician (₹299) <FiArrowRight />
          </Link>

          <a
            href="tel:+918862004797"
            className="btn"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              padding: '14px 24px',
              fontSize: '1rem',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.3)',
              textDecoration: 'none'
            }}
          >
            <FiPhoneCall /> +91 8862004797
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
