import { useState, useEffect } from "react";
import { Search, AlertTriangle, ShieldCheck, ShieldAlert, ExternalLink, Loader2 } from "lucide-react";
import { SUSPICIOUS_HINTS } from "../data";
import { CheckResult } from "../types";
import { api } from "../services/api";

export default function LinkCheckSystem() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [history, setHistory] = useState<CheckResult[]>([
    {
      id: 1,
      url: "https://secure-bank-login.xyz/update-kyc",
      score: 25,
      verdict: "Dangerous",
      hits: ["secure-", "login", ".xyz", "update", "kyc"],
    },
    {
      id: 2,
      url: "https://www.onlinesbi.sbi",
      score: 100,
      verdict: "Safe",
      hits: [],
    },
  ]);

  // Load verified links history from MongoDB on mount
  useEffect(() => {
    let isMounted = true;
    api.getLinkHistory().then((dbHistory) => {
      if (isMounted && dbHistory && dbHistory.length > 0) {
        setHistory(dbHistory);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const checkLink = async (linkToCheck?: string) => {
    const target = linkToCheck !== undefined ? linkToCheck : url;
    if (!target.trim() || isChecking) return;

    setIsChecking(true);
    try {
      // Call backend API to evaluate and persist to MongoDB
      const res = await api.checkLink(target.trim());
      setResult(res);
      setHistory((prev) => [res, ...prev.filter((p) => p.url !== res.url)].slice(0, 10));
    } catch (err) {
      console.warn("Backend link check error, calculating locally:", err);
      // Fallback local heuristic calculation
      const lower = target.toLowerCase();
      const hits = SUSPICIOUS_HINTS.filter((h) => lower.includes(h));
      const isHttps = lower.startsWith("https://");
      let score = 100 - hits.length * 20 - (isHttps ? 0 : 15);
      if (score < 0) score = 0;
      if (score > 100) score = 100;

      const verdict: "Safe" | "Suspicious" | "Dangerous" =
        score >= 70 ? "Safe" : score >= 40 ? "Suspicious" : "Dangerous";

      const localResult: CheckResult = {
        id: Date.now(),
        url: target.trim(),
        score,
        verdict,
        hits,
      };

      setResult(localResult);
      setHistory((prev) => [localResult, ...prev.filter((p) => p.url !== localResult.url)].slice(0, 10));
    } finally {
      setIsChecking(false);
    }
  };

  const verdictStyles = {
    Safe: {
      container: "text-green-800 bg-green-50 border-green-400",
      badge: "bg-green-600 text-white",
      icon: <ShieldCheck className="text-green-600" size={24} />,
    },
    Suspicious: {
      container: "text-yellow-800 bg-yellow-50 border-yellow-400",
      badge: "bg-yellow-600 text-white",
      icon: <AlertTriangle className="text-yellow-600" size={24} />,
    },
    Dangerous: {
      container: "text-red-800 bg-red-50 border-red-400",
      badge: "bg-red-600 text-white",
      icon: <ShieldAlert className="text-red-600" size={24} />,
    },
  };

  const sampleLinks = [
    { label: "Suspicious KYC Link", link: "http://bank-kyc-verify-urgent.xyz/login" },
    { label: "Lottery Claim Link", link: "http://win-free-prize-bonus.tk/claim" },
    { label: "Official Portal", link: "https://cybercrime.gov.in" },
  ];

  return (
    <div id="link-check-container" className="p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <h2 id="link-check-heading" className="text-xl font-bold text-blue-800 mb-1">
          Link Check System
        </h2>
        <p className="text-sm text-gray-600">
          Paste any website or message link below to verify if it appears safe or fraudulent.
        </p>
      </div>

      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm mb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkLink();
          }}
          className="flex flex-col sm:flex-row gap-2 mb-3"
        >
          <input
            id="url-check-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. https://secure-bank-login.xyz/update"
            className="flex-1 border-2 border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-600 transition"
          />
          <button
            id="url-check-submit-button"
            type="submit"
            disabled={isChecking}
            className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white px-5 py-2 rounded flex items-center justify-center gap-1.5 font-semibold text-sm transition cursor-pointer"
          >
            {isChecking ? (
              <>
                <Loader2 size={16} className="animate-spin" /> <span>Checking...</span>
              </>
            ) : (
              <>
                <Search size={16} /> <span>Check</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500 pt-1 border-t border-gray-100">
          <span className="font-semibold text-gray-600">Quick tests:</span>
          {sampleLinks.map((sample, idx) => (
            <button
              key={idx}
              id={`sample-link-btn-${idx}`}
              type="button"
              onClick={() => {
                setUrl(sample.link);
                checkLink(sample.link);
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition cursor-pointer text-xs"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div
          id="link-check-result-card"
          className={`border-2 rounded-lg p-4 mb-6 shadow-sm ${
            verdictStyles[result.verdict].container
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              {verdictStyles[result.verdict].icon}
              <h3 className="font-bold text-base">
                Result: {result.verdict}
              </h3>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                verdictStyles[result.verdict].badge
              }`}
            >
              Safety Score: {result.score}/100
            </span>
          </div>

          <div className="mt-2 space-y-1.5 text-sm">
            <p className="font-mono text-xs break-all bg-white/60 p-2 rounded border border-current/20">
              {result.url}
            </p>
            {result.hits.length > 0 ? (
              <div className="mt-2">
                <p className="font-semibold text-xs uppercase tracking-wide">
                  Suspicious keywords detected:
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.hits.map((hit, i) => (
                    <span
                      key={i}
                      className="bg-red-200/80 text-red-900 border border-red-300 font-mono text-xs px-2 py-0.5 rounded"
                    >
                      {hit}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-green-700 font-medium mt-1">
                ✓ No suspicious keywords detected in the URL structure.
              </p>
            )}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div id="recent-checks-section" className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-3 text-sm">Recent Checks in Session</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-xs uppercase font-semibold text-gray-600">
                  <th className="border border-gray-200 px-3 py-2">Link</th>
                  <th className="border border-gray-200 px-3 py-2 text-center w-20">Score</th>
                  <th className="border border-gray-200 px-3 py-2 text-center w-28">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={h.id || i} className="hover:bg-gray-50 text-xs">
                    <td className="border border-gray-200 px-3 py-2 break-all font-mono text-gray-700">
                      {h.url}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-center font-bold">
                      {h.score}/100
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-center">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                          h.verdict === "Safe"
                            ? "bg-green-100 text-green-700"
                            : h.verdict === "Suspicious"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {h.verdict}
                      </span>
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
}
