import React from 'react';
import { 
  FiTool, FiSliders, FiDroplet, FiCpu, FiSun, FiGrid, 
  FiShield, FiCheck, FiCalendar, FiArrowRight 
} from 'react-icons/fi';

const iconMap = {
  FiTool: <FiTool />,
  FiSliders: <FiSliders />,
  FiDroplet: <FiDroplet />,
  FiCpu: <FiCpu />,
  FiSun: <FiSun />,
  FiGrid: <FiGrid />,
  FiShield: <FiShield />
};

const ServiceCard = ({ service, onBookNow }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'all 0.3s ease',
      boxShadow: 'var(--card-shadow)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = 'var(--hover-shadow)';
      e.currentTarget.style.borderColor = 'var(--primary-blue)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--card-shadow)';
      e.currentTarget.style.borderColor = 'var(--border-color)';
    }}
    >
      {/* Icon & Category */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '12px',
          backgroundColor: 'rgba(11, 61, 145, 0.08)',
          color: 'var(--primary-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem'
        }}>
          {iconMap[service.icon] || <FiTool />}
        </div>

        <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
          {service.duration || '2 Hours'}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '1.15rem',
        fontWeight: 700,
        marginBottom: '8px',
        color: 'var(--text-primary)'
      }}>
        {service.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '0.88rem',
        color: 'var(--text-secondary)',
        marginBottom: '16px',
        lineHeight: '1.6',
        flex: 1
      }}>
        {service.description}
      </p>

      {/* Features bullet list */}
      {service.features && (
        <ul style={{
          listStyle: 'none',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.82rem',
          color: 'var(--text-primary)',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '16px'
        }}>
          {service.features.map((feat, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiCheck style={{ color: 'var(--success)', flexShrink: 0 }} />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Bottom Bar: Price Estimate & CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '16px'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            ESTIMATED CHARGE
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-blue)' }}>
            {service.priceEstimate}
          </div>
        </div>

        <button
          onClick={() => onBookNow(service)}
          className="btn btn-accent btn-sm"
          style={{ padding: '10px 18px', fontWeight: 700, borderRadius: '8px' }}
        >
          <FiCalendar /> Book Now
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
