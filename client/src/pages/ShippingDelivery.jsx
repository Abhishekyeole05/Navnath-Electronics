import React from 'react';

const ShippingDelivery = () => {
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
            Shipping & Delivery Policy
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              color: '#6b7280',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            Information about order processing, shipping, and delivery at
            Navnath Electronics & Electricals.
          </p>
        </div>

        <section>
          <h2>1. Order Processing</h2>
          <p>
            Orders are processed after successful order confirmation and
            payment verification. Processing time may vary depending on product
            availability and order details.
          </p>

          <h2>2. Shipping Availability</h2>
          <p>
            We aim to provide delivery services to locations supported by our
            delivery partners. Availability may vary depending on the delivery
            address and product.
          </p>

          <h2>3. Delivery Time</h2>
          <p>
            Estimated delivery time may vary depending on the customer's
            location, product availability, shipping method, and other
            circumstances.
          </p>

          <h2>4. Shipping Charges</h2>
          <p>
            Applicable shipping charges, if any, may depend on the order,
            delivery location, product, and selected shipping method. Any
            applicable charges will be displayed during the ordering process.
          </p>

          <h2>5. Tracking Information</h2>
          <p>
            Where tracking is available, customers may receive relevant
            shipment or delivery information after the order has been
            dispatched.
          </p>

          <h2>6. Delivery Delays</h2>
          <p>
            Delivery may occasionally be delayed due to weather conditions,
            transportation issues, holidays, high demand, or other
            circumstances beyond our reasonable control.
          </p>

          <h2>7. Incorrect Delivery Information</h2>
          <p>
            Customers are responsible for providing accurate delivery
            information. Delays or additional charges caused by incorrect or
            incomplete information may be the customer's responsibility.
          </p>

          <h2>8. Damaged Packages</h2>
          <p>
            Customers should inspect packages when possible. If an order
            arrives damaged, please contact us promptly with the order details
            and relevant information about the issue.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            For shipping and delivery questions, please contact Navnath
            Electronics & Electricals through our Contact page.
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

export default ShippingDelivery;