import React, { useState } from "react";
import { FRAUD_TYPES, LOCATIONS } from "../data";
import { FraudReport } from "../types";
import StatusBadge from "./StatusBadge";
import { Send, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { api } from "../services/api";

interface ReportSystemProps {
  reports: FraudReport[];
  setReports: React.Dispatch<React.SetStateAction<FraudReport[]>>;
  onCreateReport?: (data: {
    reporter: string;
    type: string;
    location: string;
    description: string;
    link?: string;
  }) => Promise<FraudReport>;
  reporterName?: string;
}

export default function ReportSystem({
  reports,
  setReports,
  onCreateReport,
  reporterName,
}: ReportSystemProps) {
  const [form, setForm] = useState({
    reporter: reporterName || "",
    type: FRAUD_TYPES[0],
    location: LOCATIONS[0],
    description: "",
    link: "",
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submittedMsg, setSubmittedMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.reporter.trim()) e.reporter = "Reporter name is required.";
    if (!form.description.trim()) {
      e.description = "Description is required.";
    } else if (form.description.trim().length < 10) {
      e.description = "Please describe the incident in more detail (minimum 10 characters).";
    }
    if (form.link.trim() && !/^https?:\/\//i.test(form.link.trim())) {
      e.link = "Link must start with http:// or https://";
    }
    return e;
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      setSubmittedMsg("");
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      let savedReport: FraudReport;
      const payload = {
        reporter: form.reporter.trim(),
        type: form.type,
        location: form.location,
        description: form.description.trim(),
        link: form.link.trim(),
      };

      if (onCreateReport) {
        savedReport = await onCreateReport(payload);
      } else {
        savedReport = await api.createReport(payload);
        setReports((prev) => [savedReport, ...prev.filter((r) => r.id !== savedReport.id)]);
      }

      setForm({
        reporter: reporterName || "",
        type: FRAUD_TYPES[0],
        location: LOCATIONS[0],
        description: "",
        link: "",
      });
      setSubmittedMsg(`Report #${savedReport.id} successfully recorded & filed with Cyber Crime Cell.`);
      setTimeout(() => {
        setSubmittedMsg("");
      }, 7000);
    } catch (err: any) {
      setErrors({ form: err.message || "Failed to submit report to server." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="report-system-container" className="p-4 max-w-3xl mx-auto">
      <div className="mb-4">
        <h2 id="report-system-heading" className="text-xl font-bold text-blue-800 mb-1">
          Report System
        </h2>
        <p className="text-sm text-gray-600">
          Fill this official form to file a cyber fraud or suspicious incident report with cyber authorities.
        </p>
      </div>

      <div
        id="report-form-card"
        className="border-2 border-gray-300 rounded-lg p-5 mb-8 bg-gray-50 shadow-sm"
      >
        <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
          <FileText className="text-blue-700" size={18} />
          <span>New Incident Report</span>
        </h3>

        <form onSubmit={submitReport}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="reporter-name-input"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="reporter-name-input"
                type="text"
                value={form.reporter}
                onChange={(e) => handleChange("reporter", e.target.value)}
                placeholder="e.g. Ramesh Patil"
                className="w-full border-2 border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-600 transition"
              />
              {errors.reporter && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  {errors.reporter}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="fraud-type-select"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Fraud Type <span className="text-red-500">*</span>
              </label>
              <select
                id="fraud-type-select"
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full border-2 border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-600 transition"
              >
                {FRAUD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="location-select"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                City / Location <span className="text-red-500">*</span>
              </label>
              <select
                id="location-select"
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full border-2 border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-600 transition"
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="evidence-link-input"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Evidence Link <span className="text-gray-400 text-xs font-normal">(optional)</span>
              </label>
              <input
                id="evidence-link-input"
                type="text"
                value={form.link}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="https://fake-link-or-screenshot.com"
                className="w-full border-2 border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-blue-600 transition"
              />
              {errors.link && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  {errors.link}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="description-textarea"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Incident Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description-textarea"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="Describe what happened: amount requested, mode of communication, suspicious messages, phone numbers, etc."
              className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-600 transition"
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                {errors.description}
              </p>
            )}
          </div>

          {errors.form && (
            <div className="mb-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2 flex items-center gap-1.5 font-medium">
              <AlertCircle size={15} />
              <span>{errors.form}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              id="submit-report-button"
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white px-5 py-2 rounded font-semibold text-sm flex items-center gap-1.5 transition cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Submitting report...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Report</span>
                </>
              )}
            </button>
            {submittedMsg && (
              <div
                id="report-submitted-success"
                className="text-xs sm:text-sm font-semibold text-green-700 flex items-center gap-1 bg-green-50 border border-green-300 px-3 py-1.5 rounded"
              >
                <CheckCircle2 size={16} /> <span>{submittedMsg}</span>
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 id="all-reports-heading" className="font-bold text-gray-800 text-base">
          All Submitted Reports ({reports.length})
        </h3>
        <span className="text-xs text-gray-500">Live tracker</span>
      </div>

      <div id="reports-list" className="space-y-3">
        {reports.map((r) => (
          <div
            key={r.id}
            id={`report-item-${r.id}`}
            className="border-2 border-gray-300 bg-white rounded-lg p-4 shadow-xs hover:border-gray-400 transition"
          >
            <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
              <div>
                <p className="font-bold text-gray-900 text-base">
                  {r.type} <span className="text-gray-400 font-normal">|</span>{" "}
                  <span className="text-blue-700">{r.location}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Reported by <span className="font-medium text-gray-700">{r.reporter}</span> on{" "}
                  <span className="font-medium text-gray-700">{r.date}</span>
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>

            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-200">
              {r.description}
            </p>

            {r.link && (
              <p className="text-xs text-blue-600 mt-2 truncate">
                <span className="font-medium text-gray-600">Evidence Link: </span>
                <span className="font-mono bg-blue-50 px-1.5 py-0.5 rounded">{r.link}</span>
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
              <span>Report ID: #{r.id}</span>
              <span>
                Assigned Expert:{" "}
                {r.expert ? (
                  <span className="font-semibold text-gray-800">{r.expert}</span>
                ) : (
                  <span className="italic text-gray-400">Awaiting Assignment</span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
