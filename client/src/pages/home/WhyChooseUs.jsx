import React from 'react';
import { FiShield, FiTruck, FiAward, FiTool, FiClock, FiCheckSquare } from 'react-icons/fi';

const features = [
  {
    icon: <FiAward />,
    title: '100% Genuine Brands',
    description: 'We are official distributors for Havells, Polycab, Anchor Roma, Crompton, and Schneider. Every box carries an authentic warranty seal.'
  },
  {
    icon: <FiTool />,
    title: 'Certified Electricians',
    description: 'Our licensed Nashik electricians handle domestic house wiring, motor installations, and panel commissioning with guaranteed safety.'
  },
  {
    icon: <FiTruck />,
    title: 'Same-Day Local Delivery',
    description: 'Order before 2:00 PM for same-day delivery across Nashik city, Gangapur Road, College Road, and MIDC industrial zones.'
  },
  {
    icon: <FiShield />,
    title: 'Brand Replacement Support',
    description: 'Hassle-free warranty replacement directly at our Shivaji Nagar store. No long wait times with service centers.'
  },
  {
    icon: <FiClock />,
    title: 'Emergency Breakdown Help',
    description: 'Got a main distribution board spark or water pump breakdown? We offer priority emergency technician dispatch.'
  },
  {
    icon: <FiCheckSquare />,
    title: 'Wholesale Contractor Pricing',
    description: 'Special bulk discount tiers for builders, interior decorators, electrical contractors, and residential societies.'
  }
];

const WhyChooseUs = () => {
  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 50px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '10px' }}>
            WHY WE ARE #1 IN NASHIK
          </span>
          <h2 style={{ fontSize: '2.3rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Why Customers Choose New Navnath
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            For over 15 years, households and industrial engineers have relied on us for unmatched electrical safety, wholesale prices, and reliable technical service.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '28px'
        }}>
          {features.map((feat, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '30px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '18px',
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
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: 'rgba(11, 61, 145, 0.1)',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.7rem',
                flexShrink: 0
              }}>
                {feat.icon}
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
