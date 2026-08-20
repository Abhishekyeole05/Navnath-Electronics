import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/common/ProductCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { FiArrowRight } from 'react-icons/fi';

const FeaturedProducts = ({ onToast }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('/api/products?featured=true');
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.warn('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '36px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <span className="badge badge-yellow" style={{ marginBottom: '8px' }}>
              BESTSELLERS IN NASHIK
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>
              Featured Electrical Products
            </h2>
          </div>

          <Link
            to="/products"
            className="btn btn-outline"
            style={{ padding: '10px 22px' }}
          >
            View All 1,500+ Products <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={4} />
        ) : (
          <div className="grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onToast={onToast}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
