import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FraudReport, ReportStatus } from '../../types';
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Save,
  ExternalLink,
} from 'lucide-react';

const Investigation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<FraudReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ReportStatus>('In Progress');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchCase = async () => {
      setLoading(true);
      try {
        const data = await api.getReportById(id);
        setReport(data);
        setStatus(data.status || 'In Progress');
        if (data.notes) setNotes(data.notes);
      } catch (err: any) {
        console.error('Failed to load case:', err);
        setError(err.message || 'Case file not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setMessage(null);
    try {
      const updated = await api.updateInvestigation(id, { status, notes });
      setReport(updated);
      setMessage('Investigation findings and status recorded successfully!');
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to update investigation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-gray-500">
        <Loader2 size={36} className="animate-spin text-blue-800 mb-3" />
        <p className="text-sm">Opening forensic case file...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Link to="/expert" className="inline-flex items-center gap-1.5 text-blue-700 hover:underline mb-4 text-sm font-semibold">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-700">
          <AlertTriangle className="mx-auto mb-2 text-red-500" size={32} />
          <h2 className="text-base font-bold">Failed to Load Investigation File #{id}</h2>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const ai = report.aiAnalysis;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link
        to="/expert"
        className="inline-flex items-center gap-1.5 text-blue-700 hover:underline text-sm font-semibold"
      >
        <ArrowLeft size={16} /> Back to Expert Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold font-mono text-gray-500 uppercase">Forensics File #{report.id}</span>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {report.title || `${report.type} Incident Investigation`}
          </h1>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          status === 'Solved'
            ? 'bg-green-100 text-green-800'
            : status === 'In Progress'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          Status: {status}
        </span>
      </div>

      {message && (
        <div className="p-3 bg-green-50 border border-green-300 rounded-lg text-sm text-green-800 flex items-center gap-2 font-medium">
          <CheckCircle2 size={16} className="text-green-600" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Victim Complaint Details & AI Forensic Clues */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 pb-2 border-b">
              Complaint Dossier
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block">Complainant</span>
                <span className="font-semibold text-gray-800">{report.reporter}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Jurisdiction</span>
                <span className="font-semibold text-gray-800">{report.location}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Date Lodged</span>
                <span className="font-semibold text-gray-800">{report.date}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Modus Operandi</span>
                <span className="font-semibold text-gray-800">{report.type}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 block mb-1">Victim Statement</span>
              <p className="text-xs text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed whitespace-pre-wrap">
                {report.description}
              </p>
            </div>

            {report.link && (
              <div>
                <span className="text-xs text-gray-400 block mb-1">Suspect Link / Evidence Artifact</span>
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 p-2 rounded text-xs font-mono text-blue-900 break-all">
                  <ExternalLink size={13} className="shrink-0 text-blue-600" />
                  <span>{report.link}</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Forensic Intelligence */}
          {ai && (
            <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-400" />
                  <h3 className="font-bold text-sm">AI Forensic Triage Insights</h3>
                </div>
                {ai.riskScore !== undefined && (
                  <span className="text-xs font-bold bg-purple-900/50 text-purple-300 border border-purple-700 px-2 py-0.5 rounded">
                    Score: {ai.riskScore}/100
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{ai.summary}</p>

              {ai.investigationClues && ai.investigationClues.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-amber-300 block mb-1">
                    Forensic Leads for Officer:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {ai.investigationClues.map((clue, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{clue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Expert Investigation Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 pb-2 border-b mb-4">
            Investigation Logging & Status
          </h2>

          <form onSubmit={handleSave} className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Investigation Status
                </label>
                <select
                  className="w-full border border-gray-300 p-2.5 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReportStatus)}
                >
                  <option value="Pending">Pending Assignment / Review</option>
                  <option value="In Progress">In Progress (Active Cyber Investigation)</option>
                  <option value="Solved">Solved (Remediation Complete / Takedown Issued)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Official Forensic Case Notes & Citizen Guidance
                </label>
                <textarea
                  rows={8}
                  placeholder="Record findings: beneficiary bank freeze status, domain takedown notices, CERT-In advisory references, or recovery steps communicated to victim."
                  className="w-full border border-gray-300 p-3 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Saving Findings...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Commit Findings to Registry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Investigation;
