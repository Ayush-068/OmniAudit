import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuditStore } from '../../store/useAuditStore';

export const AnalyticsView: React.FC = () => {
  const departments = useAuditStore((state) => state.departments);
  const getMetrics = useAuditStore((state) => state.getMetrics);
  const setViewMode = useAuditStore((state) => state.setViewMode);
  const selectDepartment = useAuditStore((state) => state.selectDepartment);

  const metrics = getMetrics();

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto font-sans text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Analytics Header */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              OmniAudit Enterprise Risk & Compliance Intelligence
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Quantitative risk score distributions, contract compliance velocity, and departmental vulnerability ratings.
            </p>
          </div>

          <button
            onClick={() => setViewMode('3D')}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all w-fit"
          >
            Return to 3D Citadel Map →
          </button>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Overall Citadel Score</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-white mt-2">
              {metrics.overallScore}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Systemic Rating: <strong className="text-cyan-400">{metrics.systemicRiskRating}</strong>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-rose-900/40">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Critical Risk Exposure</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-rose-400 mt-2">
              {metrics.criticalFlagsCount}
            </div>
            <div className="text-[11px] text-rose-400/80 mt-1">
              Requires immediate CCO escalation
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Active Compliance Flags</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-amber-400 mt-2">
              {metrics.totalFlags - metrics.verifiedFlagsCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Out of {metrics.totalFlags} total identified clauses
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Verified Mitigations</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">
              {metrics.verifiedFlagsCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {Math.round((metrics.verifiedFlagsCount / (metrics.totalFlags || 1)) * 100)}% audit resolution rate
            </div>
          </div>
        </div>

        {/* Department Compliance Score Breakdown Bars */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Departmental Compliance Health Breakdown
          </h3>

          <div className="space-y-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => {
                  selectDepartment(dept.id);
                  setViewMode('3D');
                }}
                className="group cursor-pointer p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 transition-all"
              >
                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {dept.code} — {dept.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        dept.riskLevel === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-300 border border-rose-700'
                          : dept.riskLevel === 'HIGH'
                          ? 'bg-red-950 text-red-300 border border-red-700'
                          : dept.riskLevel === 'MEDIUM'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      }`}
                    >
                      {dept.riskLevel}
                    </span>
                  </div>
                  <span className="font-bold text-cyan-400">{dept.score}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dept.score > 85
                        ? 'bg-emerald-500'
                        : dept.score > 65
                        ? 'bg-amber-500'
                        : dept.score > 40
                        ? 'bg-red-500'
                        : 'bg-rose-600 animate-pulse'
                    }`}
                    style={{ width: `${dept.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
