const { Category, Service, Booking, dbHelper } = require('../models');

exports.getCategories = async (req, res) => {
  try {
    const categories = await dbHelper.find('categories', Category);
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await dbHelper.find('services', Service);
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};

exports.bookService = async (req, res) => {
  try {
    const { 
      name, fullName, phone, mobile, address, street, 
      serviceId, serviceName, serviceTitle, preferredDate, date, 
      timeSlot, message, notes 
    } = req.body;

    const customerName = name || fullName || (req.user && req.user.name);
    const customerPhone = mobile || phone || (req.user && req.user.phone);
    const serviceAddr = address || street;
    const targetServiceId = serviceId;
    const targetDate = preferredDate || date || new Date().toISOString().split('T')[0];

    if (!customerName || !customerPhone || !serviceAddr) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking fields (name, phone, address).' });
    }

    const bookingId = 'BOOK-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = await dbHelper.create('bookings', Booking, {
      bookingId,
      userId: req.user ? req.user.id : (req.body.userId || 'guest'),
      name: customerName,
      mobile: customerPhone,
      address: serviceAddr,
      serviceId: targetServiceId || 'general-electrical-service',
      serviceName: serviceName || serviceTitle || 'Electrical Service & Repair',
      preferredDate: targetDate,
      message: message || notes || (timeSlot ? `Time Slot: ${timeSlot}` : ''),
      status: 'Pending',
      technicianName: 'Pending Assignment',
      estimatedCharge: 'As per inspection'
    });

    res.status(201).json({
      success: true,
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit service booking', error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const allBookings = await dbHelper.find('bookings', Booking);
    const userIdStr = String(req.user.id || req.user._id || '');
    const userPhone = String(req.user.phone || '').trim();
    const userEmail = String(req.user.email || '').trim().toLowerCase();

    const bookings = allBookings.filter(b => {
      if (b.userId && String(b.userId) === userIdStr) return true;
      if (userPhone && String(b.mobile || b.phone || '').trim() === userPhone) return true;
      if (userEmail && String(b.email || '').trim().toLowerCase() === userEmail) return true;
      return false;
    });

    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user bookings' });
  }
};
