const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'vrhvhwxa',
  api_key: process.env.CLOUDINARY_API_KEY || '921568992518143',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'FrP6jq7gUN_x1AiOFoc4Ded3d7w'
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sai-techno-school/teachers',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files (JPG, PNG, WebP) are allowed!'), false);
  }
});

// Define Mongoose Teacher Schema & Model
const teacherSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  qualification: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  remarks: { type: String, default: '' },
  photoPath: { type: String, default: '' } // Stores Cloudinary secure URL
}, { timestamps: true });

const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

// POST Route: Save Teacher Record & Upload Image to Cloudinary
router.post('/add-teacher', upload.single('photo'), async (req, res) => {
  try {
    const teacherData = { ...req.body };

    if (req.file) {
      teacherData.photoPath = req.file.path; // Cloudinary secure URL
    }

    const newTeacher = new Teacher(teacherData);
    await newTeacher.save();

    res.status(201).json({
      message: 'Teacher record and photo saved to Cloudinary & MongoDB successfully!',
      data: newTeacher
    });
  } catch (error) {
    console.error('Error saving teacher to MongoDB:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Employee ID already exists.' });
    }
    res.status(500).json({ error: 'Failed to process teacher registration.' });
  }
});

// GET Route: Fetch Teachers from MongoDB
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers from MongoDB:', error);
    res.status(500).json({ error: 'Failed to fetch staff details.' });
  }
});

module.exports = router;