/**
 * Auto-Marking and Manual Marking Engine
 * Functions for grading exams automatically and manually
 */

import { neon } from '@neondatabase/serverless';
import type {
  QuestionV2,
  ExamAttemptV2,
  ManualMark,
  MarkingInput,
  QuestionTypeV2,
} from './types';
import { isAutoGradable } from './constants';

const sql = neon(process.env.DATABASE_URL!);

/**
 * Auto-grade a single question
 */
export function autoGradeQuestion(
  question: QuestionV2,
  userAnswer: any
): { correct: boolean; marks: number } {
  const questionType = question.question_type;

  // MCQ - Single choice
  if (questionType === 'MCQ') {
    const correct = userAnswer === question.correct_answer;
    return { correct, marks: correct ? question.marks : 0 };
  }

  // Multiple Select - All correct answers must be selected
  if (questionType === 'MULTIPLE_SELECT') {
    const correctAnswers = question.correct_answer as number[];
    const userAnswers = userAnswer as number[];

    if (!Array.isArray(userAnswers) || !Array.isArray(correctAnswers)) {
      return { correct: false, marks: 0 };
    }

    const sortedCorrect = [...correctAnswers].sort();
    const sortedUser = [...userAnswers].sort();

    const correct =
      sortedCorrect.length === sortedUser.length &&
      sortedCorrect.every((val, idx) => val === sortedUser[idx]);

    return { correct, marks: correct ? question.marks : 0 };
  }

  // True/False
  if (questionType === 'TRUE_FALSE') {
    const correct = userAnswer === question.correct_answer;
    return { correct, marks: correct ? question.marks : 0 };
  }

  // Numeric - Allow small tolerance
  if (questionType === 'NUMERIC') {
    const correctAnswer = parseFloat(question.correct_answer as string);
    const userAnswerNum = parseFloat(userAnswer);

    if (isNaN(userAnswerNum) || isNaN(correctAnswer)) {
      return { correct: false, marks: 0 };
    }

    // Allow 0.01% tolerance
    const tolerance = Math.abs(correctAnswer) * 0.0001;
    const correct = Math.abs(userAnswerNum - correctAnswer) <= tolerance;

    return { correct, marks: correct ? question.marks : 0 };
  }

  // Not auto-gradable
  return { correct: false, marks: 0 };
}

/**
 * Auto-grade an entire exam attempt
 */
export async function autoGradeExamAttempt(
  attemptId: string
): Promise<{ auto_marks: number; max_auto_marks: number; requires_manual: boolean }> {
  // Get exam attempt
  const attemptResult = await sql`
    SELECT * FROM exam_attempts_v2
    WHERE id = ${attemptId}
  `;

  if (attemptResult.length === 0) {
    throw new Error('Exam attempt not found');
  }

  const attempt = attemptResult[0] as ExamAttemptV2;

  // Get exam config and questions
  const configResult = await sql`
    SELECT * FROM exam_configs
    WHERE id = ${attempt.exam_config_id}
  `;

  if (configResult.length === 0) {
    throw new Error('Exam config not found');
  }

  const config = configResult[0] as any;
  const questionIds = config.question_ids as string[];

  // Get all questions
  const questions = await sql`
    SELECT * FROM questions_v2
    WHERE id = ANY(${questionIds})
  `;

  const questionMap = new Map<string, QuestionV2>();
  questions.forEach((q: any) => {
    questionMap.set(q.id, q as QuestionV2);
  });

  // Grade auto-gradable questions
  let autoMarks = 0;
  let maxAutoMarks = 0;
  let requiresManual = false;

  const answers = (attempt.answers || {}) as Record<string, any>;

  for (const questionId of questionIds) {
    const question = questionMap.get(questionId);
    if (!question) continue;

    if (isAutoGradable(question.question_type)) {
      maxAutoMarks += question.marks;
      const userAnswer = answers[questionId];

      if (userAnswer !== undefined && userAnswer !== null) {
        const result = autoGradeQuestion(question, userAnswer);
        autoMarks += result.marks;
      }
    } else {
      requiresManual = true;
    }
  }

  // Update exam attempt with auto marks
  await sql`
    UPDATE exam_attempts_v2
    SET
      auto_marks = ${autoMarks},
      max_marks = ${maxAutoMarks + (requiresManual ? 0 : 0)},
      status = ${requiresManual ? 'SUBMITTED' : 'MARKED'},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${attemptId}
  `;

  return {
    auto_marks: autoMarks,
    max_auto_marks: maxAutoMarks,
    requires_manual: requiresManual,
  };
}

/**
 * Submit manual marks for a question
 */
export async function submitManualMark(
  adminId: string,
  input: MarkingInput
): Promise<ManualMark> {
  // Verify question exists and requires manual marking
  const questionResult = await sql`
    SELECT * FROM questions_v2
    WHERE id = ${input.question_id}
  `;

  if (questionResult.length === 0) {
    throw new Error('Question not found');
  }

  const question = questionResult[0] as QuestionV2;

  if (isAutoGradable(question.question_type)) {
    throw new Error('This question is auto-gradable');
  }

  // Validate marks
  if (input.marks_awarded < 0 || input.marks_awarded > question.marks) {
    throw new Error(`Marks must be between 0 and ${question.marks}`);
  }

  // Insert or update manual mark
  const result = await sql`
    INSERT INTO manual_marks (
      exam_attempt_id,
      question_id,
      marks_awarded,
      max_marks,
      feedback,
      marked_by_admin_id
    )
    VALUES (
      ${input.exam_attempt_id},
      ${input.question_id},
      ${input.marks_awarded},
      ${question.marks},
      ${input.feedback || null},
      ${adminId}
    )
    ON CONFLICT (exam_attempt_id, question_id)
    DO UPDATE SET
      marks_awarded = ${input.marks_awarded},
      feedback = ${input.feedback || null},
      marked_by_admin_id = ${adminId},
      marked_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  if (result.length === 0) {
    throw new Error('Failed to save manual mark');
  }

  // Recalculate total marks for the attempt
  await recalculateTotalMarks(input.exam_attempt_id);

  return result[0] as ManualMark;
}

/**
 * Recalculate total marks for an exam attempt
 */
export async function recalculateTotalMarks(attemptId: string): Promise<void> {
  // Get auto marks
  const attemptResult = await sql`
    SELECT auto_marks FROM exam_attempts_v2
    WHERE id = ${attemptId}
  `;

  if (attemptResult.length === 0) {
    throw new Error('Exam attempt not found');
  }

  const autoMarks = parseFloat(attemptResult[0].auto_marks as string) || 0;

  // Get manual marks
  const manualMarksResult = await sql`
    SELECT SUM(marks_awarded) as total_manual, SUM(max_marks) as max_manual
    FROM manual_marks
    WHERE exam_attempt_id = ${attemptId}
  `;

  const manualMarks = parseFloat(manualMarksResult[0]?.total_manual as string) || 0;
  const maxManualMarks = parseFloat(manualMarksResult[0]?.max_manual as string) || 0;

  // Get max auto marks from exam config
  const configResult = await sql`
    SELECT ec.question_ids
    FROM exam_attempts_v2 ea
    INNER JOIN exam_configs ec ON ea.exam_config_id = ec.id
    WHERE ea.id = ${attemptId}
  `;

  if (configResult.length === 0) {
    throw new Error('Exam config not found');
  }

  const questionIds = configResult[0].question_ids as string[];

  const questionsResult = await sql`
    SELECT SUM(marks) as total_marks
    FROM questions_v2
    WHERE id = ANY(${questionIds})
  `;

  const maxMarks = parseFloat(questionsResult[0]?.total_marks as string) || 0;
  const totalMarks = autoMarks + manualMarks;
  const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;

  // Check if all manual marking is complete
  const pendingManualResult = await sql`
    SELECT COUNT(*) as pending_count
    FROM questions_v2 q
    WHERE q.id = ANY(${questionIds})
      AND q.question_type NOT IN ('MCQ', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'NUMERIC')
      AND NOT EXISTS (
        SELECT 1 FROM manual_marks mm
        WHERE mm.exam_attempt_id = ${attemptId}
          AND mm.question_id = q.id
      )
  `;

  const pendingCount = parseInt(pendingManualResult[0].pending_count as string);
  const status = pendingCount === 0 ? 'MARKED' : 'SUBMITTED';

  // Update exam attempt
  await sql`
    UPDATE exam_attempts_v2
    SET
      manual_marks = ${manualMarks},
      total_marks = ${totalMarks},
      max_marks = ${maxMarks},
      percentage = ${percentage},
      status = ${status},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${attemptId}
  `;
}

/**
 * Get manual marks for an exam attempt
 */
export async function getManualMarks(attemptId: string): Promise<ManualMark[]> {
  const result = await sql`
    SELECT * FROM manual_marks
    WHERE exam_attempt_id = ${attemptId}
    ORDER BY marked_at DESC
  `;

  return result as ManualMark[];
}

/**
 * Get pending marking tasks for admin
 */
export async function getPendingMarkingTasks(
  editionId?: string,
  subject?: string,
  educationLevel?: string
): Promise<any[]> {
  let query = sql`
    SELECT
      ea.id as attempt_id,
      ea.participant_id,
      ea.submitted_at,
      ec.subject,
      ec.education_level,
      ec.stage,
      COUNT(q.id) as total_questions,
      COUNT(mm.id) as marked_questions
    FROM exam_attempts_v2 ea
    INNER JOIN exam_configs ec ON ea.exam_config_id = ec.id
    INNER JOIN questions_v2 q ON q.id = ANY(ec.question_ids)
    LEFT JOIN manual_marks mm ON mm.exam_attempt_id = ea.id AND mm.question_id = q.id
    WHERE ea.status IN ('SUBMITTED', 'IN_PROGRESS')
      AND q.question_type NOT IN ('MCQ', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'NUMERIC')
  `;

  if (editionId) {
    query = sql`${query} AND ec.edition_id = ${editionId}`;
  }

  if (subject) {
    query = sql`${query} AND ec.subject = ${subject}`;
  }

  if (educationLevel) {
    query = sql`${query} AND ec.education_level = ${educationLevel}`;
  }

  query = sql`
    ${query}
    GROUP BY ea.id, ea.participant_id, ea.submitted_at, ec.subject, ec.education_level, ec.stage
    HAVING COUNT(q.id) > COUNT(mm.id)
    ORDER BY ea.submitted_at ASC
  `;

  return await query;
}

/**
 * Moderate a manual mark
 */
export async function moderateMark(
  adminId: string,
  markId: string,
  moderationNotes?: string
): Promise<void> {
  await sql`
    UPDATE manual_marks
    SET
      moderated_by_admin_id = ${adminId},
      moderated_at = CURRENT_TIMESTAMP,
      moderation_notes = ${moderationNotes || null}
    WHERE id = ${markId}
  `;
}
