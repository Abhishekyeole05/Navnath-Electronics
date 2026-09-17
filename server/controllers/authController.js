const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User, dbHelper } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'navnath_super_secret_jwt_key_2026';

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address.'
      });
    }

    const user = await dbHelper.findOne('users', User, { email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await dbHelper.findByIdAndUpdate(
      'users',
      User,
      user._id || user.id,
      {
        resetPasswordToken: resetToken,
        resetPasswordExpires
      }
    );

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await emailTransporter.sendMail({
      from: `"Navnath Electronics" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset - Navnath Electronics',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Password Reset Request</h2>

          <p>Hello ${user.name},</p>

          <p>
            We received a request to reset your password for your
            Navnath Electronics account.
          </p>

          <p>Click the button below to reset your password:</p>

          <a href="${resetLink}"
             style="
               display: inline-block;
               padding: 12px 20px;
               background: #2563eb;
               color: white;
               text-decoration: none;
               border-radius: 6px;
             ">
            Reset Password
          </a>

          <p style="margin-top: 20px;">
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore
            this email.
          </p>

          <p>Regards,<br>Navnath Electronics Team</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'Password reset link has been sent to your email.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to send password reset email.',
      error: error.message
    });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const user = await dbHelper.findOne('users', User, {
      resetPasswordToken: token
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.'
      });
    }

    const expiry = new Date(user.resetPasswordExpires).getTime();

    if (!user.resetPasswordExpires || Date.now() > expiry) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token has expired.'
      });
    }

    await dbHelper.findByIdAndUpdate(
      'users',
      User,
      user._id || user.id,
      {
        password: password,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    );

    res.json({
      success: true,
      message: 'Password has been reset successfully.'
    });

  } catch (error) {
    console.error('Reset password error:', error);

    res.status(500).json({
      success: false,
      message: 'Unable to reset password.',
      error: error.message
    });
  }
};
