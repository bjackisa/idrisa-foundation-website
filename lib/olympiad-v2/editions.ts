/**
 * Olympiad Edition Management
 * Functions for creating and managing olympiad editions
 */

import { sql, ensureOlympiadEditionsTable, ensureEditionStagesTable } from "./database"
import { OlympiadEdition, EditionStatus, CreateEditionInput } from "./types"
import { SUBJECTS_BY_LEVEL, DEFAULT_AGE_RULES } from "./constants";

/**
 * Create a new olympiad edition
 */
export async function createEdition(
  adminId: string,
  input: CreateEditionInput
): Promise<OlympiadEdition> {
  // Ensure tables exist
  await ensureOlympiadEditionsTable();
  await ensureEditionStagesTable();
  
  // Validate dates
  const enrollmentStart = new Date(input.enrollment_start);
  const enrollmentEnd = new Date(input.enrollment_end);

  if (enrollmentEnd <= enrollmentStart) {
    throw new Error('Enrollment end date must be after start date');
  }

  // Set defaults
  const activeLevels = input.active_levels || ['Primary', 'O-Level', 'A-Level'];
  const activeSubjects = {
    Primary: input.active_subjects?.Primary || SUBJECTS_BY_LEVEL.Primary,
    'O-Level': input.active_subjects?.['O-Level'] || SUBJECTS_BY_LEVEL['O-Level'],
    'A-Level': input.active_subjects?.['A-Level'] || SUBJECTS_BY_LEVEL['A-Level'],
  };
  const ageRules = {
    Primary: input.age_rules?.Primary || DEFAULT_AGE_RULES.Primary,
    'O-Level': input.age_rules?.['O-Level'] || DEFAULT_AGE_RULES['O-Level'],
    'A-Level': input.age_rules?.['A-Level'] || DEFAULT_AGE_RULES['A-Level'],
  };

  const result = await sql`
    INSERT INTO olympiad_editions (
      name,
      year,
      enrollment_start,
      enrollment_end,
      status,
      active_levels,
      active_subjects,
      age_rules,
      max_subjects_per_participant,
      reference_date,
      created_by_admin_id
    )
    VALUES (
      ${input.name},
      ${input.year},
      ${input.enrollment_start},
      ${input.enrollment_end},
      'DRAFT',
      ${JSON.stringify(activeLevels)},
      ${JSON.stringify(activeSubjects)},
      ${JSON.stringify(ageRules)},
      ${input.max_subjects_per_participant || 3},
      ${input.reference_date || null},
      ${adminId}
    )
    RETURNING *
  `;

  if (result.length === 0) {
    throw new Error('Failed to create edition');
  }

  return result[0] as OlympiadEdition;
}

/**
 * Get edition by ID
 */
export async function getEditionById(id: string): Promise<OlympiadEdition | null> {
  // Ensure tables exist
  await ensureOlympiadEditionsTable();
  const result = await sql`
    SELECT * FROM olympiad_editions
    WHERE id = ${id}
  `;

  return result.length > 0 ? (result[0] as OlympiadEdition) : null;
}

/**
 * Get all editions
 */
export async function getAllEditions(filters?: {
  status?: EditionStatus;
  year?: number;
}): Promise<OlympiadEdition[]> {
  // Ensure tables exist
  await ensureOlympiadEditionsTable();
  let query = sql`SELECT * FROM olympiad_editions WHERE 1=1`;

  if (filters?.status) {
    query = sql`${query} AND status = ${filters.status}`;
  }

  if (filters?.year) {
    query = sql`${query} AND year = ${filters.year}`;
  }

  query = sql`${query} ORDER BY year DESC, created_at DESC`;

  return (await query) as OlympiadEdition[];
}

/**
 * Update an edition
 */
export async function updateEdition(
  id: string,
  updates: Partial<OlympiadEdition>
): Promise<OlympiadEdition> {
  // Ensure tables exist
  await ensureOlympiadEditionsTable();
  const existing = await getEditionById(id);
  if (!existing) {
    throw new Error('Edition not found');
  }

  // Fix type issues by casting to any for fields not in the type definition
  const updatesAny = updates as any;
  
  const result = await sql`
    UPDATE olympiad_editions
    SET
      name = COALESCE(${updates.name || null}, name),
      enrollment_start = COALESCE(${updates.enrollment_start || null}, enrollment_start),
      enrollment_end = COALESCE(${updates.enrollment_end || null}, enrollment_end),
      min_age = COALESCE(${updatesAny.min_age || null}, min_age),
      max_age = COALESCE(${updatesAny.max_age || null}, max_age),
      active_levels = COALESCE(${updates.active_levels ? JSON.stringify(updates.active_levels) : null}, active_levels),
      status = COALESCE(${updates.status || null}, status),
      max_subjects_per_participant = COALESCE(${updates.max_subjects_per_participant || null}, max_subjects_per_participant),
      reference_date = COALESCE(${updates.reference_date || null}, reference_date),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  if (result.length === 0) {
    throw new Error('Failed to update edition');
  }

  return result[0] as OlympiadEdition;
}

/**
 * Update edition status
 */
export async function updateEditionStatus(
  editionId: string,
  status: EditionStatus
): Promise<void> {
  // Ensure tables exist
  await ensureOlympiadEditionsTable();
  await sql`
    UPDATE olympiad_editions
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${editionId}
  `;

  // Log status change
  await sql`
    INSERT INTO audit_log (
      entity_type,
      entity_id,
      action,
      changes
    )
    VALUES (
      'edition',
      ${editionId},
      'status_change',
      ${JSON.stringify({ status })}
    )
  `;
}

/**
 * Get active (open) editions
 */
export async function getActiveEditions(): Promise<OlympiadEdition[]> {
  // Ensure tables exist
  await ensureOlympiadEditionsTable();
  
  const now = new Date().toISOString();

  const result = await sql`
    SELECT * FROM olympiad_editions
    WHERE status = 'OPEN'
      AND enrollment_start <= ${now}
      AND enrollment_end >= ${now}
    ORDER BY enrollment_start DESC
  `;

  return result as OlympiadEdition[];
}

/**
 * Get edition statistics
 */
export async function getEditionStatistics(editionId: string): Promise<{
  total_participants: number;
  participants_by_level: Record<string, number>;
  participants_by_type: Record<string, number>;
  total_subjects_enrolled: number;
}> {
  // Ensure tables exist
  await ensureOlympiadEditionsTable();
  const participantsResult = await sql`
    SELECT
      COUNT(*) as total,
      education_level,
      participant_type
    FROM olympiad_participants
    WHERE edition_id = ${editionId}
    GROUP BY education_level, participant_type
  `;

  const subjectsResult = await sql`
    SELECT COUNT(*) as total
    FROM participant_subjects ps
    INNER JOIN olympiad_participants op ON ps.participant_id = op.id
    WHERE op.edition_id = ${editionId}
  `;

  const participantsByLevel: Record<string, number> = {};
  const participantsByType: Record<string, number> = {};
  let totalParticipants = 0;

  for (const row of participantsResult as any[]) {
    const count = parseInt(row.total);
    totalParticipants += count;

    participantsByLevel[row.education_level] =
      (participantsByLevel[row.education_level] || 0) + count;
    participantsByType[row.participant_type] =
      (participantsByType[row.participant_type] || 0) + count;
  }

  return {
    total_participants: totalParticipants,
    participants_by_level: participantsByLevel,
    participants_by_type: participantsByType,
    total_subjects_enrolled: parseInt(subjectsResult[0]?.total as string) || 0,
  };
}

/**
 * Delete edition (only if no participants)
 */
export async function deleteEdition(editionId: string): Promise<void> {
  // Ensure tables exist
  await ensureOlympiadEditionsTable();
  // Check for participants
  const participantsResult = await sql`
    SELECT COUNT(*) as count
    FROM olympiad_participants
    WHERE edition_id = ${editionId}
  `;

  const participantCount = parseInt(participantsResult[0].count as string);
  if (participantCount > 0) {
    throw new Error('Cannot delete edition with participants');
  }

  await sql`
    DELETE FROM olympiad_editions
    WHERE id = ${editionId}
  `;
}
