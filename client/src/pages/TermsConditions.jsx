import React from 'react';

const TermsConditions = () => {
  return (
    <div
      style={{
        background: '#f8fafc',
        minHeight: '100vh',
        padding: '45px 20px 60px',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          maxWidth: '1050px',
          margin: '0 auto',
          background: '#ffffff',
          padding: '40px 50px',
          borderRadius: '12px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
        }}
      >
        {/* Page Header */}
        <div
          style={{
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '20px',
            marginBottom: '28px',
          }}
        >
          <h1
            style={{
              margin: 0,
              color: '#111827',
              fontSize: '30px',
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            Terms & Conditions
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            Please read these terms carefully before using the Navnath
            Electronics & Electricals website.
          </p>
        </div>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using this website, you agree to comply with these
            Terms & Conditions. If you do not agree with any part of these
            terms, please do not use the website.
          </p>

          <h2>2. Use of the Website</h2>
          <p>
            You agree to use this website only for lawful purposes and in a
            manner that does not interfere with the operation, security, or
            availability of the website.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            Users may create an account to access certain features such as
            order management and service bookings. You are responsible for
            maintaining the confidentiality of your account information.
          </p>

          <h2>4. Products and Services</h2>
          <p>
            Product information, prices, availability, specifications, and
            service details may be updated from time to time. We aim to keep
            the information accurate and up to date.
          </p>

          <h2>5. Orders and Payments</h2>
          <p>
            When you place an order, you agree to provide accurate information.
            Orders are subject to product availability and successful payment
            processing.
          </p>

          <h2>6. Service Bookings</h2>
          <p>
            Customers are responsible for providing accurate details while
            booking electrical services. Service availability may depend on
            location, selected time slot, and technician availability.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            The website content, design, logos, graphics, text, and other
            materials are intended for use by Navnath Electronics & Electricals
            and may not be copied, reproduced, or distributed without
            appropriate permission.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            We make reasonable efforts to maintain the website and provide
            accurate information. However, we are not responsible for
            temporary interruptions, technical issues, or information that may
            become outdated.
          </p>

          <h2>9. Changes to These Terms</h2>
          <p>
            We may update these Terms & Conditions when necessary. Updated
            terms will be made available on this page.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions regarding these Terms & Conditions, please
            contact Navnath Electronics & Electricals through our Contact page.
          </p>
        </section>

        {/* Last Updated */}
        <div
          style={{
            marginTop: '30px',
            paddingTop: '18px',
            borderTop: '1px solid #e5e7eb',
            color: '#6b7280',
            fontSize: '13px',
          }}
        >
          <strong style={{ color: '#374151' }}>Last Updated:</strong>{' '}
          September 2026
        </div>
      </div>

      {/* Section Styles */}
      <style>
        {`
          section h2 {
            color: #111827;
            font-size: 19px;
            font-weight: 700;
            margin: 26px 0 8px;
            line-height: 1.4;
          }

          section h2:first-child {
            margin-top: 0;
          }

          section p {
            color: #4b5563;
            font-size: 14px;
            line-height: 1.75;
            margin: 0;
          }

          @media (max-width: 768px) {
            div[style*="max-width: 1050px"] {
              padding: 28px 22px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default TermsConditions;