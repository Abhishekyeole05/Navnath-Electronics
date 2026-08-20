import React from 'react';
import { FiUsers, FiBox, FiCheckCircle, FiAward } from 'react-icons/fi';

const stats = [
  { icon: <FiUsers />, count: '10,000+', label: 'Happy Customers in Nashik' },
  { icon: <FiBox />, count: '1,500+', label: 'Genuine Electrical Products' },
  { icon: <FiCheckCircle />, count: '500+', label: 'Industrial & Residential Projects' },
  { icon: <FiAward />, count: '15+', label: 'Years of Proven Trust' }
];

const StatisticsCounter = () => {
  return (
    <section style={{
      backgroundColor: 'var(--navnath-dark-blue)',
      padding: '70px 0',
      color: '#FFFFFF',
      borderTop: '2px solid var(--accent-yellow)',
      borderBottom: '2px solid var(--accent-yellow)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          textAlign: 'center'
        }}>
          {stats.map((item, i) => (
            <div key={i} style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 193, 7, 0.15)',
                color: 'var(--accent-yellow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                marginBottom: '16px'
              }}>
                {item.icon}
              </div>

              <div style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '2.5rem',
                color: '#FFFFFF',
                marginBottom: '6px'
              }}>
                {item.count}
              </div>

              <div style={{ fontSize: '0.92rem', color: '#CBD5E1' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsCounter;
