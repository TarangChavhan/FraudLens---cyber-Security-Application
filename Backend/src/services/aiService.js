import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OPENAI_API_KEY || '';
const BASE_URL = (process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
const MODEL = process.env.OPENAI_MODEL || 'openrouter/auto';

async function callOpenAI(messages, temperature = 0.2) {
  if (!API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured in backend environment.');
  }

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      'HTTP-Referer': 'http://localhost:5000',
      'X-Title': 'FraudLens Cyber Security Platform',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  return content;
}

// Utility to parse JSON from AI responses (handles markdown codeblocks)
function extractJson(text) {
  try {
    const clean = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/i, '$1').trim();
    return JSON.parse(clean);
  } catch (err) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('Failed to parse AI JSON response: ' + text.slice(0, 150));
  }
}

/**
 * AI-powered analysis of suspicious URL, message, or link
 */
export async function analyzeUrlOrMessage(target) {
  const prompt = `You are a Senior Cyber Threat Intelligence Analyst for FraudLens National Cybercrime Portal.
Analyze the following target URL, domain, or message text for cybersecurity risks, phishing, scam intent, brand impersonation, and fraudulent patterns:

Target: "${target}"

Respond ONLY with a valid JSON object matching this exact schema (no markdown outside JSON):
{
  "score": <number between 0 and 100, where 100 is completely safe and 0 is extremely malicious>,
  "verdict": "<Safe | Suspicious | Dangerous>",
  "threatType": "<e.g., UPI Payment Phishing | Fake Bank Portal | Job Scam Link | Malware Distribution | Safe & Verified>",
  "summary": "<1-2 sentence concise explanation of why it is safe or risky>",
  "indicators": ["<Red flag 1>", "<Red flag 2>"],
  "recommendations": ["<Actionable safety recommendation 1>", "<Actionable safety recommendation 2>"]
}`;

  try {
    const raw = await callOpenAI([
      { role: 'system', content: 'You are a cybersecurity expert analyzing fraud URLs and messages. Always output valid JSON.' },
      { role: 'user', content: prompt }
    ]);
    const parsed = extractJson(raw);
    return {
      score: Math.max(0, Math.min(100, Number(parsed.score) || 50)),
      verdict: ['Safe', 'Suspicious', 'Dangerous'].includes(parsed.verdict) ? parsed.verdict : 'Suspicious',
      threatType: parsed.threatType || 'Suspicious Activity',
      summary: parsed.summary || 'Analyzed by FraudLens AI Threat Engine.',
      indicators: Array.isArray(parsed.indicators) ? parsed.indicators : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ['Do not click unknown links or share credentials.'],
      analyzedByAI: true,
    };
  } catch (err) {
    console.error('AI Link Analysis error, falling back to heuristic:', err.message);
    // Graceful fallback heuristic
    const lower = target.toLowerCase();
    const flags = ['login', 'verify', 'update', 'kyc', 'free', 'win', 'prize', 'urgent', 'otp', '.xyz', '.tk', 'bit.ly', 'apk'];
    const hits = flags.filter(f => lower.includes(f));
    const isHttps = lower.startsWith('https://');
    let score = 100 - hits.length * 20 - (isHttps ? 0 : 15);
    score = Math.max(0, Math.min(100, score));
    const verdict = score >= 75 ? 'Safe' : score >= 40 ? 'Suspicious' : 'Dangerous';
    return {
      score,
      verdict,
      threatType: hits.length > 0 ? 'Phishing / Suspicious Pattern' : 'Clean URL',
      summary: `Automated heuristic scan detected ${hits.length} risk indicators.`,
      indicators: hits.map(h => `Contains suspicious keyword/pattern: "${h}"`),
      recommendations: ['Do not provide OTP, passwords, or UPI PINs.', 'Verify official domain in browser address bar.'],
      analyzedByAI: false,
    };
  }
}

/**
 * AI-powered incident triage for submitted fraud reports
 */
export async function analyzeFraudReport({ type, description, location, link }) {
  const prompt = `You are a Cyber Crime Investigation Expert.
Analyze this citizen-submitted cyber fraud complaint:
Fraud Category: ${type}
Location: ${location}
Incident Description: "${description}"
Evidence Link: "${link || 'None provided'}"

Provide an intelligent threat triage in JSON format:
{
  "riskScore": <number 0 to 100, where 100 is catastrophic financial/identity damage>,
  "threatLevel": "<Low | Medium | High | Critical>",
  "verdict": "<Short classification, e.g. Social Engineering UPI Scam>",
  "summary": "<2-sentence analysis of the modus operandi>",
  "countermeasures": ["<Immediate step 1 for victim>", "<Immediate step 2 for victim>", "<Immediate step 3 for victim>"],
  "investigationClues": ["<Forensic lead 1 for cyber police>", "<Forensic lead 2 for cyber police>"]
}`;

  try {
    const raw = await callOpenAI([
      { role: 'system', content: 'You are an Indian Cyber Police forensic investigator. Output valid JSON only.' },
      { role: 'user', content: prompt }
    ]);
    const parsed = extractJson(raw);
    return {
      riskScore: Number(parsed.riskScore) || 70,
      threatLevel: ['Low', 'Medium', 'High', 'Critical'].includes(parsed.threatLevel) ? parsed.threatLevel : 'Medium',
      verdict: parsed.verdict || type,
      summary: parsed.summary || 'Incident triaged by FraudLens AI Assistant.',
      countermeasures: Array.isArray(parsed.countermeasures) ? parsed.countermeasures : [
        'Call the National Cyber Crime Helpline at 1930 immediately.',
        'File an official complaint on cybercrime.gov.in.',
        'Inform your bank to freeze compromised accounts or cards.'
      ],
      investigationClues: Array.isArray(parsed.investigationClues) ? parsed.investigationClues : [
        'Trace originating IP and communication handles.',
        'Verify transaction reference with beneficiary bank.'
      ],
      analyzedAt: new Date(),
    };
  } catch (err) {
    console.error('AI Report Analysis error:', err.message);
    return {
      riskScore: 65,
      threatLevel: 'Medium',
      verdict: type,
      summary: 'Automated triage based on reported cyber fraud description.',
      countermeasures: [
        'Call the National Cyber Crime Helpline 1930 immediately.',
        'Lodge a formal report at cybercrime.gov.in.',
        'Block related cards and update bank netbanking credentials.'
      ],
      investigationClues: [
        'Inspect transaction references and associated phone numbers.'
      ],
      analyzedAt: new Date(),
    };
  }
}

/**
 * AI Cyber Safety Assistant / Guidance Chat
 */
export async function askCyberAssistant(messages) {
  const systemPrompt = `You are FraudLens AI Cyber Safety Advisor, an official cybercrime guidance assistant for citizens and cyber fraud victims.
Your mission is to help people protect themselves, identify scams (phishing, UPI fraud, job scams, digital arrest scams, loan app extortion, deepfake impersonation), and give urgent step-by-step guidance if they have been scammed.
Always mention the Indian National Cyber Crime Helpline 1930 and website cybercrime.gov.in when someone lost money or is actively under attack.
Be supportive, clear, professional, and practical. Use formatting with bullet points.`;

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-8)
  ];

  return await callOpenAI(formattedMessages, 0.4);
}
