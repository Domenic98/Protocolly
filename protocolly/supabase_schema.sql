
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS & TYPES
CREATE TYPE user_tier AS ENUM ('Observer', 'Operator', 'Commander', 'Authority', 'Sovereign');
CREATE TYPE sop_status AS ENUM ('Draft', 'Pending_Review', 'Changes_Requested', 'Active', 'Rejected', 'Archived');
CREATE TYPE sop_visibility AS ENUM ('public', 'private', 'confidential');
CREATE TYPE sop_risk_class AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE app_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE notification_type AS ENUM ('update', 'new_category', 'alert', 'system');

-- 2. PROFILES (Extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    professional_name TEXT,
    tier user_tier DEFAULT 'Observer',
    is_admin BOOLEAN DEFAULT FALSE,
    is_creator BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SOPS TABLE
CREATE TABLE public.sops (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id), -- The Creator or Company Admin
    
    -- Metadata
    title TEXT NOT NULL,
    description TEXT,
    author TEXT, -- Display name
    ownership TEXT CHECK (ownership IN ('COMPANY_OWNED', 'CREATOR_OWNED')) NOT NULL DEFAULT 'CREATOR_OWNED',
    price NUMERIC DEFAULT 0,
    rating NUMERIC DEFAULT 0,
    category TEXT NOT NULL,
    sub_category TEXT,
    version TEXT DEFAULT '1.0',
    status sop_status DEFAULT 'Draft',
    visibility sop_visibility DEFAULT 'public',
    
    -- Execution Logic Configuration
    risk_class sop_risk_class DEFAULT 'Medium',
    execution_weight INTEGER DEFAULT 1,
    tier_access user_tier DEFAULT 'Operator',
    jurisdiction TEXT,
    review_cycle TEXT,
    
    -- Header / Governance
    effective_date DATE,
    next_review_date DATE,
    sop_owner TEXT, -- Text role name e.g., "VP of Ops"
    approved_by TEXT, -- Text role name
    
    -- JSONB Structured Data (Flexible & Queryable)
    purpose TEXT,
    scope TEXT,
    definitions JSONB DEFAULT '{}'::jsonb, -- Key-Value pairs
    roles JSONB DEFAULT '[]'::jsonb,       -- Array of { role, authority, responsibilities }
    prerequisites JSONB DEFAULT '[]'::jsonb, -- Array of strings
    inputs JSONB DEFAULT '[]'::jsonb,        -- Array of strings
    steps JSONB DEFAULT '[]'::jsonb,         -- Array of Step Objects (The core workflow)
    compliance_controls JSONB DEFAULT '[]'::jsonb,
    outputs JSONB DEFAULT '[]'::jsonb,
    kpis JSONB DEFAULT '[]'::jsonb,
    risks JSONB DEFAULT '[]'::jsonb,         -- Array of { trigger, mitigation, severity }
    escalation JSONB DEFAULT '[]'::jsonb,    -- Array of { condition, contact, sla }
    related_sops JSONB DEFAULT '[]'::jsonb,  -- Array of IDs
    change_log JSONB DEFAULT '[]'::jsonb,    -- Array of history objects
    
    -- Stats
    users_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATOR APPLICATIONS
CREATE TABLE public.creator_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    
    -- Applicant Details
    full_name TEXT,
    professional_name TEXT,
    industry TEXT,
    secondary_industries JSONB DEFAULT '[]'::jsonb,
    role TEXT,
    years_experience INTEGER,
    org_size TEXT,
    
    -- Proof of Work
    proof_description TEXT,
    problem_context JSONB DEFAULT '[]'::jsonb,
    outcome_metrics JSONB DEFAULT '{}'::jsonb, -- { time, cost, errors, revenue, compliance }
    dependents JSONB DEFAULT '[]'::jsonb,
    
    -- Assessment
    scenario_response TEXT,
    intent_category TEXT,
    intent_problem TEXT,
    intent_audience TEXT,
    intent_failure TEXT,
    
    -- System Status
    status app_status DEFAULT 'pending',
    ai_score NUMERIC DEFAULT 0,
    risk_flags JSONB DEFAULT '[]'::jsonb,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- 5. AUDIT LOGS (For Enterprise & Compliance)
CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    actor_id UUID REFERENCES public.profiles(id),
    actor_name TEXT,
    action TEXT NOT NULL,   -- e.g. "EXECUTE_STEP", "VIEW_SOP"
    resource_id UUID REFERENCES public.sops(id),
    resource_name TEXT,
    outcome TEXT,           -- e.g. "Success", "Flagged"
    hash TEXT,              -- Integrity hash
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 6. NOTIFICATIONS (NEW)
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id), -- If null, system-wide
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- SOPs
ALTER TABLE public.sops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Active SOPs are viewable by everyone" ON public.sops FOR SELECT USING (visibility = 'public' AND status = 'Active');
CREATE POLICY "Creators can view own SOPs" ON public.sops FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Creators can insert own SOPs" ON public.sops FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Creators can update own SOPs" ON public.sops FOR UPDATE USING (auth.uid() = owner_id);

-- Applications
ALTER TABLE public.creator_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own applications" ON public.creator_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert applications" ON public.creator_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Audit Logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own logs" ON public.audit_logs FOR SELECT USING (auth.uid() = actor_id);
CREATE POLICY "System can insert logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = actor_id);

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view system notifications" ON public.notifications FOR SELECT USING (user_id IS NULL);

-- 8. AUTOMATION & TRIGGERS

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, tier)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email,
    'Observer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sops_updated_at BEFORE UPDATE ON public.sops FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
