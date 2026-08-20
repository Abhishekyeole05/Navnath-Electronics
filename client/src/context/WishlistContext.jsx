import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('navnath_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user && user.wishlist) {
      setWishlist(user.wishlist);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('navnath_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = async (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });

    if (token) {
      try {
        await axios.post('/api/auth/wishlist', { productId });
      } catch (error) {
        console.warn('Failed to sync wishlist with server');
      }
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
