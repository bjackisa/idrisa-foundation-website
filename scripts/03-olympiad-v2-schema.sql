-- ============================================================================
-- OLYMPIAD V2 SCHEMA - Enhanced System with Minors, Stages, and Auto-Marking
-- ============================================================================

-- Drop existing types if migrating (comment out for fresh install)
-- DROP TYPE IF EXISTS participant_type CASCADE;
-- DROP TYPE IF EXISTS participant_status CASCADE;
-- DROP TYPE IF EXISTS edition_status CASCADE;
-- DROP TYPE IF EXISTS stage_name CASCADE;
-- DROP TYPE IF EXISTS question_type_v2 CASCADE;
-- DROP TYPE IF EXISTS marking_status CASCADE;

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Participant type (self or minor)
CREATE TYPE participant_type AS ENUM ('SELF', 'MINOR');

-- Participant status in an edition
CREATE TYPE participant_status AS ENUM ('ACTIVE', 'DISQUALIFIED', 'WITHDRAWN', 'COMPLETED');

-- Olympiad edition status
CREATE TYPE edition_status AS ENUM ('DRAFT', 'OPEN', 'RUNNING', 'COMPLETED');

-- Stage names
CREATE TYPE stage_name AS ENUM ('Beginner', 'Theory', 'Practical', 'Final');

-- Enhanced question types
CREATE TYPE question_type_v2 AS ENUM (
  'MCQ',                    -- Single choice
  'MULTIPLE_SELECT',        -- Multiple correct answers
  'TRUE_FALSE',             -- True/False
  'SHORT_ANSWER',           -- Short text answer
  'NUMERIC',                -- Numeric answer
  'ESSAY',                  -- Long answer/essay
  'FILE_UPLOAD',            -- File upload (for practical)
  'STRUCTURED'              -- Multi-part question
);

-- Marking status
CREATE TYPE marking_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'MODERATED');

-- ============================================================================
-- MINOR PROFILES
-- ============================================================================

CREATE TABLE minor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  school_name TEXT,
  class_grade TEXT,
  national_id TEXT,
  student_number TEXT,
  created_by_user_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_minor_profiles_created_by ON minor_profiles(created_by_user_id);

-- ============================================================================
-- OLYMPIAD EDITIONS (Enhanced)
-- ============================================================================

CREATE TABLE olympiad_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  year INT NOT NULL,
  enrollment_start TIMESTAMP WITH TIME ZONE NOT NULL,
  enrollment_end TIMESTAMP WITH TIME ZONE NOT NULL,
  status edition_status NOT NULL DEFAULT 'DRAFT',
  
  -- Active levels (JSON array of enabled levels)
  active_levels JSONB NOT NULL DEFAULT '["Primary", "O-Level", "A-Level"]',
  
  -- Active subjects per level (JSON object)
  active_subjects JSONB NOT NULL DEFAULT '{
    "Primary": ["Math", "Science", "ICT"],
    "O-Level": ["Math", "Biology", "Chemistry", "Physics", "ICT", "Agriculture"],
    "A-Level": ["Math", "Biology", "Chemistry", "Physics", "ICT", "Agriculture"]
  }',
  
  -- Age rules (can override defaults)
  age_rules JSONB NOT NULL DEFAULT '{
    "Primary": {"min": 9, "max": 15},
    "O-Level": {"min": 11, "max": 18},
    "A-Level": {"min": 15, "max": 21}
  }',
  
  -- Global rules
  max_subjects_per_participant INT DEFAULT 3,
  reference_date DATE,  -- For age calculation
  
  created_by_admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_olympiad_editions_status ON olympiad_editions(status);
CREATE INDEX idx_olympiad_editions_year ON olympiad_editions(year);

-- ============================================================================
-- PARTICIPANTS (Per Edition)
-- ============================================================================

CREATE TABLE olympiad_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES olympiad_editions(id) ON DELETE CASCADE,
  
  -- Participant type and references
  participant_type participant_type NOT NULL,
  user_id UUID REFERENCES guardians(id) ON DELETE CASCADE,  -- If SELF
  minor_profile_id UUID REFERENCES minor_profiles(id) ON DELETE CASCADE,  -- If MINOR
  enrolled_by_user_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  
  -- Participant details
  education_level education_level NOT NULL,
  status participant_status NOT NULL DEFAULT 'ACTIVE',
  
  -- Metadata
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT participant_type_check CHECK (
    (participant_type = 'SELF' AND user_id IS NOT NULL AND minor_profile_id IS NULL) OR
    (participant_type = 'MINOR' AND user_id IS NULL AND minor_profile_id IS NOT NULL)
  ),
  
  -- Unique enrollment per edition
  UNIQUE(edition_id, user_id),
  UNIQUE(edition_id, minor_profile_id)
);

CREATE INDEX idx_olympiad_participants_edition ON olympiad_participants(edition_id);
CREATE INDEX idx_olympiad_participants_user ON olympiad_participants(user_id);
CREATE INDEX idx_olympiad_participants_minor ON olympiad_participants(minor_profile_id);
CREATE INDEX idx_olympiad_participants_enrolled_by ON olympiad_participants(enrolled_by_user_id);

-- ============================================================================
-- PARTICIPANT SUBJECT ENROLLMENTS
-- ============================================================================

CREATE TABLE participant_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES olympiad_participants(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(participant_id, subject)
);

CREATE INDEX idx_participant_subjects_participant ON participant_subjects(participant_id);

-- ============================================================================
-- ENHANCED QUESTION BANK
-- ============================================================================

CREATE TABLE questions_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Scope
  edition_id UUID REFERENCES olympiad_editions(id) ON DELETE CASCADE,  -- NULL for reusable
  education_level education_level NOT NULL,
  subject TEXT NOT NULL,
  stage stage_name NOT NULL,
  
  -- Question content
  question_type question_type_v2 NOT NULL,
  question_text TEXT NOT NULL,
  question_data JSONB,  -- Additional data (options, sub-questions, etc.)
  
  -- Grading
  correct_answer JSONB,  -- Correct answer(s)
  marking_guide TEXT,    -- For manual marking
  marks DECIMAL(5, 2) NOT NULL DEFAULT 1.0,
  
  -- Metadata
  difficulty TEXT,  -- easy/medium/hard
  topic TEXT,
  subtopic TEXT,
  explanation TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  
  created_by_admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_v2_edition ON questions_v2(edition_id);
CREATE INDEX idx_questions_v2_level_subject_stage ON questions_v2(education_level, subject, stage);
CREATE INDEX idx_questions_v2_status ON questions_v2(status);

-- ============================================================================
-- EXAM CONFIGURATIONS
-- ============================================================================

CREATE TABLE exam_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES olympiad_editions(id) ON DELETE CASCADE,
  education_level education_level NOT NULL,
  subject TEXT NOT NULL,
  stage stage_name NOT NULL,
  
  -- Scheduling
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INT NOT NULL,
  
  -- Question selection
  question_ids UUID[] NOT NULL,  -- Fixed set or pre-selected
  randomize_questions BOOLEAN DEFAULT TRUE,
  randomize_options BOOLEAN DEFAULT TRUE,
  
  -- Display options
  show_score_immediately BOOLEAN DEFAULT FALSE,
  score_release_datetime TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(edition_id, education_level, subject, stage)
);

CREATE INDEX idx_exam_configs_edition ON exam_configs(edition_id);

-- ============================================================================
-- EXAM ATTEMPTS
-- ============================================================================

CREATE TABLE exam_attempts_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES olympiad_participants(id) ON DELETE CASCADE,
  exam_config_id UUID NOT NULL REFERENCES exam_configs(id) ON DELETE CASCADE,
  
  -- Attempt details
  started_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  auto_submitted BOOLEAN DEFAULT FALSE,
  
  -- Answers
  answers JSONB,  -- { question_id: answer_value }
  
  -- Scoring
  auto_marks DECIMAL(8, 2),
  manual_marks DECIMAL(8, 2),
  total_marks DECIMAL(8, 2),
  max_marks DECIMAL(8, 2),
  percentage DECIMAL(5, 2),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'NOT_STARTED',  -- NOT_STARTED, IN_PROGRESS, SUBMITTED, MARKED
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(participant_id, exam_config_id)
);

CREATE INDEX idx_exam_attempts_v2_participant ON exam_attempts_v2(participant_id);
CREATE INDEX idx_exam_attempts_v2_exam_config ON exam_attempts_v2(exam_config_id);

-- ============================================================================
-- MANUAL MARKING
-- ============================================================================

CREATE TABLE manual_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_attempt_id UUID NOT NULL REFERENCES exam_attempts_v2(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions_v2(id) ON DELETE CASCADE,
  
  -- Marking
  marks_awarded DECIMAL(5, 2) NOT NULL,
  max_marks DECIMAL(5, 2) NOT NULL,
  feedback TEXT,
  
  -- Marker
  marked_by_admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  marked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Moderation
  moderated_by_admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  moderated_at TIMESTAMP WITH TIME ZONE,
  moderation_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(exam_attempt_id, question_id)
);

CREATE INDEX idx_manual_marks_attempt ON manual_marks(exam_attempt_id);
CREATE INDEX idx_manual_marks_marker ON manual_marks(marked_by_admin_id);

-- ============================================================================
-- STAGE ELIGIBILITY
-- ============================================================================

CREATE TABLE stage_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES olympiad_participants(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  stage stage_name NOT NULL,
  
  -- Eligibility
  is_eligible BOOLEAN NOT NULL DEFAULT FALSE,
  eligibility_reason TEXT,
  
  -- Computed from previous stage
  previous_stage_score DECIMAL(5, 2),
  rank_in_previous_stage INT,
  total_in_previous_stage INT,
  
  computed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(participant_id, subject, stage)
);

CREATE INDEX idx_stage_eligibility_participant ON stage_eligibility(participant_id);
CREATE INDEX idx_stage_eligibility_stage ON stage_eligibility(stage);

-- ============================================================================
-- FINAL STAGE VENUES
-- ============================================================================

CREATE TABLE final_venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES olympiad_editions(id) ON DELETE CASCADE,
  education_level education_level NOT NULL,
  subject TEXT NOT NULL,
  
  -- Venue details
  venue_name TEXT NOT NULL,
  venue_address TEXT,
  venue_map_link TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  capacity INT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(edition_id, education_level, subject)
);

CREATE INDEX idx_final_venues_edition ON final_venues(edition_id);

-- ============================================================================
-- FINAL STAGE ATTENDANCE & RESULTS
-- ============================================================================

CREATE TABLE final_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES olympiad_participants(id) ON DELETE CASCADE,
  final_venue_id UUID NOT NULL REFERENCES final_venues(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  
  -- Attendance
  attendance_status TEXT,  -- PRESENT, ABSENT
  
  -- Results
  final_score DECIMAL(8, 2),
  final_rank INT,
  
  -- Awards
  award_category TEXT,  -- GOLD, SILVER, BRONZE, MERIT
  certificate_url TEXT,
  
  entered_by_admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  entered_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(participant_id, final_venue_id, subject)
);

CREATE INDEX idx_final_results_participant ON final_results(participant_id);
CREATE INDEX idx_final_results_venue ON final_results(final_venue_id);

-- ============================================================================
-- RANKINGS (Cached rankings per stage)
-- ============================================================================

CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES olympiad_editions(id) ON DELETE CASCADE,
  education_level education_level NOT NULL,
  subject TEXT NOT NULL,
  stage stage_name NOT NULL,
  
  participant_id UUID NOT NULL REFERENCES olympiad_participants(id) ON DELETE CASCADE,
  score DECIMAL(8, 2) NOT NULL,
  rank INT NOT NULL,
  total_participants INT NOT NULL,
  
  computed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(edition_id, education_level, subject, stage, participant_id)
);

CREATE INDEX idx_rankings_edition_level_subject_stage ON rankings(edition_id, education_level, subject, stage);
CREATE INDEX idx_rankings_participant ON rankings(participant_id);

-- ============================================================================
-- AUDIT LOG
-- ============================================================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  changes JSONB,
  performed_by_user_id UUID,
  performed_by_admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES guardians(id) ON DELETE CASCADE,
  
  -- Notification content
  type TEXT NOT NULL,  -- ENROLLMENT_CONFIRMED, STAGE_QUALIFIED, EXAM_REMINDER, RESULTS_PUBLISHED
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  
  -- Delivery
  read_at TIMESTAMP WITH TIME ZONE,
  sent_via_email BOOLEAN DEFAULT FALSE,
  sent_via_sms BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read_at);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_minor_profiles_updated_at BEFORE UPDATE ON minor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_olympiad_editions_updated_at BEFORE UPDATE ON olympiad_editions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_olympiad_participants_updated_at BEFORE UPDATE ON olympiad_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_v2_updated_at BEFORE UPDATE ON questions_v2 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_configs_updated_at BEFORE UPDATE ON exam_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_attempts_v2_updated_at BEFORE UPDATE ON exam_attempts_v2 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_final_venues_updated_at BEFORE UPDATE ON final_venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_final_results_updated_at BEFORE UPDATE ON final_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Participant details with user/minor info
CREATE OR REPLACE VIEW v_participant_details AS
SELECT 
  op.id,
  op.edition_id,
  op.participant_type,
  op.education_level,
  op.status,
  op.enrolled_at,
  CASE 
    WHEN op.participant_type = 'SELF' THEN g.full_name
    WHEN op.participant_type = 'MINOR' THEN mp.full_name
  END as participant_name,
  CASE 
    WHEN op.participant_type = 'SELF' THEN NULL
    WHEN op.participant_type = 'MINOR' THEN mp.date_of_birth
  END as date_of_birth,
  CASE 
    WHEN op.participant_type = 'SELF' THEN NULL
    WHEN op.participant_type = 'MINOR' THEN mp.school_name
  END as school_name,
  g2.full_name as enrolled_by_name,
  g2.email as enrolled_by_email
FROM olympiad_participants op
LEFT JOIN guardians g ON op.user_id = g.id
LEFT JOIN minor_profiles mp ON op.minor_profile_id = mp.id
LEFT JOIN guardians g2 ON op.enrolled_by_user_id = g2.id;

-- ============================================================================
-- SAMPLE DATA COMMENTS
-- ============================================================================

-- To insert sample data:
-- 1. Create an olympiad edition
-- 2. Create minor profiles
-- 3. Enroll participants (SELF and MINOR)
-- 4. Add questions to question bank
-- 5. Create exam configurations
-- 6. Participants take exams
-- 7. Run progression logic to compute eligibility
