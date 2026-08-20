import React from 'react';
import { Link } from 'react-router-dom';

const brands = [
  { name: 'Havells', tag: 'Wires, MCBs, Fans & LEDs', slug: 'Havells' },
  { name: 'Polycab', tag: 'Green FR Wires & Cables', slug: 'Polycab' },
  { name: 'Anchor Roma', tag: 'Modular Switches & Sockets', slug: 'Anchor by Panasonic' },
  { name: 'Crompton', tag: 'BLDC Fans & Submersible Pumps', slug: 'Crompton' },
  { name: 'Legrand', tag: 'Mylinc Switchboards & DBs', slug: 'Legrand' },
  { name: 'Philips', tag: 'T5 LED Tubes & Downlights', slug: 'Philips' },
  { name: 'Schneider', tag: 'Acti9 Heavy Duty MCBs', slug: 'Schneider Electric' },
  { name: 'Finolex', tag: 'House Wires & Cables', slug: 'Finolex' }
];

const BrandPartners = () => {
  return (
    <section style={{ padding: '70px 0', backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 40px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '8px' }}>
            AUTHORIZED DISTRIBUTOR
          </span>
          <h2 style={{ fontSize: '2.1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
            Official Brand Partners
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Every product sold at New Navnath comes directly from authorized company distributors with authentic warranty support.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {brands.map((brand, i) => (
            <Link
              key={i}
              to={`/products?brand=${encodeURIComponent(brand.slug)}`}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                padding: '24px 20px',
                textAlign: 'center',
                transition: 'all 0.25s ease',
                boxShadow: 'var(--card-shadow)',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
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
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.4rem',
                color: 'var(--primary-blue)',
                letterSpacing: '-0.5px',
                marginBottom: '6px'
              }}>
                {brand.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {brand.tag}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandPartners;
