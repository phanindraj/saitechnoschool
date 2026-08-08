const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Path pointing to student/student.txt inside the project directory
const STUDENT_DIR = path.join(__dirname, 'student');
const DATA_FILE = path.join(STUDENT_DIR, 'student.txt');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Ensure 'student' directory and 'student.txt' exist
if (!fs.existsSync(STUDENT_DIR)) {
  fs.mkdirSync(STUDENT_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// GET API: Fetch students from student/student.txt
app.get('/api/students', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read student records.' });
    res.json(JSON.parse(data || '[]'));
  });
});

// POST API: Save new student into student/student.txt
app.post('/api/add-student', (req, res) => {
  const newStudent = {
    rollNo: req.body.rollNo,
    name: req.body.name,
    dob: req.body.dob,
    classSec: req.body.classSec,
    guardian: req.body.guardian,
    contact: req.body.contact,
    grade: req.body.grade || 'Grade A',
    gradeClass: req.body.grade === 'Grade A+' ? 'excellent' : 'good'
  };

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    let students = [];
    if (!err && data) {
      try {
        students = JSON.parse(data);
      } catch (e) {
        students = [];
      }
    }

    students.push(newStudent);

    // Save updated array to student/student.txt
    fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), (err) => {
      if (err) return res.status(500).send('Error saving student details to server.');
      res.redirect('/students.html');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
