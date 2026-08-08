const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const studentRoutes = require('../routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Body Parsing Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 2. Mount API Routes FIRST (CRITICAL: Must be above express.static)
app.use('/api', studentRoutes);

// 3. Serve Static Files SECOND
app.use(express.static(path.join(__dirname, '../')));

// Connect to MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://phani543_db_user:ZgdNnThtCJKuTuK9@saitechno.lxh9qrs.mongodb.net/Saitechnoschool?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => console.error('MongoDB Atlas connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
