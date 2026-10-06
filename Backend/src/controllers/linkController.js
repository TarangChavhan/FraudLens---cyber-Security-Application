import LinkCheck from '../models/LinkCheck.js';

export const SUSPICIOUS_HINTS = [
  'login',
  'verify',
  'update',
  'free',
  'prize',
  'win',
  'bonus',
  'kyc',
  'urgent',
  'otp',
  'bit.ly',
  'tinyurl',
  '.xyz',
  '.tk',
  '.info',
  'secure-',
  '-secure',
];

// POST /api/check-link - Analyze link safety and persist in MongoDB
export async function checkLink(req, res) {
  try {
    const { url } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ success: false, message: 'URL is required for verification' });
    }

    const target = url.trim();
    const lower = target.toLowerCase();
    const hits = SUSPICIOUS_HINTS.filter((h) => lower.includes(h));
    const isHttps = lower.startsWith('https://');

    let score = 100 - hits.length * 20 - (isHttps ? 0 : 15);
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    const verdict = score >= 70 ? 'Safe' : score >= 40 ? 'Suspicious' : 'Dangerous';

    const checkRecord = new LinkCheck({
      url: target,
      score,
      verdict,
      hits,
    });

    const saved = await checkRecord.save();

    res.json({
      success: true,
      data: {
        id: saved._id,
        url: saved.url,
        score: saved.score,
        verdict: saved.verdict,
        hits: saved.hits,
        checkedAt: saved.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in checkLink:', error);
    res.status(500).json({ success: false, message: 'Failed to verify link', error: error.message });
  }
}

// GET /api/check-history - Get recent verified links
export async function getLinkHistory(req, res) {
  try {
    const history = await LinkCheck.find().sort({ createdAt: -1 }).limit(10);
    res.json({
      success: true,
      count: history.length,
      data: history.map((item) => ({
        id: item._id,
        url: item.url,
        score: item.score,
        verdict: item.verdict,
        hits: item.hits,
        checkedAt: item.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching link history:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve check history', error: error.message });
  }
}
