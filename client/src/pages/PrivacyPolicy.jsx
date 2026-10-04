import React from 'react';

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            At Navnath Electronics & Electricals, we respect your privacy and
            are committed to protecting your personal information.
          </p>
        </div>

        {/* Sections */}
        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We may collect information such as your name, email address, phone
            number, delivery address, and order details when you use our
            website.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            Your information may be used to process orders, provide services,
            communicate with you, improve our website, and provide customer
            support.
          </p>

          <h2>3. Account Information</h2>
          <p>
            If you create an account, you are responsible for keeping your
            login credentials secure. Please notify us if you notice any
            unauthorized access to your account.
          </p>

          <h2>4. Payment Information</h2>
          <p>
            Payment transactions are processed through secure payment services.
            We do not intentionally store sensitive payment details such as
            complete card numbers on our servers.
          </p>

          <h2>5. Cookies</h2>
          <p>
            Our website may use cookies or similar technologies to improve
            user experience, maintain sessions, and understand website usage.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We take reasonable measures to protect your personal information
            from unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>7. Third-Party Services</h2>
          <p>
            Our website may use third-party services such as payment providers,
            email services, or cloud services. Their use of information is
            governed by their respective privacy policies.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be reflected on this page.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please
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

export default PrivacyPolicy;