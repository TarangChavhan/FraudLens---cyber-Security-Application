import User from '../models/User.js';
import Report from '../models/Report.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });
    const resolvedReports = await Report.countDocuments({ status: 'Solved' });
    const inProgressReports = await Report.countDocuments({ status: 'In Progress' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalReports,
        pendingReports,
        resolvedReports,
        inProgressReports,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExpertsList = async (req, res) => {
  try {
    const experts = await User.find({ role: 'CYBER_EXPERT' }).select('name email mobile');
    res.json({ success: true, data: experts });
  } catch (error) {
    console.error('Error fetching experts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
