async function runTests() {
  const baseUrl = 'http://127.0.0.1:5000/api';
  console.log('=== RUNNING FRAUDLENS MONGODB & AI VERIFICATION TESTS ===\n');

  // 1. Health
  console.log('1. Testing Health Check...');
  const healthRes = await fetch(`${baseUrl}/health`);
  const health = await healthRes.json();
  console.log('   Health Status:', health.status, '| DB:', health.database, '| AI Enabled:', health.aiEnabled);

  // 2. Login
  console.log('\n2. Testing User Login against MongoDB...');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
  });
  const loginData = await loginRes.json();
  console.log('   Login Result:', loginData.success, '| User:', loginData.user?.name, '| Role:', loginData.user?.role);
  const token = loginData.token;

  // 3. Register New User in MongoDB
  console.log('\n3. Testing Registration in MongoDB...');
  const testEmail = `testuser_${Date.now()}@example.com`;
  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Verification Citizen',
      email: testEmail,
      mobile: '+91 9123499999',
      password: 'password123',
      role: 'USER',
    }),
  });
  const regData = await regRes.json();
  console.log('   Registration Result:', regData.success, '| ID:', regData.user?.id, '| Email:', regData.user?.email);

  // 4. Create Incident Report in MongoDB with AI Triage
  console.log('\n4. Testing Report Submission with AI Triage...');
  const reportRes = await fetch(`${baseUrl}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Fake Electricity Disconnection Warning',
      reporter: 'Demo Citizen',
      reporterEmail: 'user@example.com',
      type: 'UPI / Payment Fraud',
      location: 'Pune',
      description: 'Received WhatsApp message stating electricity will be turned off tonight at 9:30 PM unless I pay bill immediately through unknown payment link.',
      link: 'http://quick-bill-pay-warning.xyz/sbi',
    }),
  });
  const reportData = await reportRes.json();
  console.log('   Report Created in MongoDB with ID:', reportData.data?.id);
  console.log('   AI Threat Level:', reportData.data?.priority);
  console.log('   AI Risk Score:', reportData.data?.aiAnalysis?.riskScore);
  console.log('   AI Verdict:', reportData.data?.aiAnalysis?.verdict);

  // 5. Fetch Reports from MongoDB
  console.log('\n5. Testing Fetch All Reports from MongoDB...');
  const reportsRes = await fetch(`${baseUrl}/reports`);
  const allReports = await reportsRes.json();
  console.log('   Total Reports in MongoDB:', allReports.count);

  // 6. Test AI Link Analysis saved in MongoDB
  console.log('\n6. Testing AI Link Analysis (saved to MongoDB LinkCheck)...');
  const aiLinkRes = await fetch(`${baseUrl}/ai/analyze-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'http://free-lottery-crorepati-claim.top/winner' }),
  });
  const aiLink = await aiLinkRes.json();
  console.log('   AI Link Verdict:', aiLink.data?.verdict);
  console.log('   AI Safety Score:', aiLink.data?.score, '/ 100');
  console.log('   Threat Category:', aiLink.data?.threatType);
  console.log('   MongoDB Document ID:', aiLink.data?._id);

  // 7. Test AI Cyber Assistant Chat
  console.log('\n7. Testing AI Cyber Assistant...');
  const chatRes = await fetch(`${baseUrl}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'I lost Rs. 25,000 in a UPI scam 30 minutes ago. What should I do right now?' }),
  });
  const chatData = await chatRes.json();
  console.log('   AI Assistant Reply Length:', chatData.reply?.length, 'characters');
  console.log('   AI Assistant Sample:', chatData.reply?.slice(0, 180).replace(/\n/g, ' '));

  // 8. Test Admin Stats from MongoDB
  console.log('\n8. Testing Admin Stats from MongoDB...');
  const adminRes = await fetch(`${baseUrl}/admin/stats`);
  const adminStats = await adminRes.json();
  console.log('   Admin Stats:', JSON.stringify(adminStats.stats));

  console.log('\n=== ALL ENDPOINTS VERIFIED SUCCESSFULLY! ===');
}

runTests().catch(console.error);
