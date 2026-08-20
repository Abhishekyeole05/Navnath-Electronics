import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('navnath_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    localStorage.setItem('navnath_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => (item._id || item.id) === (product._id || product.id));
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, {
        id: product._id || product.id,
        _id: product._id || product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        brand: product.brand,
        image: product.images && product.images[0] ? product.images[0] : '',
        quantity
      }];
    });
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if ((item._id || item.id) === productId) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => (item._id || item.id) !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setDiscountAmount(0);
  };

  const applyCouponCode = async (code) => {
    try {
      const res = await axios.post('/api/coupons/apply', {
        code,
        cartTotal: subtotal
      });
      if (res.data.success) {
        setCoupon(res.data.coupon);
        setDiscountAmount(res.data.coupon.discountAmount);
        return { success: true, message: `Coupon applied! You saved ₹${res.data.coupon.discountAmount}` };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to apply coupon';
      return { success: false, message: msg };
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      subtotal,
      discountAmount,
      totalAmount,
      coupon,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCouponCode
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
