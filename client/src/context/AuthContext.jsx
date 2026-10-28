import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('navnath_token') || null);
  const [loading, setLoading] = useState(true);

  // Set default axios Auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('navnath_token', token);
      fetchProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('navnath_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.warn('Profile sync failed, clearing token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const cleanEmail = email ? email.trim().toLowerCase() : '';
      const res = await axios.post('/api/auth/login', { 
        email: cleanEmail, 
        password 
      });
      if (res.data.success) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        localStorage.setItem('navnath_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user, token: res.data.token };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
      return { success: false, message };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const cleanEmail = email ? email.trim().toLowerCase() : '';
      const res = await axios.post('/api/auth/register', { 
        name, 
        email: cleanEmail, 
        password, 
        phone 
      });
      if (res.data.success) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        localStorage.setItem('navnath_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user, token: res.data.token };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please check your details.';
      return { success: false, message };
    }
  };

  const logout = () => {
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    localStorage.removeItem('navnath_token');
    localStorage.removeItem('navnath_cart');
    localStorage.removeItem('navnath_wishlist');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
