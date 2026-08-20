import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FiActivity, FiToggleRight, FiSun, FiWind, FiSliders, FiCpu, FiHome, FiArrowRight 
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const iconMap = {
  FiActivity: <FiActivity />,
  FiToggleRight: <FiToggleRight />,
  FiSun: <FiSun />,
  FiWind: <FiWind />,
  FiSliders: <FiSliders />,
  FiCpu: <FiCpu />,
  FiHome: <FiHome />
};

const ProductCategoriesGrid = () => {
  const [categories, setCategories] = useState([]);
  const { tCategory } = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.warn('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);


  return (
    <section style={{ padding: '70px 0', backgroundColor: 'var(--bg-main)' }}>
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
            <span className="badge badge-blue" style={{ marginBottom: '8px' }}>
              OUR ELECTRICAL CATALOG
            </span>
            <h2 style={{ fontSize: '2.1rem', color: 'var(--text-primary)' }}>
              Shop by Electrical Category
            </h2>
          </div>

          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 700,
              color: 'var(--primary-blue)',
              fontSize: '0.95rem'
            }}
          >
            View Full Catalog <FiArrowRight />
          </Link>
        </div>

        {/* Categories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          {categories.map((cat) => (
            <Link
              key={cat._id || cat.slug}
              to={`/products?category=${cat.slug}`}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'var(--card-shadow)',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--hover-shadow)';
                e.currentTarget.style.borderColor = 'var(--primary-blue)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--card-shadow)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: 'rgba(11, 61, 145, 0.08)',
                color: 'var(--primary-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                marginBottom: '18px'
              }}>
                {iconMap[cat.icon] || <FiActivity />}
              </div>

              <h3 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '6px'
              }}>
                {tCategory(cat.name)}
              </h3>

              <p style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
                marginBottom: '16px',
                flex: 1
              }}>
                {cat.description}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--primary-blue)'
              }}>
                <span>Explore Products</span>
                <FiArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategoriesGrid;
