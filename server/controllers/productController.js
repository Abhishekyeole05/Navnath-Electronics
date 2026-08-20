const { Product, Category, Review, dbHelper } = require('../models');

exports.getProducts = async (req, res) => {
  try {
    const { category, brand, search, minPrice, maxPrice, minRating, inStock, sort, featured } = req.query;
    let products = await dbHelper.find('products', Product);

    // Apply filters
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    if (brand && brand !== 'all') {
      products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }
    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }
    if (minRating) {
      products = products.filter(p => p.rating >= Number(minRating));
    }
    if (inStock === 'true') {
      products = products.filter(p => p.stock > 0);
    }
    if (featured === 'true') {
      products = products.filter(p => p.isFeatured === true);
    }

    // Apply sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await dbHelper.findById('products', Product, id);
    if (!product) {
      // Try searching by slug
      product = await dbHelper.findOne('products', Product, { slug: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = await dbHelper.find('reviews', Review, { productId: product._id || product.id });

    res.json({
      success: true,
      product,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching product details' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and review comment' });
    }

    const newReview = await dbHelper.create('reviews', Review, {
      productId,
      userId: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    });

    res.status(201).json({
      success: true,
      review: newReview
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    const products = await dbHelper.find('products', Product);
    const brands = [...new Set(products.map(p => p.brand))];
    res.json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch brands' });
  }
};
