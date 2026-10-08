import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft, FiPackage } from 'react-icons/fi';

const Wishlist = ({ onToast }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { tProduct } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/products');
        if (res.data.success) {
          const allProducts = res.data.products;
          // Filter items that are in wishlist array (matching _id or id)
          const matched = allProducts.filter(p => wishlist.includes(p._id) || wishlist.includes(p.id));
          setProducts(matched);
        }
      } catch (err) {
        console.warn('Failed to load wishlist items');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  const handleMoveToCart = (product) => {
    const pId = product._id || product.id;
    addToCart(product, 1);
    toggleWishlist(pId);
    if (onToast) {
      onToast(`Moved "${tProduct(product.name)}" to Cart!`, 'success');
    }
  };

  const handleRemove = (productId, productName) => {
    toggleWishlist(productId);
    if (onToast) {
      onToast(`Removed "${tProduct(productName)}" from Wishlist`, 'info');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', minHeight: '60vh' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>Loading your saved items...</h3>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              My Wishlist <FiHeart style={{ color: 'var(--danger)', verticalAlign: 'middle', marginLeft: '6px' }} />
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              {products.length} {products.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          <Link to="/products" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <FiArrowLeft /> Continue Shopping
          </Link>
        </div>

        {products.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            padding: '60px 20px',
            textAlign: 'center',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '2rem'
            }}>
              <FiHeart />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Your Wishlist is Empty
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px auto', fontSize: '0.92rem' }}>
              Explore our wide range of electronic items and electrical services to save your favorites!
            </p>
            <Link to="/products" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Explore Products
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {products.map(product => {
              const pId = product._id || product.id;
              const image = product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80';
              const isOutOfStock = product.stock <= 0;

              return (
                <div key={pId} style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: 'var(--card-shadow)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(pId, product.name)}
                    title="Remove from Wishlist"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--danger)',
                      zIndex: 5,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    <FiTrash2 />
                  </button>

                  {/* Product Image */}
                  <Link to={`/products/${product.slug || pId}`} style={{ display: 'block', padding: '20px', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
                    <img
                      src={image}
                      alt={product.name}
                      style={{ height: '180px', objectFit: 'contain', width: '100%', borderRadius: '8px' }}
                    />
                  </Link>

                  {/* Info */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-blue)', textTransform: 'uppercase' }}>
                        {product.category}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '6px 0', color: 'var(--text-primary)' }}>
                        <Link to={`/products/${product.slug || pId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {tProduct(product.name)}
                        </Link>
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                          ₹{product.price?.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            ₹{product.originalPrice?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: isOutOfStock ? 'var(--danger)' : 'var(--success)', fontWeight: 600, marginBottom: '16px' }}>
                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                      </div>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={isOutOfStock}
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px'
                      }}
                    >
                      <FiShoppingCart /> Move to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
