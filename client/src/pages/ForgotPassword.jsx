import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:5000/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Unable to send reset link.');
        return;
      }

      setMessage(
        'Password reset link has been sent to your email.'
      );

    } catch (err) {
      setError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          background: '#fff'
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
          Forgot Password
        </h2>

        <p
          style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '25px'
          }}
        >
          Enter your email address and we will send you a
          password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '7px',
                fontWeight: '500'
              }}
            >
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <p style={{ color: 'red', marginBottom: '15px' }}>
              {error}
            </p>
          )}

          {message && (
            <p style={{ color: 'green', marginBottom: '15px' }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              background: '#2563eb',
              color: '#fff',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '20px'
          }}
        >
          <Link
            to="/login"
            style={{
              color: 'var(--primary-blue)',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;