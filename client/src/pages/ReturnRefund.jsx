import React from 'react';

const ReturnRefund = () => {
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
            Return & Refund Policy
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            Please review our return and refund guidelines before placing an
            order with Navnath Electronics & Electricals.
          </p>
        </div>

        <section>
          <h2>1. Return Eligibility</h2>
          <p>
            Products may be eligible for return if they are damaged, defective,
            incorrect, or significantly different from the product ordered.
            Return eligibility may depend on the product type and condition.
          </p>

          <h2>2. Condition of Products</h2>
          <p>
            Returned products should be unused and in their original packaging
            whenever possible. Accessories, manuals, invoices, and other
            included items should also be returned with the product.
          </p>

          <h2>3. Reporting Damaged Products</h2>
          <p>
            If a product arrives damaged or defective, customers should contact
            us as soon as possible with the order details and relevant
            information about the issue.
          </p>

          <h2>4. Non-Returnable Items</h2>
          <p>
            Certain products may not be eligible for return due to their
            nature, installation, customization, usage, or other applicable
            conditions.
          </p>

          <h2>5. Refund Process</h2>
          <p>
            Once a return is reviewed and approved, the applicable refund will
            be processed through the appropriate payment method or refund
            process.
          </p>

          <h2>6. Refund Time</h2>
          <p>
            The time required for a refund to appear in the customer's account
            may vary depending on the payment method and financial institution.
          </p>

          <h2>7. Order Cancellation</h2>
          <p>
            Cancellation requests may be accepted depending on the status of
            the order. Orders that have already been processed, dispatched, or
            delivered may be subject to different conditions.
          </p>

          <h2>8. Service Bookings</h2>
          <p>
            Cancellation or refund conditions for service bookings may depend
            on the booking status, selected service, and applicable service
            terms.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            For return or refund-related questions, please contact Navnath
            Electronics & Electricals through our Contact page and provide your
            order details.
          </p>
        </section>

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

export default ReturnRefund;