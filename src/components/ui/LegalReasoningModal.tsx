import React, { useState, useEffect } from 'react';
import {
  Scale,
  Sparkles,
  X,
  FileText,
  ShieldCheck,
  Send,
  Copy,
  Check,
  Building2,
  AlertTriangle,
  BookOpen,
  Bot,
  PlusCircle,
  Save,
  RotateCcw
} from 'lucide-react';
import { useAuditStore } from '../../store/useAuditStore';
import { RiskLevel } from '../../types/audit';

interface LegalReasoningModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClause?: string;
  initialRule?: string;
  initialDepartmentId?: string;
  initialFlagId?: string;
  existingReasoning?: string;
}

export const LegalReasoningModal: React.FC<LegalReasoningModalProps> = ({
  isOpen,
  onClose,
  initialClause = '',
  initialRule = '',
  initialDepartmentId,
  initialFlagId,
  existingReasoning = '',
}) => {
  const departments = useAuditStore((state) => state.departments);
  const addComplianceFlag = useAuditStore((state) => state.addComplianceFlag);
  const updateFlagReasoning = useAuditStore((state) => state.updateFlagReasoning);

  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    initialDepartmentId || (departments[0]?.id || '')
  );
  const [contractClause, setContractClause] = useState<string>(initialClause);
  const [violatedRule, setViolatedRule] = useState<string>(initialRule);
  const [category, setCategory] = useState<string>('Contractual Compliance');
  const [severity, setSeverity] = useState<RiskLevel>('HIGH');
  const [riskScore, setRiskScore] = useState<number>(75);
  const [customQuery, setCustomQuery] = useState<string>('');

  const [reasoningResult, setReasoningResult] = useState<string>(existingReasoning);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modeUsed, setModeUsed] = useState<'ai' | 'custom' | 'none'>('none');
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialDepartmentId) setSelectedDeptId(initialDepartmentId);
    if (initialClause) setContractClause(initialClause);
    if (initialRule) setViolatedRule(initialRule);
    if (existingReasoning) {
      setReasoningResult(existingReasoning);
      setModeUsed('custom');
    }
  }, [initialDepartmentId, initialClause, initialRule, existingReasoning, isOpen]);

  if (!isOpen) return null;

  const handleGenerateAIReasoning = async () => {
    setIsLoading(true);
    setSaveSuccess(null);

    const deptObj = departments.find((d) => d.id === selectedDeptId);

    try {
      const response = await fetch('/api/legal-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clause: contractClause || 'Standard Corporate Governance & Data Clause',
          rule: violatedRule || 'Enterprise Risk Baseline Standard',
          department: deptObj?.name || 'Enterprise Unit',
          category,
          customQuery,
        }),
      });

      const data = await response.json();
      if (data.reasoning) {
        setReasoningResult(data.reasoning);
        setModeUsed(data.mode === 'ai' ? 'ai' : 'custom');
      }
    } catch (err) {
      console.error('Error generating legal reasoning:', err);
      // Fallback
      setReasoningResult(`<reasoning>
1. Legal Statutory Baseline: Statutory analysis under ${violatedRule || 'applicable regulations'}.
2. Operational Divergence: Subject clause "${contractClause || 'Contract Clause'}" presents legal liability exposure.
3. Financial Impact: Unmitigated risk of statutory fine or contractual litigation.
4. Recommended Remediation: Execute clarifying addendum and log formal compliance exception token.
</reasoning>`);
      setModeUsed('custom');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setReasoningResult(`<reasoning>
1. Contractual Obligation: [Describe specific contractual or statutory requirement]
2. Compliance Breach / Gap: [Detail operational or legal deviation identified]
3. Risk & Liability Assessment: [Calculate legal, regulatory, or financial impact]
4. Auditor Recommendations: [Provide concrete legal remediation steps]
</reasoning>`);
    setModeUsed('custom');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reasoningResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveFlag = () => {
    if (!reasoningResult) return;

    if (initialFlagId && initialDepartmentId) {
      // Update existing flag
      updateFlagReasoning(initialDepartmentId, initialFlagId, reasoningResult);
      setSaveSuccess('Legal reasoning successfully updated on flag!');
      setTimeout(() => {
        setSaveSuccess(null);
        onClose();
      }, 1500);
    } else {
      // Add new compliance flag
      addComplianceFlag(selectedDeptId, {
        contract_clause: contractClause || 'Custom Legal Audit Query',
        violated_rule: violatedRule || 'Internal Governance Standard',
        reasoning_chain: reasoningResult,
        risk_score: riskScore,
        severity,
        category,
      });

      const deptObj = departments.find((d) => d.id === selectedDeptId);
      setSaveSuccess(`New compliance flag & legal reasoning added to ${deptObj?.name || 'Department'}!`);
      setTimeout(() => {
        setSaveSuccess(null);
        onClose();
      }, 1500);
    }
  };

  // Helper to render clean reasoning
  const renderFormattedReasoning = (raw: string) => {
    const clean = raw.replace(/<\/?reasoning>/g, '').trim();
    const lines = clean.split('\n').filter((l) => l.trim().length > 0);

    return (
      <div className="space-y-2 text-xs text-slate-200">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2.5 p-2 rounded bg-slate-900/60 border border-slate-800/80"
          >
            <span className="shrink-0 w-5 h-5 rounded bg-sky-500/20 text-sky-400 font-mono text-[10px] font-bold flex items-center justify-center border border-sky-500/30">
              {idx + 1}
            </span>
            <p className="leading-relaxed">{line.replace(/^\d+[\.\)]\s*/, '')}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100 tracking-wide">
                  Legal Reasoning Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  Gemini AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Query AI legal counsel or formulate custom step-by-step reasoning chains
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          {/* Query & Context Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                Target Department
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code}) - {d.riskLevel} RISK
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Category / Legal Domain
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Contractual Liability, Data Privacy, Financial Reporting"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-400" />
                Contract Clause or Legal Scenario
              </label>
              <textarea
                value={contractClause}
                onChange={(e) => setContractClause(e.target.value)}
                rows={2}
                placeholder="e.g. Clause 14.2: Vendor limitation of liability capped at $50,000 despite high data liability..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Statutory Rule or Compliance Baseline
              </label>
              <input
                type="text"
                value={violatedRule}
                onChange={(e) => setViolatedRule(e.target.value)}
                placeholder="e.g. GDPR Article 28 / EU AI Act / ASC 606 / SOC 2 Type II"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                Specific Legal Reasoning Prompt / Inquiry
              </label>
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="e.g. What is the jurisdiction risk under Singapore international arbitration rules?"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleGenerateAIReasoning}
              disabled={isLoading}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium text-xs shadow-lg shadow-sky-950/50 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-sky-200" />
                  Analyzing Legal Reasoning...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  Ask AI Legal Reasoning
                </>
              )}
            </button>

            <button
              onClick={handleCreateTemplate}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl font-medium text-xs transition-all"
            >
              <PlusCircle className="w-4 h-4 text-slate-400" />
              Write Custom Reasoning
            </button>
          </div>

          {/* Legal Reasoning Output & Editor */}
          {reasoningResult && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-sky-400" />
                  Reasoning Chain (<span className="font-mono text-slate-300">&lt;reasoning&gt;</span>)
                </label>
                <div className="flex items-center gap-2">
                  {modeUsed === 'ai' && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950 text-sky-300 border border-sky-800">
                      AI Generated
                    </span>
                  )}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Formatted View */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                {renderFormattedReasoning(reasoningResult)}
              </div>

              {/* Raw Editable Text Area */}
              <details className="group text-xs">
                <summary className="cursor-pointer text-slate-400 hover:text-slate-200 flex items-center gap-1 py-1 font-mono text-[11px]">
                  <span>[+] Edit Raw Legal Reasoning Source Code</span>
                </summary>
                <textarea
                  value={reasoningResult}
                  onChange={(e) => setReasoningResult(e.target.value)}
                  rows={6}
                  className="w-full mt-2 bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300 p-3 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </details>

              {/* Optional Flag Settings if creating new flag */}
              {!initialFlagId && (
                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">Severity Level</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as RiskLevel)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                    >
                      <option value="LOW">LOW RISK</option>
                      <option value="MEDIUM">MEDIUM RISK</option>
                      <option value="HIGH">HIGH RISK</option>
                      <option value="CRITICAL">CRITICAL RISK</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                      Risk Score ({riskScore}/100)
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={riskScore}
                      onChange={(e) => setRiskScore(Number(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              {saveSuccess}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          {reasoningResult && (
            <button
              onClick={handleSaveFlag}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all"
            >
              <Save className="w-4 h-4" />
              {initialFlagId ? 'Update Flag Reasoning' : 'Attach Legal Flag to Audit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
