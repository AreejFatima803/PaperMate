/**
 * PaperMate Backend - Node.js + Express + MongoDB (Mongoose)
 * 
 * To run:
 * 1. cd backend
 * 2. npm install express mongoose cors dotenv bcryptjs jsonwebtoken
 * 3. node server.js
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/papermate';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✓ Connected to MongoDB (papermate)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', UserSchema);

// Exam Paper Schema
const PaperSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  institutionName: String,
  boardName: String,
  className: String,
  subjectName: String,
  medium: String,
  syllabusScope: String,
  totalMarks: Number,
  timeAllowed: String,
  mcqSection: Object,
  shortSections: Array,
  longSection: Object,
  createdAt: { type: Date, default: Date.now },
});
const Paper = mongoose.model('Paper', PaperSchema);

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });
    const user = new User({ name, email, password });
    await user.save();
    res.json({ success: true, message: 'Account created successfully', user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Paper Routes
app.post('/api/papers/save', async (req, res) => {
  try {
    const paper = new Paper(req.body);
    await paper.save();
    res.json({ success: true, paper });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/papers/history', async (req, res) => {
  try {
    const papers = await Paper.find().sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/papers/:id', async (req, res) => {
  try {
    await Paper.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Paper deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PaperMate MongoDB API running on port ${PORT}`);
});
