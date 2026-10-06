import React, { useState } from "react";
import { EXPERTS } from "../data";
import { FraudReport } from "../types";
import StatusBadge from "./StatusBadge";
import { Users, CheckCircle, UserCheck, Loader2 } from "lucide-react";
import { api } from "../services/api";

interface AppointExpertProps {
  reports: FraudReport[];
  setReports: React.Dispatch<React.SetStateAction<FraudReport[]>>;
  onAssignExpert?: (id: number, expert: string) => Promise<FraudReport>;
  onUpdateStatus?: (id: number, status: "Solved" | "Pending" | "In Progress") => Promise<FraudReport>;
}

export default function AppointExpert({
  reports,
  setReports,
  onAssignExpert,
  onUpdateStatus,
}: AppointExpertProps) {
  const [selectedExpert, setSelectedExpert] = useState<Record<number, string>>({});
  const [loadingAction, setLoadingAction] = useState<Record<number, string | null>>({});

  const assign = async (id: number) => {
    const expert = selectedExpert[id];
    if (!expert) return;

    setLoadingAction((prev) => ({ ...prev, [id]: "assign" }));
    try {
      let updated: FraudReport;
      if (onAssignExpert) {
        updated = await onAssignExpert(id, expert);
      } else {
        updated = await api.assignExpert(id, expert);
      }
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error("Failed to assign expert:", err);
      alert("Failed to assign expert to this report. Please check backend connection.");
    } finally {
      setLoadingAction((prev) => ({ ...prev, [id]: null }));
    }
  };

  const markSolved = async (id: number) => {
    setLoadingAction((prev) => ({ ...prev, [id]: "solve" }));
    try {
      let updated: FraudReport;
      if (onUpdateStatus) {
        updated = await onUpdateStatus(id, "Solved");
      } else {
        updated = await api.updateReportStatus(id, "Solved");
      }
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error("Failed to mark solved:", err);
      alert("Failed to mark case solved in database.");
    } finally {
      setLoadingAction((prev) => ({ ...prev, [id]: null }));
    }
  };

  return (
    <div id="appoint-expert-container" className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 id="appoint-expert-heading" className="text-xl font-bold text-red-700 mb-1">
          Appoint Cyber Expert
        </h2>
        <p className="text-sm text-gray-600">
          Assign designated cyber forensic officers and cyber cell teams to investigate reported incidents.
        </p>
      </div>

      <div className="space-y-3.5">
        {reports.map((r) => (
          <div
            key={r.id}
            id={`expert-case-${r.id}`}
            className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-xs"
          >
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <p className="font-bold text-gray-900 text-base">
                  {r.type} <span className="text-gray-400 font-normal">|</span>{" "}
                  <span className="text-red-700">{r.location}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Reported by <span className="font-medium text-gray-800">{r.reporter}</span> on{" "}
                  <span className="font-medium text-gray-800">{r.date}</span>
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>

            <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2.5 rounded border border-gray-200">
              {r.description}
            </p>

            {r.link && (
              <p className="text-xs text-blue-700 mt-2 truncate font-mono">
                Evidence: {r.link}
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs flex items-center gap-1.5 text-gray-600">
                <UserCheck size={15} className="text-blue-600" />
                <span>
                  Current Expert:{" "}
                  {r.expert ? (
                    <strong className="text-gray-900 font-semibold">{r.expert}</strong>
                  ) : (
                    <span className="italic text-gray-400">None appointed</span>
                  )}
                </span>
              </div>

              {r.status !== "Solved" ? (
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    id={`expert-select-${r.id}`}
                    className="border-2 border-gray-300 rounded px-2.5 py-1 text-xs bg-white focus:outline-none focus:border-blue-600"
                    value={selectedExpert[r.id] || ""}
                    onChange={(e) =>
                      setSelectedExpert({
                        ...selectedExpert,
                        [r.id]: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Expert</option>
                    {EXPERTS.map((ex) => (
                      <option key={ex} value={ex}>
                        {ex}
                      </option>
                    ))}
                  </select>

                  <button
                    id={`assign-btn-${r.id}`}
                    onClick={() => assign(r.id)}
                    disabled={!selectedExpert[r.id] || loadingAction[r.id] === "assign"}
                    className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    {loadingAction[r.id] === "assign" ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> <span>Assigning...</span>
                      </>
                    ) : (
                      <>
                        <Users size={13} /> <span>Assign</span>
                      </>
                    )}
                  </button>

                  <button
                    id={`mark-solved-btn-${r.id}`}
                    onClick={() => markSolved(r.id)}
                    disabled={loadingAction[r.id] === "solve"}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    {loadingAction[r.id] === "solve" ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={13} /> <span>Mark Solved</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-xs text-green-700 font-semibold flex items-center gap-1">
                  <CheckCircle size={14} /> <span>Case Closed & Solved</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
