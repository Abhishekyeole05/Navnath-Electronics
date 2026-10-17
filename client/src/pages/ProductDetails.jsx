import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/common/ProductCard';
import { 
  FiShoppingCart, FiHeart, FiStar, FiShield, FiTruck, 
  FiCheck, FiMinus, FiPlus, FiMessageSquare, FiZap 
} from 'react-icons/fi';

const ProductDetails = ({ onToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { tProduct } = useLanguage();


  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${id}`);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setReviews(res.data.reviews || []);
          if (prod.images && prod.images.length > 0) {
            setSelectedImage(prod.images[0]);
          }

          // Fetch related products in the same category
          const relRes = await axios.get(`/api/products?category=${prod.category}`);
          if (relRes.data.success) {
            setRelatedProducts(
              relRes.data.products
                .filter(p => (p._id || p.id) !== (prod._id || prod.id))
                .slice(0, 4)
            );
          }

          // Check if current user can review this product
          if (user) {
            const pid = prod._id || prod.id;
            try {
              const revCheck = await axios.get(`/api/reviews/can-review/${pid}`);
              if (revCheck.data.success) setCanReview(revCheck.data.canReview);
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>Loading product details...</h3>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);

  const handleAddToCart = () => {
    if (!user) {
      if (onToast) onToast('Please sign in to add products to your cart', 'warning');
      navigate('/login');
      return;
    }
    const res = addToCart(product, quantity);
    if (res && res.requireAuth) {
      if (onToast) onToast(res.message, 'warning');
      navigate('/login');
      return;
    }
    if (onToast) {
      onToast(`Added ${quantity} x "${product.name.split(' ')[0]}..." to Cart!`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      if (onToast) onToast('Please sign in to proceed with purchase', 'warning');
      navigate('/login');
      return;
    }
    const res = addToCart(product, quantity);
    if (res && res.requireAuth) {
      if (onToast) onToast(res.message, 'warning');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      if (onToast) onToast('Please sign in to post a review', 'warning');
      return;
    }
    if (!commentInput.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await axios.post(`/api/products/${productId}/reviews`, {
        rating: ratingInput,
        comment: commentInput
      });
      if (res.data.success) {
        setReviews([res.data.review, ...reviews]);
        setCommentInput('');
        setCanReview(false);
        if (onToast) onToast('Review posted successfully!', 'success');
      }
    } catch (err) {
      if (onToast) onToast('Failed to post review', 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Compute rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Number(r.rating) === star).length
  }));
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviews.length).toFixed(1)
    : (product?.rating || 0);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{tProduct(product.name)}</span>
        </div>

        {/* Main Product Layout */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          padding: '36px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '48px',
          boxShadow: 'var(--card-shadow)',
          marginBottom: '48px'
        }}>
          {/* Left: Gallery & Thumbnails */}
          <div>
            <div style={{
              width: '100%',
              height: '420px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              position: 'relative'
            }}>
              <img
                src={selectedImage || '/images/placeholder-product.svg'}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/placeholder-product.svg';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }}
              />
              {product.discount > 0 && (
                <span className="badge badge-yellow" style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '0.8rem' }}>
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails Row */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '10px',
                      border: selectedImage === img ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      opacity: selectedImage === img ? 1 : 0.7
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/placeholder-product.svg';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-blue">{product.brand}</span>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                {product.stock > 0 ? '✓ IN STOCK (Immediate Dispatch)' : '✗ OUT OF STOCK'}
              </span>
            </div>

            <h1 style={{ fontSize: '1.9rem', marginBottom: '12px', color: 'var(--text-primary)', lineHeight: '1.3' }}>
              {tProduct(product.name)}
            </h1>

            {/* Rating Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'var(--success)',
                color: '#FFFFFF',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 700
              }}>
                <span>{product.rating || 4.8}</span>
                <FiStar style={{ fill: '#FFFFFF' }} />
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {reviews.length || product.reviewsCount || 12} Verified Customer Reviews
              </span>
            </div>

            {/* Price */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 800, fontSize: '2.2rem', color: 'var(--text-primary)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discount > 0 && (
                  <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.95rem' }}>
                    You Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({product.discount}%)
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Inclusive of all taxes & GST • Guaranteed wholesale rate in Nashik market
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              marginBottom: '28px'
            }}>
              {product.description}
            </p>

            {/* Quantity & CTA Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '28px',
              flexWrap: 'wrap'
            }}>
              {/* Quantity Box */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-card)'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                >
                  <FiMinus />
                </button>
                <span style={{ padding: '0 18px', fontWeight: 700, fontSize: '1rem' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                >
                  <FiPlus />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn btn-primary"
                style={{ flex: 1, padding: '14px', fontSize: '1rem' }}
              >
                <FiShoppingCart /> Add to Cart
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn btn-accent"
                style={{ flex: 1, padding: '14px', fontSize: '1rem' }}
              >
                <FiZap /> Buy Now
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  toggleWishlist(productId);
                  if (onToast) onToast(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist!', 'info');
                }}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  cursor: 'pointer',
                  color: isWishlisted ? 'var(--danger)' : 'var(--text-primary)',
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FiHeart style={{ fill: isWishlisted ? 'var(--danger)' : 'none' }} />
              </button>
            </div>

            {/* Assurance Box */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '20px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiShield style={{ color: 'var(--primary-blue)', fontSize: '1.2rem' }} />
                <span>{product.warranty || '10 Year Warranty'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiTruck style={{ color: 'var(--primary-blue)', fontSize: '1.2rem' }} />
                <span>Same Day Nashik Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCheck style={{ color: 'var(--success)', fontSize: '1.2rem' }} />
                <span>100% Genuine Brand Box</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          padding: '36px',
          boxShadow: 'var(--card-shadow)',
          marginBottom: '48px'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', borderBottom: '2px solid var(--primary-blue)', display: 'inline-block', paddingBottom: '6px' }}>
            Technical Specifications
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {product.specifications && product.specifications.map((spec, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: idx % 2 === 0 ? 'var(--bg-secondary)' : 'transparent',
                borderRadius: '8px',
                fontSize: '0.92rem'
              }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{spec.key}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          padding: '36px',
          boxShadow: 'var(--card-shadow)',
          marginBottom: '48px'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiMessageSquare /> Customer Reviews & Ratings
          </h2>

          {/* Rating Summary Row */}
          {reviews.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '32px',
              alignItems: 'center',
              backgroundColor: 'var(--bg-secondary)',
              padding: '24px',
              borderRadius: '14px',
              marginBottom: '28px'
            }}>
              {/* Big Average */}
              <div style={{ textAlign: 'center', minWidth: '110px' }}>
                <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {avgRating}
                </div>
                <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', margin: '8px 0' }}>
                  {[1,2,3,4,5].map(n => (
                    <FiStar key={n} style={{
                      fill: n <= Math.round(avgRating) ? 'var(--accent-yellow)' : 'none',
                      color: n <= Math.round(avgRating) ? 'var(--accent-yellow)' : 'var(--border-color)',
                      fontSize: '1.1rem'
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {reviews.length} Verified Reviews
                </div>
              </div>

              {/* Breakdown Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ratingBreakdown.map(({ star, count }) => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
                    <span style={{ minWidth: '20px', color: 'var(--text-secondary)', textAlign: 'right' }}>{star}</span>
                    <FiStar style={{ fill: 'var(--accent-yellow)', color: 'var(--accent-yellow)', fontSize: '0.8rem', flexShrink: 0 }} />
                    <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%',
                        height: '100%',
                        backgroundColor: star >= 4 ? 'var(--success)' : star === 3 ? 'var(--accent-yellow)' : 'var(--danger)',
                        borderRadius: '4px',
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                    <span style={{ minWidth: '24px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {/* Reviews List */}
            <div>
              {reviews.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>
                  <FiStar style={{ fontSize: '2.5rem', opacity: 0.3, marginBottom: '8px', display: 'block' }} />
                  No reviews yet. Be the first verified buyer to share your experience!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {reviews.map((rev, i) => (
                    <div key={i} style={{
                      borderBottom: '1px solid var(--border-color)',
                      paddingBottom: '18px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{rev.userName}</span>
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '0.72rem',
                            backgroundColor: 'rgba(16,185,129,0.12)',
                            color: 'var(--success)',
                            padding: '2px 7px',
                            borderRadius: '20px',
                            fontWeight: 600
                          }}>
                            ✓ Verified Purchase
                          </span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
                        {[1,2,3,4,5].map((n) => (
                          <FiStar key={n} style={{
                            fill: n <= rev.rating ? 'var(--accent-yellow)' : 'none',
                            color: n <= rev.rating ? 'var(--accent-yellow)' : 'var(--border-color)'
                          }} />
                        ))}
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              height: 'fit-content'
            }}>
              {!user ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-secondary)' }}>
                  <FiStar style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.4 }} />
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Sign in to leave a review</div>
                  <a href="/login" className="btn btn-primary btn-sm">Sign In</a>
                </div>
              ) : canReview ? (
                <>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Write a Review</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--success)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    ✓ Verified Purchase — you can leave a review
                  </p>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label className="form-label">Your Rating</label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px', marginBottom: '8px' }}>
                        {[1,2,3,4,5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingInput(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                          >
                            <FiStar style={{
                              fill: star <= (hoverRating || ratingInput) ? 'var(--accent-yellow)' : 'none',
                              color: star <= (hoverRating || ratingInput) ? 'var(--accent-yellow)' : 'var(--border-color)',
                              fontSize: '1.8rem',
                              transition: 'all 0.15s'
                            }} />
                          </button>
                        ))}
                        <span style={{ alignSelf: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {['','Poor','Fair','Good','Very Good','Excellent'][hoverRating || ratingInput]}
                        </span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Review</label>
                      <textarea
                        rows={4}
                        placeholder="Share your experience — product quality, wiring safety, delivery speed..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="form-textarea"
                        required
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: '10px' }}
                    >
                      {reviewSubmitting ? 'Posting...' : '⭐ Submit Verified Review'}
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-secondary)' }}>
                  <FiShield style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--primary-blue)', opacity: 0.6 }} />
                  <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>Verified Purchase Only</div>
                  <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                    Only customers who have purchased and received this product can leave a review. This ensures all reviews are genuine.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '24px', color: 'var(--text-primary)' }}>
              Related Products in this Category
            </h2>
            <div className="grid-cols-4">
              {relatedProducts.map((prod) => (
                <ProductCard
                  key={prod._id || prod.id}
                  product={prod}
                  onToast={onToast}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
