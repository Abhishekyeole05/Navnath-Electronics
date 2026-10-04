import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import {
  FiCheckCircle, FiDownload, FiArrowRight, FiBox, FiPhoneCall,
  FiTruck, FiCheck, FiCreditCard, FiShield
} from 'react-icons/fi';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.warn('Failed to fetch order receipt');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const items = order ? (order.items || order.orderItems || []) : [];
  const totalAmount = order ? Number(order.totalAmount || order.totalPrice || order.subtotal || 0) : 0;
  const subtotal = order ? Number(order.subtotal || order.itemsPrice || totalAmount) : 0;
  const discountAmount = order ? Number(order.discountAmount || 0) : 0;
  const isPaid = order ? (order.paymentStatus === 'Paid' || order.isPaid === true) : false;
  const paymentMethod = order ? (order.paymentMethod || 'Cash on Delivery') : 'Cash on Delivery';
  const paymentId = order?.paymentDetails?.paymentId || order?.paymentDetails?.utrNumber || '';

  const handleDownloadInvoice = () => {
    if (!order) return;
    const doc = new jsPDF();
    
    // Brand Header
    doc.setFontSize(18);
    doc.setTextColor(11, 61, 145);
    doc.text('NEW NAVNATH ELECTRONICS & ELECTRICALS', 20, 24);
    
    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text('Opposite Bus Stand, Main Market Road, Manmad - 422001, Maharashtra', 20, 31);
    doc.text('Proprietor: Mayur Dadaji Chaudhari | Contact: +91 8862004797 | info@newnavnathelectricals.com', 20, 36);
    
    doc.setDrawColor(200, 210, 230);
    doc.setLineWidth(0.5);
    doc.line(20, 41, 190, 41);

    // Invoice Meta
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('TAX INVOICE / CASH MEMO', 20, 50);

    doc.setFontSize(9.5);
    doc.setTextColor(60);
    doc.text(`Order Number: #${order.orderId || order._id || order.id}`, 20, 58);
    doc.text(`Order Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, 20, 64);
    doc.text(`Payment Method: ${paymentMethod.toUpperCase()}`, 20, 70);
    doc.text(`Payment Status: ${isPaid ? 'PAID / CONFIRMED' : 'CASH ON DELIVERY (PENDING)'}`, 20, 76);
    if (paymentId) {
      doc.text(`Transaction Reference: ${paymentId}`, 20, 82);
    }

    // Shipping Customer Details
    const addr = order.shippingAddress || {};
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Delivered To Customer:', 120, 58);
    doc.setFontSize(9);
    doc.setTextColor(60);
    doc.text(`${addr.fullName || order.customerName || 'Customer'}`, 120, 64);
    doc.text(`${addr.street || addr.address || 'Opposite Bus Stand'}, ${addr.city || 'Manmad'}`, 120, 70);
    doc.text(`PIN: ${addr.postalCode || addr.pinCode || '422001'}, ${addr.state || 'Maharashtra'}`, 120, 76);
    doc.text(`Phone: ${addr.phone || order.mobile || '8862004797'}`, 120, 82);

    // Table Header
    let y = 96;
    doc.setFillColor(235, 243, 255);
    doc.rect(20, y - 6, 170, 8, 'F');
    doc.setFontSize(9);
    doc.setTextColor(11, 61, 145);
    doc.text('Item Description', 22, y);
    doc.text('Brand', 105, y);
    doc.text('Qty', 135, y);
    doc.text('Amount (INR)', 160, y);

    y += 10;
    doc.setTextColor(30);
    items.forEach((item, index) => {
      const itemPrice = Number(item.price || 0);
      const itemQty = Number(item.quantity || item.qty || 1);
      const itemTotal = itemPrice * itemQty;
      
      const itemName = item.name ? (item.name.length > 40 ? item.name.substring(0, 38) + '...' : item.name) : `Item ${index + 1}`;
      doc.text(itemName, 22, y);
      doc.text(`${item.brand || 'Navnath'}`, 105, y);
      doc.text(`${itemQty}`, 137, y);
      doc.text(`INR ${itemTotal.toLocaleString('en-IN')}`, 160, y);
      y += 8;
    });

    doc.setDrawColor(220);
    doc.line(20, y, 190, y);
    y += 8;

    // Totals Section
    doc.setFontSize(9);
    doc.setTextColor(70);
    doc.text(`Items Subtotal:`, 125, y);
    doc.text(`INR ${subtotal.toLocaleString('en-IN')}`, 160, y);
    y += 6;

    if (discountAmount > 0) {
      doc.text(`Coupon Discount:`, 125, y);
      doc.text(`- INR ${discountAmount.toLocaleString('en-IN')}`, 160, y);
      y += 6;
    }

    doc.text(`Delivery Charge (Manmad):`, 125, y);
    doc.text(`FREE`, 160, y);
    y += 6;

    doc.text(`GST (18% Included):`, 125, y);
    doc.text(`INR ${Math.round(totalAmount * 0.18).toLocaleString('en-IN')}`, 160, y);
    y += 8;

    doc.setDrawColor(11, 61, 145);
    doc.rect(122, y - 5, 68, 10, 'F');
    doc.setFontSize(10.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`TOTAL PAYABLE: INR ${totalAmount.toLocaleString('en-IN')}`, 125, y + 2);

    // Footer Terms
    doc.setFontSize(8);
    doc.setTextColor(110);
    doc.text('• 100% Genuine Brand Warranty applies to all electrical products on presentation of this invoice.', 20, 275);
    doc.text('• Certified shop location: New Navnath Electronics & Electricals, Opposite Bus Stand, Manmad.', 20, 280);
    doc.text('• Thank you for shopping with us! For assistance, call: +91 8862004797', 20, 285);

    doc.save(`Invoice_Navnath_${order.orderId || id}.pdf`);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>Loading your order receipt...</h3>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '50px 0' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          padding: '40px 32px',
          boxShadow: 'var(--card-shadow)'
        }}>
          {/* Success Icon */}
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            margin: '0 auto 20px'
          }}>
            <FiCheckCircle />
          </div>

          <div style={{ textAlign: 'center' }}>
            <span className="badge badge-green" style={{ marginBottom: '10px' }}>
              {isPaid ? 'PAYMENT RECEIVED & ORDER CONFIRMED' : 'ORDER PLACED - CASH ON DELIVERY'}
            </span>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '10px', color: 'var(--text-primary)' }}>
              Thank You For Your Order!
            </h1>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: '1.6' }}>
              Your order <strong>#{order?.orderId || id}</strong> has been received and is being prepared for fast local dispatch across Manmad.
            </p>
          </div>

          {/* Order Details Card */}
          {order && (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '28px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-blue)' }}>
                  Order #{order.orderId || order._id}
                </span>
                <span className={`badge ${isPaid ? 'badge-green' : 'badge-yellow'}`}>
                  {isPaid ? 'Paid' : 'Payment Due on Delivery'}
                </span>
              </div>

              {/* Items Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                {items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80'}
                        alt=""
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>{item.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          Qty: {item.quantity || item.qty} × ₹{Number(item.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700 }}>
                      ₹{(Number(item.price) * Number(item.quantity || item.qty || 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary Metadata */}
              <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Payment Method:</span>
                  <span style={{ fontWeight: 700 }}>{paymentMethod}</span>
                </div>

                {paymentId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Transaction Ref:</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{paymentId}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping Address:</span>
                  <span style={{ fontWeight: 600, textAlign: 'right' }}>
                    {order.shippingAddress?.street || 'Opposite Bus Stand'}, {order.shippingAddress?.city || 'Manmad'}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '10px',
                  marginTop: '6px',
                  fontSize: '1.15rem',
                  fontWeight: 800
                }}>
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--primary-blue)' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleDownloadInvoice}
              className="btn btn-primary"
              style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FiDownload /> Download Tax Invoice (PDF)
            </button>

            <Link
              to="/dashboard?tab=orders"
              className="btn btn-outline"
              style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Track Order on Dashboard <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

