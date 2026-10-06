import dns from 'dns';
import mongoose from 'mongoose';
import Report from '../models/Report.js';

// Configure public DNS servers to prevent querySrv ECONNREFUSED on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('Custom DNS setServers warning:', dnsErr.message);
}

const initialSeedReports = [
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

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);

    // Seed database if empty
    const count = await Report.countDocuments();
    if (count === 0) {
      console.log('No existing reports found in database. Seeding initial data...');
      await Report.insertMany(initialSeedReports);
      console.log(`Seeded ${initialSeedReports.length} initial reports.`);
    } else {
      console.log(`Found ${count} reports in MongoDB database.`);
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.log('Continuing without database connection...');
  }
}
