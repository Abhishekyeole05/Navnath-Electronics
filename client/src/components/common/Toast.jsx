import React, { useEffect } from 'react';
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiXCircle, FiX } from 'react-icons/fi';

const iconMap = {
  success: <FiCheckCircle style={{ color: 'var(--success)' }} />,
  info: <FiInfo style={{ color: 'var(--info)' }} />,
  warning: <FiAlertTriangle style={{ color: 'var(--warning)' }} />,
  error: <FiXCircle style={{ color: 'var(--danger)' }} />
};

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px',
      right: '24px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '10px',
      padding: '12px 18px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 10000,
      animation: 'fadeInUp 0.3s ease',
      maxWidth: '340px'
    }}>
      <span style={{ fontSize: '1.25rem' }}>{iconMap[type] || iconMap.success}</span>
      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          fontSize: '1rem'
        }}
      >
        <FiX />
      </button>
    </div>
  );
};

export default Toast;
