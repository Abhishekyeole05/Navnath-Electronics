import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = ({ onToast }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    const result = await register(name, email, password, phone);
    setLoading(false);
    if (result.success) {
      if (onToast) onToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } else {
      if (onToast) onToast(result.message || 'Registration failed', 'error');
    }
  };

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
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="badge badge-blue" style={{ marginBottom: '8px' }}>
              NEW NAVNATH ACCOUNT
            </span>
            <h1 style={{ fontSize: '1.9rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Create Your Account
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Get faster checkout, track orders, and book home electrician service.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Sanjay Patil"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="sanjay@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (Nashik contact)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                placeholder="+91 9876543210"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Create Password *</label>
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
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '14px' }}
            >
              {loading ? 'Creating Account...' : 'Register Now'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: 700 }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
