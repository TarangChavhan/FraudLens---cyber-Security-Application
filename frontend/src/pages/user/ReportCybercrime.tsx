import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ShieldAlert, Send, Loader2, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { FRAUD_TYPES, LOCATIONS } from '../../data';

const ReportCybercrime: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(FRAUD_TYPES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const payload = {
        title: title.trim() || `${category} reported in ${location}`,
        reporter: user?.name || 'Citizen Reporter',
        reporterEmail: user?.email || '',
        type: category,
        location,
        description: description.trim(),
        link: link.trim(),
      };

      const created = await api.createReport(payload);
      setSuccess(`Report #${created.id} successfully recorded! AI threat triage completed.`);
      setTimeout(() => {
        navigate('/user/my-reports');
      }, 1200);
    } catch (err: any) {
      console.error('Failed to submit report:', err);
      setError(err.message || 'Failed to submit report to database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-100 rounded-xl text-red-700">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">File Cybercrime Incident Report</h1>
          <p className="text-sm text-gray-500">
            Reports are encrypted, securely recorded in the National Registry, and automatically prioritized using AI Threat Intelligence.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Incident Subject / Headline <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Received fraudulent electricity bill disconnection SMS"
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fraud Category *</label>
            <select
              className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {FRAUD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location / Jurisdiction *</label>
            <select
              className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Suspicious URL, Evidence Link, or Sender ID <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="https://fake-banking-portal.xyz or UPI VPA"
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Detailed Incident Description *
          </label>
          <textarea
            required
            rows={5}
            placeholder="Provide a step-by-step account: How was contact made? What payment handles or APK files were used? Approximate money lost, phone numbers involved, and timestamps."
            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 flex items-center gap-2">
          <Sparkles className="shrink-0 text-blue-600" size={18} />
          <span>
            Upon submission, our AI forensic engine automatically triages your case, analyzes modus operandi, and computes an investigative priority score.
          </span>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/user')}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Submitting to Cyber Cell...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit to Cyber Cell</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportCybercrime;
