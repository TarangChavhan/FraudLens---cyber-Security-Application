import fs from 'fs';
import path from 'path';

const src = process.cwd();

const files = {
  '.env': `PORT=5000
MONGODB_URI=mongodb://localhost:27017/fraudlens
JWT_SECRET=supersecret123
`,
  'src/middleware/auth.js': `import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-passwordHash');
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};

export const expert = (req, res, next) => {
  if (req.user && (req.user.role === 'CYBER_EXPERT' || req.user.role === 'ADMIN')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an expert' });
  }
};
`,
  'src/models/CyberExpert.js': `import mongoose from 'mongoose';

const cyberExpertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  casesResolved: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('CyberExpert', cyberExpertSchema);
`,
  'src/models/Guideline.js': `import mongoose from 'mongoose';

const guidelineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Guideline', guidelineSchema);
`,
  'src/models/URLCheck.js': `import mongoose from 'mongoose';

const urlCheckSchema = new mongoose.Schema({
  url: { type: String, required: true },
  status: { type: String, enum: ['SAFE', 'SUSPICIOUS', 'MALICIOUS'], required: true },
  checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: { type: String },
}, { timestamps: true });

export default mongoose.model('URLCheck', urlCheckSchema);
`,
  'src/models/ReportUpdate.js': `import mongoose from 'mongoose';

const reportUpdateSchema = new mongoose.Schema({
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  updateText: { type: String, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('ReportUpdate', reportUpdateSchema);
`,
  'src/routes/authRoutes.js': `import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;
`,
  'src/routes/adminRoutes.js': `import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { getDashboardStats } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);

export default router;
`,
  'src/routes/expertRoutes.js': `import express from 'express';
import { protect, expert } from '../middleware/auth.js';
import { getExpertCases } from '../controllers/expertController.js';

const router = express.Router();

router.get('/cases', protect, expert, getExpertCases);

export default router;
`,
  'src/routes/guidelineRoutes.js': `import express from 'express';
import { getGuidelines, createGuideline } from '../controllers/guidelineController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getGuidelines).post(protect, admin, createGuideline);

export default router;
`,
  'src/controllers/authController.js': `import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, mobile, passwordHash, role });
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.json({ success: true, user, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
`,
  'src/controllers/adminController.js': `import User from '../models/User.js';
import Report from '../models/Report.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    res.json({ success: true, stats: { totalUsers, totalReports } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
`,
  'src/controllers/expertController.js': `import Report from '../models/Report.js';

export const getExpertCases = async (req, res) => {
  try {
    const reports = await Report.find({ expert: req.user.name });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
`,
  'src/controllers/guidelineController.js': `import Guideline from '../models/Guideline.js';

export const getGuidelines = async (req, res) => {
  try {
    const guidelines = await Guideline.find({});
    res.json({ success: true, guidelines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGuideline = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const guideline = await Guideline.create({ title, content, category, createdBy: req.user._id });
    res.status(201).json({ success: true, guideline });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});

console.log('Files generated successfully.');
