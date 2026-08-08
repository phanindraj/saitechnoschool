const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define or reuse existing Student Model
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

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

// GET /api/students - Fetch all students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    return res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve students from database.' });
  }
});

// POST /api/add-student - Register new student
router.post('/add-student', async (req, res) => {
  try {
    const { rollNo, name, dob, classSec, guardian, contact, grade } = req.body;

    if (!rollNo || !name || !dob || !classSec || !guardian || !contact) {
      return res.status(400).json({
        success: false,
        error: 'All required fields must be provided.'
      });
    }

    const gradeClassValue = grade === 'Grade A+' ? 'excellent' : 'good';

    const newStudent = new Student({
      rollNo,
      name,
      dob,
      classSec,
      guardian,
      contact,
      grade: grade || 'Grade A',
      gradeClass: gradeClassValue
    });

    const savedStudent = await newStudent.save();
    console.log(`Successfully created student: ${savedStudent.name}`);

    return res.status(201).json({
      success: true,
      message: 'Student record successfully saved!',
      student: savedStudent
    });
  } catch (error) {
    console.error('Error saving student:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while saving record.'
    });
  }
});

module.exports = router;
