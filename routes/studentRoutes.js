const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Schema matching the form fields in add-student.html
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

// Create model bound to 'students' collection in 'Saitechnoschool' DB
const Student = mongoose.model('Student', studentSchema);

// --------------------------------------------------
// GET /api/students — Fetch all student records
// --------------------------------------------------
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    return res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch student records from database.'
    });
  }
});

// --------------------------------------------------
// POST /api/add-student — Save new student entry
// --------------------------------------------------
router.post('/add-student', async (req, res) => {
  try {
    const { rollNo, name, dob, classSec, guardian, contact, grade } = req.body;

    // Validate required fields explicitly
    if (!rollNo || !name || !dob || !classSec || !guardian || !contact) {
      return res.status(400).json({
        success: false,
        error: 'Missing required form fields. Please fill out all required inputs.'
      });
    }

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

    const savedStudent = await newStudent.save();
    console.log(`Successfully saved student: ${savedStudent.name}`);

    // ALWAYS return explicit JSON with HTTP 201 Created
    return res.status(201).json({
      success: true,
      message: 'Student record saved successfully!',
      student: savedStudent
    });

  } catch (error) {
    console.error('Error saving student to MongoDB:', error);
    
    // ALWAYS return explicit JSON on failure (prevents HTML error pages)
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error while saving student to MongoDB Atlas.'
    });
  }
});

module.exports = router;
