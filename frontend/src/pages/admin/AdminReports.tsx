import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FraudReport, ReportStatus } from '../../types';
import { FileText, Loader2, RefreshCw, Sparkles, Filter } from 'lucide-react';

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId: number, newStatus: ReportStatus) => {
    setStatusUpdating(reportId);
    try {
      const updated = await api.updateReportStatus(reportId, newStatus);
      setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
    } catch (err: any) {
      alert(err.message || 'Failed to update case status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-800" size={24} />
            <span>National Cybercrime Incident Registry</span>
          </h1>
          <p className="text-sm text-gray-500">
            Total recorded complaints: <span className="font-semibold text-gray-800">{reports.length}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 rounded-lg px-2.5 py-1.5">
            <Filter size={14} className="text-gray-500" />
            <select
              className="focus:outline-none bg-transparent font-medium text-gray-700"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Solved">Solved</option>
            </select>
          </div>

          <button
            onClick={fetchReports}
            className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            title="Refresh Registry"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 flex flex-col items-center justify-center text-gray-500">
          <Loader2 size={32} className="animate-spin text-blue-800 mb-3" />
          <p className="text-sm">Retrieving official complaint registry...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center text-gray-500">
          <p className="text-sm font-semibold">No reports matching "{filterStatus}" filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold">
                <tr>
                  <th className="py-3.5 px-4 text-left">Case ID</th>
                  <th className="py-3.5 px-4 text-left">Subject & Category</th>
                  <th className="py-3.5 px-4 text-left">Reporter</th>
                  <th className="py-3.5 px-4 text-left">Location</th>
                  <th className="py-3.5 px-4 text-left">AI Triage</th>
                  <th className="py-3.5 px-4 text-left">Assigned Expert</th>
                  <th className="py-3.5 px-4 text-left">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      #{report.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">
                        {report.title || `${report.type} Incident`}
                      </div>
                      <div className="text-xs text-gray-500">{report.type}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      <div className="font-medium">{report.reporter}</div>
                      {report.reporterEmail && (
                        <div className="text-[11px] text-gray-400">{report.reporterEmail}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{report.location}</td>
                    <td className="py-3.5 px-4">
                      {report.aiAnalysis ? (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-semibold">
                          <Sparkles size={11} /> {report.aiAnalysis.riskScore}/100
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-800">
                      {report.expert ? (
                        <span className="font-medium text-blue-800">{report.expert}</span>
                      ) : (
                        <span className="italic text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        report.status === 'Solved'
                          ? 'bg-green-100 text-green-800'
                          : report.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        disabled={statusUpdating === report.id}
                        className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-blue-600"
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.id, e.target.value as ReportStatus)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Solved">Mark Solved</option>
                      </select>
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

export default AdminReports;
