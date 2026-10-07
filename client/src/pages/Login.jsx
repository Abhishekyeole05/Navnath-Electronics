import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogOut, FiZap, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const Login = ({ onToast }) => {
  const { user, login, loginAsDemoAdmin, loginAsDemoCustomer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (onToast) onToast('Signed in successfully!', 'success');
      navigate('/dashboard');
    } else {
      const errorMsg = result.message || 'Invalid email or password. Please check your credentials.';
      setError(errorMsg);
      if (onToast) onToast(errorMsg, 'error');
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    setError('');
    const result = await loginAsDemoAdmin();
    setLoading(false);
    if (result.success) {
      if (onToast) onToast('Welcome, Administrator!', 'success');
      navigate('/admin');
    } else {
      const errorMsg = result.message || 'Demo admin sign in failed';
      setError(errorMsg);
      if (onToast) onToast(errorMsg, 'error');
    }
  };

  const handleDemoCustomer = async () => {
    setLoading(true);
    setError('');
    const result = await loginAsDemoCustomer();
    setLoading(false);
    if (result.success) {
      if (onToast) onToast('Welcome to New Navnath Electricals!', 'success');
      navigate('/dashboard');
    } else {
      const errorMsg = result.message || 'Demo customer sign in failed';
      setError(errorMsg);
      if (onToast) onToast(errorMsg, 'error');
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

          {error && (
            <div style={{
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
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

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
            <div style={{ textAlign: 'right', marginTop: '-4px', marginBottom: '8px' }}>
  <Link
    to="/forgot-password"
    style={{
      color: 'var(--primary-blue)',
      fontSize: '0.85rem',
      fontWeight: 600,
      textDecoration: 'none'
    }}
  >
    Forgot Password?
  </Link>
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
