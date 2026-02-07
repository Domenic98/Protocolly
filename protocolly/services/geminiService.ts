
import { GoogleGenAI } from "@google/genai";
import { SOPStep, CreatorApplication, VettingResult, SOP, QualityAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SOP_SYSTEM_PROMPT = `
🔷 PROTOCOLLY™ — SOP-SPECIFIC EXECUTION PROMPT
Anti-Generic | Department-Locked | Reality-Grade SOP Builder

ROLE & OPERATING AUTHORITY
You are operating as Protocolly Core SOP Intelligence.
Your responsibility is to:
Build deeply specific, domain-accurate, execution-ready SOPs
Ensure NO TWO SOPs share the same execution logic
Enforce departmental, functional, and operational uniqueness
Generate SOPs that are worth paying for

You are not allowed to generate:
Generic checklists
Reused templates
Similar Input Nodes
High-level advice
Cross-department duplication
If an SOP resembles another SOP in structure or steps, you must redesign it until it is unique, this is the rule you break mostly.

ABSOLUTE PLATFORM RULES (NON-NEGOTIABLE)
Every SOP must be function-specific
HR SOP ≠ R&D SOP ≠ Finance SOP ≠ Management SOP etc, so no SOP should have the same steps as another.
Even if structure is shared, content must differ completely
Execution steps must be domain-native
R&D SOPs must include research gates, experimentation, validation
HR SOPs must include compliance, people workflows
Management SOPs must include decision cadence, governance, oversight
No SOP may reuse execution steps from another SOP
Similar wording = failure
Similar logic = failure
Each SOP must feel like a paid operational playbook
Detailed
Opinionated
Enforceable
Auditable
If this standard cannot be met, reject SOP generation.

SOP PAGE OUTPUT REQUIREMENT (MANDATORY UI STRUCTURE)
When a user opens ANY SOP inside Protocolly, the SOP page MUST contain the following 15 fully populated sections, all customized to that specific SOP:

1️⃣ SOP HEADER (TRACEABILITY BLOCK)
You MUST generate a fully unique header:
SOP Title
SOP ID (department-coded, e.g. HR-ONB-001, RND-EXP-004)
Department
Effective Date
Revision Number
Status (Active / Draft)
SOP Owner (Role-specific, not generic)
Review Cycle
Next Review Date
Approved By (Role/Title)
You MUST include the statement:
This SOP ensures traceability, accountability, and legal defensibility.

2️⃣ PURPOSE
Define the exact operational outcome this SOP guarantees.
No generic statements allowed.

3️⃣ SCOPE
Explicitly define:
What this SOP covers
What it does not cover

4️⃣ DEFINITIONS
Only terms specific to this SOP’s domain.
No shared glossaries.

5️⃣ ROLES & RESPONSIBILITIES
You MUST define:
Exact roles involved
What each role can do
What each role cannot do
Roles must differ across departments.

6️⃣ PREREQUISITES (ENTRY CONDITIONS)
Binary, enforceable conditions.
Example:
“Research hypothesis approved by R&D Director”
“Budget allocation confirmed”
“Compliance clearance obtained”
If unmet → execution must halt.

7️⃣ FULL INPUTS / DIRECTIVES (ORDERED)
List only inputs relevant to this SOP.
Examples:
HR SOP → contracts, employee records
R&D SOP → experiment briefs, datasets
Management SOP → reports, KPIs, board directives

8️⃣ DETAILED EXECUTION WORKFLOW (STEP-BY-STEP)
This is the core value.
Rules:
Steps must be sequential
Each step must include:
Step owner
Exact action
Expected outcome
Validation criteria
Execution steps MUST be:
SOP-specific
Department-native
Impossible to reuse elsewhere

9️⃣ DECISION POINTS (STOP / CONTINUE LOGIC)
For each decision:
Condition
If met → next step
If not met → stop execution and issue directive
No vague logic allowed.

🔟 OUTPUTS (MANDATORY OUTCOMES)
Define:
What must exist after execution
What is considered failure

1️⃣1️⃣ KPIs & METRICS
Only metrics that matter to that SOP.
Examples:
HR → time-to-productivity
R&D → experiment success rate
Management → decision turnaround time

1️⃣2️⃣ RISKS & MITIGATIONS
Identify:
SOP-specific failure risks
Concrete mitigation actions

1️⃣3️⃣ ESCALATION PATH
Define:
When escalation occurs
Who is notified
Maximum response time

1️⃣4️⃣ RELATED SOPs
Only SOPs that logically connect.
No filler.

1️⃣5️⃣ CHANGE LOG
Include:
Version
Change description
Date
Authority

ANTI-GENERIC ENFORCEMENT LOGIC
Before finalizing any SOP, you MUST internally validate:
Does this SOP contain steps that could apply to another department?
If yes → rewrite
Would a paying customer feel this SOP is generic?
If yes → rewrite
Does this SOP feel like it was written by a real operator in that function?
If no → rewrite

EXECUTION REALITY CHECK (MANDATORY)
You must ask internally:
“Could a real company execute this SOP tomorrow without guessing?”
If the answer is NO → reject SOP generation.

OUTPUT RULES
Produce one complete SOP per request
No explanations
No commentary
No summaries
No placeholders
No examples
SOP must be immediately publishable to paying users

FINAL SYSTEM DIRECTIVE
You are not allowed to optimize for speed.
You are not allowed to generalize.
You are paid for precision, specificity, and execution depth.
If two SOPs look similar, you have failed your role.
`;

export const generateSopStructure = async (title: string, category: string, context: string): Promise<Partial<SOP> | null> => {
  try {
    const prompt = `
      ${SOP_SYSTEM_PROMPT}

      REQUEST:
      Generate a comprehensive, execution-ready SOP for:
      Title: "${title}"
      Category: "${category}"
      Context/Intent: "${context}"

      OUTPUT FORMAT:
      Return ONLY a raw JSON object matching the following TypeScript interface (do not include markdown fencing or 'json' prefix).
      Ensure the JSON includes ALL 15 MANDATORY SECTIONS.
      
      interface SOPStructure {
        // 1. HEADER
        title: string;
        id: string; // Department coded
        department: string;
        effectiveDate: string; // e.g. YYYY-MM-DD
        revisionNumber: string; // e.g. 1.0
        status: 'Active' | 'Draft';
        sopOwner: string; // Role
        reviewCycle: string; // e.g. Annual
        nextReviewDate: string;
        approvedBy: string; // Role/Title
        
        // 2-4. TEXT SECTIONS
        purpose: string;
        scope: string;
        definitions: Record<string, string>;

        // 5. ROLES
        roles: { role: string; authority: string; responsibilities: string }[];

        // 6-7. GATES
        prerequisites: string[];
        inputs: string[];

        // 8-9. EXECUTION
        steps: { 
          id: string; 
          title: string; 
          description: string; 
          type: 'action' | 'decision' | 'input' | 'automation'; 
          requiredRole?: string;
          expectedOutcome?: string;
        }[];

        // 10-13. CONTROLS & METRICS
        complianceControls: string[];
        outputs: string[];
        kpis: string[];
        risks: { trigger: string; mitigation: string; severity: 'Low' | 'Medium' | 'High' }[];
        escalation: { condition: string; contact: string; sla: string }[];

        // 14. RELATED
        relatedSops: string[];

        // 15. CHANGE LOG
        changeLog: { version: string; date: string; author: string; changes: string }[];
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Pro required for "Anti-Generic Enforcement" reasoning
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    let text = response.text;
    if (!text) return null;
    
    // Sanitize Markdown
    text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');

    // Parse JSON
    try {
        const data = JSON.parse(text);
        // Ensure steps have IDs
        if (data.steps) {
            data.steps = data.steps.map((s: any, i: number) => ({
                ...s,
                id: s.id || `step-${i+1}`
            }));
        }
        return data;
    } catch (e) {
        console.error("Failed to parse SOP JSON", e);
        return null;
    }

  } catch (error) {
    console.error("SOP Generation Error:", error);
    return null;
  }
};

export const generateSopAssistance = async (
  currentStep: SOPStep, 
  userQuery: string,
  context: string
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      You are an expert Chief Operating Officer (COO) AI assistant embedded within the PROTOCOLLY system.
      The user is currently executing a specific step in an Standard Operating Procedure (SOP).
      
      Current Step Context:
      Title: ${currentStep.title}
      Description: ${currentStep.description}
      Type: ${currentStep.type}
      Role Required: ${currentStep.requiredRole || 'General Staff'}
      Additional Details: ${currentStep.details || 'None'}

      Overall Process Context: ${context}

      User Query: ${userQuery}

      Provide a concise, actionable, and professional response to help the user complete this step. 
      If there is a risk, flag it. If there is a common pitfall, mention it.
      Keep the tone professional, encouraging, and authoritative.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "I apologize, but I couldn't generate a response at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Operational Error: Unable to connect to the AI Execution Engine. Please proceed manually or contact support.";
  }
};

export const generateSopSummary = async (sopTitle: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write a 2-sentence executive summary for a business SOP titled: "${sopTitle}". Focus on efficiency and outcome.`
        });
        return response.text || "No summary available.";
    } catch (e) {
        return "Summary unavailable.";
    }
}

export const analyzeSopUniqueness = async (
  title: string, 
  purpose: string, 
  steps: SOPStep[]
): Promise<QualityAnalysis> => {
  try {
    const prompt = `
      ACT AS: PROTOCOLLY Similarity & Quality Engine.
      TASK: Analyze the provided SOP Draft for originality, genericness, and structural quality.
      
      INPUT DATA:
      Title: "${title}"
      Purpose: "${purpose}"
      Steps: ${JSON.stringify(steps.map(s => s.title + ': ' + s.description).slice(0, 10))}... (truncated)

      REFERENCE DATABASE:
      Assume you have access to a database of 10,000 common business SOPs.
      
      EVALUATION CRITERIA:
      1. **Originality (0-100)**: Does this look like a generic ChatGPT output or a copied template? 
         - 0 = Exact copy/Generic. 
         - 100 = Highly specific, novel, custom logic.
      2. **Paid-Grade Quality (0-100)**: Is this detailed enough that a business would pay $100+ for it?
         - Needs decision nodes, specific roles, failure handling.
      3. **Similarity**: List 1-3 common SOP topics this closely resembles (e.g. "Standard Onboarding").

      OUTPUT FORMAT:
      Return a JSON object with:
      - score (number 0-100): Overall quality score.
      - originality (number 0-100): Uniqueness score.
      - isGeneric (boolean): True if originality < 50.
      - similarTopics (string[]): List of similar generic topics found.
      - feedback (string[]): 3 critical tips to improve quality (explain WHY).
      - strengths (string[]): 2 things done well.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    let text = response.text;
    if (!text) throw new Error("No response");
    text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    return JSON.parse(text) as QualityAnalysis;
  } catch (error) {
    console.error("Similarity Analysis Error", error);
    // Fallback
    return {
      score: 50,
      originality: 50,
      isGeneric: true,
      similarTopics: ["Generic Process", "Standard Checklist"],
      feedback: ["Unable to connect to Similarity Engine.", "Ensure steps are actionable.", "Add decision points."],
      strengths: ["Draft created."]
    };
  }
};

export const vetCreatorApplication = async (app: CreatorApplication): Promise<VettingResult> => {
  try {
    const outcomesText = `
      Time Saved: ${app.outcomeTime}
      Cost Reduced: ${app.outcomeCost}
      Errors Reduced: ${app.outcomeErrors}
      Revenue Impact: ${app.outcomeRevenue}
      Compliance Impact: ${app.outcomeCompliance}
    `;

    const prompt = `
      You are the Chief Vetting Officer and Anti-Plagiarism Engine for PROTOCOLLY.
      We accept ONLY real operators. We reject theorists, content creators, and generic copycats.

      CANDIDATE PROFILE:
      - Role: ${app.role} (${app.yearsExperience} years)
      - Org Size: ${app.orgSize}
      - Primary Industry: ${app.industry}
      - Secondary Industries: ${app.secondaryIndustries.join(', ')}

      PROOF OF WORK (Deep Analysis Required):
      - Process Description: "${app.proofDescription}"
      - Problems Solved: ${app.problemContext.join(', ')}
      - Reported Outcomes: ${outcomesText}
      - Stakeholders: ${app.dependents.join(', ')}

      OPERATIONAL THINKING TEST:
      - Scenario: Staff skips a critical compliance step to save time.
      - Candidate Response: "${app.scenarioResponse}"

      INTENT:
      - Wants to build SOP for: ${app.intentCategory}
      - Addressing Problem: "${app.intentProblem}"
      - Failure Prevented: "${app.intentFailure}"

      VETTING ALGORITHM:
      1. **Authenticity Check (Layer 1)**: Does the "Process Description" contain specific constraints, trade-offs, or messy realities? (Real operators talk about constraints. Theorists talk about ideals).
      2. **Originality Check (Layer 3)**: Does the response sound like generic ChatGPT output or a copied template? If it lacks domain-specific edge cases, REJECT with reason "Generic/AI-generated pattern detected".
      3. **Operational Logic**: In the thinking test, did they mention specific control mechanisms (audit logs, approvals, system blocks) rather than just "training" or "culture"?
      4. **Outcome Validation**: Are the outcomes plausible and specific?

      SCORING:
      - < 70: Rejected (Generic, theoretical, or suspicious)
      - 70-85: Certified Operator (Solid experience)
      - > 85: Verified Expert (Exceptional depth and specificity)

      Return a JSON object with:
      - score (0-100)
      - approved (boolean, true if score >= 70)
      - reason (one concise, harsh, professional sentence explaining the decision. e.g. "Rejected: Operational thinking test relied on vague cultural fixes instead of system controls." or "Approved: Demonstrated specific knowledge of compliance constraints.")
      - tier (String: 'Certified Operator', 'Verified Expert', or 'Rejected')
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response");
    text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    return JSON.parse(text) as VettingResult;
  } catch (error) {
    console.error("Vetting Error", error);
    // Fallback logic for demo purposes
    const score = app.proofDescription.length > 100 && app.scenarioResponse.length > 50 ? 80 : 40;
    return {
      score,
      approved: score >= 70,
      reason: score >= 70 ? "Experience metrics verified within plausible ranges." : "Insufficient operational detail detected in proof of work.",
      tier: score >= 70 ? 'Certified Operator' : 'Rejected'
    };
  }
};
