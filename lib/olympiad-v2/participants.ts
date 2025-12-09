/**
 * Olympiad Participants Management
 * Functions for managing participants in olympiad editions
 */

import { sql, ensureParticipantsTable, ensureParticipantSubjectsTable } from "./database"
import { OlympiadParticipant, ParticipantType, CreateParticipantInput } from "./types"

/**
 * Create a new participant
 */
export async function createParticipant(
  input: CreateParticipantInput
): Promise<OlympiadParticipant> {
  // Ensure tables exist
  await ensureParticipantsTable();
  await ensureParticipantSubjectsTable();

  // Validate required fields
  if (!input.edition_id || !input.participant_type || !input.education_level) {
    throw new Error('Missing required fields');
  }

  // Validate participant type specific fields
  if (input.participant_type === ParticipantType.SELF && !input.user_id) {
    throw new Error('User ID is required for self-enrollment');
  }

  if (input.participant_type === ParticipantType.MINOR && !input.guardian_id) {
    throw new Error('Guardian ID is required for minor enrollment');
  }

  // Create participant
  const result = await sql`
    INSERT INTO olympiad_participants (
      edition_id,
      participant_type,
      user_id,
      guardian_id,
      minor_id,
      education_level,
      class_level,
      is_qualified,
      current_stage
    )
    VALUES (
      ${input.edition_id},
      ${input.participant_type},
      ${input.user_id || null},
      ${input.guardian_id || null},
      ${input.minor_id || null},
      ${input.education_level},
      ${input.class_level || ''},
      ${input.is_qualified !== false},
      1
    )
    RETURNING *
  `;

  if (result.length === 0) {
    throw new Error('Failed to create participant');
  }

  const participant = result[0] as OlympiadParticipant;

  // Add subjects if provided
  if (input.subjects && input.subjects.length > 0) {
    await Promise.all(
      input.subjects.map((subject: string) =>
        sql`
          INSERT INTO participant_subjects (
            participant_id,
            subject
          )
          VALUES (
            ${participant.id},
            ${subject}
          )
        `
      )
    );
  }

  return participant;
}

/**
 * Get participant by ID
 */
export async function getParticipantById(id: string): Promise<OlympiadParticipant | null> {
  // Ensure table exists
  await ensureParticipantsTable();
  
  const result = await sql`
    SELECT * FROM olympiad_participants
    WHERE id = ${id}
  `;

  return result.length > 0 ? (result[0] as OlympiadParticipant) : null;
}

/**
 * Get participants by edition ID
 */
export async function getParticipantsByEdition(
  editionId: string,
  filters?: {
    education_level?: string;
    participant_type?: ParticipantType;
    is_qualified?: boolean;
    current_stage?: number;
  }
): Promise<OlympiadParticipant[]> {
  // Ensure table exists
  await ensureParticipantsTable();
  
  let query = sql`SELECT * FROM olympiad_participants WHERE edition_id = ${editionId}`;

  if (filters?.education_level) {
    query = sql`${query} AND education_level = ${filters.education_level}`;
  }

  if (filters?.participant_type) {
    query = sql`${query} AND participant_type = ${filters.participant_type}`;
  }

  if (filters?.is_qualified !== undefined) {
    query = sql`${query} AND is_qualified = ${filters.is_qualified}`;
  }

  if (filters?.current_stage) {
    query = sql`${query} AND current_stage = ${filters.current_stage}`;
  }

  query = sql`${query} ORDER BY created_at DESC`;

  return (await query) as OlympiadParticipant[];
}

/**
 * Get participants by user ID
 */
export async function getParticipantsByUser(userId: string): Promise<OlympiadParticipant[]> {
  // Ensure table exists
  await ensureParticipantsTable();
  
  const result = await sql`
    SELECT op.*, oe.name as edition_name, oe.year as edition_year
    FROM olympiad_participants op
    JOIN olympiad_editions oe ON op.edition_id = oe.id
    WHERE op.user_id = ${userId}
    ORDER BY oe.year DESC, op.created_at DESC
  `;

  return result as OlympiadParticipant[];
}

/**
 * Get participants by guardian ID
 */
export async function getParticipantsByGuardian(guardianId: string): Promise<OlympiadParticipant[]> {
  // Ensure table exists
  await ensureParticipantsTable();
  
  const result = await sql`
    SELECT op.*, oe.name as edition_name, oe.year as edition_year, mp.full_name as minor_name
    FROM olympiad_participants op
    JOIN olympiad_editions oe ON op.edition_id = oe.id
    JOIN minor_profiles mp ON op.minor_id = mp.id
    WHERE op.guardian_id = ${guardianId}
    ORDER BY oe.year DESC, op.created_at DESC
  `;

  return result as OlympiadParticipant[];
}

/**
 * Update participant qualification status
 */
export async function updateParticipantQualification(
  participantId: string,
  isQualified: boolean,
  currentStage: number
): Promise<void> {
  // Ensure table exists
  await ensureParticipantsTable();
  
  await sql`
    UPDATE olympiad_participants
    SET 
      is_qualified = ${isQualified},
      current_stage = ${currentStage}
    WHERE id = ${participantId}
  `;
}

/**
 * Get participant subjects
 */
export async function getParticipantSubjects(participantId: string): Promise<string[]> {
  // Ensure table exists
  await ensureParticipantSubjectsTable();
  
  const result = await sql`
    SELECT subject FROM participant_subjects
    WHERE participant_id = ${participantId}
  `;

  return result.map((row: any) => row.subject);
}

/**
 * Update participant subjects
 */
export async function updateParticipantSubjects(
  participantId: string,
  subjects: string[]
): Promise<void> {
  // Ensure tables exist
  await ensureParticipantsTable();
  await ensureParticipantSubjectsTable();
  
  // Delete existing subjects
  await sql`
    DELETE FROM participant_subjects
    WHERE participant_id = ${participantId}
  `;

  // Add new subjects
  if (subjects.length > 0) {
    await Promise.all(
      subjects.map(subject =>
        sql`
          INSERT INTO participant_subjects (
            participant_id,
            subject
          )
          VALUES (
            ${participantId},
            ${subject}
          )
        `
      )
    );
  }
}
