import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiCheck, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';

const ProductCard = ({ product, onToast }) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { t, tProduct } = useLanguage();

  const id = product._id || product.id;
  const isWishlisted = isInWishlist(id);
  const image = product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    if (onToast) {
      onToast(`Added "${tProduct(product.name).split(' ')[0]}..." to Cart!`, 'success');
    }
  };


  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
    if (onToast) {
      onToast(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist!', 'info');
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '12px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: 'var(--card-shadow)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = 'var(--hover-shadow)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--card-shadow)';
    }}
    >
      {/* Top Badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        {product.discount > 0 ? (
          <span className="badge badge-yellow" style={{ fontSize: '0.7rem', fontWeight: 800 }}>
            {product.discount}% OFF
          </span>
        ) : <span />}

        <button
          onClick={handleWishlistToggle}
          title="Add to Wishlist"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isWishlisted ? 'var(--danger)' : 'var(--text-muted)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            fontSize: '1.05rem',
            transition: 'all 0.2s'
          }}
        >
          <FiHeart style={{ fill: isWishlisted ? 'var(--danger)' : 'none' }} />
        </button>
      </div>

      {/* Image Container */}
      <Link
        to={`/products/${product.slug || id}`}
        style={{
          position: 'relative',
          height: '210px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img
          src={image}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </Link>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Brand & Stock */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-blue)', textTransform: 'uppercase' }}>
            {product.brand}
          </span>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
            {product.stock > 0 ? t('in_stock') : t('out_of_stock')}
          </span>
        </div>

        {/* Product Title */}
        <Link
          to={`/products/${product.slug || id}`}
          style={{
            fontWeight: 700,
            fontSize: '0.98rem',
            color: 'var(--text-primary)',
            marginBottom: '8px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '44px',
            lineHeight: '1.4'
          }}
        >
          {tProduct(product.name)}
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: 'var(--success)',
            color: '#FFFFFF',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontWeight: 700
          }}>
            <span>{product.rating || 4.5}</span>
            <FiStar style={{ fill: '#FFFFFF' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            ({product.reviewsCount || 12} reviews)
          </span>
        </div>

        {/* Price Section */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-color)',
          paddingTop: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Inclusive of GST
            </span>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn btn-primary btn-sm"
            style={{
              borderRadius: '8px',
              padding: '8px 14px',
              opacity: product.stock === 0 ? 0.5 : 1,
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <FiShoppingCart /> {t('add_to_cart')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
