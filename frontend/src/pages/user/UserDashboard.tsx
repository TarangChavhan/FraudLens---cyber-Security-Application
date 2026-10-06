import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { FraudReport } from '../../types';
import {
  ShieldAlert,
  FileText,
  BookOpen,
  PhoneCall,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [myReports, setMyReports] = useState<FraudReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const data = await api.getMyReports(user?.email);
        setMyReports(data);
      } catch (err) {
        console.error('Failed to load user reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, [user?.email]);

  const solvedCount = myReports.filter((r) => r.status === 'Solved').length;
  const inProgressCount = myReports.filter((r) => r.status === 'In Progress').length;
  const pendingCount = myReports.filter((r) => r.status === 'Pending').length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Citizen Cyber Portal</span>
          <h1 className="text-3xl font-extrabold mt-1">Welcome back, {user?.name || 'Citizen'}</h1>
          <p className="text-sm text-blue-100 mt-2 max-w-lg">
            Track your complaint status in real-time, run AI link scans, and access 24/7 cybercrime emergency guidance.
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 px-5 py-4 rounded-xl flex items-center gap-3 shrink-0">
          <div className="p-2.5 bg-red-500 rounded-full text-white">
            <PhoneCall size={20} />
          </div>
          <div>
            <p className="text-[11px] text-blue-200 font-bold uppercase">Emergency Cyber Helpline</p>
            <p className="text-xl font-black">1930</p>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">My Total Reports</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{loading ? '...' : myReports.length}</p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-800 rounded-lg">
            <FileText size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Under Investigation</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{loading ? '...' : inProgressCount + pendingCount}</p>
          </div>
          <div className="p-2.5 bg-yellow-50 text-yellow-700 rounded-lg">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Resolved Cases</p>
            <p className="text-2xl font-black text-green-600 mt-1">{loading ? '...' : solvedCount}</p>
          </div>
          <div className="p-2.5 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Feature Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          to="/user/report"
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-red-300 transition flex flex-col justify-between group border-t-4 border-t-red-500"
        >
          <div>
            <div className="p-2.5 bg-red-100 text-red-600 rounded-lg w-fit mb-3">
              <ShieldAlert size={22} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-red-600 transition">
              Report Cybercrime
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Lodge an encrypted complaint with automated AI threat triage directly to the Cyber Cell.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-red-600">
            <span>File Incident</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/user/my-reports"
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between group border-t-4 border-t-blue-500"
        >
          <div>
            <div className="p-2.5 bg-blue-100 text-blue-800 rounded-lg w-fit mb-3">
              <FileText size={22} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-800 transition">
              My Reports
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Track investigative progress, view appointed cyber experts, and review forensic notes.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-blue-800">
            <span>Track Cases</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/user/link-check"
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-amber-300 transition flex flex-col justify-between group border-t-4 border-t-amber-500"
        >
          <div>
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg w-fit mb-3">
              <Sparkles size={22} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-amber-700 transition">
              AI Link Checker
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Scan suspicious URLs, SMS texts, and payment handles for phishing using AI threat intelligence.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-700">
            <span>Scan URL</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/user/guidance"
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between group border-t-4 border-t-emerald-500"
        >
          <div>
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg w-fit mb-3">
              <BookOpen size={22} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition">
              Safety & AI Advisor
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Interact with the 24/7 AI Cyber Safety Advisor and read protocols for recovering scammed funds.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>Ask Advisor</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
