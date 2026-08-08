const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Schema for Student records
const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true },
  name: { type: String, required: true },
  dob: { type: String, required: true },
  classSec: { type: String, required: true },
  guardian: { type: String, required: true },
  contact: { type: String, required: true },
  grade: { type: String, default: 'Grade A' },
  gradeClass: { type: String, default: 'good' },
  createdAt: { type: Date, default: Date.now }
});

// Bind to 'students' collection inside 'Saitechnoschool' DB
const Student = mongoose.model('Student', studentSchema);

// POST /api/add-student — Save student data
router.post('/add-student', async (req, res) => {
  try {
    const { rollNo, name, dob, classSec, guardian, contact, grade } = req.body;

    // Node.js Mongoose Instance creation
    const newStudent = new Student({
      rollNo,
      name,
      dob,
      classSec,
      guardian,
      contact,
      grade: grade || 'Grade A',
      gradeClass: grade === 'Grade A+' ? 'excellent' : 'good'
    });

    // Save document to MongoDB Atlas
    const savedStudent = await newStudent.save();
    console.log('Saved to MongoDB Atlas:', savedStudent.name);

    // Return success response to frontend
    res.status(201).json({
      success: true,
      message: 'Student record saved successfully!',
      student: savedStudent
    });
  } catch (error) {
    console.error('Database save error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save student data to MongoDB Atlas.'
    });
  }
});

module.exports = router;
