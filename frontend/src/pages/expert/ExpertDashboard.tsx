import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { FraudReport } from '../../types';
import {
  Briefcase,
  Loader2,
  ArrowRight,
  RefreshCw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const ExpertDashboard: React.FC = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<FraudReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await api.getExpertCases(user?.name);
      setCases(data);
    } catch (err) {
      console.error('Failed to load expert cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [user?.name]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-blue-800" size={26} />
            <span>Expert Forensics Workspace</span>
          </h1>
          <p className="text-sm text-gray-500">
            Cases assigned to <span className="font-semibold text-gray-800">{user?.name}</span> registered for forensic analysis.
          </p>
        </div>

        <button
          onClick={fetchCases}
          className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition cursor-pointer self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Sync Assigned Cases</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 flex flex-col items-center justify-center text-gray-500">
          <Loader2 size={32} className="animate-spin text-blue-800 mb-3" />
          <p className="text-sm">Fetching forensic investigation files...</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <CheckCircle2 className="mx-auto mb-3 text-gray-400" size={40} />
          <h3 className="text-base font-bold text-gray-800">No Pending Case Files</h3>
          <p className="text-sm text-gray-500 mt-1">
            You currently have no forensic cases assigned.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {cases.map((report) => (
            <div
              key={report.id}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-blue-600 hover:border-gray-300 transition"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    Case #{report.id}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {report.type}
                  </span>
                  {report.aiAnalysis && (
                    <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                      <Sparkles size={10} /> AI Score: {report.aiAnalysis.riskScore}/100
                    </span>
                  )}
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    report.status === 'Solved'
                      ? 'bg-green-100 text-green-800'
                      : report.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {report.status}
                  </span>
                </div>

                <h2 className="text-base font-bold text-gray-900">
                  {report.title || `${report.type} Incident`}
                </h2>
                <p className="text-xs text-gray-500">
                  Victim: <span className="font-medium text-gray-700">{report.reporter}</span> • Location: {report.location} • Date: {report.date}
                </p>
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded line-clamp-2">
                  {report.description}
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  to={`/expert/investigation/${report.id}`}
                  className="inline-flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  <span>Open Investigation File</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertDashboard;
