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
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: 'Login failed' };
  };

  const register = async (name, email, password, phone) => {
    const res = await axios.post('/api/auth/register', { name, email, password, phone });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: 'Registration failed' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('navnath_token');
  };

  // Quick helper for Demo testing
  const loginAsDemoAdmin = async () => {
    return await login('admin@navnath.com', 'admin123');
  };

  const loginAsDemoCustomer = async () => {
    return await login('user@navnath.com', 'user123');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      loginAsDemoAdmin,
      loginAsDemoCustomer
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
