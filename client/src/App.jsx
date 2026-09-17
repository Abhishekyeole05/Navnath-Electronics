import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingButtons from './components/common/FloatingButtons';
import ScrollProgressBar from './components/common/ScrollProgressBar';
import Toast from './components/common/Toast';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Services from './pages/Services';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const App = () => {
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: '', type: 'success' });
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ScrollProgressBar />
        <Navbar />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home onToast={showToast} />} />
            <Route path="/products" element={<Products onToast={showToast} />} />
            <Route path="/products/:id" element={<ProductDetails onToast={showToast} />} />
            <Route path="/services" element={<Services onToast={showToast} />} />
            <Route path="/cart" element={<Cart onToast={showToast} />} />
            <Route path="/checkout" element={<Checkout onToast={showToast} />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/contact" element={<Contact onToast={showToast} />} />
            <Route path="/login" element={<Login onToast={showToast} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register onToast={showToast} />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/dashboard" element={<UserDashboard onToast={showToast} />} />
            <Route path="/admin" element={<AdminDashboard onToast={showToast} />} />
          </Routes>
        </main>

        <Footer />
        <FloatingButtons />
        
        {toast.message && (
          <Toast message={toast.message} type={toast.type} onClose={closeToast} />
        )}
      </div>
    </Router>
  );
};

export default App;
