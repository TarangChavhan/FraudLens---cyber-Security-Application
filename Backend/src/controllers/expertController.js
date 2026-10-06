import Report from '../models/Report.js';
import ReportUpdate from '../models/ReportUpdate.js';

export const getExpertCases = async (req, res) => {
  try {
    const expertName = req.query.name || req.user?.name;
    let query = {};

    if (expertName) {
      query = { expert: new RegExp(`^${expertName}$`, 'i') };
    } else if (req.user?._id) {
      query = { $or: [{ expertId: req.user._id }, { expert: req.user.name }] };
    } else {
      // Return all cases that have an assigned expert or in progress
      query = { expert: { $ne: null } };
    }

    const reports = await Report.find(query).sort({ updatedAt: -1 });
    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    console.error('Error fetching expert cases:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInvestigation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, priority } = req.body;

    let query = {};
    if (!isNaN(Number(id))) {
      query = { id: Number(id) };
    } else {
      query = { _id: id };
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (priority) updateFields.priority = priority;
    if (notes) updateFields.notes = notes;

    const report = await Report.findOneAndUpdate(query, updateFields, { new: true });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (notes) {
      await ReportUpdate.create({
        report: report._id,
        updateText: notes,
        updatedBy: req.user ? req.user._id : report._id, // fallback to report id if unauthenticated demo
      });
    }

    res.json({ success: true, message: 'Investigation updated successfully', data: report });
  } catch (error) {
    console.error('Error updating investigation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
