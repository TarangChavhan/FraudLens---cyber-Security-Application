import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CheckResult } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Loader2,
  Sparkles,
  History,
  CheckCircle2,
} from 'lucide-react';

const LinkCheck: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [history, setHistory] = useState<CheckResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const data = await api.getLinkHistory();
      setHistory(data);
    } catch (err) {
      console.warn('Could not fetch link history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.checkLink(url.trim());
      setResult(res);
      fetchHistory();
    } catch (err: any) {
      console.error('Link check error:', err);
      setError(err.message || 'Failed to analyze URL');
    } finally {
      setLoading(false);
    }
  };

  const selectSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setError(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-100 text-blue-900 rounded-xl">
            <Sparkles size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">AI Threat & Link Inspector</h1>
            <p className="text-sm text-gray-600">
              Verify suspicious URLs, payment links, APK downloads, and SMS messages using AI threat detection.
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200">
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Enter Suspicious URL, Domain, or Message Text
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  placeholder="e.g. http://sbi-kyc-verify-alert.xyz/reward or paste full SMS"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-sm transition cursor-pointer shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>AI Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Analyze Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-500">
            <span className="font-semibold text-gray-600">Try samples:</span>
            <button
              type="button"
              onClick={() => selectSample('http://sbi-kyc-update-portal.xyz/login')}
              className="bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded hover:bg-red-100 font-medium cursor-pointer"
            >
              Fake SBI Phishing
            </button>
            <button
              type="button"
              onClick={() => selectSample('https://vip-hotel-rating-crypto.top')}
              className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-1 rounded hover:bg-orange-100 font-medium cursor-pointer"
            >
              Crypto Task Scam
            </button>
            <button
              type="button"
              onClick={() => selectSample('https://cybercrime.gov.in')}
              className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded hover:bg-green-100 font-medium cursor-pointer"
            >
              Official Gov Portal
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Analysis Result Card */}
      {result && (
        <div
          className={`rounded-xl p-6 border shadow-sm transition ${
            result.verdict === 'Safe'
              ? 'bg-green-50/50 border-green-300'
              : result.verdict === 'Dangerous'
              ? 'bg-red-50/50 border-red-300'
              : 'bg-yellow-50/50 border-yellow-300'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200/80">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-full text-white ${
                  result.verdict === 'Safe'
                    ? 'bg-green-600'
                    : result.verdict === 'Dangerous'
                    ? 'bg-red-600'
                    : 'bg-yellow-600'
                }`}
              >
                {result.verdict === 'Safe' ? (
                  <ShieldCheck size={28} />
                ) : (
                  <ShieldAlert size={28} />
                )}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Official Verification Verdict
                </span>
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span>{result.verdict}</span>
                  {result.threatType && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-200 text-gray-800">
                      {result.threatType}
                    </span>
                  )}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-black text-gray-900">{result.score}/100</div>
              <span className="text-xs font-semibold text-gray-500">Safety Rating</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs font-mono text-gray-600 break-all bg-white/70 p-2 rounded border border-gray-200">
                Target: {result.url}
              </p>
            </div>

            {result.summary && (
              <p className="text-sm text-gray-800 leading-relaxed font-medium bg-white/60 p-3 rounded-lg border border-gray-200">
                {result.summary}
              </p>
            )}

            {result.hits && result.hits.length > 0 && (
              <div className="mt-3">
                <span className="text-xs font-bold uppercase tracking-wider text-red-800 block mb-1">
                  Identified Red Flags:
                </span>
                <ul className="space-y-1 text-xs text-red-700">
                  {result.hits.map((hit, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                      <span>{hit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200/80">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-1">
                  Safety Recommendations:
                </span>
                <ul className="space-y-1 text-xs text-gray-700">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="text-blue-700" size={20} />
            <h2 className="text-base font-bold text-gray-900">Recent Threat Verifications</h2>
          </div>
          <span className="text-xs text-gray-400">Total verified: {history.length}</span>
        </div>

        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No scan records found.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {history.slice(0, 8).map((item, idx) => (
              <div key={item._id || item.id || idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-gray-800 truncate">{item.url}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">
                    {item.threatType || 'Checked link'} • Score: {item.score}/100
                  </p>
                </div>
                <div className="shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                      item.verdict === 'Safe'
                        ? 'bg-green-100 text-green-800'
                        : item.verdict === 'Dangerous'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {item.verdict}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkCheck;
