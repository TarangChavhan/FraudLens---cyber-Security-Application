import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './src/models/User.js';
import Report from './src/models/Report.js';
import CyberExpert from './src/models/CyberExpert.js';
import Guideline from './src/models/Guideline.js';
import LinkCheck from './src/models/LinkCheck.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Report.deleteMany({});
    await CyberExpert.deleteMany({});
    await Guideline.deleteMany({});
    await LinkCheck.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      {
        name: 'Demo Citizen',
        email: 'user@example.com',
        mobile: '+91 9876543210',
        passwordHash,
        role: 'USER',
      },
      {
        name: 'Inspector Vikram Singh',
        email: 'admin@example.com',
        mobile: '+91 9123456780',
        passwordHash,
        role: 'ADMIN',
      },
      {
        name: 'Rahul Sharma (Senior Forensics)',
        email: 'expert@example.com',
        mobile: '+91 9988776655',
        passwordHash,
        role: 'CYBER_EXPERT',
      },
      {
        name: 'Priya Deshmukh (Threat Analyst)',
        email: 'priya@example.com',
        mobile: '+91 9988776644',
        passwordHash,
        role: 'CYBER_EXPERT',
      },
    ]);

    console.log(`Seeded ${users.length} users with credentials password123`);

    // Seed Cyber Experts
    await CyberExpert.insertMany([
      {
        user: users[2]._id,
        specialization: 'UPI & Banking Fraud Investigation',
        casesResolved: 18,
        availability: true,
      },
      {
        user: users[3]._id,
        specialization: 'Phishing & Identity Theft',
        casesResolved: 12,
        availability: true,
      },
    ]);
    console.log('Seeded cyber experts');

    // Seed Reports with AI triage details
    await Report.insertMany([
      {
        id: 101,
        title: 'Fake SBI KYC Update SMS with Phishing Link',
        reporter: 'Demo Citizen',
        reporterEmail: 'user@example.com',
        user: users[0]._id,
        type: 'UPI / Payment Fraud',
        location: 'Pune',
        description: 'Received an SMS claiming electricity power will be disconnected unless I download an APK and pay Rs. 10 via an unverified link.',
        link: 'http://sbi-kyc-update-alert.xyz/verify',
        status: 'In Progress',
        priority: 'High',
        expert: 'Rahul Sharma (Senior Forensics)',
        expertId: users[2]._id,
        date: '2026-09-18',
        aiAnalysis: {
          riskScore: 88,
          verdict: 'Dangerous Phishing APK',
          threatLevel: 'High',
          summary: 'Classic social engineering using electricity disconnection fear to deliver malware and capture netbanking OTPs.',
          countermeasures: [
            'Immediately delete any downloaded APK file.',
            'Change netbanking and UPI password.',
            'File a complaint on cybercrime.gov.in and call 1930.',
          ],
          investigationClues: [
            'Target APK connects to command-and-control server in Hong Kong.',
            'Forwarding number extracted from SMS header.',
          ],
          analyzedAt: new Date(),
        },
      },
      {
        id: 102,
        title: 'Telegram Part-time Rating Job Scam',
        reporter: 'Demo Citizen',
        reporterEmail: 'user@example.com',
        user: users[0]._id,
        type: 'Job Fraud',
        location: 'Bangalore',
        description: 'Asked to deposit Rs. 50,000 for VIP tasks on a crypto portal after initial Rs. 500 profit payout. Now withdrawal is frozen.',
        link: 'https://vip-hotel-rating-crypto.top',
        status: 'Pending',
        priority: 'Critical',
        expert: null,
        date: '2026-09-20',
        aiAnalysis: {
          riskScore: 95,
          verdict: 'Ponzi Task & Crypto Investment Fraud',
          threatLevel: 'Critical',
          summary: 'Task-based advance fee scam with simulated investment returns on an unregistered fraudulent exchange.',
          countermeasures: [
            'Cease all communications with the Telegram handlers immediately.',
            'Request bank to issue a fraudulent chargeback alert on the beneficiary UPI VPAs.',
            'Dial 1930 within the golden hour to freeze the beneficiary mule account.',
          ],
          investigationClues: [
            'Mule account branch identified in Surat, Gujarat.',
            'Telegram bot token linked to syndicated fraud ring.',
          ],
          analyzedAt: new Date(),
        },
      },
      {
        id: 103,
        title: 'E-commerce Clone Site Delivery Scam',
        reporter: 'Amit Kulkarni',
        reporterEmail: 'amit@example.com',
        user: null,
        type: 'Online Shopping Fraud',
        location: 'Mumbai',
        description: 'Ordered shoes on a heavily discounted website advertised on Instagram. Money debited, tracking link fake, support unreachable.',
        link: 'http://cheap-shoes-factory-outlet.online',
        status: 'Solved',
        priority: 'Medium',
        expert: 'Priya Deshmukh (Threat Analyst)',
        expertId: users[3]._id,
        date: '2026-09-12',
        notes: 'Beneficiary gateway flagged. Domain takedown notice issued via CERT-In.',
        aiAnalysis: {
          riskScore: 72,
          verdict: 'Fake E-Commerce Storefront',
          threatLevel: 'Medium',
          summary: 'Domain created 3 days before campaign. No merchant registration or contact address.',
          countermeasures: [
            'File credit card chargeback with card issuing bank under fraud category.',
          ],
          investigationClues: ['Shopify clone template using Cloudflare proxy.'],
          analyzedAt: new Date(),
        },
      },
    ]);
    console.log('Seeded reports');

    // Seed Guidelines
    await Guideline.insertMany([
      {
        title: 'Golden Hour Protocol for Cyber Financial Fraud',
        category: 'Financial Safety',
        content: 'If money is fraudulently debited from your account or UPI, call 1930 immediately or log on to cybercrime.gov.in within 2 to 3 hours. The Citizen Financial Cyber Fraud Reporting System can freeze funds before the scammer withdraws at an ATM.',
        createdBy: users[1]._id,
      },
      {
        title: 'Recognizing Fake "Digital Arrest" Scams',
        category: 'Extortion Prevention',
        content: 'Police, CBI, ED, or TRAI NEVER conduct interrogations or "arrests" over Skype or WhatsApp video calls. Genuine law enforcement officers never demand money transfers for "verification clearance".',
        createdBy: users[1]._id,
      },
      {
        title: 'UPI PIN Safety Rules',
        category: 'Payment Safety',
        content: 'Entering your UPI PIN ALWAYS debits money from your account. You NEVER need to enter a UPI PIN to receive money or refunds.',
        createdBy: users[1]._id,
      },
      {
        title: 'Safe APK Installation Guidelines',
        category: 'Device Security',
        content: 'Never download application files (.apk) received over WhatsApp, Telegram, or SMS. Always install apps exclusively from the official Google Play Store or Apple App Store.',
        createdBy: users[1]._id,
      },
    ]);
    console.log('Seeded guidelines');

    // Seed a couple of Link Checks
    await LinkCheck.insertMany([
      {
        url: 'http://sbi-kyc-rewards-claim.xyz/login',
        score: 15,
        verdict: 'Dangerous',
        threatType: 'Banking Credential Harvester',
        summary: 'Lookalike domain attempting to steal internet banking credentials and OTPs.',
        hits: ['Fake bank domain', 'Unsecured HTTP', 'Suspicious TLD .xyz', 'Credential harvesting form'],
        recommendations: ['Do not click or enter credentials.', 'Report to report.phishing@sbi.co.in.'],
        analyzedByAI: true,
      },
      {
        url: 'https://cybercrime.gov.in',
        score: 98,
        verdict: 'Safe',
        threatType: 'Official Government Portal',
        summary: 'Official Indian National Cyber Crime Reporting Portal operated by MHA.',
        hits: [],
        recommendations: ['Safe for filing official cybercrime complaints.'],
        analyzedByAI: true,
      },
    ]);
    console.log('Seeded initial link checks');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
