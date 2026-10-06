import { FraudReport, CheckResult, ReportStatus } from '../types';

const API_BASE = '/api';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Check backend server & DB connection
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.status === 'ok';
    } catch {
      return false;
    }
  },

  // Auth: Login
  async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Invalid credentials');
    }
    return json;
  },

  // Auth: Register
  async register(data: { name: string; email: string; password: string; mobile?: string; role?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Registration failed');
    }
    return json;
  },

  // Auth: Get current user profile
  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeaders(),
    });
    return res.json();
  },

  // Fetch all reports from MongoDB
  async getReports(params?: { status?: string; expert?: string }): Promise<FraudReport[]> {
    let url = `${API_BASE}/reports`;
    if (params?.status) url += `?status=${encodeURIComponent(params.status)}`;
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch reports (HTTP ${res.status})`);
    const json = await res.json();
    return json.data || [];
  },

  // Fetch reports submitted by the logged-in user
  async getMyReports(userEmail?: string): Promise<FraudReport[]> {
    let url = `${API_BASE}/reports/my`;
    if (userEmail) url += `?email=${encodeURIComponent(userEmail)}`;
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch your reports (HTTP ${res.status})`);
    const json = await res.json();
    return json.data || [];
  },

  // Fetch single report by ID from MongoDB
  async getReportById(id: string | number): Promise<any> {
    const res = await fetch(`${API_BASE}/reports/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch report #${id}`);
    const json = await res.json();
    return json.data;
  },

  // Submit a new incident report to MongoDB with AI threat triage
  async createReport(reportData: {
    title?: string;
    reporter: string;
    reporterEmail?: string;
    type: string;
    location: string;
    description: string;
    link?: string;
  }): Promise<FraudReport> {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(reportData),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to submit report');
    }
    return json.data;
  },

  // Assign expert to a report in MongoDB
  async assignExpert(id: number | string, expert: string, expertId?: string): Promise<FraudReport> {
    const res = await fetch(`${API_BASE}/reports/${id}/expert`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ expert, expertId }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to assign expert');
    }
    return json.data;
  },

  // Update report status in MongoDB
  async updateReportStatus(id: number | string, status: ReportStatus, notes?: string): Promise<FraudReport> {
    const res = await fetch(`${API_BASE}/reports/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update report status');
    }
    return json.data;
  },

  // AI-Powered Link and Text Verification saved to MongoDB
  async checkLink(url: string): Promise<CheckResult> {
    const res = await fetch(`${API_BASE}/ai/analyze-link`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ url }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to verify link');
    }
    return json.data;
  },

  // Fetch recent checked links from MongoDB
  async getLinkHistory(): Promise<CheckResult[]> {
    try {
      const res = await fetch(`${API_BASE}/ai/history`, { headers: authHeaders() });
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  // Ask AI Cyber Assistant (guidance chat)
  async askCyberAssistant(message: string, history: Array<{ role: string; content: string }> = []): Promise<string> {
    const messages = [...history, { role: 'user', content: message }];
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ messages }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'AI Assistant unavailable');
    }
    return json.reply;
  },

  // Admin Dashboard stats
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    const json = await res.json();
    return json.stats;
  },

  // List of registered Cyber Experts for assignment
  async getExpertsList(): Promise<Array<{ _id: string; name: string; email: string; mobile?: string }>> {
    const res = await fetch(`${API_BASE}/admin/experts`, { headers: authHeaders() });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  },

  // Expert dashboard assignments
  async getExpertCases(expertName?: string): Promise<FraudReport[]> {
    let url = `${API_BASE}/expert/cases`;
    if (expertName) url += `?name=${encodeURIComponent(expertName)}`;
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch expert assignments');
    const json = await res.json();
    return json.reports || [];
  },

  // Update investigation notes & status
  async updateInvestigation(id: string | number, data: { status?: string; notes?: string; priority?: string }) {
    const res = await fetch(`${API_BASE}/expert/investigation/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update investigation');
    return json.data;
  },

  // Fetch cyber safety guidelines from MongoDB
  async getGuidelines() {
    const res = await fetch(`${API_BASE}/guidelines`, { headers: authHeaders() });
    if (!res.ok) return [];
    const json = await res.json();
    return json.guidelines || [];
  },
};
