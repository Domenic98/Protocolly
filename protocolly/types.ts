
export enum ViewState {
  LANDING = 'LANDING',
  SIGN_UP = 'SIGN_UP',
  PRICING_SELECTION = 'PRICING_SELECTION',
  HOME = 'HOME',
  MARKETPLACE = 'MARKETPLACE',
  EXECUTION = 'EXECUTION',
  DASHBOARD = 'DASHBOARD',
  CREATOR_DASHBOARD = 'CREATOR_DASHBOARD', // New View
  CHECKOUT = 'CHECKOUT',
  SUBSCRIPTION_CHECKOUT = 'SUBSCRIPTION_CHECKOUT',
  CREATE_PROTOCOL = 'CREATE_PROTOCOL',
  ADMIN = 'ADMIN',
  ENTERPRISE = 'ENTERPRISE',
  ENTERPRISE_SALES = 'ENTERPRISE_SALES',
  SETTINGS = 'SETTINGS',
  SUPPORT = 'SUPPORT',
  LEGAL = 'LEGAL',
  FEATURES = 'FEATURES',
  PRICING = 'PRICING',
  ABOUT = 'ABOUT',
  COMMUNITIES = 'COMMUNITIES'
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'new_category' | 'alert' | 'system';
  timestamp: string;
  read: boolean;
}

export interface SOP {
  id: string;
  // --- OWNERSHIP & REVENUE LOCK ---
  ownership: 'COMPANY_OWNED' | 'CREATOR_OWNED'; // Immutable flag for revenue routing

  // --- 1. SOP METADATA (TRACEABILITY BLOCK) ---
  title: string;
  description: string;
  author: string;
  price: number; 
  rating: number;
  category: 'HR' | 'Finance' | 'Operations' | 'Legal' | 'Growth' | 'QHSE' | 'Admin' | 'IT' | 'Manufacturing' | 'Lab' | 'Healthcare' | 'Sales' | 'Marketing' | 'Supply Chain & Logistics' | 'Facilities & Office Management' | 'Food Service' | 'Environmental' | 'Engineering' | 'Education' | 'Retail' | 'Construction' | 'Non-Profit' | 'Customer Support' | 'Quality Management' | 'Cybersecurity & Data Privacy' | 'Project Management' | 'Customer Success' | 'Research & Development (R&D)' | 'Procurement & Vendor Management' | 'Security Operations' | 'Clinical Trial Management' | 'Digital Marketing' | 'Warehouse Operations' | 'Food & Beverage Production' | 'Real Estate & Property Management' | 'Transportation & Fleet Management' | 'Energy Management' | 'Internal Communications & Collaboration' | 'Training & Learning Operations' | 'Environmental Health & Safety (EHS)' | 'Retail Loss Prevention' | 'Consulting Services' | 'Event Management' | 'Product Management' | 'Risk Management' | 'Data & Analytics Operations' | 'Executive & Leadership Operations';
  subCategory?: string; 
  users: number;
  version: string; // Revision Number
  status: 'Draft' | 'Active' | 'Archived' | 'Pending_Review';
  visibility?: 'public' | 'private' | 'confidential';
  
  // New Header Fields
  effectiveDate?: string;
  nextReviewDate?: string;
  sopOwner?: string;
  approvedBy?: string;

  // Execution Logic
  riskClass: 'Low' | 'Medium' | 'High';
  executionWeight: number; // 1-5, determines Attributable Revenue Share
  tierAccess: 'Observer' | 'Operator' | 'Commander' | 'Authority' | 'Sovereign';
  jurisdiction: string;
  reviewCycle: string;

  // --- 2-4. TEXT SECTIONS ---
  purpose: string;
  scope: string;
  definitions: Record<string, string>;

  // --- 5. ROLES & PERMISSIONS ---
  roles: { role: string; authority: string; responsibilities?: string }[];

  // --- 6-7. GATES ---
  prerequisites: string[]; // Execution Gates
  inputs: string[]; // Artifacts required

  // --- 8-9. EXECUTION FLOW (Steps & Decisions) ---
  steps: SOPStep[];

  // --- 10. CONTROLS & COMPLIANCE ---
  complianceControls: string[];

  // --- 11. OUTPUTS ---
  outputs: string[];

  // --- 12. KPIs & METRICS ---
  kpis: string[];

  // --- 13. RISKS & MITIGATIONS ---
  risks: { trigger: string; mitigation: string; severity?: 'Low' | 'Medium' | 'High' }[];

  // --- 14. ESCALATION ---
  escalation: { condition: string; contact: string; sla?: string }[];

  // --- 15. CHANGE LOG & RELATED ---
  changeLog?: { version: string; date: string; author: string; changes: string }[];
  relatedSops?: string[]; // New
}

export interface SOPStep {
  id: string;
  title: string;
  description: string;
  type: 'action' | 'decision' | 'input' | 'automation';
  details?: string;
  requiredRole?: string;
  expectedOutcome?: string;
  systemInteraction?: string; // e.g., "ERP", "CRM"
  subSteps?: string[];
}

export interface AnalyticMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface CreatorApplication {
  eligibilityConfirmed: boolean;
  fullName: string;
  professionalName: string;
  industry: string;
  secondaryIndustries: string[];
  role: string;
  yearsExperience: number;
  orgSize: string;
  proofDescription: string;
  problemContext: string[];
  outcomeTime: string;
  outcomeCost: string;
  outcomeErrors: string;
  outcomeRevenue: string;
  outcomeCompliance: string;
  dependents: string[];
  scenarioResponse: string;
  intentCategory: string;
  intentProblem: string;
  intentAudience: string;
  intentFailure: string;
  termsAgreed: boolean;
  certified: boolean;
}

export interface VettingResult {
  approved: boolean;
  score: number;
  reason: string;
  tier: 'Rejected' | 'Certified Operator' | 'Verified Expert';
}

export interface AdminStats {
  pendingApps: number;
  pendingSOPs: number;
  flaggedSOPs: number;
  creatorsProbation: number;
  avgSopScore: number;
  revenueAtRisk: number;
}

export interface ReviewApplication extends CreatorApplication {
  id: string;
  submittedAt: string;
  aiScore: number;
  riskFlags: string[];
  status: 'pending' | 'approved' | 'rejected';
  certified: boolean;
}

export interface ReviewSOP extends Omit<SOP, 'status'> {
  submittedAt: string;
  aiOriginalityScore: number;
  structuralUniquenessScore: number;
  estimatedUserValue: number;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
}

export interface FlaggedIncident {
  id: string;
  type: 'plagiarism' | 'execution_failure' | 'compliance' | 'outdated' | 'complaint';
  sopId?: string;
  creatorId?: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'resolved';
  date: string;
}

export interface CreatorPerformance {
  id: string;
  name: string;
  status: 'Trusted' | 'Watchlist' | 'Probation' | 'Banned';
  totalSOPs: number;
  avgScore: number;
  revenue: number;
  violations: number;
}

export type CreatorTier = 'Certified Operator' | 'Verified Expert' | 'Master Protocol Architect';

export interface SOPRevenueMetric {
  sopId: string;
  title: string;
  ownership: 'CREATOR_OWNED';
  executions: number;
  executionWeight: number; // 1-5
  grossAttributableRevenue: number; // Raw value generated
  platformFee: number; // Fixed 20%
  netPayout: number; // Fixed 80%
  status: 'Payout Eligible' | 'Suspended';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  outcome: 'Success' | 'Failure' | 'Flagged';
  hash: string;
}

export interface ExpertRequest {
  id: string;
  category: string;
  requirements: string;
  budget: string;
  status: 'Pending' | 'Matched' | 'In Progress';
}

export interface QualityAnalysis {
  score: number; // 0-100
  originality: number; // 0-100 (100 = Unique)
  feedback: string[];
  strengths: string[];
  isGeneric: boolean;
  similarTopics: string[];
}

export type RejectionReasonCode = 
  | 'GENERIC_CONTENT' 
  | 'SAFETY_RISK' 
  | 'INCOMPLETE_LOGIC' 
  | 'PLAGIARISM' 
  | 'FORMATTING' 
  | 'VAGUE_OUTCOMES';

export interface RejectionFeedback {
  code: RejectionReasonCode;
  notes: string;
  suggestedFix: string;
}
