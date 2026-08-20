import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import { FiCheckCircle, FiDownload, FiArrowRight, FiBox, FiPhoneCall } from 'react-icons/fi';

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

  const handleDownloadInvoice = () => {
    if (!order) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(11, 61, 145);
    doc.text('NEW NAVNATH ELECTRONICS & ELECTRICALS', 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('NEW NAVNATH ELECTRONICS AND ELECTRICALS, OPPOSITE BUS STAND, MANMAD', 20, 32);
    doc.text('Proprietor: Mayur Dadaji Chaudhari | Phone: +91 8862004797', 20, 38);
    
    doc.setLineWidth(0.5);
    doc.line(20, 43, 190, 43);

    // Invoice Title & Info
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('TAX INVOICE / RECEIPT', 20, 53);

    doc.setFontSize(10);
    doc.text(`Order ID: #${order._id || order.id}`, 20, 62);
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 20, 68);
    doc.text(`Payment Status: ${order.isPaid ? 'PAID' : 'CASH ON DELIVERY'}`, 20, 74);

    // Shipping Address
    const addr = order.shippingAddress || {};
    doc.text('Delivered To:', 120, 62);
    doc.text(`${addr.fullName || 'Sanjay Patil'}`, 120, 68);
    doc.text(`${addr.street || 'Opposite Bus Stand'}, ${addr.city || 'Manmad'}`, 120, 74);
    doc.text(`Phone: ${addr.phone || '8862004797'}`, 120, 80);

    // Items Table Header
    let y = 95;
    doc.setFillColor(240, 245, 255);
    doc.rect(20, y - 6, 170, 8, 'F');
    doc.setFontSize(9);
    doc.text('Item Description', 22, y);
    doc.text('Qty', 130, y);
    doc.text('Price (INR)', 165, y);

    y += 10;
    (order.orderItems || []).forEach(item => {
      doc.text(`${item.name || 'Electrical Item'}`, 22, y);
      doc.text(`${item.qty}`, 132, y);
      doc.text(`INR ${item.price.toLocaleString('en-IN')}`, 165, y);
      y += 8;
    });

    doc.line(20, y, 190, y);
    y += 10;

    // Totals
    doc.text(`Subtotal: INR ${(order.itemsPrice || order.totalPrice).toLocaleString('en-IN')}`, 130, y);
    y += 6;
    doc.text(`Delivery Charge: FREE`, 130, y);
    y += 6;
    doc.text(`GST (18% Included): INR ${Math.round((order.totalPrice || 0) * 0.18).toLocaleString('en-IN')}`, 130, y);
    y += 8;
    doc.setFontSize(11);
    doc.setTextColor(11, 61, 145);
    doc.text(`TOTAL PAYABLE: INR ${(order.totalPrice || 0).toLocaleString('en-IN')}`, 130, y);

    // Footer note
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text('Thank you for choosing New Navnath Electronics & Electricals!', 20, 280);
    doc.text('100% Genuine Brand Warranty Valid with this Invoice.', 20, 286);

    doc.save(`Invoice_NewNavnath_${order._id || order.id}.pdf`);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>Loading your order receipt...</h3>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: 'var(--card-shadow)'
        }}>
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

          <span className="badge badge-yellow" style={{ marginBottom: '10px' }}>
            ORDER CONFIRMED
          </span>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
            Thank You For Your Order!
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '28px', lineHeight: '1.6' }}>
            Your order <strong>#{id}</strong> has been received and is being prepared for dispatch across Manmad.
          </p>

          {order && (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '28px',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payment Method:</span>
                <span style={{ fontWeight: 700 }}>{order.paymentMethod ? order.paymentMethod.toUpperCase() : 'ONLINE'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Amount:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary-blue)', fontSize: '1.1rem' }}>
                  ₹{(order.totalPrice || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Delivery:</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>Same Day (Before 7:00 PM)</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleDownloadInvoice}
              className="btn btn-primary"
              style={{ padding: '14px 28px' }}
            >
              <FiDownload /> Download PDF Invoice
            </button>

            <Link
              to="/dashboard"
              className="btn btn-outline"
              style={{ padding: '14px 28px' }}
            >
              Track Order Status <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
