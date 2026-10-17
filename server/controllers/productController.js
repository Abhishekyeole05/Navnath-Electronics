const { Product, Category, Review, Order, dbHelper } = require('../models');

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
      product = await dbHelper.findOne('products', Product, { slug: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const prodId = String(product._id || product.id);
    const allReviews = await dbHelper.find('reviews', Review);
    const reviews = allReviews.filter(r => 
      String(r.productId) === prodId || 
      String(r.productId) === String(product.slug) || 
      String(r.productId) === String(id)
    );

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

    let product = await dbHelper.findById('products', Product, productId);
    if (!product) {
      product = await dbHelper.findOne('products', Product, { slug: productId });
    }

    const targetProdId = product ? (product._id || product.id) : productId;

    const newReview = await dbHelper.create('reviews', Review, {
      productId: String(targetProdId),
      userId: req.user.id,
      userName: req.user.name || 'Customer',
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    });

    // Update product overall rating and reviews count in database
    if (product) {
      const allReviews = await dbHelper.find('reviews', Review);
      const prodReviews = allReviews.filter(r => String(r.productId) === String(targetProdId) || String(r.productId) === String(product.slug));
      const avgRating = Number((prodReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / (prodReviews.length || 1)).toFixed(1));
      
      await dbHelper.findByIdAndUpdate('products', Product, product._id || product.id, {
        rating: avgRating,
        reviewsCount: prodReviews.length
      });
    }

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

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const allReviews = await dbHelper.find('reviews', Review);
    const reviews = allReviews
      .filter(r => String(r.productId) === String(productId))
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const allReviews = await dbHelper.find('reviews', Review);
    const myReviews = allReviews.filter(r => String(r.userId) === String(req.user.id));
    res.json({ success: true, reviews: myReviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch your reviews' });
  }
};

exports.canReviewProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Check if user has a delivered order containing this product
    const allOrders = await dbHelper.find('orders', Order, { userId });
    const hasDeliveredOrder = allOrders.some(order => {
      const isDelivered = (order.orderStatus || '').toLowerCase() === 'delivered';
      if (!isDelivered) return false;
      const items = order.items || order.orderItems || [];
      return items.some(item => {
        const pid = String(item.productId || item.product || item._id || item.id || '');
        return pid === String(productId) || pid.includes(String(productId)) || String(productId).includes(pid);
      });
    });

    // Check if user already reviewed this product
    const allReviews = await dbHelper.find('reviews', Review);
    const alreadyReviewed = allReviews.some(
      r => String(r.userId) === String(userId) && String(r.productId) === String(productId)
    );

    res.json({
      success: true,
      canReview: hasDeliveredOrder && !alreadyReviewed,
      hasDeliveredOrder,
      alreadyReviewed
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to check review eligibility' });
  }
};
