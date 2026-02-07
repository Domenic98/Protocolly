import { SOP, SOPStep } from '../types';

// --- DATE UTILITIES FOR DYNAMIC UPDATES ---
const getDynamicDate = (daysOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

// --- CATEGORY-SPECIFIC STEP GENERATOR ---
const getCategorySpecificSteps = (category: string, idPrefix: string): SOPStep[] => {
  // Simplified step generator for mass volume
  return [
        { id: `${idPrefix}-1`, title: 'Initialization & Context', description: 'Initialize process context and verify user authorization.', type: 'action' },
        { id: `${idPrefix}-2`, title: 'Prerequisite Check', description: 'Ensure all inputs are available.', type: 'decision' },
        { id: `${idPrefix}-3`, title: 'Core Execution Phase', description: `Execute primary ${category} logic flows.`, type: 'action' },
        { id: `${idPrefix}-4`, title: 'Validation', description: 'Validate output against compliance standards.', type: 'decision' },
        { id: `${idPrefix}-5`, title: 'Documentation', description: 'Log activity and archive result.', type: 'action' }
  ];
};

// --- ROBUST GENERATOR ---
const createDeepSOP = (
  id: string,
  title: string,
  category: SOP['category'],
  tier: SOP['tierAccess'] = 'Operator',
  price: number = 250,
  users: number = 100
): SOP => {
  const isHighRisk = tier === 'Sovereign' || tier === 'Authority';
  const executionWeight = Math.ceil(price / 100);

  // Generate distinct steps based on category
  const steps = getCategorySpecificSteps(category, id);

  return {
    // 1. Metadata
    id,
    ownership: 'COMPANY_OWNED', // Defaulting generated library to COMPANY_OWNED
    title,
    category,
    subCategory: 'General Operations', 
    author: `Protocolly ${category} Core`, // Updated author to reflect system ownership
    price,
    rating: 4.5 + (Math.random() * 0.5),
    users,
    version: '2.4.0',
    status: 'Active',
    visibility: 'public',
    riskClass: isHighRisk ? 'High' : 'Medium',
    executionWeight,
    tierAccess: tier,
    jurisdiction: 'Global (US/EU/APAC)',
    reviewCycle: isHighRisk ? 'Quarterly' : 'Bi-Annual',
    
    // New Header Fields - Dynamic Dates
    effectiveDate: getDynamicDate(-1), // Yesterday
    nextReviewDate: getDynamicDate(isHighRisk ? 90 : 180), // 3 to 6 months out
    sopOwner: 'Director of Operations',
    approvedBy: 'VP Compliance',

    // 2. Purpose
    description: `Enterprise-grade execution framework for ${title}. Designed to ensure operational consistency, minimize risk, and maintain audit-readiness in ${category} environments.`,
    purpose: `To establish a strictly governed, repeatable process for ${title} that guarantees regulatory compliance and operational efficiency, reducing variance by >90%.`,

    // 3. Scope
    scope: `Covers end-to-end execution of ${title} for internal teams and authorized vendors. Explicitly excludes experimental workflows and non-production environments.`,

    // 4. Definitions
    definitions: {
      "Executor": "The certified individual performing the step.",
      "System of Record": "The primary ERP/CRM where data is logged.",
      "Exception": "Any deviation requiring managerial override."
    },

    // 5. Roles
    roles: [
      { role: 'Process Executor', authority: 'Execute standard steps', responsibilities: 'Data entry, verification, logging' },
      { role: 'Compliance Officer', authority: 'Audit & Review', responsibilities: 'Periodic spot-checks, incident review' },
      { role: 'Department Head', authority: 'Approval & Escalation', responsibilities: 'Budget release, exception sign-off' }
    ],

    // 6. Prerequisites (Gates)
    prerequisites: [
      'Authenticated Identity (MFA)',
      'Role-Based Access Control Verified',
      'Training Module 101 Completed',
      'System Uptime Verified'
    ],

    // 7. Inputs
    inputs: [
      'Transactional Data Record',
      'Authorization Token',
      'Stakeholder Requirements Doc'
    ],

    // 8-9. Execution Flow (Deep Steps)
    steps: steps,

    // 10. Controls
    complianceControls: [
      'Segregation of Duties enforced',
      'Audit Trail immutable',
      'Data Encryption at Rest',
      'GDPR Article 30 Record'
    ],

    // 11. Outputs
    outputs: [
      'Verified Transaction Record',
      'Compliance Certificate',
      'Audit Log Entry'
    ],

    // 12. KPIs
    kpis: [
      'Cycle Time < 4 Hours',
      'First Pass Yield > 98%',
      'Compliance Rate 100%'
    ],

    // 13. Risks
    risks: [
      { trigger: 'Data Integrity Failure', mitigation: 'Automated Checksum Validation', severity: 'High' },
      { trigger: 'SLA Breach', mitigation: 'Auto-escalation to Manager', severity: 'Medium' },
      { trigger: 'Unauthorized Access', mitigation: 'Session Termination & Alert', severity: 'High' }
    ],

    // 14. Escalation
    escalation: [
      { condition: 'System Failure', contact: 'IT Ops (P1)', sla: '15 mins' },
      { condition: 'Compliance Violation', contact: 'Risk Officer', sla: '1 hour' }
    ],

    // 15. Change Log & Related
    changeLog: [
      { version: '2.3', date: getDynamicDate(-30), author: 'System', changes: 'Routine Optimization' },
      { version: '2.4.0', date: getDynamicDate(-1), author: 'Process Architect', changes: 'Daily Policy Sync' }
    ],
    relatedSops: []
  };
};

// --- CATEGORY LISTS (Approx 45 items per category to reach ~1100 total with 25 categories) ---
const CATEGORIES: Record<string, string[]> = {
  HR: Array.from({length: 45}, (_, i) => `HR Protocol ${i+1}: Workforce Management & Compliance`),
  "Customer Support": Array.from({length: 45}, (_, i) => `CX Protocol ${i+1}: Incident Resolution & Satisfaction`),
  Finance: Array.from({length: 45}, (_, i) => `Finance Protocol ${i+1}: Fiscal Control & Auditing`),
  Sales: Array.from({length: 45}, (_, i) => `Sales Protocol ${i+1}: Pipeline Velocity & Closing`),
  IT: Array.from({length: 45}, (_, i) => `IT Ops Protocol ${i+1}: Infrastructure & Security`),
  Operations: Array.from({length: 45}, (_, i) => `General Ops Protocol ${i+1}: Efficiency & Safety`),
  Marketing: Array.from({length: 45}, (_, i) => `Growth Protocol ${i+1}: Campaign & Brand Mgmt`),
  Legal: Array.from({length: 45}, (_, i) => `Legal Protocol ${i+1}: Risk Mitigation & Contract Gov`),
  "Supply Chain & Logistics": Array.from({length: 45}, (_, i) => `Logistics Protocol ${i+1}: Fulfillment & Inventory`),
  "Facilities & Office Management": Array.from({length: 45}, (_, i) => `Facilities Protocol ${i+1}: Safety & Maintenance`),
  "Engineering": Array.from({length: 45}, (_, i) => `Engineering Protocol ${i+1}: DevOps & QA`),
  "Healthcare": Array.from({length: 45}, (_, i) => `Clinical Protocol ${i+1}: Patient Care & HIPAA`),
  "Manufacturing": Array.from({length: 45}, (_, i) => `Production Protocol ${i+1}: QC & Lean Six Sigma`),
  "Retail": Array.from({length: 45}, (_, i) => `Retail Protocol ${i+1}: POS & Merchandising`),
  "Construction": Array.from({length: 45}, (_, i) => `Site Protocol ${i+1}: Safety & Project Mgmt`),
  "Education": Array.from({length: 45}, (_, i) => `EdTech Protocol ${i+1}: Student Admin & LMS`),
  "Non-Profit": Array.from({length: 45}, (_, i) => `NGO Protocol ${i+1}: Donor Mgmt & Impact`),
  "Research & Development (R&D)": Array.from({length: 45}, (_, i) => `R&D Protocol ${i+1}: Innovation & Testing`),
  "Procurement & Vendor Management": Array.from({length: 45}, (_, i) => `Procurement Protocol ${i+1}: Sourcing & Contracts`),
  "Security Operations": Array.from({length: 45}, (_, i) => `SecOps Protocol ${i+1}: Threat Intel & Response`),
  "Cybersecurity & Data Privacy": Array.from({length: 45}, (_, i) => `Cyber Protocol ${i+1}: Data Protection & GDPR`),
  "Project Management": Array.from({length: 45}, (_, i) => `PMO Protocol ${i+1}: Agile & Waterfall Delivey`),
  "Customer Success": Array.from({length: 45}, (_, i) => `CS Protocol ${i+1}: Retention & QBR`),
  "Real Estate & Property Management": Array.from({length: 45}, (_, i) => `Property Protocol ${i+1}: Leasing & Maintenance`),
  "Food Service": Array.from({length: 45}, (_, i) => `HACCP Protocol ${i+1}: Food Safety & Prep`)
};

// --- MERGE & EXPORT ---
// This generates approximately 1,125 unique SOPs
const GENERATED_SOPS: SOP[] = Object.entries(CATEGORIES).flatMap(([cat, titles]) => 
  titles.map((title, idx) => createDeepSOP(
    `${cat.toLowerCase().substring(0,3)}-${idx + 1000}`, 
    title, 
    cat as SOP['category'],
    Math.random() > 0.8 ? 'Authority' : Math.random() > 0.6 ? 'Commander' : 'Operator',
    Math.floor(Math.random() * 500) + 50,
    Math.floor(Math.random() * 5000) + 100
  ))
);

// --- EXPORT INITIAL DATA ---
export const INITIAL_SOPS: SOP[] = [
  // ... Include specific high-quality overrides if needed, here we just use the generator for volume
  ...GENERATED_SOPS
];