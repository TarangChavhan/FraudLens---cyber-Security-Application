import LinkCheck from '../models/LinkCheck.js';
import { analyzeUrlOrMessage, analyzeFraudReport, askCyberAssistant } from '../services/aiService.js';

export async function handleAnalyzeLink(req, res) {
  try {
    const { url } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ success: false, message: 'URL or message is required' });
    }

    const target = url.trim();
    // Run AI analysis
    const aiResult = await analyzeUrlOrMessage(target);

    // Save check result into MongoDB LinkCheck collection
    const linkRecord = new LinkCheck({
      url: target,
      score: aiResult.score,
      verdict: aiResult.verdict,
      threatType: aiResult.threatType,
      summary: aiResult.summary,
      hits: aiResult.indicators,
      recommendations: aiResult.recommendations,
      analyzedByAI: aiResult.analyzedByAI,
      checkedBy: req.user ? req.user._id : null,
    });

    const saved = await linkRecord.save();

    res.json({
      success: true,
      data: saved,
    });
  } catch (error) {
    console.error('Error analyzing link:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze link', error: error.message });
  }
}

export async function handleAnalyzeReport(req, res) {
  try {
    const { type, description, location, link } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: 'Incident description is required' });
    }

    const analysis = await analyzeFraudReport({ type, description, location, link });
    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error analyzing report:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze report', error: error.message });
  }
}

export async function handleChat(req, res) {
  try {
    const { message, messages } = req.body;

    let chatMessages = [];
    if (Array.isArray(messages) && messages.length > 0) {
      chatMessages = messages;
    } else if (message) {
      chatMessages = [{ role: 'user', content: message }];
    } else {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const reply = await askCyberAssistant(chatMessages);
    res.json({ success: true, reply });
  } catch (error) {
    console.error('Error in AI chat assistant:', error);
    res.status(500).json({ success: false, message: 'AI chat assistant failed', error: error.message });
  }
}

export async function getCheckHistory(req, res) {
  try {
    const history = await LinkCheck.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching check history:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve check history', error: error.message });
  }
}
