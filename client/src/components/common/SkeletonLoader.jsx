import React from 'react';

const SkeletonLoader = ({ count = 4 }) => {
  return (
    <div className="grid-cols-4" style={{ gap: '24px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div className="skeleton-box" style={{ height: '180px', width: '100%', borderRadius: '8px' }} />
          <div className="skeleton-box" style={{ height: '20px', width: '60%' }} />
          <div className="skeleton-box" style={{ height: '24px', width: '90%' }} />
          <div className="skeleton-box" style={{ height: '18px', width: '40%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <div className="skeleton-box" style={{ height: '28px', width: '45%' }} />
            <div className="skeleton-box" style={{ height: '34px', width: '35%' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
