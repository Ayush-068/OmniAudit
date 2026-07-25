import { create } from 'zustand';
import { AuditStoreState, DepartmentData, AuditMetrics, RiskLevel } from '../types/audit';

const INITIAL_DEPARTMENTS: DepartmentData[] = [
  {
    id: 'dept-finance',
    name: 'Finance & Treasury Wing',
    code: 'FIN-01',
    riskLevel: 'MEDIUM',
    score: 72,
    position: [-3.5, 2.5, 3.5],
    dimensions: [3, 5, 3],
    color: '#F59E0B',
    description: 'Manages capital allocation, financial reporting, corporate tax compliance, and treasury risk controls.',
    leadAuditor: 'Sarah Jenkins, CPA',
    lastAuditDate: '2026-07-18',
    flags: [
      {
        flag_id: 'flag-fin-101',
        contract_clause: 'Clause 14.2: Deferred Revenue Recognition & Multi-Year SaaS Recognition Schedule',
        violated_rule: 'ASC 606 / IFRS 15 Compliance Framework Rule #402',
        reasoning_chain: `<reasoning>
1. Contract #SAAS-2025-998 records $4.2M up-front licensing payment recognized immediately in Q2.
2. Under ASC 606 performance obligations, 40% of deliverables (Custom Enterprise API Connectors) remain unfulfilled.
3. Premature revenue recognition inflates Q2 earnings by $1.68M, creating audit exposure during annual PCAOB review.
4. Recommended Action: Reclassify $1.68M to Contract Liabilities account pending milestone verification.
</reasoning>`,
        risk_score: 68,
        status: 'UNVERIFIED',
        severity: 'MEDIUM',
        category: 'Financial Reporting',
        timestamp: '2026-07-22 14:32:10',
      },
      {
        flag_id: 'flag-fin-102',
        contract_clause: 'Clause 8.1: Expenditure Threshold & Dual Executive Co-Signature Protocol',
        violated_rule: 'Corporate Treasury Governance Standard Section 3.1',
        reasoning_chain: `<reasoning>
1. Wire Transfer #WT-8819 ($850,000) dispatched to offshore subsidiary without required CFO second-key approval.
2. Single-signoff override utilized emergency override token #ERR-09, which lacked documented justification in ERP logs.
3. Internal control test failed on segregation of duties. High risk of unmonitored liquidity leakage.
</reasoning>`,
        risk_score: 74,
        status: 'UNVERIFIED',
        severity: 'HIGH',
        category: 'Internal Controls',
        timestamp: '2026-07-24 09:15:44',
      },
    ],
  },
  {
    id: 'dept-legal',
    name: 'Legal & Corporate Governance',
    code: 'LEG-02',
    riskLevel: 'LOW',
    score: 94,
    position: [3.5, 3.5, -3.5],
    dimensions: [3, 7, 3],
    color: '#10B981',
    description: 'Oversees contractual obligations, regulatory filings, intellectual property protection, and litigation risk.',
    leadAuditor: 'Marcus Vance, Esq.',
    lastAuditDate: '2026-07-20',
    flags: [
      {
        flag_id: 'flag-leg-201',
        contract_clause: 'Clause 22.4: Termination Notice Window Ambiguity in Cross-Border Licensing Agreement',
        violated_rule: 'Enterprise Contract Standardization Guidelines 2025',
        reasoning_chain: `<reasoning>
1. Agreement stipulates "30 business days notice" in Paragraph A, but "60 calendar days" in Schedule C.
2. Divergence introduces minor litigation risk during contract renewal window in jurisdiction of Singapore.
3. Low financial impact ($12,000 potential dispute cost); easily remediated via unilateral Addendum #1.
</reasoning>`,
        risk_score: 22,
        status: 'UNVERIFIED',
        severity: 'LOW',
        category: 'Contractual Clarity',
        timestamp: '2026-07-19 11:04:12',
      },
    ],
  },
  {
    id: 'dept-vendor',
    name: 'Vendor Management & Cloud Logistics',
    code: 'VND-03',
    riskLevel: 'CRITICAL',
    score: 28,
    position: [3.5, 4.0, 3.5],
    dimensions: [3.2, 8, 3.2],
    color: '#7F1D1D',
    description: 'Coordinates third-party procurement, vendor risk assessments, cloud infrastructure SLAs, and logistics compliance.',
    leadAuditor: 'Elena Rostova, CISA',
    lastAuditDate: '2026-07-24',
    flags: [
      {
        flag_id: 'flag-vnd-301',
        contract_clause: 'Clause 19.3: Uncapped Third-Party Data Liability & Missing SOC 2 Type II Attestation',
        violated_rule: 'Third-Party Risk Management (TPRM) Policy Directive 8',
        reasoning_chain: `<reasoning>
1. Primary cloud hosting provider (Vendor #V-901) handles core customer database containing 3.8M record entries.
2. SOC 2 Type II audit report expired 90 days ago; vendor failed to provide renewal documentation despite 3 formal notices.
3. Indemnity clause #19.3 caps vendor liability at $50,000, while enterprise exposure exceeds $24.5M in data breach scenario.
4. Immediate breach of Enterprise Risk Policy. High structural vulnerability detected in supply chain perimeter.
</reasoning>`,
        risk_score: 96,
        status: 'UNVERIFIED',
        severity: 'CRITICAL',
        category: 'Vendor Security & SLA',
        timestamp: '2026-07-24 18:45:00',
      },
      {
        flag_id: 'flag-vnd-302',
        contract_clause: 'Clause 11.2: Sub-Tier Supplier ESG Non-Compliance & Audit Refusal',
        violated_rule: 'EU Supply Chain Due Diligence Act (CSDDD) Article 6',
        reasoning_chain: `<reasoning>
1. Secondary hardware supplier in Tier 2 manufacturing network refused onsite environmental and labor audit.
2. Independent satellite monitoring flagged carbon emissions exceeding contractual thresholds by 140%.
3. Regulatory penalty under CSDDD can equal up to 5% of global net turnover ($11.2M liability).
</reasoning>`,
        risk_score: 88,
        status: 'UNVERIFIED',
        severity: 'CRITICAL',
        category: 'Regulatory Compliance',
        timestamp: '2026-07-23 16:10:22',
      },
      {
        flag_id: 'flag-vnd-303',
        contract_clause: 'Clause 7.4: Unrestricted Sub-Processor Data Transfers in Offshore IT Support Contract',
        violated_rule: 'Enterprise TPRM Security Baseline 2026.2',
        reasoning_chain: `<reasoning>
1. Offshore IT contractor engaged unvetted sub-processor for night-shift system monitoring.
2. Credentials granted to sub-processor allow root administrative access to production database clusters.
3. Unsanctioned access route violates Zero Trust Architecture baseline and contract agreement.
</reasoning>`,
        risk_score: 91,
        status: 'UNVERIFIED',
        severity: 'CRITICAL',
        category: 'Access Control',
        timestamp: '2026-07-24 22:01:05',
      },
    ],
  },
  {
    id: 'dept-privacy',
    name: 'Data Privacy & AI Ethics',
    code: 'PRV-04',
    riskLevel: 'HIGH',
    score: 48,
    position: [-3.5, 3.0, -3.5],
    dimensions: [3, 6, 3],
    color: '#EF4444',
    description: 'Guards GDPR/CCPA data privacy standards, AI model governance, telemetry consent, and cross-border data transfers.',
    leadAuditor: 'Dr. Aris Thorne',
    lastAuditDate: '2026-07-23',
    flags: [
      {
        flag_id: 'flag-prv-401',
        contract_clause: 'Clause 5.2: Unconsented LLM Model Training on Customer Biometric & Telemetry Data',
        violated_rule: 'EU AI Act Article 10 (Data Governance) & GDPR Article 6',
        reasoning_chain: `<reasoning>
1. Feature pipeline #AI-99 extracts end-user voice notes and telemetry to fine-tune internal customer service LLMs.
2. User Terms of Service Section 5.2 explicitly excludes generative AI model training without opt-in consent.
3. Non-compliance exposes firm to EU AI Act High-Risk system sanctions (up to €35M or 7% global annual turnover).
4. Automated mitigation: Pause model retraining pipeline immediately pending consent re-opt-in campaign.
</reasoning>`,
        risk_score: 85,
        status: 'UNVERIFIED',
        severity: 'HIGH',
        category: 'AI Model Safety',
        timestamp: '2026-07-23 10:20:15',
      },
      {
        flag_id: 'flag-prv-402',
        contract_clause: 'Clause 12.1: Incomplete Data Subject Erasure Workflow under GDPR Article 17',
        violated_rule: 'GDPR Right to be Forgotten Technical Implementation Standard',
        reasoning_chain: `<reasoning>
1. Erasure requests logged via Privacy Portal are processed in primary SQL database but fail to purge backup cold storage nodes.
2. 412 deleted user profile identifiers persist in cloud snapshot backups beyond the statutory 30-day purge window.
</reasoning>`,
        risk_score: 76,
        status: 'UNVERIFIED',
        severity: 'HIGH',
        category: 'Data Rights',
        timestamp: '2026-07-21 15:40:00',
      },
    ],
  },
  {
    id: 'dept-hr',
    name: 'Human Resources & Workforce Risk',
    code: 'HR-05',
    riskLevel: 'LOW',
    score: 91,
    position: [0, 1.5, 4.5],
    dimensions: [2.5, 3, 2.5],
    color: '#10B981',
    description: 'Manages talent acquisition policies, non-disclosure compliance, workforce safety, and labor regulations.',
    leadAuditor: 'David Chen, SPHR',
    lastAuditDate: '2026-07-15',
    flags: [
      {
        flag_id: 'flag-hr-501',
        contract_clause: 'Clause 3.1: Non-Compete Clause Scope Limitation',
        violated_rule: 'FTC Non-Compete Rule Guidelines 2024',
        reasoning_chain: `<reasoning>
1. Standard employment template contains broad non-compete clause spanning 24 months globally.
2. Recent FTC regulatory updates invalidate overly broad restrictions for non-executive staff.
3. Low operational risk; updated template pending HR board approval in Q3.
</reasoning>`,
        risk_score: 28,
        status: 'UNVERIFIED',
        severity: 'LOW',
        category: 'Employment Law',
        timestamp: '2026-07-15 08:30:00',
      },
    ],
  },
  {
    id: 'dept-exec',
    name: 'Central Executive Steering Spire',
    code: 'EXEC-00',
    riskLevel: 'MEDIUM',
    score: 80,
    position: [0, 5.0, 0],
    dimensions: [2.2, 10, 2.2],
    color: '#3B82F6',
    description: 'Central hub coordinating enterprise risk strategy, board compliance committee reports, and audit trail aggregation.',
    leadAuditor: 'Chief Compliance Officer',
    lastAuditDate: '2026-07-25',
    flags: [
      {
        flag_id: 'flag-exec-001',
        contract_clause: 'Directive 1.0: Annual Board Risk Disclosure SLA Delay',
        violated_rule: 'SEC Cyber Disclosure Rule Item 105',
        reasoning_chain: `<reasoning>
1. Aggregated risk matrix draft pending executive approval 2 days past internal deadline.
2. Escalation required to finalize 10-Q filing disclosures before market open.
</reasoning>`,
        risk_score: 55,
        status: 'UNVERIFIED',
        severity: 'MEDIUM',
        category: 'Executive Disclosure',
        timestamp: '2026-07-25 07:00:00',
      },
    ],
  },
];

export const useAuditStore = create<AuditStoreState>((set, get) => ({
  departments: INITIAL_DEPARTMENTS,
  selectedDepartment: null,
  hoveredDepartment: null,
  searchQuery: '',
  riskFilter: 'ALL',
  viewMode: '3D',

  selectDepartment: (id: string | null) => {
    if (!id) {
      set({ selectedDepartment: null });
      return;
    }
    const dept = get().departments.find((d) => d.id === id) || null;
    set({ selectedDepartment: dept });
  },

  setHoveredDepartment: (id: string | null) => {
    set({ hoveredDepartment: id });
  },

  verifyFlag: (deptId: string, flagId: string) => {
    set((state) => {
      const updatedDepartments = state.departments.map((dept) => {
        if (dept.id !== deptId) return dept;
        const updatedFlags = dept.flags.map((flag) =>
          flag.flag_id === flagId ? { ...flag, status: 'VERIFIED' as const } : flag
        );
        // Recalculate score slightly when flags are verified
        const activeFlags = updatedFlags.filter((f) => f.status === 'UNVERIFIED');
        const newScore = Math.min(100, Math.max(10, 100 - activeFlags.length * 15));
        const newRiskLevel: RiskLevel =
          newScore > 85 ? 'LOW' : newScore > 65 ? 'MEDIUM' : newScore > 40 ? 'HIGH' : 'CRITICAL';

        return {
          ...dept,
          flags: updatedFlags,
          score: newScore,
          riskLevel: newRiskLevel,
        };
      });

      const updatedSelected =
        state.selectedDepartment?.id === deptId
          ? updatedDepartments.find((d) => d.id === deptId) || null
          : state.selectedDepartment;

      return {
        departments: updatedDepartments,
        selectedDepartment: updatedSelected,
      };
    });
  },

  dismissFlag: (deptId: string, flagId: string) => {
    set((state) => {
      const updatedDepartments = state.departments.map((dept) => {
        if (dept.id !== deptId) return dept;
        const updatedFlags = dept.flags.map((flag) =>
          flag.flag_id === flagId ? { ...flag, status: 'DISMISSED' as const } : flag
        );
        const activeFlags = updatedFlags.filter((f) => f.status === 'UNVERIFIED');
        const newScore = Math.min(100, Math.max(10, 100 - activeFlags.length * 15));
        const newRiskLevel: RiskLevel =
          newScore > 85 ? 'LOW' : newScore > 65 ? 'MEDIUM' : newScore > 40 ? 'HIGH' : 'CRITICAL';

        return {
          ...dept,
          flags: updatedFlags,
          score: newScore,
          riskLevel: newRiskLevel,
        };
      });

      const updatedSelected =
        state.selectedDepartment?.id === deptId
          ? updatedDepartments.find((d) => d.id === deptId) || null
          : state.selectedDepartment;

      return {
        departments: updatedDepartments,
        selectedDepartment: updatedSelected,
      };
    });
  },

  updateFlagReasoning: (deptId: string, flagId: string, newReasoning: string) => {
    set((state) => {
      const updatedDepartments = state.departments.map((dept) => {
        if (dept.id !== deptId) return dept;
        const updatedFlags = dept.flags.map((flag) =>
          flag.flag_id === flagId ? { ...flag, reasoning_chain: newReasoning } : flag
        );
        return {
          ...dept,
          flags: updatedFlags,
        };
      });

      const updatedSelected =
        state.selectedDepartment?.id === deptId
          ? updatedDepartments.find((d) => d.id === deptId) || null
          : state.selectedDepartment;

      return {
        departments: updatedDepartments,
        selectedDepartment: updatedSelected,
      };
    });
  },

  addComplianceFlag: (deptId: string, flag) => {
    const newFlag = {
      ...flag,
      flag_id: `flag-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'UNVERIFIED' as const,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    set((state) => {
      const updatedDepartments = state.departments.map((dept) => {
        if (dept.id !== deptId) return dept;
        const updatedFlags = [newFlag, ...dept.flags];
        const activeFlags = updatedFlags.filter((f) => f.status === 'UNVERIFIED');
        const newScore = Math.min(100, Math.max(10, 100 - activeFlags.length * 15));
        const newRiskLevel: RiskLevel =
          newScore > 85 ? 'LOW' : newScore > 65 ? 'MEDIUM' : newScore > 40 ? 'HIGH' : 'CRITICAL';

        return {
          ...dept,
          flags: updatedFlags,
          score: newScore,
          riskLevel: newRiskLevel,
        };
      });

      const updatedSelected =
        state.selectedDepartment?.id === deptId
          ? updatedDepartments.find((d) => d.id === deptId) || null
          : state.selectedDepartment;

      return {
        departments: updatedDepartments,
        selectedDepartment: updatedSelected,
      };
    });
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setRiskFilter: (filter: RiskLevel | 'ALL') => set({ riskFilter: filter }),
  setViewMode: (mode) => set({ viewMode: mode }),

  resetAuditState: () => {
    set({
      departments: INITIAL_DEPARTMENTS,
      selectedDepartment: null,
      hoveredDepartment: null,
      searchQuery: '',
      riskFilter: 'ALL',
      viewMode: '3D',
    });
  },

  getMetrics: (): AuditMetrics => {
    const { departments } = get();
    const totalDepartments = departments.length;
    let totalFlags = 0;
    let criticalFlagsCount = 0;
    let highFlagsCount = 0;
    let verifiedFlagsCount = 0;
    let scoreSum = 0;

    departments.forEach((d) => {
      scoreSum += d.score;
      d.flags.forEach((f) => {
        totalFlags++;
        if (f.status === 'VERIFIED') verifiedFlagsCount++;
        if (f.status === 'UNVERIFIED') {
          if (f.severity === 'CRITICAL' || f.risk_score >= 85) criticalFlagsCount++;
          else if (f.severity === 'HIGH' || f.risk_score >= 70) highFlagsCount++;
        }
      });
    });

    const overallScore = Math.round(scoreSum / (totalDepartments || 1));
    let systemicRiskRating: AuditMetrics['systemicRiskRating'] = 'OPTIMAL';
    if (criticalFlagsCount > 2 || overallScore < 45) systemicRiskRating = 'CRITICAL';
    else if (criticalFlagsCount > 0 || overallScore < 65) systemicRiskRating = 'SEVERE';
    else if (highFlagsCount > 2 || overallScore < 80) systemicRiskRating = 'ELEVATED';

    return {
      totalDepartments,
      overallScore,
      totalFlags,
      criticalFlagsCount,
      highFlagsCount,
      verifiedFlagsCount,
      systemicRiskRating,
    };
  },
}));
