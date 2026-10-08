import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome, FiShoppingBag } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '80px 0', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.8rem',
          margin: '0 auto 24px auto'
        }}>
          <FiAlertTriangle />
        </div>

        <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary-blue)', lineHeight: 1, marginBottom: '12px' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.98rem' }}>
          The page you are looking for does not exist or has been moved. Explore our electrical product catalog or return home.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <FiHome /> Return to Home
          </Link>
          <Link to="/products" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <FiShoppingBag /> Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
