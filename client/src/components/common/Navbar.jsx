import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiSearch, FiShoppingCart, FiHeart, FiUser, FiSun, FiMoon, 
  FiMenu, FiX, FiPhoneCall, FiZap, FiShield, FiChevronDown, FiLogOut 
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';

const Navbar = () => {
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout, loginAsDemoAdmin, loginAsDemoCustomer } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Fetch live search suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const fetchSuggestions = async () => {
        try {
          const res = await axios.get(`/api/products?search=${encodeURIComponent(searchQuery)}`);
          if (res.data.success) {
            setSuggestions(res.data.products.slice(0, 5));
            setIsSearchOpen(true);
          }
        } catch (err) {
          console.warn('Search suggestions failed');
        }
      };
      const debounce = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(debounce);
    } else {
      setSuggestions([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleDemoAdmin = async () => {
    await loginAsDemoAdmin();
    setIsUserMenuOpen(false);
    navigate('/admin');
  };

  const handleDemoCustomer = async () => {
    await loginAsDemoCustomer();
    setIsUserMenuOpen(false);
    navigate('/dashboard');
  };

  const navLinks = [
    { name: t('nav_home'), path: '/' },
    { name: t('nav_products'), path: '/products' },
    { name: t('nav_services'), path: '/services' },
    { name: t('nav_contact'), path: '/contact' },
  ];

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'MR', label: 'मराठी' },
    { code: 'HI', label: 'हिन्दी' }
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: 'var(--card-shadow)' }}>
      {/* 1. Top Announcement Bar */}
      <div style={{
        background: 'linear-gradient(90deg, var(--primary-blue), var(--navnath-navy))',
        color: '#FFFFFF',
        fontSize: '0.82rem',
        padding: '6px 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiZap style={{ color: 'var(--accent-yellow)' }} /> {t('genuine_products')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.9 }}>
              <FiShield style={{ color: 'var(--accent-yellow)' }} /> {t('certified_visits')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href="tel:+918862004797" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <FiPhoneCall /> +91 8862004797
            </a>
            <span>|</span>
            <span>{t('nashik_location')}</span>
            <span>|</span>

            {/* Top Corner Language Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: '20px',
              padding: '2px 4px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <span style={{ fontSize: '0.78rem', marginRight: '4px', marginLeft: '4px' }}>🌐</span>
              {languages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => changeLanguage(l.code)}
                    style={{
                      border: 'none',
                      background: isSelected ? 'var(--accent-yellow)' : 'transparent',
                      color: isSelected ? '#1E293B' : '#FFFFFF',
                      fontWeight: isSelected ? 800 : 500,
                      fontSize: '0.78rem',
                      padding: '3px 8px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      lineHeight: 1
                    }}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img
              src="/logo.jpg"
              alt="New Navnath Electronics & Electricals"
              style={{
                height: '46px',
                width: '46px',
                objectFit: 'contain',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                padding: '2px',
                boxShadow: '0 4px 10px rgba(11, 61, 145, 0.25)',
                border: '1.5 solid var(--primary-blue)'
              }}
            />
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: 'var(--primary-blue)',
                letterSpacing: '-0.5px',
                lineHeight: 1.1
              }}>
                NEW NAVNATH
              </div>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '2px'
              }}>
                Electronics & Electricals
              </div>
            </div>
          </Link>

          {/* Search Bar with Live Dropdown */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '8px 0 0 8px',
                  border: '1px solid var(--border-color)',
                  borderRight: 'none',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0 20px',
                  backgroundColor: 'var(--primary-blue)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '0 8px 8px 0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem'
                }}
              >
                <FiSearch />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {isSearchOpen && suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                marginTop: '6px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                  SUGGESTED PRODUCTS
                </div>
                {suggestions.map((prod) => (
                  <div
                    key={prod._id || prod.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      navigate(`/products/${prod.slug || (prod._id || prod.id)}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <img
                      src={prod.images && prod.images[0] ? prod.images[0] : ''}
                      alt={prod.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        {prod.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary-blue)', fontWeight: 700 }}>
                        ₹{prod.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
                <div
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                  }}
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--primary-blue)',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(11, 61, 145, 0.05)'
                  }}
                >
                  View all results ({suggestions.length}+)
                </div>
              </div>
            )}
          </div>

          {/* Icons & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Main Header Language Switcher (EN | मराठी | हिन्दी) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              padding: '2px',
              border: '1px solid var(--border-color)'
            }}>
              {languages.map((l) => {
                const isSelected = language === l.code;
                return (
                  <button
                    key={`main-${l.code}`}
                    onClick={() => changeLanguage(l.code)}
                    title={`Switch to ${l.label}`}
                    style={{
                      border: 'none',
                      background: isSelected ? 'var(--primary-blue)' : 'transparent',
                      color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                      fontWeight: isSelected ? 800 : 500,
                      fontSize: '0.78rem',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-color)',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
            >
              {theme === 'light' ? <FiMoon /> : <FiSun style={{ color: 'var(--accent-yellow)' }} />}
            </button>

            {/* Wishlist */}
            <Link
              to="/dashboard?tab=wishlist"
              title="Wishlist"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '1.2rem'
              }}
            >
              <FiHeart />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--accent-yellow)',
                  color: '#1E293B',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              title="Shopping Cart"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-blue)',
                color: '#FFFFFF',
                fontSize: '1.2rem'
              }}
            >
              <FiShoppingCart />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--accent-yellow)',
                  color: '#1E293B',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                <FiUser />
                <span style={{ maxWidth: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
                <FiChevronDown />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  width: '240px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  zIndex: 1100,
                  overflow: 'hidden'
                }}>
                  {user ? (
                    <div>
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                        <span className="badge badge-blue" style={{ marginTop: '6px', fontSize: '0.68rem' }}>
                          {user.role.toUpperCase()}
                        </span>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{ display: 'block', padding: '10px 16px', fontSize: '0.9rem', borderBottom: '1px solid var(--border-color)' }}
                      >
                        My Dashboard & Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          style={{ display: 'block', padding: '10px 16px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-blue)', borderBottom: '1px solid var(--border-color)' }}
                        >
                          ⚡ Admin Portal
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                          navigate('/');
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 16px',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--danger)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        <FiLogOut /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Sign in for faster checkout and order tracking
                      </div>
                      <Link
                        to="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: '8px' }}
                      >
                        Sign In / Register
                      </Link>

                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', margin: '10px 0 6px' }}>
                        INSTANT DEMO ACCESS:
                      </div>
                      <button
                        onClick={handleDemoCustomer}
                        className="btn btn-outline"
                        style={{ width: '100%', fontSize: '0.8rem', padding: '8px', marginBottom: '6px' }}
                      >
                        Demo Customer Account
                      </button>
                      <button
                        onClick={handleDemoAdmin}
                        className="btn btn-accent"
                        style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}
                      >
                        ⚡ Demo Admin Login
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'none',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontSize: '1.4rem'
              }}
              className="mobile-nav-toggle"
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Nav Links Bar */}
      <nav style={{
        backgroundColor: 'var(--bg-main)',
        borderBottom: '1px solid var(--border-color)',
        padding: '10px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  style={{
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    color: isActive ? 'var(--primary-blue)' : 'var(--text-primary)',
                    borderBottom: isActive ? '2px solid var(--primary-blue)' : '2px solid transparent',
                    paddingBottom: '2px',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('need_electrician')}</span>
            <Link
              to="/services"
              className="badge badge-yellow"
              style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}
            >
              {t('book_home_service')}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
