const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import routes from the routes folder (relative to js/)
const studentRoutes = require('../routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware (CRITICAL for reading form & JSON payloads)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. Mount API Routes FIRST under '/api'
app.use('/api', studentRoutes);

// 2. Serve static frontend files directly from the root directory (one level up from js/)
app.use(express.static(path.join(__dirname, '../')));

// Serve index.html when visiting the root domain '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// MongoDB Atlas Connection URI
// Note: Replace <user> and <password> if hardcoding, or set MONGO_URI in Environment Variables
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://phani543_db_user:ZgdNnThtCJKuTuK9@saitechno.lxh9qrs.mongodb.net/Saitechnoschool?retryWrites=true&w=majority";

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to Saitechnoschool database on MongoDB Atlas!'))
  .catch((err) => {
    console.error('================ MONGODB CONNECTION ERROR ================');
    console.error('Message:', err.message);
    console.error('===========================================================');
  });

// Start Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
