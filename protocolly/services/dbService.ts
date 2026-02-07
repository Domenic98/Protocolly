
import { supabase } from './supabaseClient';
import { SOP, CreatorApplication, ReviewSOP, ReviewApplication } from '../types';

// --- MAPPERS ---

const mapSopFromDb = (row: any): SOP => ({
  id: row.id,
  ownership: row.ownership,
  title: row.title,
  description: row.description,
  author: row.author,
  price: Number(row.price),
  rating: Number(row.rating),
  category: row.category,
  subCategory: row.sub_category,
  users: row.users_count,
  version: row.version,
  status: row.status,
  visibility: row.visibility,
  riskClass: row.risk_class,
  executionWeight: row.execution_weight,
  tierAccess: row.tier_access,
  jurisdiction: row.jurisdiction,
  reviewCycle: row.review_cycle,
  effectiveDate: row.effective_date,
  nextReviewDate: row.next_review_date,
  sopOwner: row.sop_owner,
  approvedBy: row.approved_by,
  purpose: row.purpose,
  scope: row.scope,
  definitions: row.definitions || {},
  roles: row.roles || [],
  prerequisites: row.prerequisites || [],
  inputs: row.inputs || [],
  steps: row.steps || [],
  complianceControls: row.compliance_controls || [],
  outputs: row.outputs || [],
  kpis: row.kpis || [],
  risks: row.risks || [],
  escalation: row.escalation || [],
  relatedSops: row.related_sops || [],
  changeLog: row.change_log || []
});

const mapSopToDb = (sop: Partial<SOP>, ownerId: string) => ({
  id: sop.id,
  owner_id: ownerId,
  title: sop.title,
  description: sop.description,
  author: sop.author,
  ownership: sop.ownership,
  price: sop.price,
  rating: sop.rating,
  category: sop.category,
  sub_category: sop.subCategory,
  version: sop.version,
  status: sop.status,
  visibility: sop.visibility,
  risk_class: sop.riskClass,
  execution_weight: sop.executionWeight,
  tier_access: sop.tierAccess,
  jurisdiction: sop.jurisdiction,
  review_cycle: sop.reviewCycle,
  effective_date: sop.effectiveDate,
  next_review_date: sop.nextReviewDate,
  sop_owner: sop.sopOwner,
  approved_by: sop.approvedBy,
  purpose: sop.purpose,
  scope: sop.scope,
  definitions: sop.definitions,
  roles: sop.roles,
  prerequisites: sop.prerequisites,
  inputs: sop.inputs,
  steps: sop.steps,
  compliance_controls: sop.complianceControls,
  outputs: sop.outputs,
  kpis: sop.kpis,
  risks: sop.risks,
  escalation: sop.escalation,
  related_sops: sop.relatedSops,
  change_log: sop.changeLog,
  users_count: sop.users
});

const mapAppFromDb = (row: any): ReviewApplication => ({
  id: row.id,
  // user_id: row.user_id, // Internal use - Removed to fix type error
  fullName: row.full_name,
  professionalName: row.professional_name,
  industry: row.industry,
  secondaryIndustries: row.secondary_industries || [],
  role: row.role,
  yearsExperience: row.years_experience,
  orgSize: row.org_size,
  proofDescription: row.proof_description,
  problemContext: row.problem_context || [],
  outcomeTime: row.outcome_metrics?.time || '',
  outcomeCost: row.outcome_metrics?.cost || '',
  outcomeErrors: row.outcome_metrics?.errors || '',
  outcomeRevenue: row.outcome_metrics?.revenue || '',
  outcomeCompliance: row.outcome_metrics?.compliance || '',
  dependents: row.dependents || [],
  scenarioResponse: row.scenario_response,
  intentCategory: row.intent_category,
  intentProblem: row.intent_problem,
  intentAudience: row.intent_audience,
  intentFailure: row.intent_failure,
  status: row.status,
  aiScore: Number(row.ai_score),
  riskFlags: row.risk_flags || [],
  submittedAt: new Date(row.submitted_at).toLocaleDateString(),
  certified: row.status === 'approved',
  termsAgreed: true,
  eligibilityConfirmed: true
});

// --- API ---

export const db = {
  // SOPS
  async getActiveSops(): Promise<SOP[]> {
    const { data, error } = await supabase
      .from('sops')
      .select('*')
      .eq('status', 'Active')
      .eq('visibility', 'public');
    
    if (error) {
      console.error('Error fetching SOPs:', error);
      return [];
    }
    return data.map(mapSopFromDb);
  },

  async getAllSops(): Promise<SOP[]> {
    const { data, error } = await supabase
      .from('sops')
      .select('*');
    
    if (error) {
      console.error('Error fetching all SOPs:', error);
      return [];
    }
    return data.map(mapSopFromDb);
  },

  async createSop(sop: SOP): Promise<SOP | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const payload = mapSopToDb(sop, user.id);
    // Remove ID to let DB generate it, or use valid UUID if provided
    if (payload.id && payload.id.length < 10) delete payload.id; // Basic check for temp IDs

    const { data, error } = await supabase
      .from('sops')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error creating SOP:', error);
      return null;
    }
    return mapSopFromDb(data);
  },

  async updateSopStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('sops')
      .update({ status })
      .eq('id', id);
    return !error;
  },

  async deleteSop(id: string): Promise<boolean> {
    const { error } = await supabase.from('sops').delete().eq('id', id);
    return !error;
  },

  // APPLICATIONS
  async createApplication(app: CreatorApplication): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const payload = {
      user_id: user.id,
      full_name: app.fullName,
      professional_name: app.professionalName,
      industry: app.industry,
      secondary_industries: app.secondaryIndustries,
      role: app.role,
      years_experience: app.yearsExperience,
      org_size: app.orgSize,
      proof_description: app.proofDescription,
      problem_context: app.problemContext,
      outcome_metrics: {
        time: app.outcomeTime,
        cost: app.outcomeCost,
        errors: app.outcomeErrors,
        revenue: app.outcomeRevenue,
        compliance: app.outcomeCompliance
      },
      dependents: app.dependents,
      scenario_response: app.scenarioResponse,
      intent_category: app.intentCategory,
      intent_problem: app.intentProblem,
      intent_audience: app.intentAudience,
      intent_failure: app.intentFailure,
      status: 'pending',
      ai_score: 85, // Mock score for now, or pass from Gemini result
      risk_flags: []
    };

    const { error } = await supabase.from('creator_applications').insert([payload]);
    if (error) {
        console.error("App Submit Error", error);
        return false;
    }
    return true;
  },

  async getApplications(): Promise<ReviewApplication[]> {
    const { data, error } = await supabase
      .from('creator_applications')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (error) return [];
    return data.map(mapAppFromDb);
  },

  async updateAppStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    const { error } = await supabase
      .from('creator_applications')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', id);
    return !error;
  },

  // PROFILES
  async getUserProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  },

  // UTILS
  async seedInitialSops(sops: SOP[]) {
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) return;
     
     // Double check against DB directly before seeding
     const existingCount = await supabase.from('sops').select('id', { count: 'exact', head: true });
     if (existingCount.count && existingCount.count > 0) {
         console.log("Database already populated. Skipping seed.");
         return;
     }

     console.log(`Seeding database with ${sops.length} protocols...`);
     
     // Prepare payloads
     const payloads = sops.map(sop => {
         const p = mapSopToDb(sop, user.id);
         // Clean IDs to allow UUID generation for fresh inserts
         if (p.id && p.id.length < 10) delete p.id;
         return p;
     });

     // Batch insert in chunks of 50 to avoid payload limits/timeouts
     const chunkSize = 50;
     for (let i = 0; i < payloads.length; i += chunkSize) {
         const chunk = payloads.slice(i, i + chunkSize);
         const { error } = await supabase.from('sops').insert(chunk);
         if (error) {
             console.error(`Seed Batch Error (Chunk ${i}):`, error);
         } else {
             console.log(`Seeded chunk ${i} to ${i + chunk.length}`);
         }
     }
     
     console.log("Seeding complete.");
  }
};
