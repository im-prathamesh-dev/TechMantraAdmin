const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// GET /api/registrations with optional filters
router.get('/', async (req, res) => {
  try {
    const { event, from, to } = req.query; // Extract query parameters
    let filter = {};

    // Add dynamic filter conditions
    if (event) filter.event = { $regex: event, $options: 'i' }; // Case-insensitive regex search
    if (from || to) {
      filter.registrationDate = {};
      if (from) filter.registrationDate.$gte = new Date(from); // Greater or equal to 'from' date
      if (to) filter.registrationDate.$lte = new Date(to); // Less or equal to 'to' date
    }

    // Fetch data, sort by registrationDate (descending order)
    const registrations = await Registration.find(filter).sort({ registrationDate: -1 });
    res.status(200).json(registrations); // Respond with filtered data
  } catch (err) {
    console.error('Error fetching registrations:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// PUT /api/registrations/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const updated = await Registration.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});


module.exports = router;
