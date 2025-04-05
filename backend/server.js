// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const registrationRoutes = require('./routes/registrations');

// Create an Express app
const app = express();

// Middleware
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://tech-mantra-admin.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventRegistration', { // Fallback URI for localhost
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Failed to connect to MongoDB:', err.message));

// Routes
app.use('/api/registrations', registrationRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000; // Fallback port for development
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
