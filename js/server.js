const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// Import routes relative to the js/ directory
const studentRoutes = require('../routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. Mount API routes FIRST under '/api' prefix to prevent static route conflicts
app.use('/api', studentRoutes);

// 2. Serve static frontend files from 'public' directory (one level up from js/)
app.use(express.static(path.join(__dirname, '../public')));

// Connect to MongoDB Atlas (Saitechnoschool Database)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://phani543_db_user:ZgdNnThtCJKuTuK9@saitechno.lxh9qrs.mongodb.net/Saitechnoschool?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to Saitechnoschool database on MongoDB Atlas!'))
  .catch((err) => console.error('MongoDB Atlas connection error:', err));

// Start Node server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
