/**
 * TypeScript Types for Olympiad V2 System
 * Comprehensive type definitions for the enhanced Olympiad module
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum ParticipantType {
  SELF = 'SELF',
  MINOR = 'MINOR'
}

export type ParticipantTypeString = 'SELF' | 'MINOR';
export type ParticipantStatus = 'ACTIVE' | 'DISQUALIFIED' | 'WITHDRAWN' | 'COMPLETED';
export type EditionStatus = 'DRAFT' | 'OPEN' | 'RUNNING' | 'COMPLETED';
export type StageName = 'Beginner' | 'Theory' | 'Practical' | 'Final';
export type EducationLevel = 'Primary' | 'O-Level' | 'A-Level';

export type QuestionTypeV2 = 
  | 'MCQ'                 // Single choice
  | 'MULTIPLE_SELECT'     // Multiple correct answers
  | 'TRUE_FALSE'          // True/False
  | 'SHORT_ANSWER'        // Short text answer
  | 'NUMERIC'             // Numeric answer
  | 'ESSAY'               // Long answer/essay
  | 'FILE_UPLOAD'         // File upload (for practical)
  | 'STRUCTURED';         // Multi-part question

export type MarkingStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'MODERATED';
export type ExamStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'MARKED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT';
export type AwardCategory = 'GOLD' | 'SILVER' | 'BRONZE' | 'MERIT';
export type NotificationType = 
  | 'ENROLLMENT_CONFIRMED' 
  | 'STAGE_QUALIFIED' 
  | 'EXAM_REMINDER' 
  | 'RESULTS_PUBLISHED'
  | 'DISQUALIFIED'
  | 'FINAL_INVITATION';

// ============================================================================
// MINOR PROFILES
// ============================================================================

export interface MinorProfile {
  id: string;
  full_name: string;
  date_of_birth: string;
  gender?: string;
  school_name?: string;
  class_grade?: string;
  national_id?: string;
  student_number?: string;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMinorProfileInput {
  full_name: string;
  date_of_birth: string;
  gender?: string;
  school_name?: string;
  class_grade?: string;
  national_id?: string;
  student_number?: string;
}

// ============================================================================
// OLYMPIAD EDITIONS
// ============================================================================

export interface AgeRules {
  Primary: { min: number; max: number };
  'O-Level': { min: number; max: number };
  'A-Level': { min: number; max: number };
}

export interface ActiveSubjects {
  Primary: string[];
  'O-Level': string[];
  'A-Level': string[];
}

export interface OlympiadEdition {
  id: string;
  name: string;
  year: number;
  enrollment_start: string;
  enrollment_end: string;
  status: EditionStatus;
  active_levels: EducationLevel[];
  active_subjects: ActiveSubjects;
  age_rules: AgeRules;
  max_subjects_per_participant: number;
  reference_date?: string;
  created_by_admin_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEditionInput {
  name: string;
  year: number;
  enrollment_start: string;
  enrollment_end: string;
  active_levels?: EducationLevel[];
  active_subjects?: Partial<ActiveSubjects>;
  age_rules?: Partial<AgeRules>;
  max_subjects_per_participant?: number;
  reference_date?: string;
}

// ============================================================================
// PARTICIPANTS
// ============================================================================

export interface OlympiadParticipant {
  id: string;
  edition_id: string;
  participant_type: ParticipantType;
  user_id?: string;
  minor_profile_id?: string;
  enrolled_by_user_id: string;
  education_level: EducationLevel;
  status: ParticipantStatus;
  enrolled_at: string;
  created_at: string;
  updated_at: string;
}

export interface ParticipantSubject {
  id: string;
  participant_id: string;
  subject: string;
  enrolled_at: string;
}

export interface EnrollmentInput {
  edition_id: string;
  participant_type: ParticipantType;
  user_id?: string;
  minor_profile_id?: string;
  education_level: EducationLevel;
  subjects: string[];
}

export interface CreateParticipantInput {
  edition_id: string;
  participant_type: ParticipantType;
  user_id?: string;
  guardian_id?: string;
  minor_id?: string;
  education_level: EducationLevel;
  class_level?: string;
  is_qualified?: boolean;
  subjects?: string[];
}

export interface EnrollmentEligibility {
  eligible: boolean;
  errors: string[];
  warnings: string[];
  age?: number;
  age_valid?: boolean;
  level_available?: boolean;
  subjects_valid?: boolean;
  already_enrolled?: boolean;
}

// ============================================================================
// QUESTIONS
// ============================================================================

export interface QuestionData {
  options?: string[];              // For MCQ, MULTIPLE_SELECT, TRUE_FALSE
  sub_questions?: SubQuestion[];   // For STRUCTURED
  file_types?: string[];           // For FILE_UPLOAD
  max_file_size?: number;          // For FILE_UPLOAD
  word_limit?: number;             // For ESSAY
}

export interface SubQuestion {
  id: string;
  text: string;
  marks: number;
  type: QuestionTypeV2;
  correct_answer?: any;
}

export interface QuestionV2 {
  id: string;
  edition_id?: string;
  education_level: EducationLevel;
  subject: string;
  stage: StageName;
  question_type: QuestionTypeV2;
  question_text: string;
  question_data?: QuestionData;
  correct_answer?: any;
  marking_guide?: string;
  marks: number;
  difficulty?: string;
  topic?: string;
  subtopic?: string;
  explanation?: string;
  status: string;
  created_by_admin_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateQuestionInput {
  edition_id?: string;
  education_level: EducationLevel;
  subject: string;
  stage: StageName;
  question_type: QuestionTypeV2;
  question_text: string;
  question_data?: QuestionData;
  correct_answer?: any;
  marking_guide?: string;
  marks: number;
  difficulty?: string;
  topic?: string;
  subtopic?: string;
  explanation?: string;
}

// ============================================================================
// EXAMS
// ============================================================================

export interface ExamConfig {
  id: string;
  edition_id: string;
  education_level: EducationLevel;
  subject: string;
  stage: StageName;
  start_datetime: string;
  end_datetime: string;
  duration_minutes: number;
  question_ids: string[];
  randomize_questions: boolean;
  randomize_options: boolean;
  show_score_immediately: boolean;
  score_release_datetime?: string;
  created_at: string;
  updated_at: string;
}

export interface ExamAttemptV2 {
  id: string;
  participant_id: string;
  exam_config_id: string;
  started_at?: string;
  submitted_at?: string;
  auto_submitted: boolean;
  answers?: Record<string, any>;
  auto_marks?: number;
  manual_marks?: number;
  total_marks?: number;
  max_marks?: number;
  percentage?: number;
  status: ExamStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateExamConfigInput {
  edition_id: string;
  education_level: EducationLevel;
  subject: string;
  stage: StageName;
  start_datetime: string;
  end_datetime: string;
  duration_minutes: number;
  question_ids: string[];
  randomize_questions?: boolean;
  randomize_options?: boolean;
  show_score_immediately?: boolean;
  score_release_datetime?: string;
}

// ============================================================================
// MARKING
// ============================================================================

export interface ManualMark {
  id: string;
  exam_attempt_id: string;
  question_id: string;
  marks_awarded: number;
  max_marks: number;
  feedback?: string;
  marked_by_admin_id: string;
  marked_at: string;
  moderated_by_admin_id?: string;
  moderated_at?: string;
  moderation_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MarkingInput {
  exam_attempt_id: string;
  question_id: string;
  marks_awarded: number;
  feedback?: string;
}

// ============================================================================
// STAGE ELIGIBILITY & PROGRESSION
// ============================================================================

export interface StageEligibility {
  id: string;
  participant_id: string;
  subject: string;
  stage: StageName;
  is_eligible: boolean;
  eligibility_reason?: string;
  previous_stage_score?: number;
  rank_in_previous_stage?: number;
  total_in_previous_stage?: number;
  computed_at: string;
  created_at: string;
}

export interface ProgressionRules {
  Beginner: {
    min_score: number;
  };
  Theory: {
    min_score: number;
    min_percentile: number;  // Top 50%
  };
  Practical: {
    min_score: number;
    min_percentile: number;  // Top 40%
  };
  Final: {
    // No automatic progression, manual selection
  };
}

// ============================================================================
// FINAL STAGE
// ============================================================================

export interface FinalVenue {
  id: string;
  edition_id: string;
  education_level: EducationLevel;
  subject: string;
  venue_name: string;
  venue_address?: string;
  venue_map_link?: string;
  event_date: string;
  capacity?: number;
  created_at: string;
  updated_at: string;
}

export interface FinalResult {
  id: string;
  participant_id: string;
  final_venue_id: string;
  subject: string;
  attendance_status?: AttendanceStatus;
  final_score?: number;
  final_rank?: number;
  award_category?: AwardCategory;
  certificate_url?: string;
  entered_by_admin_id?: string;
  entered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFinalVenueInput {
  edition_id: string;
  education_level: EducationLevel;
  subject: string;
  venue_name: string;
  venue_address?: string;
  venue_map_link?: string;
  event_date: string;
  capacity?: number;
}

// ============================================================================
// RANKINGS
// ============================================================================

export interface Ranking {
  id: string;
  edition_id: string;
  education_level: EducationLevel;
  subject: string;
  stage: StageName;
  participant_id: string;
  score: number;
  rank: number;
  total_participants: number;
  computed_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  participant_name: string;
  school_name?: string;
  score: number;
  participant_id: string;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read_at?: string;
  sent_via_email: boolean;
  sent_via_sms: boolean;
  created_at: string;
}

export interface CreateNotificationInput {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  send_email?: boolean;
  send_sms?: boolean;
}

// ============================================================================
// AUDIT LOG
// ============================================================================

export interface AuditLogEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  changes?: Record<string, any>;
  performed_by_user_id?: string;
  performed_by_admin_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ============================================================================
// DASHBOARD & VIEWS
// ============================================================================

export interface ParticipantDetails {
  id: string;
  edition_id: string;
  participant_type: ParticipantType;
  education_level: EducationLevel;
  status: ParticipantStatus;
  enrolled_at: string;
  participant_name: string;
  date_of_birth?: string;
  school_name?: string;
  enrolled_by_name: string;
  enrolled_by_email: string;
}

export interface UserDashboardData {
  self_participations: ParticipantDashboardEntry[];
  minor_participations: ParticipantDashboardEntry[];
  minors: MinorProfile[];
}

export interface ParticipantDashboardEntry {
  participant: OlympiadParticipant;
  edition: OlympiadEdition;
  subjects: ParticipantSubject[];
  stage_progress: StageProgress[];
  upcoming_exams: ExamConfig[];
}

export interface StageProgress {
  subject: string;
  stage: StageName;
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  score?: number;
  rank?: number;
  eligible_for_next?: boolean;
}

// ============================================================================
// ADMIN DASHBOARD
// ============================================================================

export interface AdminDashboardStats {
  total_editions: number;
  active_editions: number;
  total_participants: number;
  participants_by_level: Record<EducationLevel, number>;
  participants_by_stage: Record<StageName, number>;
}

export interface EditionOverview {
  edition: OlympiadEdition;
  total_participants: number;
  participants_by_level: Record<EducationLevel, number>;
  stage_statistics: StageStatistics[];
}

export interface StageStatistics {
  stage: StageName;
  education_level: EducationLevel;
  subject: string;
  total_enrolled: number;
  total_attempted: number;
  total_completed: number;
  average_score: number;
  pass_rate: number;
}
