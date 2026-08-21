import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingButtons from './components/common/FloatingButtons';
import ScrollProgressBar from './components/common/ScrollProgressBar';
import Toast from './components/common/Toast';
import PrivateRoute from './components/common/PrivateRoute';

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
import NotFound from './pages/NotFound';

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
            {/* Public Routes */}
            <Route path="/" element={<Home onToast={showToast} />} />
            <Route path="/products" element={<Products onToast={showToast} />} />
            <Route path="/products/:id" element={<ProductDetails onToast={showToast} />} />
            <Route path="/services" element={<Services onToast={showToast} />} />
            <Route path="/cart" element={<Cart onToast={showToast} />} />
            <Route path="/contact" element={<Contact onToast={showToast} />} />
            <Route path="/login" element={<Login onToast={showToast} />} />
            <Route path="/register" element={<Register onToast={showToast} />} />

            {/* Protected Routes — login required */}
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout onToast={showToast} />
                </PrivateRoute>
              }
            />
            <Route
              path="/order-success/:id"
              element={
                <PrivateRoute>
                  <OrderSuccess />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <UserDashboard onToast={showToast} />
                </PrivateRoute>
              }
            />

            {/* Admin-only Route */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminDashboard onToast={showToast} />
                </PrivateRoute>
              }
            />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
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
