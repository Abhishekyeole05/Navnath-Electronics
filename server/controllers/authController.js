const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User, dbHelper } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'navnath_super_secret_jwt_key_2026';

const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter (a-z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*).' };
  }
  return { valid: true };
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    let { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ success: false, message: passwordValidation.message });
    }

    email = email.trim().toLowerCase();

    const existingUser = await dbHelper.findOne('users', User, { email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await dbHelper.create('users', User, {
      name,
      email,
      password: hashedPassword,
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
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    email = email.trim().toLowerCase();

    const user = await dbHelper.findOne('users', User, { email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    let isMatch = false;
    const looksHashed = user.password && user.password.startsWith('$2');

    if (looksHashed) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = (user.password === password);
      if (isMatch) {
        const rehashed = await bcrypt.hash(password, 10);
        await dbHelper.findByIdAndUpdate('users', User, user._id || user.id, { password: rehashed });
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
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
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address.'
      });
    }

    email = email.trim().toLowerCase();

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

    const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${origin}/reset-password/${resetToken}`;

    const emailUser = process.env.EMAIL_USER || 'abhishekyeole9975@gmail.com';
    const emailPass = process.env.EMAIL_PASS;

    let emailSent = false;
    let mailErrorMessage = null;

    if (emailPass && emailPass.trim()) {
      try {
        const cleanPass = emailPass.replace(/\s+/g, '');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: emailUser,
            pass: cleanPass
          }
        });

        await transporter.sendMail({
          from: `"New Navnath Electricals" <${emailUser}>`,
          to: user.email,
          subject: '🔑 Password Reset Request - New Navnath Electricals',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #0b3d91; margin: 0;">NEW NAVNATH</h2>
                <p style="color: #64748b; font-size: 0.85rem; margin-top: 4px;">Electronics & Electricals — Manmad</p>
              </div>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <h3 style="color: #1e293b;">Password Reset Request</h3>
              <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">Hello <strong>${user.name}</strong>,</p>
              <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">We received a request to reset your password for your account (<strong>${user.email}</strong>).</p>
              <p style="color: #334155; font-size: 0.95rem; line-height: 1.5;">Click the secure button below to create your new password:</p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="${resetLink}" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 1rem; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
                  🔒 Reset My Password Now
                </a>
              </div>
              <p style="color: #64748b; font-size: 0.85rem;">Or copy and paste this link in your browser:</p>
              <p style="font-size: 0.8rem; word-break: break-all; color: #2563eb;"><a href="${resetLink}">${resetLink}</a></p>
              <p style="color: #64748b; font-size: 0.85rem;">This link is secure and will expire in <strong>15 minutes</strong>.</p>
              <p style="color: #64748b; font-size: 0.85rem;">If you did not request a password reset, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 16px;" />
              <p style="color: #94a3b8; font-size: 0.78rem; text-align: center;">New Navnath Electronics & Electricals, Opposite Bus Stand, Manmad, Maharashtra 423104</p>
            </div>
          `
        });

        console.log(`📧 [Gmail Sent] Reset email successfully delivered to ${user.email}`);
        emailSent = true;
      } catch (mailError) {
        console.error('❌ Gmail SMTP Email delivery error:', mailError.message);
        mailErrorMessage = mailError.message;
      }
    } else {
      console.log(`ℹ️ [Email Note] EMAIL_PASS is not configured in server/.env. Generated direct reset link: ${resetLink}`);
    }

    return res.json({
      success: true,
      emailDelivery: emailSent ? 'sent' : (mailErrorMessage ? 'failed_fallback' : 'direct'),
      resetLink,
      resetToken,
      message: emailSent
        ? `Password reset email sent to ${user.email}. Please check your Gmail inbox (or spam folder)!`
        : mailErrorMessage
          ? `Reset link ready! (Gmail delivery note: ${mailErrorMessage}). You can reset your password immediately below.`
          : `Password reset link created! You can reset your password immediately using the link below.`
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to process password reset request.',
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

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
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
        message: 'Password reset token has expired. Please request a new one.'
      });
    }

    const hashedNewPassword = await bcrypt.hash(password, 10);

    await dbHelper.findByIdAndUpdate(
      'users',
      User,
      user._id || user.id,
      {
        password: hashedNewPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    );

    res.json({
      success: true,
      message: 'Password has been reset successfully! You can now log in.'
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
