import React, { useState, useEffect } from 'react';
import { FiPhoneCall, FiArrowUp, FiMessageCircle } from 'react-icons/fi';

const FloatingButtons = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 900
    }}>
      {/* 1. WhatsApp Chat Button */}
      <a
        href="https://wa.me/918862004797?text=Hello%20New%20Navnath%20Electricals%2C%20I%20have%20an%20inquiry%20regarding%20electrical%20products/service."
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
          textDecoration: 'none',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <FiMessageCircle />
      </a>

      {/* 2. Call Shop Button */}
      <a
        href="tel:+918862004797"
        title="Call Shop Now (+91 8862004797)"
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-blue)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: '0 4px 15px rgba(11, 61, 145, 0.4)',
          textDecoration: 'none',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <FiPhoneCall />
      </a>

      {/* 3. Back To Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          title="Back to Top"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-yellow)',
            color: '#0F172A',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 193, 7, 0.4)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <FiArrowUp />
        </button>
      )}
    </div>
  );
};

export default FloatingButtons;
