import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiShield, FiUser, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const Login = ({ onToast }) => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('role') === 'admin' ? 'admin' : 'customer';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const roleParam = new URLSearchParams(location.search).get('role');
    if (roleParam === 'admin') {
      setActiveTab('admin');
    }
  }, [location.search]);

  if (user) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const loggedUser = result.user;
      if (activeTab === 'admin') {
        if (loggedUser.role !== 'admin') {
          logout();
          const err = 'Access Denied: This account is a customer account and does not have store administrator privileges. Please switch to Customer Sign In.';
          setError(err);
          if (onToast) onToast(err, 'error');
          return;
        }
        if (onToast) onToast('Welcome, Administrator!', 'success');
        navigate('/admin', { replace: true });
      } else {
        if (onToast) onToast('Signed in successfully!', 'success');
        const target = loggedUser.role === 'admin' ? '/admin' : '/dashboard';
        navigate(target, { replace: true });
      }
    } else {
      const errorMsg = result.message || 'Invalid email or password. Please verify your credentials.';
      setError(errorMsg);
      if (onToast) onToast(errorMsg, 'error');
    }
  };

  const isAdminTab = activeTab === 'admin';

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '60px 0', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          padding: '36px',
          boxShadow: 'var(--card-shadow)'
        }}>
          {/* Role Mode Tabs: Customer vs Admin */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            backgroundColor: 'var(--bg-secondary)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '28px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              type="button"
              onClick={() => handleTabChange('customer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: !isAdminTab ? 700 : 500,
                fontSize: '0.9rem',
                backgroundColor: !isAdminTab ? 'var(--primary-blue)' : 'transparent',
                color: !isAdminTab ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                boxShadow: !isAdminTab ? '0 2px 8px rgba(11, 61, 145, 0.25)' : 'none'
              }}
            >
              <FiUser /> Customer
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: isAdminTab ? 700 : 500,
                fontSize: '0.9rem',
                backgroundColor: isAdminTab ? 'var(--primary-blue)' : 'transparent',
                color: isAdminTab ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                boxShadow: isAdminTab ? '0 2px 8px rgba(11, 61, 145, 0.25)' : 'none'
              }}
            >
              <FiShield /> Store Admin
            </button>
          </div>

          {/* Heading Section */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span
              className={`badge ${isAdminTab ? 'badge-blue' : 'badge-yellow'}`}
              style={{ marginBottom: '8px' }}
            >
              {isAdminTab ? 'RESTRICTED ADMIN ACCESS' : 'CUSTOMER PORTAL'}
            </span>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
              {isAdminTab ? 'Store Admin Sign In' : 'Sign In to Your Account'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {isAdminTab
                ? 'Manage store products, customer orders, service technicians, and shop operations.'
                : 'Track electrical orders, manage wishlist, and book verified home electrician visits.'}
            </p>
          </div>

          {/* Error Message */}
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
              gap: '8px'
            }}>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                {isAdminTab ? 'Admin Email Address' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder={isAdminTab ? 'samarthsonawane2006@gmail.com' : 'e.g. rahul.shinde@gmail.com'}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '-4px', marginBottom: '12px' }}>
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
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '6px' }}
            >
              {loading
                ? (isAdminTab ? 'Verifying Admin Access...' : 'Signing In...')
                : (isAdminTab ? 'Access Admin Dashboard' : 'Sign In as Customer')}
            </button>
          </form>

          {/* Bottom Switcher & Register Link */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>
            {!isAdminTab ? (
              <div>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>
                  Create an Account
                </Link>
              </div>
            ) : (
              <div>
                Are you a customer?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('customer')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-blue)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '0.9rem'
                  }}
                >
                  Switch to Customer Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
