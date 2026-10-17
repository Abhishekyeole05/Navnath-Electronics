import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('navnath_wishlist');
    const tokenExists = localStorage.getItem('navnath_token');
    return saved && tokenExists ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user && user.wishlist) {
      setWishlist(user.wishlist);
    } else if (!user && !token) {
      setWishlist([]);
      localStorage.removeItem('navnath_wishlist');
    }
  }, [user, token]);

  useEffect(() => {
    if (user || token) {
      localStorage.setItem('navnath_wishlist', JSON.stringify(wishlist));
    } else {
      localStorage.removeItem('navnath_wishlist');
    }
  }, [wishlist, user, token]);

  const toggleWishlist = async (productId) => {
    if (!user && !token) {
      return { success: false, requireAuth: true, message: 'Please sign in to add products to your wishlist.' };
    }

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
    return { success: true };
  };

  const isInWishlist = (productId) => (user || token) ? wishlist.includes(productId) : false;

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
