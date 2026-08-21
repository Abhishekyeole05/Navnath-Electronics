import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiZap, FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: 'var(--bg-main)',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '560px' }}>
        {/* Lightning bolt icon */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: 'rgba(11, 61, 145, 0.08)',
          color: 'var(--primary-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          margin: '0 auto 28px',
          border: '2px solid rgba(11, 61, 145, 0.15)'
        }}>
          <FiZap />
        </div>

        <div style={{
          fontSize: '6rem',
          fontWeight: 800,
          color: 'var(--primary-blue)',
          lineHeight: 1,
          marginBottom: '16px',
          fontFamily: 'var(--font-heading)'
        }}>
          404
        </div>

        <h1 style={{ fontSize: '1.8rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '36px', lineHeight: '1.7' }}>
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to shopping for genuine electrical products!
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline"
            style={{ padding: '12px 28px' }}
          >
            <FiArrowLeft /> Go Back
          </button>
          <Link to="/" className="btn btn-primary" style={{ padding: '12px 28px' }}>
            <FiHome /> Back to Home
          </Link>
          <Link to="/products" className="btn btn-accent" style={{ padding: '12px 28px' }}>
            Browse Products
          </Link>
        </div>

        <div style={{
          marginTop: '40px',
          padding: '16px 24px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          fontSize: '0.88rem',
          color: 'var(--text-secondary)'
        }}>
          Need help? Call us: <a href="tel:+918862004797" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>+91 8862004797</a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
