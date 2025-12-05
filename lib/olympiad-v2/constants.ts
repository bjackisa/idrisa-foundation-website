/**
 * Constants for Olympiad V2 System
 * All configuration values and business rules
 */

import type { EducationLevel, StageName, ProgressionRules } from './types';

// ============================================================================
// EDUCATION LEVELS & SUBJECTS
// ============================================================================

export const EDUCATION_LEVELS: EducationLevel[] = ['Primary', 'O-Level', 'A-Level'];

export const SUBJECTS_BY_LEVEL: Record<EducationLevel, string[]> = {
  Primary: ['Math', 'Science', 'ICT'],
  'O-Level': ['Math', 'Biology', 'Chemistry', 'Physics', 'ICT', 'Agriculture'],
  'A-Level': ['Math', 'Biology', 'Chemistry', 'Physics', 'ICT', 'Agriculture'],
};

// ============================================================================
// AGE RULES (Default)
// ============================================================================

export const DEFAULT_AGE_RULES = {
  Primary: { min: 9, max: 15 },
  'O-Level': { min: 11, max: 18 },
  'A-Level': { min: 15, max: 21 },
};

// ============================================================================
// STAGES
// ============================================================================

export const STAGES: StageName[] = ['Beginner', 'Theory', 'Practical', 'Final'];

export const STAGE_DESCRIPTIONS: Record<StageName, string> = {
  Beginner: 'Quiz-type exam - Initial screening',
  Theory: 'Written theory exam',
  Practical: 'Practical problem-solving exam',
  Final: 'Physical final event at designated venue',
};

// ============================================================================
// PROGRESSION RULES
// ============================================================================

export const PROGRESSION_RULES: ProgressionRules = {
  Beginner: {
    min_score: 70,  // Must score at least 70% to progress to Theory
  },
  Theory: {
    min_score: 60,  // Must score at least 60%
    min_percentile: 50,  // Must be in top 50% to progress to Practical
  },
  Practical: {
    min_score: 60,  // Must score at least 60%
    min_percentile: 40,  // Must be in top 40% to progress to Final
  },
  Final: {},  // No automatic progression
};

// ============================================================================
// QUESTION TYPES
// ============================================================================

export const QUESTION_TYPES_BY_STAGE: Record<StageName, string[]> = {
  Beginner: ['MCQ', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'NUMERIC'],
  Theory: ['SHORT_ANSWER', 'ESSAY', 'STRUCTURED', 'NUMERIC'],
  Practical: ['ESSAY', 'FILE_UPLOAD', 'STRUCTURED', 'NUMERIC'],
  Final: [],  // No online exam
};

export const AUTO_GRADABLE_QUESTION_TYPES = [
  'MCQ',
  'MULTIPLE_SELECT',
  'TRUE_FALSE',
  'NUMERIC',
];

export const MANUAL_GRADABLE_QUESTION_TYPES = [
  'SHORT_ANSWER',
  'ESSAY',
  'STRUCTURED',
  'FILE_UPLOAD',
];

// ============================================================================
// EXAM DURATIONS (in minutes)
// ============================================================================

export const EXAM_DURATIONS: Record<StageName, Record<EducationLevel, number>> = {
  Beginner: {
    Primary: 45,
    'O-Level': 60,
    'A-Level': 60,
  },
  Theory: {
    Primary: 90,
    'O-Level': 120,
    'A-Level': 150,
  },
  Practical: {
    Primary: 150,
    'O-Level': 180,
    'A-Level': 195,
  },
  Final: {
    Primary: 0,  // Physical event
    'O-Level': 0,
    'A-Level': 0,
  },
};

// ============================================================================
// QUESTION BANK SETTINGS
// ============================================================================

export const DEFAULT_QUESTIONS_PER_EXAM: Record<StageName, number> = {
  Beginner: 20,
  Theory: 15,
  Practical: 10,
  Final: 0,
};

export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const DIFFICULTY_DISTRIBUTION = {
  easy: 0.33,
  medium: 0.34,
  hard: 0.33,
};

// ============================================================================
// ENROLLMENT SETTINGS
// ============================================================================

export const MAX_SUBJECTS_PER_PARTICIPANT = 3;
export const MIN_SUBJECTS_PER_PARTICIPANT = 1;

// ============================================================================
// FILE UPLOAD SETTINGS
// ============================================================================

export const ALLOWED_FILE_TYPES = {
  document: ['.pdf', '.doc', '.docx', '.txt'],
  image: ['.jpg', '.jpeg', '.png', '.gif'],
  code: ['.py', '.js', '.java', '.cpp', '.c', '.html', '.css'],
  spreadsheet: ['.xls', '.xlsx', '.csv'],
};

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ============================================================================
// NOTIFICATION SETTINGS
// ============================================================================

export const NOTIFICATION_TEMPLATES = {
  ENROLLMENT_CONFIRMED: {
    title: 'Enrollment Confirmed',
    message: 'You have successfully enrolled in {edition_name} for {subjects}.',
  },
  STAGE_QUALIFIED: {
    title: 'Congratulations! Stage Qualified',
    message: 'You have qualified for the {stage} stage in {subject}. Score: {score}%',
  },
  EXAM_REMINDER: {
    title: 'Exam Reminder',
    message: 'Your {stage} exam for {subject} starts in {hours} hours.',
  },
  RESULTS_PUBLISHED: {
    title: 'Results Published',
    message: 'Results for {stage} stage in {subject} are now available.',
  },
  DISQUALIFIED: {
    title: 'Stage Not Qualified',
    message: 'Unfortunately, you did not qualify for the next stage in {subject}.',
  },
  FINAL_INVITATION: {
    title: 'Final Stage Invitation',
    message: 'Congratulations! You are invited to the Final stage at {venue} on {date}.',
  },
};

// ============================================================================
// EXAM REMINDER TIMES (hours before exam)
// ============================================================================

export const EXAM_REMINDER_HOURS = [24, 2];  // Send reminders 24h and 2h before

// ============================================================================
// RANKING SETTINGS
// ============================================================================

export const LEADERBOARD_PAGE_SIZE = 50;
export const SHOW_TOP_N_RANKS = 100;

// ============================================================================
// AWARD CATEGORIES
// ============================================================================

export const AWARD_THRESHOLDS = {
  GOLD: 90,    // 90% and above
  SILVER: 80,  // 80-89%
  BRONZE: 70,  // 70-79%
  MERIT: 60,   // 60-69%
};

// ============================================================================
// SESSION & SECURITY
// ============================================================================

export const AUTO_SAVE_INTERVAL_MS = 30000;  // Auto-save answers every 30 seconds
export const SESSION_TIMEOUT_MS = 3600000;   // 1 hour session timeout
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_DURATION_MS = 900000;  // 15 minutes

// ============================================================================
// PAGINATION
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  minorName: {
    minLength: 2,
    maxLength: 100,
  },
  schoolName: {
    minLength: 3,
    maxLength: 200,
  },
  editionName: {
    minLength: 5,
    maxLength: 200,
  },
  questionText: {
    minLength: 10,
    maxLength: 5000,
  },
  essayAnswer: {
    maxLength: 10000,
  },
  shortAnswer: {
    maxLength: 500,
  },
};

// ============================================================================
// DATE FORMATS
// ============================================================================

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';
export const DISPLAY_DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  AGE_NOT_VALID: 'Age does not meet the requirements for the selected education level',
  LEVEL_NOT_AVAILABLE: 'The selected education level is not available for this edition',
  SUBJECT_NOT_VALID: 'One or more selected subjects are not valid for this level',
  ALREADY_ENROLLED: 'Already enrolled in this edition',
  ENROLLMENT_CLOSED: 'Enrollment period has ended',
  ENROLLMENT_NOT_OPEN: 'Enrollment has not started yet',
  MAX_SUBJECTS_EXCEEDED: 'Maximum number of subjects exceeded',
  NOT_ELIGIBLE_FOR_STAGE: 'Not eligible for this stage',
  EXAM_NOT_AVAILABLE: 'Exam is not available at this time',
  EXAM_ALREADY_COMPLETED: 'Exam has already been completed',
  EXAM_TIME_EXPIRED: 'Exam time has expired',
  INVALID_ANSWER_FORMAT: 'Invalid answer format',
  PARTICIPANT_NOT_FOUND: 'Participant not found',
  EDITION_NOT_FOUND: 'Olympiad edition not found',
  QUESTION_NOT_FOUND: 'Question not found',
  UNAUTHORIZED: 'Unauthorized access',
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  ENROLLMENT_SUCCESS: 'Successfully enrolled in the Olympiad',
  MINOR_CREATED: 'Minor profile created successfully',
  EXAM_SUBMITTED: 'Exam submitted successfully',
  MARKS_SAVED: 'Marks saved successfully',
  EDITION_CREATED: 'Olympiad edition created successfully',
  QUESTION_CREATED: 'Question added successfully',
  VENUE_CREATED: 'Final venue created successfully',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get exam duration for a specific stage and education level
 */
export function getExamDuration(stage: StageName, level: EducationLevel): number {
  return EXAM_DURATIONS[stage][level];
}

/**
 * Get subjects for a specific education level
 */
export function getSubjectsForLevel(level: EducationLevel): string[] {
  return SUBJECTS_BY_LEVEL[level];
}

/**
 * Check if a question type is auto-gradable
 */
export function isAutoGradable(questionType: string): boolean {
  return AUTO_GRADABLE_QUESTION_TYPES.includes(questionType);
}

/**
 * Get progression rule for a stage
 */
export function getProgressionRule(stage: StageName) {
  return PROGRESSION_RULES[stage];
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date, referenceDate: Date = new Date()): number {
  const age = referenceDate.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = referenceDate.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < dateOfBirth.getDate())) {
    return age - 1;
  }
  
  return age;
}

/**
 * Validate age for education level
 */
export function validateAge(
  age: number,
  level: EducationLevel,
  customRules?: typeof DEFAULT_AGE_RULES
): boolean {
  const rules = customRules || DEFAULT_AGE_RULES;
  const { min, max } = rules[level];
  return age >= min && age <= max;
}

/**
 * Get award category based on score
 */
export function getAwardCategory(score: number): string | null {
  if (score >= AWARD_THRESHOLDS.GOLD) return 'GOLD';
  if (score >= AWARD_THRESHOLDS.SILVER) return 'SILVER';
  if (score >= AWARD_THRESHOLDS.BRONZE) return 'BRONZE';
  if (score >= AWARD_THRESHOLDS.MERIT) return 'MERIT';
  return null;
}
