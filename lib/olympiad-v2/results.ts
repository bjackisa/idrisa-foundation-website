/**
 * Results and Rankings Management
 * Functions for calculating results, rankings, and leaderboards
 */

import { sql, ensureExamAttemptsTable } from './database';
import type { 
  Ranking, 
  LeaderboardEntry,
  OlympiadParticipant,
  EducationLevel,
  StageName
} from './types';

/**
 * Calculate rankings for a specific subject and stage
 */
export async function calculateRankings(
  editionId: string,
  educationLevel: EducationLevel,
  subject: string,
  stage: StageName
): Promise<Ranking[]> {
  // Ensure tables exist
  await ensureRankingsTable();
  await ensureExamAttemptsTable();
  
  // Get all attempts for this subject/stage
  const attemptsResult = await sql`
    SELECT 
      ea.id,
      ea.participant_id,
      ea.total_marks,
      ea.percentage,
      op.education_level
    FROM exam_attempts_v2 ea
    INNER JOIN exam_configs ec ON ea.exam_config_id = ec.id
    INNER JOIN olympiad_participants op ON ea.participant_id = op.id
    WHERE ec.edition_id = ${editionId}
      AND ec.subject = ${subject}
      AND ec.stage = ${stage}
      AND op.education_level = ${educationLevel}
      AND ea.status = 'MARKED'
    ORDER BY ea.percentage DESC
  `;
  
  if (attemptsResult.length === 0) {
    return [];
  }
  
  // Calculate rankings
  const rankings: Ranking[] = [];
  let currentRank = 1;
  let previousScore = null;
  let sameRankCount = 0;
  
  for (let i = 0; i < attemptsResult.length; i++) {
    const attempt = attemptsResult[i];
    const score = parseFloat(attempt.percentage);
    
    // If this score is different from previous, assign new rank
    if (previousScore !== null && score < previousScore) {
      currentRank += sameRankCount;
      sameRankCount = 1;
    } else if (previousScore === score) {
      sameRankCount++;
    } else {
      sameRankCount = 1;
    }
    
    previousScore = score;
    
    // Create ranking
    const ranking: Ranking = {
      id: `${editionId}-${subject}-${stage}-${attempt.participant_id}`,
      edition_id: editionId,
      education_level: educationLevel,
      subject: subject,
      stage: stage,
      participant_id: attempt.participant_id,
      score: parseFloat(attempt.total_marks),
      rank: currentRank,
      total_participants: attemptsResult.length,
      computed_at: new Date().toISOString()
    };
    
    rankings.push(ranking);
    
    // Save to database
    await sql`
      INSERT INTO rankings (
        id,
        edition_id,
        education_level,
        subject,
        stage,
        participant_id,
        score,
        rank,
        total_participants,
        computed_at
      )
      VALUES (
        ${ranking.id},
        ${ranking.edition_id},
        ${ranking.education_level},
        ${ranking.subject},
        ${ranking.stage},
        ${ranking.participant_id},
        ${ranking.score},
        ${ranking.rank},
        ${ranking.total_participants},
        ${ranking.computed_at}
      )
      ON CONFLICT (id) DO UPDATE SET
        score = ${ranking.score},
        rank = ${ranking.rank},
        total_participants = ${ranking.total_participants},
        computed_at = ${ranking.computed_at}
    `;
  }
  
  return rankings;
}

/**
 * Get leaderboard for a specific subject and stage
 */
export async function getLeaderboard(
  editionId: string,
  educationLevel: EducationLevel,
  subject: string,
  stage: StageName,
  limit: number = 10
): Promise<LeaderboardEntry[]> {
  // Ensure tables exist
  await ensureRankingsTable();
  
  // Get rankings with participant details
  const result = await sql`
    SELECT 
      r.rank,
      r.score,
      r.participant_id,
      CASE
        WHEN op.participant_type = 'SELF' THEN u.display_name
        WHEN op.participant_type = 'MINOR' THEN mp.full_name
        ELSE 'Unknown'
      END as participant_name,
      COALESCE(mp.school_name, u.school) as school_name
    FROM rankings r
    INNER JOIN olympiad_participants op ON r.participant_id = op.id
    LEFT JOIN users u ON op.user_id = u.id
    LEFT JOIN minor_profiles mp ON op.minor_id = mp.id
    WHERE r.edition_id = ${editionId}
      AND r.education_level = ${educationLevel}
      AND r.subject = ${subject}
      AND r.stage = ${stage}
    ORDER BY r.rank ASC
    LIMIT ${limit}
  `;
  
  return result as LeaderboardEntry[];
}

/**
 * Get participant's ranking for a specific subject and stage
 */
export async function getParticipantRanking(
  participantId: string,
  subject: string,
  stage: string
): Promise<Ranking | null> {
  // Ensure tables exist
  await ensureRankingsTable();
  
  const result = await sql`
    SELECT * FROM rankings
    WHERE participant_id = ${participantId}
      AND subject = ${subject}
      AND stage = ${stage}
  `;
  
  return result.length > 0 ? (result[0] as Ranking) : null;
}

/**
 * Get all rankings for a participant
 */
export async function getParticipantRankings(
  participantId: string
): Promise<Ranking[]> {
  // Ensure tables exist
  await ensureRankingsTable();
  
  const result = await sql`
    SELECT * FROM rankings
    WHERE participant_id = ${participantId}
    ORDER BY stage, subject
  `;
  
  return result as Ranking[];
}

// Import ensureRankingsTable from database.ts instead of defining it here
import { ensureRankingsTable } from './database';
