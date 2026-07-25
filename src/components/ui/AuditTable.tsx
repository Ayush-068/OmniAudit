import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuditStore } from '../../store/useAuditStore';
import { RiskLevel } from '../../types/audit';

export const AuditTable: React.FC = () => {
  const departments = useAuditStore((state) => state.departments);
  const verifyFlag = useAuditStore((state) => state.verifyFlag);
  const dismissFlag = useAuditStore((state) => state.dismissFlag);
  const selectDepartment = useAuditStore((state) => state.selectDepartment);
  const setViewMode = useAuditStore((state) => state.setViewMode);

  const [expandedFlagId, setExpandedFlagId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  // Flatten all flags from all departments
  const allFlags = departments.flatMap((dept) =>
    dept.flags.map((flag) => ({
      ...flag,
      deptName: dept.name,
      deptCode: dept.code,
      deptId: dept.id,
      deptRiskLevel: dept.riskLevel,
    }))
  );

  const filteredFlags = allFlags.filter((f) => {
    if (filterSeverity === 'ALL') return true;
    return f.severity === filterSeverity;
  });

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto font-sans text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Table Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div>
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              Contract Compliance Audit Matrix Table
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Detailed breakdown of all contract clauses, violated rules, and reasoning chains across all Citadel wings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">Severity Filter:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-slate-950 text-xs text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none font-mono"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 font-mono text-slate-400 uppercase text-[10px]">
                  <th className="p-4">Department / Code</th>
                  <th className="p-4">Contract Clause</th>
                  <th className="p-4">Violated Corporate Rule</th>
                  <th className="p-4">Risk Score</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredFlags.map((flag) => {
                  const isExpanded = expandedFlagId === flag.flag_id;
                  return (
                    <React.Fragment key={flag.flag_id}>
                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono">
                          <button
                            onClick={() => {
                              selectDepartment(flag.deptId);
                              setViewMode('3D');
                            }}
                            className="text-left hover:text-cyan-400 transition-colors group"
                          >
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {flag.deptCode}
                              <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-[10px] text-slate-400">{flag.deptName}</div>
                          </button>
                        </td>

                        <td className="p-4 font-semibold text-slate-200 max-w-xs">
                          {flag.contract_clause}
                        </td>

                        <td className="p-4 font-mono text-rose-300 max-w-xs">
                          {flag.violated_rule}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                              flag.severity === 'CRITICAL'
                                ? 'bg-rose-950 text-rose-300 border border-rose-700'
                                : flag.severity === 'HIGH'
                                ? 'bg-red-950 text-red-300 border border-red-700'
                                : flag.severity === 'MEDIUM'
                                ? 'bg-amber-950 text-amber-300 border border-amber-700'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            }`}
                          >
                            {flag.severity} ({flag.risk_score})
                          </span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                              flag.status === 'VERIFIED'
                                ? 'bg-emerald-950 text-emerald-300'
                                : flag.status === 'DISMISSED'
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-amber-950 text-amber-300'
                            }`}
                          >
                            {flag.status}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                setExpandedFlagId(isExpanded ? null : flag.flag_id)
                              }
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-mono flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              {isExpanded ? 'Hide <reasoning>' : 'View <reasoning>'}
                              {isExpanded ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>

                            {flag.status === 'UNVERIFIED' && (
                              <>
                                <button
                                  onClick={() => verifyFlag(flag.deptId, flag.flag_id)}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium"
                                >
                                  Verify
                                </button>
                                <button
                                  onClick={() => dismissFlag(flag.deptId, flag.flag_id)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px]"
                                >
                                  Dismiss
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Legal Reasoning Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/90">
                          <td colSpan={6} className="p-4">
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                              <div className="text-cyan-400 font-bold flex items-center gap-1.5 uppercase text-[10px]">
                                <Sparkles className="w-3.5 h-3.5" />
                                Legal Audit Reasoning Chain for {flag.flag_id}
                              </div>
                              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                                {flag.reasoning_chain.replace(/<\/?reasoning>/g, '')}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
