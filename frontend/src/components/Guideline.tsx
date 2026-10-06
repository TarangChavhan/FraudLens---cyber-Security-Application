import { GUIDELINES } from "../data";
import { ShieldCheck, Check } from "lucide-react";

export default function Guideline() {
  return (
    <div id="guideline-container" className="p-4 max-w-3xl mx-auto">
      <div className="mb-4">
        <h2 id="guideline-heading" className="text-xl font-bold text-blue-800 mb-1 flex items-center gap-2">
          <ShieldCheck className="text-blue-700" size={24} />
          <span>Cyber Safety Guidelines</span>
        </h2>
        <p className="text-sm text-gray-600">
          Essential cybersecurity precautions and guidelines maintained in the database to keep citizens and employees safe from online fraud.
        </p>
      </div>

      <div className="space-y-3.5">
        {GUIDELINES.map((g, i) => (
          <div
            key={i}
            id={`guideline-card-${i + 1}`}
            className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-xs hover:border-blue-300 transition"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <h3 className="font-bold text-gray-900 text-base">
                {g.title}
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed pl-8">
              {g.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <h4 className="text-sm font-bold text-blue-900 mb-1">National Cyber Crime Reporting Helpline</h4>
        <p className="text-xs text-blue-800 leading-relaxed">
          In emergency situations involving immediate financial deduction, dial <strong className="font-semibold text-blue-950">1930</strong> right away to freeze disputed transactions with the financial intermediary.
        </p>
      </div>
    </div>
  );
}
