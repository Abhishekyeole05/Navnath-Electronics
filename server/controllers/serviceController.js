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
    const { name, mobile, address, serviceId, serviceName, preferredDate, message } = req.body;
    if (!name || !mobile || !address || !serviceId || !preferredDate) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking fields.' });
    }

    const bookingId = 'BOOK-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = await dbHelper.create('bookings', Booking, {
      bookingId,
      userId: req.user ? req.user.id : null,
      name,
      mobile,
      address,
      serviceId,
      serviceName,
      preferredDate,
      message: message || '',
      status: 'Pending',
      technicianName: 'Pending Assignment',
      estimatedCharge: 'As per inspection'
    });

    res.status(201).json({
      success: true,
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit service booking' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await dbHelper.find('bookings', Booking, { userId: req.user.id });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user bookings' });
  }
};
