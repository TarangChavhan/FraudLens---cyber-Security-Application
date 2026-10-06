import Report from '../models/Report.js';
import ReportUpdate from '../models/ReportUpdate.js';
import { analyzeFraudReport } from '../services/aiService.js';

// GET /api/reports - Fetch all reports (optional query filters: status, expert, search)
export async function getAllReports(req, res) {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.expert) {
      filter.expert = req.query.expert;
    }

    const reports = await Report.find(filter).sort({ id: -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve reports', error: error.message });
  }
}

// GET /api/reports/my - Fetch reports for logged-in user or by reporter email
export async function getMyReports(req, res) {
  try {
    const userEmail = req.user?.email || req.query.email;
    const userId = req.user?._id;

    let query = {};
    if (userId && userEmail) {
      query = { $or: [{ user: userId }, { reporterEmail: userEmail.toLowerCase() }] };
    } else if (userEmail) {
      query = { reporterEmail: userEmail.toLowerCase() };
    } else if (userId) {
      query = { user: userId };
    }

    const reports = await Report.find(query).sort({ id: -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error('Error fetching user reports:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve your reports', error: error.message });
  }
}

// GET /api/reports/:id - Fetch single report by numeric ID or Mongo _id
export async function getReportById(req, res) {
  try {
    const param = req.params.id;
    let report = null;

    if (!isNaN(Number(param))) {
      report = await Report.findOne({ id: Number(param) });
    }

    if (!report && param.match(/^[0-9a-fA-F]{24}$/)) {
      report = await Report.findById(param);
    }

    if (!report) {
      return res.status(404).json({ success: false, message: `Report #${param} not found` });
    }

    // Get any audit/investigation updates
    const updates = await ReportUpdate.find({ report: report._id }).populate('updatedBy', 'name role').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...report.toJSON(),
        updates,
      },
    });
  } catch (error) {
    console.error('Error fetching report details:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve report details', error: error.message });
  }
}

// POST /api/reports - Submit a new incident report to MongoDB with automated AI triage
export async function createReport(req, res) {
  try {
    const { title, reporter, reporterEmail, type, location, description, link } = req.body;

    const reporterName = reporter || req.user?.name;
    const email = (reporterEmail || req.user?.email || '').toLowerCase().trim();

    if (!reporterName || !reporterName.trim()) {
      return res.status(400).json({ success: false, message: 'Reporter name is required' });
    }
    if (!description || description.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 5 characters long',
      });
    }

    // Generate unique numeric ID
    const highestReport = await Report.findOne().sort({ id: -1 }).select('id');
    const newId = highestReport && highestReport.id ? Math.max(highestReport.id + 1, 101) : 101;

    const reportType = type || 'Other';
    const reportLocation = location || 'Mumbai';
    const reportLink = link ? link.trim() : '';

    // Run automated AI analysis on the report
    let aiAnalysis = null;
    try {
      aiAnalysis = await analyzeFraudReport({
        type: reportType,
        description: description.trim(),
        location: reportLocation,
        link: reportLink,
      });
    } catch (aiErr) {
      console.warn('AI analysis skipped for new report:', aiErr.message);
    }

    const report = new Report({
      id: newId,
      title: title ? title.trim() : `${reportType} Incident in ${reportLocation}`,
      reporter: reporterName.trim(),
      reporterEmail: email,
      user: req.user ? req.user._id : null,
      type: reportType,
      location: reportLocation,
      description: description.trim(),
      link: reportLink,
      status: 'Pending',
      priority: aiAnalysis?.threatLevel || 'Medium',
      expert: null,
      date: new Date().toISOString().slice(0, 10),
      aiAnalysis: aiAnalysis || undefined,
    });

    const saved = await report.save();
    res.status(201).json({ success: true, message: 'Report created and filed successfully with Cyber Crime Cell', data: saved });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ success: false, message: 'Failed to create report', error: error.message });
  }
}

// PATCH /api/reports/:id/expert - Appoint cyber expert to a case in MongoDB
export async function assignExpert(req, res) {
  try {
    const param = req.params.id;
    const { expert, expertId } = req.body;

    if (!expert || !expert.trim()) {
      return res.status(400).json({ success: false, message: 'Expert name is required' });
    }

    let query = {};
    if (!isNaN(Number(param))) {
      query = { id: Number(param) };
    } else {
      query = { _id: param };
    }

    const updated = await Report.findOneAndUpdate(
      query,
      {
        expert: expert.trim(),
        expertId: expertId || null,
        status: 'In Progress',
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: `Report #${param} not found` });
    }

    // Record an audit log if user is present
    if (req.user) {
      await ReportUpdate.create({
        report: updated._id,
        updateText: `Assigned Cyber Expert: ${expert.trim()}`,
        updatedBy: req.user._id,
      });
    }

    res.json({ success: true, message: 'Expert appointed successfully', data: updated });
  } catch (error) {
    console.error('Error appointing expert:', error);
    res.status(500).json({ success: false, message: 'Failed to assign expert', error: error.message });
  }
}

// PATCH /api/reports/:id/status - Update report status and notes in MongoDB
export async function updateReportStatus(req, res) {
  try {
    const param = req.params.id;
    const { status, notes, priority } = req.body;

    const validStatuses = ['Solved', 'Pending', 'In Progress'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    let query = {};
    if (!isNaN(Number(param))) {
      query = { id: Number(param) };
    } else {
      query = { _id: param };
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (priority) updateFields.priority = priority;
    if (notes !== undefined) updateFields.notes = notes;

    const updated = await Report.findOneAndUpdate(query, updateFields, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: `Report #${param} not found` });
    }

    // If notes were provided and user is authenticated, create a ReportUpdate record
    if (notes && req.user) {
      await ReportUpdate.create({
        report: updated._id,
        updateText: notes,
        updatedBy: req.user._id,
      });
    }

    res.json({ success: true, message: 'Status updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
}

// GET /api/reports/stats - Aggregated metrics calculated from MongoDB
export async function getReportStats(req, res) {
  try {
    const reports = await Report.find();
    const total = reports.length;
    const solved = reports.filter((r) => r.status === 'Solved').length;
    const pending = reports.filter((r) => r.status === 'Pending').length;
    const inProgress = reports.filter((r) => r.status === 'In Progress').length;

    res.json({
      success: true,
      data: {
        total,
        solved,
        pending,
        inProgress,
      },
    });
  } catch (error) {
    console.error('Error calculating report stats:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate stats', error: error.message });
  }
}
