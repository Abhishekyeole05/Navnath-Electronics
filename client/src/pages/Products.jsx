import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/common/ProductCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useLanguage } from '../context/LanguageContext';
import { FiFilter, FiX, FiSearch, FiSliders } from 'react-icons/fi';

const Products = ({ onToast }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const { tCategory } = useLanguage();


  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpenMobile, setIsFilterOpenMobile] = useState(false);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState(queryParams.get('brand') || 'all');
  const [searchTerm, setSearchTerm] = useState(queryParams.get('search') || '');
  const [maxPrice, setMaxPrice] = useState(20000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('default');

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(queryParams.get('category') || 'all');
    setSelectedBrand(queryParams.get('brand') || 'all');
    setSearchTerm(queryParams.get('search') || '');
  }, [location.search]);

  // Load Categories & Brands
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products/brands')
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (brandRes.data.success) setBrands(brandRes.data.brands);
      } catch (err) {
        console.warn('Failed to load filter metadata');
      }
    };
    fetchMeta();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
        if (selectedBrand && selectedBrand !== 'all') params.append('brand', selectedBrand);
        if (searchTerm) params.append('search', searchTerm);
        if (maxPrice < 20000) params.append('maxPrice', maxPrice);
        if (minRating > 0) params.append('minRating', minRating);
        if (inStockOnly) params.append('inStock', 'true');
        if (sortOption !== 'default') params.append('sort', sortOption);

        const res = await axios.get(`/api/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.warn('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedBrand, searchTerm, maxPrice, minRating, inStockOnly, sortOption]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSearchTerm('');
    setMaxPrice(20000);
    setMinRating(0);
    setInStockOnly(false);
    setSortOption('default');
    navigate('/products');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', padding: '40px 0' }}>
      <div className="container">
        {/* Top Breadcrumb & Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Home / <strong>Electrical Products Catalog</strong>
            </div>
            <h1 style={{ fontSize: '1.9rem', color: 'var(--text-primary)' }}>
              {selectedCategory === 'all' ? 'All Electrical Products' : `Category: ${selectedCategory.replace('-', ' ').toUpperCase()}`}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Sort Select */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '8px 14px', fontSize: '0.88rem' }}
            >
              <option value="default">Sort by: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpenMobile(!isFilterOpenMobile)}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* Sidebar Filters */}
          <aside style={{
            width: '280px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--card-shadow)',
            flexShrink: 0
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: '14px',
              marginBottom: '20px'
            }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiSliders /> Filter Products
              </span>
              <button
                onClick={handleClearFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-blue)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reset All
              </button>
            </div>

            {/* 1. Category Filter */}
            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ marginBottom: '10px' }}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  navigate(e.target.value === 'all' ? '/products' : `/products?category=${e.target.value}`);
                }}
                className="form-select"
                style={{ fontSize: '0.88rem' }}
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c._id || c.slug} value={c.slug}>{tCategory(c.name)}</option>
                ))}
              </select>
            </div>

            {/* 2. Brand Filter */}
            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ marginBottom: '10px' }}>Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="form-select"
                style={{ fontSize: '0.88rem' }}
              >
                <option value="all">All Brands</option>
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* 3. Max Price Slider */}
            <div className="form-group" style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label">Max Price</label>
                <span style={{ fontWeight: 700, color: 'var(--primary-blue)', fontSize: '0.9rem' }}>
                  ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="20000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            {/* 4. Minimum Rating */}
            <div className="form-group" style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ marginBottom: '10px' }}>Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="form-select"
                style={{ fontSize: '0.88rem' }}
              >
                <option value={0}>Any Rating</option>
                <option value={4}>4.0+ Stars & Above</option>
                <option value={4.5}>4.5+ Stars & Above</option>
                <option value={4.8}>4.8+ Top Rated Only</option>
              </select>
            </div>

            {/* 5. In Stock Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input
                type="checkbox"
                id="inStockCheck"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="inStockCheck" style={{ fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                In Stock Products Only
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main style={{ flex: 1 }}>
            {loading ? (
              <SkeletonLoader count={6} />
            ) : products.length === 0 ? (
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                padding: '60px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No matching electrical products found</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Try adjusting your filters or searching for different terms like "Havells", "Switch", or "Pump".
                </p>
                <button onClick={handleClearFilters} className="btn btn-primary">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Showing <strong>{products.length}</strong> products
                </div>

                <div className="grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                      onToast={onToast}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
