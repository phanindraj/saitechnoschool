const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Student Schema & Model
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

const Student = mongoose.model('Student', studentSchema);

// GET /api/students - Fetch all student records from MongoDB Atlas
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch student records.' });
  }
});

// POST /api/add-student - Save new student to MongoDB Atlas
router.post('/add-student', async (req, res) => {
  try {
    const newStudent = new Student({
      rollNo: req.body.rollNo,
      name: req.body.name,
      dob: req.body.dob,
      classSec: req.body.classSec,
      guardian: req.body.guardian,
      contact: req.body.contact,
      grade: req.body.grade || 'Grade A',
      gradeClass: req.body.grade === 'Grade A+' ? 'excellent' : 'good'
    });

    await newStudent.save();
    console.log(`Saved student ${newStudent.name} to Saitechnoschool database.`);
    
    // Send JSON response for AJAX fetch requests
    res.status(201).json({ success: true, message: 'Student saved successfully.' });
  } catch (error) {
    console.error('Error saving student:', error);
    res.status(500).json({ error: 'Failed to save student record to MongoDB Atlas.' });
  }
});

module.exports = router;
