import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FraudReport } from '../../types';
import { UserCheck, Loader2, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';

const AssignExpert: React.FC = () => {
  const [pendingReports, setPendingReports] = useState<FraudReport[]>([]);
  const [experts, setExperts] = useState<Array<{ _id: string; name: string; email: string; mobile?: string }>>([]);
  const [selectedExpert, setSelectedExpert] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsData, expertsData] = await Promise.all([
        api.getReports(),
        api.getExpertsList(),
      ]);
      const unassigned = reportsData.filter((r) => !r.expert || r.status === 'Pending');
      setPendingReports(unassigned);
      setExperts(expertsData);
    } catch (err) {
      console.error('Failed to load assignment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (reportId: number) => {
    const expertName = selectedExpert[reportId];
    if (!expertName) {
      alert('Please select a Cyber Expert from the dropdown.');
      return;
    }

    const expertObj = experts.find((e) => e.name === expertName);

    setAssigningId(reportId);
    setMessage(null);

    try {
      await api.assignExpert(reportId, expertName, expertObj?._id);
      setMessage(`Assigned ${expertName} to Case #${reportId} successfully.`);
      setPendingReports((prev) => prev.filter((r) => r.id !== reportId));
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to assign expert');
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <UserCheck className="text-blue-800" size={26} />
            <span>Appoint Cyber Forensics Experts</span>
          </h1>
          <p className="text-sm text-gray-500">
            Assign incoming citizen incident reports to certified cyber specialists.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800 flex items-center gap-2 font-medium">
          <CheckCircle2 size={16} className="text-green-600" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 flex flex-col items-center justify-center text-gray-500">
          <Loader2 size={32} className="animate-spin text-blue-800 mb-3" />
          <p className="text-sm">Loading pending cases and certified experts...</p>
        </div>
      ) : pendingReports.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <CheckCircle2 className="mx-auto mb-3 text-green-500" size={40} />
          <h3 className="text-base font-bold text-gray-800">All Cases Assigned!</h3>
          <p className="text-sm text-gray-500 mt-1">
            There are currently no unassigned pending reports in the queue.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-red-500 hover:border-gray-300 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    Case #{report.id}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {report.type}
                  </span>
                  {report.aiAnalysis && (
                    <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                      <Sparkles size={10} /> AI Risk: {report.aiAnalysis.riskScore}/100
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-gray-900">
                  {report.title || `${report.type} Incident in ${report.location}`}
                </h2>
                <p className="text-xs text-gray-500">
                  Reported by <span className="font-medium text-gray-700">{report.reporter}</span> on {report.date} • {report.location}
                </p>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1 bg-gray-50 p-2 rounded">
                  {report.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                <select
                  className="border border-gray-300 p-2 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-w-[200px]"
                  value={selectedExpert[report.id] || ''}
                  onChange={(e) => setSelectedExpert({ ...selectedExpert, [report.id]: e.target.value })}
                >
                  <option value="">Select Certified Expert...</option>
                  {experts.map((exp) => (
                    <option key={exp._id} value={exp.name}>
                      {exp.name} ({exp.email})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleAssign(report.id)}
                  disabled={assigningId === report.id}
                  className="bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  {assigningId === report.id ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Assign</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignExpert;
