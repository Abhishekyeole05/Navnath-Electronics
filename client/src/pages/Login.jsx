import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogOut, FiZap, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const Login = ({ onToast }) => {
  const { login, loginAsDemoAdmin, loginAsDemoCustomer } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (onToast) onToast('Signed in successfully!', 'success');
      navigate('/dashboard');
    } else {
      if (onToast) onToast(result.message || 'Login failed. Please check credentials.', 'error');
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    const result = await loginAsDemoAdmin();
    setLoading(false);
    if (result.success) {
      if (onToast) onToast('Welcome, Administrator!', 'success');
      navigate('/admin');
    } else {
      if (onToast) onToast('Demo admin sign in failed', 'error');
    }
  };

  const handleDemoCustomer = async () => {
    setLoading(true);
    const result = await loginAsDemoCustomer();
    setLoading(false);
    if (result.success) {
      if (onToast) onToast('Welcome to New Navnath Electricals!', 'success');
      navigate('/dashboard');
    } else {
      if (onToast) onToast('Demo customer sign in failed', 'error');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '60px 0', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          padding: '36px',
          boxShadow: 'var(--card-shadow)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <img
              src="/logo.jpg"
              alt="New Navnath Logo"
              style={{
                width: '76px',
                height: '76px',
                objectFit: 'contain',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                padding: '4px',
                boxShadow: '0 6px 16px rgba(11, 61, 145, 0.2)',
                marginBottom: '14px',
                border: '2px solid var(--primary-blue)'
              }}
            />
            <br />
            <span className="badge badge-yellow" style={{ marginBottom: '8px' }}>
              SECURE ACCESS
            </span>
            <h1 style={{ fontSize: '1.9rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Sign In to Your Account
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Track electrical orders, save addresses, and book home electrician visits.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Logins Section */}
          <div style={{
            marginTop: '28px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '0.5px' }}>
              INSTANT DEMO CREDENTIALS (NO TYPING):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={handleDemoCustomer}
                disabled={loading}
                className="btn btn-outline"
                style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
              >
                Demo Customer Login (user@navnath.com)
              </button>

              <button
                type="button"
                onClick={handleDemoAdmin}
                disabled={loading}
                className="btn btn-accent"
                style={{ width: '100%', padding: '12px', fontSize: '0.9rem' }}
              >
                ⚡ Demo Admin Login (admin@navnath.com)
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>Create an Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
