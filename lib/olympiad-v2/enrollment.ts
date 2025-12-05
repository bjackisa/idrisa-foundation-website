/**
 * Enrollment and Eligibility Management
 * Functions for enrolling participants and checking eligibility
 */

import { neon } from '@neondatabase/serverless';
import type {
  EnrollmentInput,
  EnrollmentEligibility,
  OlympiadParticipant,
  ParticipantSubject,
  OlympiadEdition,
  EducationLevel,
} from './types';
import {
  calculateAge,
  validateAge,
  getSubjectsForLevel,
  ERROR_MESSAGES,
} from './constants';
import { getMinorProfileById } from './minors';

const sql = neon(process.env.DATABASE_URL!);

/**
 * Check enrollment eligibility
 */
export async function checkEnrollmentEligibility(
  userId: string,
  input: EnrollmentInput
): Promise<EnrollmentEligibility> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let age: number | undefined;
  let age_valid = false;
  let level_available = false;
  let subjects_valid = false;
  let already_enrolled = false;

  // Get edition
  const editionResult = await sql`
    SELECT * FROM olympiad_editions
    WHERE id = ${input.edition_id}
  `;

  if (editionResult.length === 0) {
    errors.push(ERROR_MESSAGES.EDITION_NOT_FOUND);
    return {
      eligible: false,
      errors,
      warnings,
    };
  }

  const edition = editionResult[0] as any;

  // Check enrollment window
  const now = new Date();
  const enrollmentStart = new Date(edition.enrollment_start);
  const enrollmentEnd = new Date(edition.enrollment_end);

  if (now < enrollmentStart) {
    errors.push(ERROR_MESSAGES.ENROLLMENT_NOT_OPEN);
  }

  if (now > enrollmentEnd) {
    errors.push(ERROR_MESSAGES.ENROLLMENT_CLOSED);
  }

  // Check if edition is open
  if (edition.status !== 'OPEN') {
    errors.push('Edition is not open for enrollment');
  }

  // Check if level is available
  const activeLevels = edition.active_levels as EducationLevel[];
  level_available = activeLevels.includes(input.education_level);
  if (!level_available) {
    errors.push(ERROR_MESSAGES.LEVEL_NOT_AVAILABLE);
  }

  // Get date of birth for age validation
  let dateOfBirth: Date | null = null;

  if (input.participant_type === 'SELF') {
    // Get user's date of birth from participants table (if they were previously registered)
    const userParticipantResult = await sql`
      SELECT date_of_birth FROM participants
      WHERE guardian_id = ${userId}
      LIMIT 1
    `;

    if (userParticipantResult.length > 0) {
      dateOfBirth = new Date(userParticipantResult[0].date_of_birth as string);
    } else {
      // For self-enrollment, we need DOB from user profile
      // This should be collected during enrollment
      warnings.push('Date of birth required for age validation');
    }
  } else if (input.participant_type === 'MINOR' && input.minor_profile_id) {
    const minor = await getMinorProfileById(input.minor_profile_id);
    if (!minor) {
      errors.push('Minor profile not found');
    } else {
      dateOfBirth = new Date(minor.date_of_birth);
    }
  }

  // Validate age
  if (dateOfBirth) {
    const referenceDate = edition.reference_date
      ? new Date(edition.reference_date)
      : new Date();
    age = calculateAge(dateOfBirth, referenceDate);

    const ageRules = edition.age_rules as any;
    age_valid = validateAge(age, input.education_level, ageRules);

    if (!age_valid) {
      errors.push(ERROR_MESSAGES.AGE_NOT_VALID);
    }
  }

  // Validate subjects
  const activeSubjects = edition.active_subjects as any;
  const allowedSubjects = activeSubjects[input.education_level] || [];
  const invalidSubjects = input.subjects.filter(
    (s) => !allowedSubjects.includes(s)
  );

  subjects_valid = invalidSubjects.length === 0;
  if (!subjects_valid) {
    errors.push(
      `${ERROR_MESSAGES.SUBJECT_NOT_VALID}: ${invalidSubjects.join(', ')}`
    );
  }

  // Check subject count
  const maxSubjects = edition.max_subjects_per_participant || 3;
  if (input.subjects.length > maxSubjects) {
    errors.push(`${ERROR_MESSAGES.MAX_SUBJECTS_EXCEEDED} (max: ${maxSubjects})`);
  }

  if (input.subjects.length < 1) {
    errors.push('At least one subject must be selected');
  }

  // Check for duplicate enrollment
  if (input.participant_type === 'SELF') {
    const existingResult = await sql`
      SELECT id FROM olympiad_participants
      WHERE edition_id = ${input.edition_id}
        AND user_id = ${userId}
    `;
    already_enrolled = existingResult.length > 0;
  } else if (input.minor_profile_id) {
    const existingResult = await sql`
      SELECT id FROM olympiad_participants
      WHERE edition_id = ${input.edition_id}
        AND minor_profile_id = ${input.minor_profile_id}
    `;
    already_enrolled = existingResult.length > 0;
  }

  if (already_enrolled) {
    errors.push(ERROR_MESSAGES.ALREADY_ENROLLED);
  }

  return {
    eligible: errors.length === 0,
    errors,
    warnings,
    age,
    age_valid,
    level_available,
    subjects_valid,
    already_enrolled,
  };
}

/**
 * Enroll a participant
 */
export async function enrollParticipant(
  userId: string,
  input: EnrollmentInput
): Promise<OlympiadParticipant> {
  // Check eligibility
  const eligibility = await checkEnrollmentEligibility(userId, input);
  if (!eligibility.eligible) {
    throw new Error(`Enrollment failed: ${eligibility.errors.join(', ')}`);
  }

  // Create participant record
  const participantResult = await sql`
    INSERT INTO olympiad_participants (
      edition_id,
      participant_type,
      user_id,
      minor_profile_id,
      enrolled_by_user_id,
      education_level,
      status
    )
    VALUES (
      ${input.edition_id},
      ${input.participant_type},
      ${input.participant_type === 'SELF' ? userId : null},
      ${input.participant_type === 'MINOR' ? input.minor_profile_id : null},
      ${userId},
      ${input.education_level},
      'ACTIVE'
    )
    RETURNING *
  `;

  if (participantResult.length === 0) {
    throw new Error('Failed to create participant');
  }

  const participant = participantResult[0] as OlympiadParticipant;

  // Add subject enrollments
  for (const subject of input.subjects) {
    await sql`
      INSERT INTO participant_subjects (participant_id, subject)
      VALUES (${participant.id}, ${subject})
    `;
  }

  return participant;
}

/**
 * Get participant by ID
 */
export async function getParticipantById(
  participantId: string
): Promise<OlympiadParticipant | null> {
  const result = await sql`
    SELECT * FROM olympiad_participants
    WHERE id = ${participantId}
  `;

  return result.length > 0 ? (result[0] as OlympiadParticipant) : null;
}

/**
 * Get participant subjects
 */
export async function getParticipantSubjects(
  participantId: string
): Promise<ParticipantSubject[]> {
  const result = await sql`
    SELECT * FROM participant_subjects
    WHERE participant_id = ${participantId}
    ORDER BY enrolled_at ASC
  `;

  return result as ParticipantSubject[];
}

/**
 * Get all participants for a user (self + minors)
 */
export async function getUserParticipants(userId: string): Promise<{
  self: OlympiadParticipant[];
  minors: OlympiadParticipant[];
}> {
  const selfResult = await sql`
    SELECT * FROM olympiad_participants
    WHERE user_id = ${userId}
    ORDER BY enrolled_at DESC
  `;

  const minorsResult = await sql`
    SELECT * FROM olympiad_participants
    WHERE enrolled_by_user_id = ${userId}
      AND participant_type = 'MINOR'
    ORDER BY enrolled_at DESC
  `;

  return {
    self: selfResult as OlympiadParticipant[],
    minors: minorsResult as OlympiadParticipant[],
  };
}

/**
 * Get participants for an edition
 */
export async function getEditionParticipants(
  editionId: string,
  filters?: {
    education_level?: EducationLevel;
    status?: string;
    subject?: string;
  }
): Promise<OlympiadParticipant[]> {
  let query = sql`
    SELECT DISTINCT op.*
    FROM olympiad_participants op
  `;

  if (filters?.subject) {
    query = sql`
      SELECT DISTINCT op.*
      FROM olympiad_participants op
      INNER JOIN participant_subjects ps ON op.id = ps.participant_id
      WHERE op.edition_id = ${editionId}
        AND ps.subject = ${filters.subject}
    `;
  } else {
    query = sql`
      SELECT * FROM olympiad_participants
      WHERE edition_id = ${editionId}
    `;
  }

  let result = await query;

  // Apply filters
  if (filters?.education_level) {
    result = result.filter((p: any) => p.education_level === filters.education_level);
  }

  if (filters?.status) {
    result = result.filter((p: any) => p.status === filters.status);
  }

  return result as OlympiadParticipant[];
}

/**
 * Update participant status
 */
export async function updateParticipantStatus(
  participantId: string,
  status: 'ACTIVE' | 'DISQUALIFIED' | 'WITHDRAWN' | 'COMPLETED',
  reason?: string
): Promise<void> {
  await sql`
    UPDATE olympiad_participants
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${participantId}
  `;

  // Log the status change
  await sql`
    INSERT INTO audit_log (
      entity_type,
      entity_id,
      action,
      changes
    )
    VALUES (
      'participant',
      ${participantId},
      'status_change',
      ${JSON.stringify({ status, reason })}
    )
  `;
}

/**
 * Withdraw from olympiad
 */
export async function withdrawParticipant(
  participantId: string,
  userId: string
): Promise<void> {
  // Verify ownership
  const participant = await getParticipantById(participantId);
  if (!participant || participant.enrolled_by_user_id !== userId) {
    throw new Error('Participant not found or access denied');
  }

  await updateParticipantStatus(participantId, 'WITHDRAWN', 'User withdrawal');
}

/**
 * Check if user can access participant data
 */
export async function canAccessParticipant(
  userId: string,
  participantId: string
): Promise<boolean> {
  const result = await sql`
    SELECT id FROM olympiad_participants
    WHERE id = ${participantId}
      AND (user_id = ${userId} OR enrolled_by_user_id = ${userId})
  `;

  return result.length > 0;
}
