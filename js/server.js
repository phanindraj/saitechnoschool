const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Reads your MongoDB Atlas connection string securely from environment variable
const MONGO_URI = mongodb+srv://phani543_db_user:ZgdNnThtCJKuTuK9@saitechno.lxh9qrs.mongodb.net/?appName=SaiTechno;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('MongoDB Atlas connection error:', err));

// Student Schema & Model
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

// GET API: Fetch students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student data.' });
  }
});

// POST API: Save student
app.post('/api/add-student', async (req, res) => {
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
    res.redirect('/students.html');
  } catch (error) {
    res.status(500).send('Error saving student to MongoDB Atlas.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
