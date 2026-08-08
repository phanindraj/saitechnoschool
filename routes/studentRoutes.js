const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Student Schema & Model matching form inputs
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

// Binds to 'students' collection inside 'Saitechnoschool' DB
const Student = mongoose.model('Student', studentSchema);

// GET /api/students — Fetch all students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch student records.' });
  }
});

// POST /api/add-student — Save new student data to MongoDB
router.post('/add-student', async (req, res) => {
  try {
    const { rollNo, name, dob, classSec, guardian, contact, grade } = req.body;

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
    console.log(`Saved student record: ${savedStudent.name}`);

    // Return JSON response for frontend fetch handler
    res.status(201).json({
      success: true,
      message: 'Student record saved successfully!',
      student: savedStudent
    });
  } catch (error) {
    console.error('Error saving student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save student record to MongoDB Atlas.'
    });
  }
});

module.exports = router;
