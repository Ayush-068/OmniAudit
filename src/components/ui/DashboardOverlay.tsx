import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Search,
  RotateCcw,
  MousePointer,
  Maximize2,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Calendar,
  Layers,
  BarChart3,
  ChevronRight,
  Sparkles,
  Info,
  Filter,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useAuditStore } from '../../store/useAuditStore';
import { RiskLevel, ComplianceFlag } from '../../types/audit';

export const DashboardOverlay: React.FC = () => {
  const departments = useAuditStore((state) => state.departments);
  const selectedDepartment = useAuditStore((state) => state.selectedDepartment);
  const selectDepartment = useAuditStore((state) => state.selectDepartment);
  const verifyFlag = useAuditStore((state) => state.verifyFlag);
  const dismissFlag = useAuditStore((state) => state.dismissFlag);

  const searchQuery = useAuditStore((state) => state.searchQuery);
  const setSearchQuery = useAuditStore((state) => state.setSearchQuery);
  const riskFilter = useAuditStore((state) => state.riskFilter);
  const setRiskFilter = useAuditStore((state) => state.setRiskFilter);
  const viewMode = useAuditStore((state) => state.viewMode);
  const setViewMode = useAuditStore((state) => state.setViewMode);
  const resetAuditState = useAuditStore((state) => state.resetAuditState);
  const getMetrics = useAuditStore((state) => state.getMetrics);

  const metrics = getMetrics();

  const [expandedReasoningId, setExpandedReasoningId] = useState<string | null>(null);

  // Filtered departments for quick list or table
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.flags.some((f) => f.contract_clause.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRisk = riskFilter === 'ALL' || dept.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  // Risk Color Utilities
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'LOW':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-700/50';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-400 border-amber-700/50';
      case 'HIGH':
        return 'bg-red-950/80 text-red-400 border-red-700/50';
      case 'CRITICAL':
      default:
        return 'bg-rose-950/90 text-rose-300 border-rose-600/70 animate-pulse';
    }
  };

  const getSystemicBadgeColor = (rating: string) => {
    switch (rating) {
      case 'OPTIMAL':
        return 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30';
      case 'ELEVATED':
        return 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30';
      case 'SEVERE':
        return 'from-red-500/20 to-rose-500/10 text-red-400 border-red-500/30';
      case 'CRITICAL':
      default:
        return 'from-rose-600/30 to-red-600/20 text-rose-300 border-rose-500/50';
    }
  };

  // Format reasoning chain tags nicely
  const renderFormattedReasoning = (rawReasoning: string) => {
    // Strip <reasoning> tags
    const cleanText = rawReasoning.replace(/<\/?reasoning>/g, '').trim();
    const lines = cleanText.split('\n').filter((l) => l.trim().length > 0);

    return (
      <div className="space-y-1.5 font-sans text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-sky-400 tracking-wider mb-2">
          <Sparkles className="w-3 h-3 text-sky-400" />
          Legal & Audit Reasoning Chain
        </div>
        {lines.map((line, idx) => {
          return (
            <div key={idx} className="flex items-start gap-2 text-slate-300 leading-relaxed">
              <span className="text-sky-400 font-mono font-bold shrink-0">{idx + 1}.</span>
              <span>{line.replace(/^\d+\.\s*/, '')}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 overflow-hidden">
      {/* TOP BAR / HUD HEADER */}
      <header className="pointer-events-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/85 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-2xl">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-mono">
                OmniAudit <span className="text-cyan-400">// Compliance Citadel</span>
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                3D RISK MAP
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Contract Audit, Legal Reasoning Chain & Enterprise Risk Matrix
            </p>
          </div>
        </div>

        {/* Center Stats Bar */}
        <div className="flex flex-wrap items-center gap-3 md:gap-6 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Critical Flags</div>
              <div className="text-sm font-bold font-mono text-rose-400">
                {metrics.criticalFlagsCount}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">High Risk</div>
              <div className="text-sm font-bold font-mono text-amber-400">
                {metrics.highFlagsCount}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Verified</div>
              <div className="text-sm font-bold font-mono text-emerald-400">
                {metrics.verifiedFlagsCount}
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Systemic Rating Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border bg-gradient-to-r ${getSystemicBadgeColor(
              metrics.systemicRiskRating
            )}`}
          >
            <div className="text-right">
              <div className="text-[9px] uppercase font-mono text-slate-300">Systemic Health</div>
              <div className="text-xs font-bold font-mono tracking-wide">
                {metrics.overallScore}% — {metrics.systemicRiskRating}
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Switcher & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('3D')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === '3D'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              3D Citadel
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Matrix Table
            </button>
            <button
              onClick={() => setViewMode('ANALYTICS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'ANALYTICS'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
          </div>

          <button
            onClick={resetAuditState}
            title="Reset Audit Matrix"
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* FILTER & SEARCH SUB-BAR */}
      <div className="pointer-events-auto mt-3 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800/60">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search departments, clauses, rules, or contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-white"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Risk Level Filter Chips */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-1 hidden sm:inline">Filter:</span>
          {(['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-bold transition-all ${
                riskFilter === lvl
                  ? lvl === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-300 border border-rose-600'
                    : lvl === 'HIGH'
                    ? 'bg-red-950 text-red-300 border border-red-600'
                    : lvl === 'MEDIUM'
                    ? 'bg-amber-950 text-amber-300 border border-amber-600'
                    : lvl === 'LOW'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-600'
                  : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* MIDDLE SECTION - FLEX DISPLAY WITH SLIDE OVER PANEL */}
      <div className="flex-1 my-3 relative overflow-hidden flex justify-between gap-4">
        {/* Left Quick Department Selector List (Only shown if no department selected) */}
        {!selectedDepartment && viewMode === '3D' && (
          <div className="pointer-events-auto hidden md:flex flex-col gap-2 w-64 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800/80 max-h-full overflow-y-auto">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 px-1 mb-1">
              Citadel Wings ({filteredDepartments.length})
            </div>
            {filteredDepartments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => selectDepartment(dept.id)}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all text-left"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-white">{dept.code}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded border uppercase font-mono font-bold ${getRiskBadge(
                        dept.riskLevel
                      )}`}
                    >
                      {dept.riskLevel}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 truncate max-w-[150px]">{dept.name}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* RIGHT SIDE PANEL: AUDIT HUD DETAILS (Appears when department selected) */}
        {selectedDepartment && (
          <div className="pointer-events-auto ml-auto w-full max-w-lg bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col max-h-full overflow-hidden transition-all duration-300 animate-in slide-in-from-right">
            {/* Header / Department Summary */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                    {selectedDepartment.code}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border uppercase font-mono font-bold ${getRiskBadge(
                      selectedDepartment.riskLevel
                    )}`}
                  >
                    {selectedDepartment.riskLevel} RISK
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedDepartment.name}</h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedDepartment.description}
                </p>
              </div>

              <button
                onClick={() => selectDepartment(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Department Meta Specs */}
            <div className="grid grid-cols-2 gap-3 my-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] uppercase text-slate-400 font-mono">Lead Auditor</div>
                  <div className="font-semibold text-slate-200 truncate">
                    {selectedDepartment.leadAuditor}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase text-slate-400 font-mono">Last Audit Date</div>
                  <div className="font-semibold text-slate-200">
                    {selectedDepartment.lastAuditDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Flags Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Contract Compliance Flags ({selectedDepartment.flags.length})
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Score:{' '}
                <strong className="text-cyan-400">{selectedDepartment.score}%</strong>
              </span>
            </div>

            {/* Scrollable Compliance Flags List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {selectedDepartment.flags.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No active flags recorded for this wing.
                </div>
              ) : (
                selectedDepartment.flags.map((flag) => (
                  <div
                    key={flag.flag_id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      flag.status === 'VERIFIED'
                        ? 'bg-emerald-950/30 border-emerald-800/50 opacity-80'
                        : flag.status === 'DISMISSED'
                        ? 'bg-slate-950/40 border-slate-800 opacity-50 line-through'
                        : flag.severity === 'CRITICAL'
                        ? 'bg-rose-950/40 border-rose-700/60 shadow-lg shadow-rose-950/20'
                        : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    {/* Flag Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                              flag.severity === 'CRITICAL'
                                ? 'bg-rose-900 text-rose-200'
                                : flag.severity === 'HIGH'
                                ? 'bg-red-900 text-red-200'
                                : 'bg-amber-900 text-amber-200'
                            }`}
                          >
                            {flag.severity} RISK ({flag.risk_score})
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {flag.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug">
                          {flag.contract_clause}
                        </h4>
                      </div>

                      {/* Status Tag */}
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          flag.status === 'VERIFIED'
                            ? 'bg-emerald-900 text-emerald-300'
                            : flag.status === 'DISMISSED'
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-amber-950 text-amber-300'
                        }`}
                      >
                        {flag.status}
                      </span>
                    </div>

                    {/* Violated Policy Rule */}
                    <div className="text-[11px] text-rose-300 font-mono bg-rose-950/30 px-2.5 py-1 rounded border border-rose-900/40 mb-2">
                      <strong className="text-rose-400">Rule Violation:</strong>{' '}
                      {flag.violated_rule}
                    </div>

                    {/* Structured Reasoning Chain Toggle */}
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          setExpandedReasoningId(
                            expandedReasoningId === flag.flag_id ? null : flag.flag_id
                          )
                        }
                        className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2"
                      >
                        <Sparkles className="w-3 h-3" />
                        {expandedReasoningId === flag.flag_id
                          ? 'Hide Legal Reasoning Chain'
                          : 'View Legal Reasoning Chain (<reasoning>)'}
                      </button>

                      {expandedReasoningId === flag.flag_id &&
                        renderFormattedReasoning(flag.reasoning_chain)}
                    </div>

                    {/* Action Buttons: Verify / Dismiss */}
                    {flag.status === 'UNVERIFIED' && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() =>
                            verifyFlag(selectedDepartment.id, flag.flag_id)
                          }
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Verify & Mitigate
                        </button>
                        <button
                          onClick={() =>
                            dismissFlag(selectedDepartment.id, flag.flag_id)
                          }
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Dismiss Flag
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM CONTROL HELP & EVENT LOG TICKER */}
      <footer className="pointer-events-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Controls Help Box */}
        <div className="flex items-center gap-4 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-xl">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold text-[11px]">
            <MousePointer className="w-3.5 h-3.5" />
            3D CONTROLS:
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>
              <strong className="text-slate-200">Orbit:</strong> Left-Click + Drag
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              <strong className="text-slate-200">Pan:</strong> Right-Click + Drag
            </span>
            <span>•</span>
            <span>
              <strong className="text-slate-200">Zoom:</strong> Scroll
            </span>
            <span>•</span>
            <span>
              <strong className="text-slate-200">Inspect:</strong> Click Wing
            </span>
          </div>

          <button
            onClick={() => selectDepartment(null)}
            className="ml-auto text-[10px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Reset Camera
          </button>
        </div>

        {/* Live Event Ticker */}
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-400 max-w-md overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="font-mono text-[11px] text-cyan-400 font-bold shrink-0">
            AUDIT TRAIL LOG:
          </span>
          <span className="font-mono text-[11px] text-slate-300 truncate">
            {selectedDepartment
              ? `Inspecting ${selectedDepartment.code} — ${selectedDepartment.flags.length} Contract Clauses Flagged`
              : metrics.criticalFlagsCount > 0
              ? `Alert: ${metrics.criticalFlagsCount} Critical Contract Violations requiring immediate mitigation`
              : 'All 3D Citadel wings operational — Continuous audit monitoring active'}
          </span>
        </div>
      </footer>
    </div>
  );
};
