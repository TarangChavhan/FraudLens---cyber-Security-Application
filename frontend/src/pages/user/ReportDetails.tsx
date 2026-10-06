import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FraudReport } from '../../types';
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  UserCheck,
  Calendar,
  MapPin,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const ReportDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<FraudReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getReportById(id);
        setReport(data);
      } catch (err: any) {
        console.error('Failed to fetch report:', err);
        setError(err.message || 'Report not found in official registry');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-gray-500">
        <Loader2 size={36} className="animate-spin text-blue-700 mb-3" />
        <p className="text-sm">Retrieving official case record...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Link to="/user/my-reports" className="inline-flex items-center gap-1.5 text-blue-700 hover:underline mb-4 text-sm font-semibold">
          <ArrowLeft size={16} /> Back to My Reports
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-700">
          <AlertTriangle className="mx-auto mb-2 text-red-500" size={32} />
          <h2 className="text-base font-bold">Failed to Load Report #{id}</h2>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const ai = report.aiAnalysis;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link
        to="/user/my-reports"
        className="inline-flex items-center gap-1.5 text-blue-700 hover:underline text-sm font-semibold"
      >
        <ArrowLeft size={16} /> Back to My Reports
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded">
                Case ID #{report.id}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                report.status === 'Solved'
                  ? 'bg-green-100 text-green-800'
                  : report.status === 'In Progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {report.status}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
              {report.title || `${report.type} Incident`}
            </h1>
          </div>

          <div className="text-right text-xs text-gray-500">
            <p className="flex items-center justify-end gap-1 font-medium text-gray-700">
              <Calendar size={14} /> Filed: {report.date}
            </p>
            <p className="flex items-center justify-end gap-1 mt-1">
              <MapPin size={14} /> Jurisdiction: {report.location}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div>
            <span className="text-xs text-gray-500 font-medium block">Reporter</span>
            <span className="font-semibold text-gray-800">{report.reporter}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Fraud Category</span>
            <span className="font-semibold text-gray-800">{report.type}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium block">Assigned Cyber Expert</span>
            <span className="font-semibold text-blue-800 flex items-center gap-1 mt-0.5">
              <UserCheck size={16} />
              {report.expert ? report.expert : 'Under Assignment by Cyber Cell'}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">
            Incident Narrative
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed bg-white border border-gray-200 p-4 rounded-lg whitespace-pre-wrap">
            {report.description}
          </p>
        </div>

        {report.link && (
          <div className="mt-4">
            <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
              Evidence Link / Domain
            </h2>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 p-2.5 rounded-lg text-xs font-mono text-blue-900 break-all">
              <ExternalLink size={14} className="shrink-0 text-blue-600" />
              <span>{report.link}</span>
            </div>
          </div>
        )}

        {report.notes && (
          <div className="mt-5 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-xs font-bold text-yellow-900 uppercase tracking-wider mb-1">
              Official Cyber Cell Remarks
            </h3>
            <p className="text-sm text-yellow-950">{report.notes}</p>
          </div>
        )}
      </div>

      {/* AI Threat Intelligence Card */}
      {ai && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-6 shadow-md border border-indigo-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">AI Cyber Threat Intelligence Assessment</h3>
                <p className="text-xs text-indigo-300">Automated forensic evaluation</p>
              </div>
            </div>
            {ai.riskScore !== undefined && (
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">{ai.riskScore}/100</span>
                <p className="text-[11px] text-indigo-300">Risk Severity Score</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="bg-white/10 rounded-lg p-3.5 border border-white/10">
              <span className="text-[11px] uppercase tracking-wider text-indigo-300 font-bold block mb-1">
                Classification & Pattern
              </span>
              <p className="text-sm font-semibold text-white">{ai.verdict || report.type}</p>
              <p className="text-xs text-indigo-200 mt-1 leading-relaxed">{ai.summary}</p>
            </div>

            <div className="bg-white/10 rounded-lg p-3.5 border border-white/10">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block mb-1">
                Immediate Protective Actions for Citizen
              </span>
              <ul className="space-y-1.5 text-xs text-gray-200">
                {ai.countermeasures && ai.countermeasures.length > 0 ? (
                  ai.countermeasures.map((cm, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{cm}</span>
                    </li>
                  ))
                ) : (
                  <li>Call National Helpline 1930 immediately.</li>
                )}
              </ul>
            </div>
          </div>

          {ai.investigationClues && ai.investigationClues.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-indigo-200">
              <span className="font-bold text-indigo-300">Investigative Clues for Officer: </span>
              <span>{ai.investigationClues.join(' • ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportDetails;
