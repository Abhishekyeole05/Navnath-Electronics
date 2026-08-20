const jwt = require('jsonwebtoken');
const { User, dbHelper } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'navnath_super_secret_jwt_key_2026';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = await dbHelper.findOne('users', User, { email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const newUser = await dbHelper.create('users', User, {
      name,
      email,
      password, // Note: In production, hash with bcrypt
      phone: phone || '',
      role: 'customer',
      addresses: [],
      wishlist: []
    });

    const token = generateToken(newUser);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id || newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        addresses: newUser.addresses || [],
        wishlist: newUser.wishlist || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await dbHelper.findOne('users', User, { email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password. Try admin@navnath.com / admin123' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
        wishlist: user.wishlist || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await dbHelper.findById('users', User, req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
        wishlist: user.wishlist || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
};

exports.updateAddresses = async (req, res) => {
  try {
    const { addresses } = req.body;
    const updatedUser = await dbHelper.findByIdAndUpdate('users', User, req.user.id, { addresses });
    res.json({
      success: true,
      addresses: updatedUser.addresses || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update address' });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await dbHelper.findById('users', User, req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let wishlist = user.wishlist || [];
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      wishlist.push(productId);
    }

    await dbHelper.findByIdAndUpdate('users', User, req.user.id, { wishlist });
    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update wishlist' });
  }
};
