import { FraudReport, GuidelineItem } from './types';

export const FRAUD_TYPES: string[] = [
  "Phishing",
  "OTP Fraud",
  "UPI / Payment Fraud",
  "Job Fraud",
  "Loan App Fraud",
  "Online Shopping Fraud",
  "Other",
];

export const LOCATIONS: string[] = [
  "Mumbai",
  "Pune",
  "Delhi",
  "Bangalore",
  "Amravati",
  "Nagpur",
  "Hyderabad",
  "Chennai",
];

export const EXPERTS: string[] = [
  "Rahul Sharma",
  "Priya Deshmukh",
  "Cyber Cell Team A",
  "Cyber Cell Team B",
  "Anjali Verma",
  "Suresh Patil",
];

export const initialReports: FraudReport[] = [
  {
    id: 1,
    reporter: "Amit Kulkarni",
    type: "UPI / Payment Fraud",
    location: "Pune",
    description: "Received a fake payment link asking for UPI pin.",
    link: "http://fake-payment-link.com",
    status: "Solved",
    expert: "Rahul Sharma",
    date: "2026-08-12",
  },
  {
    id: 2,
    reporter: "Sneha Rao",
    type: "Job Fraud",
    location: "Bangalore",
    description: "Asked to pay Rs.2000 registration fee for a fake job offer.",
    link: "",
    status: "Pending",
    expert: null,
    date: "2026-08-20",
  },
  {
    id: 3,
    reporter: "Vikram Singh",
    type: "Phishing",
    location: "Delhi",
    description: "Email pretending to be from bank asking to update KYC.",
    link: "http://bank-kyc-update.fake",
    status: "In Progress",
    expert: "Priya Deshmukh",
    date: "2026-08-25",
  },
  {
    id: 4,
    reporter: "Meena Iyer",
    type: "Loan App Fraud",
    location: "Mumbai",
    description: "App charged hidden fees and threatened contacts list.",
    link: "",
    status: "Pending",
    expert: null,
    date: "2026-08-28",
  },
  {
    id: 5,
    reporter: "Karan Joshi",
    type: "Online Shopping Fraud",
    location: "Mumbai",
    description: "Paid for product on fake e-commerce website, never delivered.",
    link: "http://cheap-deals-online.fake",
    status: "Solved",
    expert: "Anjali Verma",
    date: "2026-08-15",
  },
  {
    id: 6,
    reporter: "Pooja Nair",
    type: "OTP Fraud",
    location: "Amravati",
    description: "Caller pretending to be bank employee asked for OTP.",
    link: "",
    status: "Pending",
    expert: null,
    date: "2026-08-30",
  },
];

export const SUSPICIOUS_HINTS: string[] = [
  "login",
  "verify",
  "update",
  "free",
  "prize",
  "win",
  "bonus",
  "kyc",
  "urgent",
  "otp",
  "bit.ly",
  "tinyurl",
  ".xyz",
  ".tk",
  ".info",
  "secure-",
  "-secure",
];

export const GUIDELINES: GuidelineItem[] = [
  {
    title: "Never share OTP",
    text: "Banks and companies never call to ask for your OTP or PIN. Do not share it with anyone over phone, SMS or email.",
  },
  {
    title: "Check the link before clicking",
    text: "Hover over links to see the real address. Fraud links often use spelling mistakes or extra words like 'secure-bank-login.com'.",
  },
  {
    title: "Avoid unknown payment requests",
    text: "Do not accept UPI collect requests from unknown numbers. A payment request from a stranger is a red flag.",
  },
  {
    title: "Verify job offers",
    text: "Genuine companies do not ask for registration fees before hiring. Check the company on official channels first.",
  },
  {
    title: "Report immediately",
    text: "If you notice any suspicious activity, report it right away using the Report System so cyber experts can act fast.",
  },
  {
    title: "Keep proof",
    text: "Take screenshots of messages, links and numbers involved before reporting. This helps the cyber team investigate faster.",
  },
];
