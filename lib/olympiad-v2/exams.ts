/**
 * Exam Management
 * Functions for creating exams, managing attempts, and submissions
 */

import { neon } from '@neondatabase/serverless';
import type {
  ExamConfig,
  ExamAttemptV2,
  CreateExamConfigInput,
  QuestionV2,
} from './types';
import { autoGradeExamAttempt } from './marking';
import { isParticipantEligibleForStage } from './progression';

const sql = neon(process.env.DATABASE_URL!);

/**
 * Create exam configuration
 */
export async function createExamConfig(
  input: CreateExamConfigInput
): Promise<ExamConfig> {
  // Validate question IDs exist
  const questionsResult = await sql`
    SELECT COUNT(*) as count
    FROM questions_v2
    WHERE id = ANY(${input.question_ids})
  `;

  const questionCount = parseInt(questionsResult[0].count as string);
  if (questionCount !== input.question_ids.length) {
    throw new Error('Some question IDs are invalid');
  }

  const result = await sql`
    INSERT INTO exam_configs (
      edition_id,
      education_level,
      subject,
      stage,
      start_datetime,
      end_datetime,
      duration_minutes,
      question_ids,
      randomize_questions,
      randomize_options,
      show_score_immediately,
      score_release_datetime
    )
    VALUES (
      ${input.edition_id},
      ${input.education_level},
      ${input.subject},
      ${input.stage},
      ${input.start_datetime},
      ${input.end_datetime},
      ${input.duration_minutes},
      ${input.question_ids},
      ${input.randomize_questions ?? true},
      ${input.randomize_options ?? true},
      ${input.show_score_immediately ?? false},
      ${input.score_release_datetime || null}
    )
    RETURNING *
  `;

  if (result.length === 0) {
    throw new Error('Failed to create exam config');
  }

  return result[0] as ExamConfig;
}

/**
 * Get exam config by ID
 */
export async function getExamConfigById(examConfigId: string): Promise<ExamConfig | null> {
  const result = await sql`
    SELECT * FROM exam_configs
    WHERE id = ${examConfigId}
  `;

  return result.length > 0 ? (result[0] as ExamConfig) : null;
}

/**
 * Get exam config for participant
 */
export async function getExamConfigForParticipant(
  editionId: string,
  educationLevel: string,
  subject: string,
  stage: string
): Promise<ExamConfig | null> {
  const result = await sql`
    SELECT * FROM exam_configs
    WHERE edition_id = ${editionId}
      AND education_level = ${educationLevel}
      AND subject = ${subject}
      AND stage = ${stage}
  `;

  return result.length > 0 ? (result[0] as ExamConfig) : null;
}

/**
 * Start exam attempt
 */
export async function startExamAttempt(
  participantId: string,
  examConfigId: string
): Promise<ExamAttemptV2> {
  // Get exam config
  const config = await getExamConfigById(examConfigId);
  if (!config) {
    throw new Error('Exam config not found');
  }

  // Check if exam is available
  const now = new Date();
  const startTime = new Date(config.start_datetime);
  const endTime = new Date(config.end_datetime);

  if (now < startTime) {
    throw new Error('Exam has not started yet');
  }

  if (now > endTime) {
    throw new Error('Exam has ended');
  }

  // Get participant info
  const participantResult = await sql`
    SELECT * FROM olympiad_participants
    WHERE id = ${participantId}
  `;

  if (participantResult.length === 0) {
    throw new Error('Participant not found');
  }

  const participant = participantResult[0] as any;

  // Check if participant is enrolled in this subject
  const subjectResult = await sql`
    SELECT * FROM participant_subjects
    WHERE participant_id = ${participantId}
      AND subject = ${config.subject}
  `;

  if (subjectResult.length === 0) {
    throw new Error('Not enrolled in this subject');
  }

  // Check eligibility for this stage
  const eligibility = await isParticipantEligibleForStage(
    participantId,
    config.subject,
    config.stage
  );

  if (!eligibility.eligible) {
    throw new Error(`Not eligible for this stage: ${eligibility.reason}`);
  }

  // Check if already attempted
  const existingAttempt = await sql`
    SELECT * FROM exam_attempts_v2
    WHERE participant_id = ${participantId}
      AND exam_config_id = ${examConfigId}
  `;

  if (existingAttempt.length > 0) {
    const attempt = existingAttempt[0] as ExamAttemptV2;
    if (attempt.status === 'SUBMITTED' || attempt.status === 'MARKED') {
      throw new Error('Exam already completed');
    }
    // Return existing in-progress attempt
    return attempt;
  }

  // Create new attempt
  const result = await sql`
    INSERT INTO exam_attempts_v2 (
      participant_id,
      exam_config_id,
      started_at,
      status
    )
    VALUES (
      ${participantId},
      ${examConfigId},
      CURRENT_TIMESTAMP,
      'IN_PROGRESS'
    )
    RETURNING *
  `;

  if (result.length === 0) {
    throw new Error('Failed to create exam attempt');
  }

  return result[0] as ExamAttemptV2;
}

/**
 * Save exam answers (auto-save)
 */
export async function saveExamAnswers(
  attemptId: string,
  answers: Record<string, any>
): Promise<void> {
  await sql`
    UPDATE exam_attempts_v2
    SET
      answers = ${JSON.stringify(answers)},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${attemptId}
      AND status = 'IN_PROGRESS'
  `;
}

/**
 * Submit exam
 */
export async function submitExam(
  attemptId: string,
  answers: Record<string, any>,
  autoSubmit: boolean = false
): Promise<ExamAttemptV2> {
  // Get attempt
  const attemptResult = await sql`
    SELECT * FROM exam_attempts_v2
    WHERE id = ${attemptId}
  `;

  if (attemptResult.length === 0) {
    throw new Error('Exam attempt not found');
  }

  const attempt = attemptResult[0] as ExamAttemptV2;

  if (attempt.status !== 'IN_PROGRESS') {
    throw new Error('Exam is not in progress');
  }

  // Get exam config to check time
  const config = await getExamConfigById(attempt.exam_config_id);
  if (!config) {
    throw new Error('Exam config not found');
  }

  // Update attempt
  await sql`
    UPDATE exam_attempts_v2
    SET
      answers = ${JSON.stringify(answers)},
      submitted_at = CURRENT_TIMESTAMP,
      auto_submitted = ${autoSubmit},
      status = 'SUBMITTED',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${attemptId}
  `;

  // Trigger auto-grading
  await autoGradeExamAttempt(attemptId);

  // Get updated attempt
  const updatedResult = await sql`
    SELECT * FROM exam_attempts_v2
    WHERE id = ${attemptId}
  `;

  return updatedResult[0] as ExamAttemptV2;
}

/**
 * Get exam attempt
 */
export async function getExamAttempt(attemptId: string): Promise<ExamAttemptV2 | null> {
  const result = await sql`
    SELECT * FROM exam_attempts_v2
    WHERE id = ${attemptId}
  `;

  return result.length > 0 ? (result[0] as ExamAttemptV2) : null;
}

/**
 * Get participant's exam attempts
 */
export async function getParticipantExamAttempts(
  participantId: string,
  subject?: string
): Promise<ExamAttemptV2[]> {
  let query = sql`
    SELECT ea.*
    FROM exam_attempts_v2 ea
    INNER JOIN exam_configs ec ON ea.exam_config_id = ec.id
    WHERE ea.participant_id = ${participantId}
  `;

  if (subject) {
    query = sql`${query} AND ec.subject = ${subject}`;
  }

  query = sql`${query} ORDER BY ea.started_at DESC`;

  return (await query) as ExamAttemptV2[];
}

/**
 * Get questions for exam (with randomization if configured)
 */
export async function getExamQuestions(
  examConfigId: string,
  randomize: boolean = false
): Promise<QuestionV2[]> {
  const config = await getExamConfigById(examConfigId);
  if (!config) {
    throw new Error('Exam config not found');
  }

  let query = sql`
    SELECT * FROM questions_v2
    WHERE id = ANY(${config.question_ids})
  `;

  if (randomize && config.randomize_questions) {
    query = sql`${query} ORDER BY RANDOM()`;
  } else {
    // Maintain order from question_ids array
    query = sql`${query} ORDER BY array_position(${config.question_ids}, id)`;
  }

  return (await query) as QuestionV2[];
}

/**
 * Check if exam time has expired
 */
export async function checkExamTimeExpired(attemptId: string): Promise<boolean> {
  const attempt = await getExamAttempt(attemptId);
  if (!attempt || !attempt.started_at) {
    return false;
  }

  const config = await getExamConfigById(attempt.exam_config_id);
  if (!config) {
    return false;
  }

  const startTime = new Date(attempt.started_at);
  const now = new Date();
  const elapsedMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);

  return elapsedMinutes >= config.duration_minutes;
}

/**
 * Auto-submit expired exams
 */
export async function autoSubmitExpiredExams(): Promise<number> {
  // Get all in-progress attempts
  const attempts = await sql`
    SELECT ea.*, ec.duration_minutes
    FROM exam_attempts_v2 ea
    INNER JOIN exam_configs ec ON ea.exam_config_id = ec.id
    WHERE ea.status = 'IN_PROGRESS'
      AND ea.started_at IS NOT NULL
  `;

  let submittedCount = 0;

  for (const attempt of attempts as any[]) {
    const startTime = new Date(attempt.started_at);
    const now = new Date();
    const elapsedMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60);

    if (elapsedMinutes >= attempt.duration_minutes) {
      // Auto-submit
      const answers = attempt.answers || {};
      await submitExam(attempt.id, answers, true);
      submittedCount++;
    }
  }

  return submittedCount;
}

/**
 * Get available exams for participant
 */
export async function getAvailableExamsForParticipant(
  participantId: string
): Promise<ExamConfig[]> {
  // Get participant info
  const participantResult = await sql`
    SELECT * FROM olympiad_participants
    WHERE id = ${participantId}
  `;

  if (participantResult.length === 0) {
    return [];
  }

  const participant = participantResult[0] as any;

  // Get participant's subjects
  const subjectsResult = await sql`
    SELECT subject FROM participant_subjects
    WHERE participant_id = ${participantId}
  `;

  const subjects = subjectsResult.map((s: any) => s.subject);

  if (subjects.length === 0) {
    return [];
  }

  // Get available exams
  const now = new Date().toISOString();

  const exams = await sql`
    SELECT * FROM exam_configs
    WHERE edition_id = ${participant.edition_id}
      AND education_level = ${participant.education_level}
      AND subject = ANY(${subjects})
      AND start_datetime <= ${now}
      AND end_datetime >= ${now}
    ORDER BY start_datetime ASC
  `;

  // Filter by eligibility
  const availableExams: ExamConfig[] = [];

  for (const exam of exams as ExamConfig[]) {
    const eligibility = await isParticipantEligibleForStage(
      participantId,
      exam.subject,
      exam.stage
    );

    if (eligibility.eligible) {
      // Check if already completed
      const attemptResult = await sql`
        SELECT status FROM exam_attempts_v2
        WHERE participant_id = ${participantId}
          AND exam_config_id = ${exam.id}
      `;

      if (attemptResult.length === 0 || attemptResult[0].status === 'IN_PROGRESS') {
        availableExams.push(exam);
      }
    }
  }

  return availableExams;
}
