import { LOCATIONS, FRAUD_TYPES } from "../data";
import { FraudReport } from "../types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AlertTriangle, MapPin, Tag } from "lucide-react";

interface AnalyzeFraudProps {
  reports: FraudReport[];
}

export default function AnalyzeFraud({ reports }: AnalyzeFraudProps) {
  const byLocation = LOCATIONS.map((loc) => ({
    location: loc,
    count: reports.filter((r) => r.location === loc).length,
  })).filter((d) => d.count > 0);

  const byType = FRAUD_TYPES.map((t) => ({
    type: t,
    count: reports.filter((r) => r.type === t).length,
  })).filter((d) => d.count > 0);

  const topLocation =
    byLocation.length > 0
      ? byLocation.reduce((a, b) => (b.count > a.count ? b : a))
      : null;

  return (
    <div id="analyze-fraud-container" className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 id="analyze-fraud-heading" className="text-xl font-bold text-red-700 mb-1">
          Fraud Geographic & Pattern Analysis
        </h2>
        <p className="text-sm text-gray-600">
          Geographical hotspots and crime category distributions to deploy targeted cyber awareness programs.
        </p>
      </div>

      {topLocation && (
        <div
          id="highest-fraud-alert"
          className="border-2 border-red-400 bg-red-50 rounded-lg p-3.5 mb-6 flex items-center gap-3 shadow-xs"
        >
          <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-red-800">
              Highest Risk Hotspot: {topLocation.location} ({topLocation.count} reports filed)
            </p>
            <p className="text-xs text-red-700 mt-0.5">
              Recommend initiating localized cyber awareness advisories and intensified surveillance in this zone.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div
          id="location-chart-card"
          className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-xs"
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="text-blue-700" size={18} />
            <h3 className="font-bold text-gray-800 text-base">Incidents by Location</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">Volume of incidents reported across metropolitan zones</p>

          {byLocation.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No location data recorded yet.</p>
          ) : (
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byLocation} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="location" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value} incidents`, "Reports"]}
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "6px" }}
                  />
                  <Bar dataKey="count" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div
          id="type-chart-card"
          className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-xs"
        >
          <div className="flex items-center gap-2 mb-2">
            <Tag className="text-red-600" size={18} />
            <h3 className="font-bold text-gray-800 text-base">Incidents by Fraud Category</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">Breakdown of modus operandi reported by victims</p>

          {byType.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No category data recorded yet.</p>
          ) : (
            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={byType}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    dataKey="type"
                    type="category"
                    width={130}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} incidents`, "Category Total"]}
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", borderRadius: "6px" }}
                  />
                  <Bar dataKey="count" fill="#dc2626" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
