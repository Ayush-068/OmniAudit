export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FlagStatus = 'UNVERIFIED' | 'VERIFIED' | 'DISMISSED';

export interface ComplianceFlag {
  flag_id: string;
  contract_clause: string;
  violated_rule: string;
  reasoning_chain: string; // Detailed legal/audit reasoning with <reasoning> tags
  risk_score: number; // 0 to 100
  status: FlagStatus;
  severity: RiskLevel;
  category: string;
  timestamp: string;
}

export interface DepartmentData {
  id: string;
  name: string;
  code: string;
  riskLevel: RiskLevel;
  score: number; // Compliance health score (0 - 100)
  position: [number, number, number];
  dimensions: [number, number, number]; // [width, height, depth]
  color?: string;
  description: string;
  leadAuditor: string;
  lastAuditDate: string;
  flags: ComplianceFlag[];
}

export interface AuditMetrics {
  totalDepartments: number;
  overallScore: number;
  totalFlags: number;
  criticalFlagsCount: number;
  highFlagsCount: number;
  verifiedFlagsCount: number;
  systemicRiskRating: 'OPTIMAL' | 'ELEVATED' | 'SEVERE' | 'CRITICAL';
}

export interface AuditStoreState {
  departments: DepartmentData[];
  selectedDepartment: DepartmentData | null;
  hoveredDepartment: string | null;
  searchQuery: string;
  riskFilter: RiskLevel | 'ALL';
  viewMode: '3D' | 'TABLE' | 'ANALYTICS';
  
  // Actions
  selectDepartment: (id: string | null) => void;
  setHoveredDepartment: (id: string | null) => void;
  verifyFlag: (deptId: string, flagId: string) => void;
  dismissFlag: (deptId: string, flagId: string) => void;
  updateFlagReasoning: (deptId: string, flagId: string, newReasoning: string) => void;
  addComplianceFlag: (deptId: string, flag: Omit<ComplianceFlag, 'flag_id' | 'status' | 'timestamp'>) => void;
  setSearchQuery: (query: string) => void;
  setRiskFilter: (filter: RiskLevel | 'ALL') => void;
  setViewMode: (mode: '3D' | 'TABLE' | 'ANALYTICS') => void;
  resetAuditState: () => void;
  getMetrics: () => AuditMetrics;
}
