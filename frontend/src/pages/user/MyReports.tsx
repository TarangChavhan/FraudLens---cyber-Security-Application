import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { FraudReport } from '../../types';
import { FileText, Loader2, Plus, AlertTriangle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

const MyReports: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMyReports(user?.email);
      setReports(data);
    } catch (err: any) {
      console.error('Failed to load reports:', err);
      setError(err.message || 'Failed to load reports from registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user?.email]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Solved':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">Solved</span>;
      case 'In Progress':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">In Progress</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">Pending Review</span>;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-red-100 text-red-700">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-orange-100 text-orange-700">High</span>;
      case 'Low':
        return <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-gray-100 text-gray-700">Low</span>;
      default:
        return <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-amber-100 text-amber-700">Medium</span>;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-700" size={24} />
            <span>My Reported Incidents</span>
          </h1>
          <p className="text-sm text-gray-500">
            Official complaints filed by <span className="font-semibold text-gray-700">{user?.email}</span> with Cyber Cell.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchReports}
            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            title="Refresh Complaint Registry"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/user/report"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus size={16} />
            <span>New Complaint</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 flex flex-col items-center justify-center text-gray-500">
          <Loader2 size={32} className="animate-spin text-blue-700 mb-3" />
          <p className="text-sm">Loading your incident records...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
          <AlertTriangle className="mx-auto mb-2 text-red-500" size={28} />
          <p className="font-semibold text-sm">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-3 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded text-xs font-semibold"
          >
            Retry Connection
          </button>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <FileText className="mx-auto mb-3 text-gray-400" size={40} />
          <h3 className="text-base font-bold text-gray-700">No reports filed yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-5">
            You haven't filed any cyber fraud reports yet. If you have been targeted by a cyber scam, lodge an incident immediately.
          </p>
          <Link
            to="/user/report"
            className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition"
          >
            <Plus size={16} />
            <span>File Incident Report</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 text-left">Case ID</th>
                  <th className="py-3.5 px-4 text-left">Incident Title & Category</th>
                  <th className="py-3.5 px-4 text-left">Location</th>
                  <th className="py-3.5 px-4 text-left">Date Filed</th>
                  <th className="py-3.5 px-4 text-left">Priority</th>
                  <th className="py-3.5 px-4 text-left">Investigation Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      #{report.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">
                        {report.title || `${report.type} Incident`}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium text-gray-700">{report.type}</span>
                        {report.aiAnalysis && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200 font-medium">
                            <Sparkles size={10} /> AI Triaged
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">{report.location}</td>
                    <td className="py-3.5 px-4 text-gray-600">{report.date}</td>
                    <td className="py-3.5 px-4">{getPriorityBadge(report.priority)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(report.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/user/report/${report.id}`}
                        className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold hover:underline"
                      >
                        <span>Details</span>
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;
