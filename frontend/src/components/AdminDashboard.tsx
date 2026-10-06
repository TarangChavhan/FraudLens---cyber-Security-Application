import { FraudReport } from "../types";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { CheckCircle, Clock, AlertCircle, Layers } from "lucide-react";

interface AdminDashboardProps {
  reports: FraudReport[];
}

export default function AdminDashboard({ reports }: AdminDashboardProps) {
  const solved = reports.filter((r) => r.status === "Solved").length;
  const pending = reports.filter((r) => r.status === "Pending").length;
  const inProgress = reports.filter((r) => r.status === "In Progress").length;
  const total = reports.length;

  const pieData = [
    { name: "Solved", value: solved },
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
  ];
  const pieColors = ["#16a34a", "#eab308", "#2563eb"];

  return (
    <div id="admin-dashboard-container" className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 id="admin-dashboard-heading" className="text-xl font-bold text-red-700 mb-1">
          Report Status Overview
        </h2>
        <p className="text-sm text-gray-600">
          Executive monitoring metrics of active and resolved cyber fraud investigations.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div
          id="stat-card-total"
          className="border-2 border-gray-300 rounded-lg p-3 text-center bg-white shadow-xs"
        >
          <div className="flex justify-center mb-1 text-gray-500">
            <Layers size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{total}</p>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Reports</p>
        </div>

        <div
          id="stat-card-solved"
          className="border-2 border-green-400 rounded-lg p-3 text-center bg-green-50 shadow-xs"
        >
          <div className="flex justify-center mb-1 text-green-600">
            <CheckCircle size={20} />
          </div>
          <p className="text-2xl font-bold text-green-700">{solved}</p>
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Solved</p>
        </div>

        <div
          id="stat-card-in-progress"
          className="border-2 border-blue-400 rounded-lg p-3 text-center bg-blue-50 shadow-xs"
        >
          <div className="flex justify-center mb-1 text-blue-600">
            <Clock size={20} />
          </div>
          <p className="text-2xl font-bold text-blue-700">{inProgress}</p>
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">In Progress</p>
        </div>

        <div
          id="stat-card-pending"
          className="border-2 border-yellow-400 rounded-lg p-3 text-center bg-yellow-50 shadow-xs"
        >
          <div className="flex justify-center mb-1 text-yellow-600">
            <AlertCircle size={20} />
          </div>
          <p className="text-2xl font-bold text-yellow-700">{pending}</p>
          <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Pending</p>
        </div>
      </div>

      <div className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-xs">
        <h3 className="font-bold text-gray-800 mb-1 text-base">Resolution Ratio Breakdown</h3>
        <p className="text-xs text-gray-500 mb-4">
          Distribution between solved cases and unresolved backlog
        </p>

        {total === 0 ? (
          <p className="text-sm text-gray-500 text-center py-10">No report records available.</p>
        ) : (
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={30}
                  paddingAngle={4}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} cases (${((value / total) * 100).toFixed(1)}%)`,
                    name,
                  ]}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
