export type ReportStatus = 'Solved' | 'Pending' | 'In Progress';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface AIAnalysis {
  riskScore?: number;
  threatLevel?: string;
  verdict?: string;
  summary?: string;
  countermeasures?: string[];
  investigationClues?: string[];
  analyzedAt?: string;
}

export interface FraudReport {
  id: number;
  title?: string;
  reporter: string;
  reporterEmail?: string;
  type: string;
  location: string;
  description: string;
  link?: string;
  status: ReportStatus;
  priority?: PriorityLevel;
  expert?: string | null;
  expertId?: string | null;
  date: string;
  notes?: string;
  aiAnalysis?: AIAnalysis;
}

export interface CheckResult {
  id?: string | number;
  _id?: string;
  url: string;
  score: number;
  verdict: 'Safe' | 'Suspicious' | 'Dangerous';
  threatType?: string;
  summary?: string;
  hits?: string[];
  recommendations?: string[];
  analyzedByAI?: boolean;
  createdAt?: string;
}

export interface GuidelineItem {
  _id?: string;
  title: string;
  content: string;
  category?: string;
}

export type AppMode = 'home' | 'userLogin' | 'user' | 'adminLogin' | 'admin';
export type UserTab = 'link' | 'report' | 'guideline' | null;
export type AdminTab = 'dashboard' | 'assign' | 'analyze' | null;
