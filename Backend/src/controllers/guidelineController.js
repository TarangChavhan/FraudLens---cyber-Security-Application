import Guideline from '../models/Guideline.js';

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
