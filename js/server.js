const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const studentRoutes = require('../routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Enable CORS for all origins (Allows GitHub Pages to communicate with Render)
app.use(cors());

// 2. Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Mount API Routes BEFORE static assets
app.use('/api', studentRoutes);

// 4. Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

// Fallback home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://phani543_db_user:ZgdNnThtCJKuTuK9@saitechno.lxh9qrs.mongodb.net/Saitechnoschool?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((err) => {
    console.error('================ MONGODB CONNECTION ERROR ================');
    console.error(err.message);
    console.error('==========================================================');
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
