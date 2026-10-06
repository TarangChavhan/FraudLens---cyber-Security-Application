import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FraudReport } from '../../types';
import {
  ShieldAlert,
  Users,
  Clock,
  CheckCircle2,
  FileText,
  UserCheck,
  RefreshCw,
  Loader2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<FraudReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, reportsData] = await Promise.all([
        api.getAdminStats(),
        api.getReports(),
      ]);
      setStats(statsData);
      setRecentReports(reportsData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-blue-800" size={26} />
            <span>Cyber Crime Cell Admin Command</span>
          </h1>
          <p className="text-sm text-gray-500">
            Real-time jurisdictional overview powered by National Threat Intelligence Engine.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync Registry</span>
        </button>
      </div>

      {loading && !stats ? (
        <div className="p-12 flex flex-col items-center justify-center text-gray-500">
          <Loader2 size={32} className="animate-spin text-blue-800 mb-3" />
          <p className="text-sm">Calculating real-time database metrics...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200 border-t-4 border-t-blue-600">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Complaints</span>
                <FileText size={18} className="text-blue-600" />
              </div>
              <p className="text-3xl font-black text-gray-900">{stats?.totalReports ?? 0}</p>
              <p className="text-[11px] text-gray-400 mt-1">Total in Registry</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200 border-t-4 border-t-yellow-500">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Assignment</span>
                <Clock size={18} className="text-yellow-600" />
              </div>
              <p className="text-3xl font-black text-yellow-600">{stats?.pendingReports ?? 0}</p>
              <p className="text-[11px] text-gray-400 mt-1">Awaiting expert triage</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200 border-t-4 border-t-green-600">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Cases Solved</span>
                <CheckCircle2 size={18} className="text-green-600" />
              </div>
              <p className="text-3xl font-black text-green-600">{stats?.resolvedReports ?? 0}</p>
              <p className="text-[11px] text-gray-400 mt-1">Resolved & closed</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200 border-t-4 border-t-purple-600">
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Registered Citizens</span>
                <Users size={18} className="text-purple-600" />
              </div>
              <p className="text-3xl font-black text-purple-700">{stats?.totalUsers ?? 0}</p>
              <p className="text-[11px] text-gray-400 mt-1">Active Citizen Accounts</p>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/reports"
              className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition"
            >
              <FileText size={16} />
              <span>Manage All Reports</span>
            </Link>
            <Link
              to="/admin/assign"
              className="bg-white hover:bg-gray-50 text-blue-900 border border-blue-900 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-xs transition"
            >
              <UserCheck size={16} />
              <span>Assign Cyber Experts</span>
            </Link>
          </div>

          {/* Recent Live Cases */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Recent Incident Reports</h2>
              <Link to="/admin/reports" className="text-xs text-blue-700 hover:underline font-semibold flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentReports.map((report) => (
                <div key={report.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-900">#{report.id}</span>
                      <span className="font-semibold text-gray-900">{report.title || report.type}</span>
                      {report.aiAnalysis && (
                        <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                          <Sparkles size={9} /> AI Score: {report.aiAnalysis.riskScore}/100
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      By {report.reporter} • {report.location} • {report.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600">
                      Expert: <span className="font-medium text-gray-800">{report.expert || 'Unassigned'}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      report.status === 'Solved'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
