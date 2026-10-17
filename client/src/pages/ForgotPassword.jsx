import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiCopy, FiCheck, FiExternalLink, FiKey } from 'react-icons/fi';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailDelivery, setEmailDelivery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');
    setResetLink('');
    setCopied(false);

    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Unable to process password reset request.');
        return;
      }

      setMessage(data.message || 'Password reset link generated successfully.');
      if (data.resetLink) {
        setResetLink(data.resetLink);
      }
      if (data.emailDelivery) {
        setEmailDelivery(data.emailDelivery);
      }

    } catch (err) {
      setError('Unable to connect to the backend server. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!resetLink) return;
    navigator.clipboard.writeText(resetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-main)',
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px 20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '36px',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--card-shadow)',
          background: 'var(--bg-card)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(11, 61, 145, 0.1)',
              color: 'var(--primary-blue)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginBottom: '14px'
            }}
          >
            <FiKey />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
            Forgot Password
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Enter your account email to receive your secure password reset link.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <FiAlertCircle style={{ flexShrink: 0, fontSize: '1.1rem' }} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              color: '#166534',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '20px',
              fontSize: '0.88rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <FiCheckCircle style={{ color: '#16A34A', fontSize: '1.2rem', flexShrink: 0 }} />
              <span>{emailDelivery === 'sent' ? 'Email Sent to Inbox!' : 'Reset Link Ready!'}</span>
            </div>
            <p style={{ margin: 0, lineHeight: '1.45' }}>{message}</p>
          </div>
        )}

        {/* Instant Reset Action Card if link is generated */}
        {resetLink && (
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '24px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
              ⚡ Instant Reset Access:
            </div>

            <button
              type="button"
              onClick={() => {
                const token = resetLink.split('/reset-password/')[1];
                if (token) {
                  navigate(`/reset-password/${token}`);
                } else {
                  window.location.href = resetLink;
                }
              }}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Reset Password Now</span>
              <FiExternalLink />
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="btn btn-outline"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              {copied ? (
                <>
                  <FiCheck style={{ color: '#16A34A' }} />
                  <span>Link Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <FiCopy />
                  <span>Copy Reset Link</span>
                </>
              )}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Registered Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@navnath.com"
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
              <FiMail
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontSize: '1.1rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem', marginTop: '10px' }}
          >
            {loading ? 'Generating Reset Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link
            to="/login"
            style={{
              color: 'var(--primary-blue)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <FiArrowLeft />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;