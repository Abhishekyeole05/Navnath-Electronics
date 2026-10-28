import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

export const checkPasswordStrength = (password = '') => {
  const criteria = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'upper', label: 'At least one uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { id: 'lower', label: 'At least one lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { id: 'number', label: 'At least one number (0-9)', met: /[0-9]/.test(password) },
    { id: 'special', label: 'At least one special character (!@#$%^&*)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password) }
  ];

  const metCount = criteria.filter(c => c.met).length;
  const isStrong = metCount === 5;

  let label = 'Very Weak';
  let color = '#ef4444';
  let percent = 20;

  if (metCount === 5) {
    label = 'Strong';
    color = '#10b981';
    percent = 100;
  } else if (metCount === 4) {
    label = 'Good';
    color = '#3b82f6';
    percent = 80;
  } else if (metCount === 3) {
    label = 'Fair';
    color = '#f59e0b';
    percent = 60;
  } else if (metCount === 2) {
    label = 'Weak';
    color = '#f97316';
    percent = 40;
  } else {
    label = 'Very Weak';
    color = '#ef4444';
    percent = Math.max(10, metCount * 20);
  }

  return { criteria, metCount, isStrong, label, color, percent };
};

const PasswordStrengthMeter = ({ password = '' }) => {
  if (!password) return null;

  const { criteria, isStrong, label, color, percent } = checkPasswordStrength(password);

  return (
    <div style={{
      marginTop: '10px',
      padding: '12px 14px',
      backgroundColor: 'var(--bg-secondary, #f8fafc)',
      borderRadius: '10px',
      border: '1px solid var(--border-color, #e2e8f0)',
      fontSize: '0.82rem'
    }}>
      {/* Strength Header & Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ color: 'var(--text-secondary, #64748b)', fontWeight: 600 }}>Password Strength:</span>
        <span style={{ color, fontWeight: 700 }}>{label}</span>
      </div>

      <div style={{
        height: '6px',
        backgroundColor: '#e2e8f0',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '10px'
      }}>
        <div style={{
          height: '100%',
          width: `${percent}%`,
          backgroundColor: color,
          transition: 'all 0.3s ease'
        }} />
      </div>

      {/* Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '6px' }}>
        {criteria.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: item.met ? '#16a34a' : 'var(--text-muted, #94a3b8)',
              fontWeight: item.met ? 600 : 400,
              fontSize: '0.78rem',
              transition: 'color 0.2s'
            }}
          >
            {item.met ? (
              <FiCheck style={{ color: '#16a34a', flexShrink: 0, strokeWidth: 3 }} />
            ) : (
              <span style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#cbd5e1',
                flexShrink: 0,
                marginLeft: '3px',
                marginRight: '3px'
              }} />
            )}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;

