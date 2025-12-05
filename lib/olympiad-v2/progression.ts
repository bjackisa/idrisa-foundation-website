/**
 * Stage Progression and Ranking Logic
 * Functions for computing eligibility and rankings
 */

import { neon } from '@neondatabase/serverless';
import type {
  StageEligibility,
  Ranking,
  StageName,
  EducationLevel,
  LeaderboardEntry,
} from './types';
import { PROGRESSION_RULES } from './constants';

const sql = neon(process.env.DATABASE_URL!);

/**
 * Compute rankings for a specific stage
 */
export async function computeRankings(
  editionId: string,
  educationLevel: EducationLevel,
  subject: string,
  stage: StageName
): Promise<Ranking[]> {
  // Get all completed exam attempts for this stage
  const attempts = await sql`
    SELECT
      ea.participant_id,
      ea.percentage as score,
      op.id as participant_id
    FROM exam_attempts_v2 ea
    INNER JOIN exam_configs ec ON ea.exam_config_id = ec.id
    INNER JOIN olympiad_participants op ON ea.participant_id = op.id
    WHERE ec.edition_id = ${editionId}
      AND ec.education_level = ${educationLevel}
      AND ec.subject = ${subject}
      AND ec.stage = ${stage}
      AND ea.status = 'MARKED'
      AND ea.percentage IS NOT NULL
    ORDER BY ea.percentage DESC, ea.submitted_at ASC
  `;

  if (attempts.length === 0) {
    return [];
  }

  // Assign ranks (handle ties)
  const rankings: Ranking[] = [];
  let currentRank = 1;
  let previousScore: number | null = null;
  let sameRankCount = 0;

  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i] as any;
    const score = parseFloat(attempt.score);

    if (previousScore !== null && score < previousScore) {
      currentRank += sameRankCount;
      sameRankCount = 1;
    } else {
      sameRankCount++;
    }

    rankings.push({
      id: '', // Will be set by database
      edition_id: editionId,
      education_level: educationLevel,
      subject,
      stage,
      participant_id: attempt.participant_id,
      score,
      rank: currentRank,
      total_participants: attempts.length,
      computed_at: new Date().toISOString(),
    });

    previousScore = score;
  }

  // Save rankings to database
  for (const ranking of rankings) {
    await sql`
      INSERT INTO rankings (
        edition_id,
        education_level,
        subject,
        stage,
        participant_id,
        score,
        rank,
        total_participants
      )
      VALUES (
        ${ranking.edition_id},
        ${ranking.education_level},
        ${ranking.subject},
        ${ranking.stage},
        ${ranking.participant_id},
        ${ranking.score},
        ${ranking.rank},
        ${ranking.total_participants}
      )
      ON CONFLICT (edition_id, education_level, subject, stage, participant_id)
      DO UPDATE SET
        score = ${ranking.score},
        rank = ${ranking.rank},
        total_participants = ${ranking.total_participants},
        computed_at = CURRENT_TIMESTAMP
    `;
  }

  return rankings;
}

/**
 * Compute stage eligibility for next stage
 */
export async function computeStageEligibility(
  editionId: string,
  educationLevel: EducationLevel,
  subject: string,
  currentStage: StageName
): Promise<StageEligibility[]> {
  // Determine next stage
  const stageOrder: StageName[] = ['Beginner', 'Theory', 'Practical', 'Final'];
  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
    throw new Error('Invalid stage or no next stage');
  }

  const nextStage = stageOrder[currentIndex + 1];

  // Get progression rules for current stage
  const rules = PROGRESSION_RULES[currentStage];
  if (!rules || !('min_score' in rules)) {
    throw new Error('No progression rules for this stage');
  }

  // First, compute rankings for current stage
  await computeRankings(editionId, educationLevel, subject, currentStage);

  // Get all rankings for current stage
  const rankings = await sql`
    SELECT * FROM rankings
    WHERE edition_id = ${editionId}
      AND education_level = ${educationLevel}
      AND subject = ${subject}
      AND stage = ${currentStage}
    ORDER BY rank ASC
  `;

  const eligibilities: StageEligibility[] = [];

  for (const ranking of rankings as any[]) {
    let isEligible = false;
    let reason = '';

    const score = parseFloat(ranking.score);
    const rank = parseInt(ranking.rank);
    const totalParticipants = parseInt(ranking.total_participants);

    // Check minimum score
    if (score < rules.min_score) {
      isEligible = false;
      reason = `Score ${score}% is below minimum ${rules.min_score}%`;
    }
    // Check percentile if required
    else if ('min_percentile' in rules && rules.min_percentile) {
      const percentile = ((totalParticipants - rank + 1) / totalParticipants) * 100;
      const requiredPercentile = 100 - rules.min_percentile;

      if (percentile >= requiredPercentile) {
        isEligible = true;
        reason = `Qualified with score ${score}% and rank ${rank}/${totalParticipants}`;
      } else {
        isEligible = false;
        reason = `Rank ${rank}/${totalParticipants} is not in top ${100 - rules.min_percentile}%`;
      }
    } else {
      // Only minimum score required
      isEligible = true;
      reason = `Qualified with score ${score}%`;
    }

    // Save eligibility record
    await sql`
      INSERT INTO stage_eligibility (
        participant_id,
        subject,
        stage,
        is_eligible,
        eligibility_reason,
        previous_stage_score,
        rank_in_previous_stage,
        total_in_previous_stage
      )
      VALUES (
        ${ranking.participant_id},
        ${subject},
        ${nextStage},
        ${isEligible},
        ${reason},
        ${score},
        ${rank},
        ${totalParticipants}
      )
      ON CONFLICT (participant_id, subject, stage)
      DO UPDATE SET
        is_eligible = ${isEligible},
        eligibility_reason = ${reason},
        previous_stage_score = ${score},
        rank_in_previous_stage = ${rank},
        total_in_previous_stage = ${totalParticipants},
        computed_at = CURRENT_TIMESTAMP
    `;

    eligibilities.push({
      id: '',
      participant_id: ranking.participant_id,
      subject,
      stage: nextStage,
      is_eligible: isEligible,
      eligibility_reason: reason,
      previous_stage_score: score,
      rank_in_previous_stage: rank,
      total_in_previous_stage: totalParticipants,
      computed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  }

  return eligibilities;
}

/**
 * Check if participant is eligible for a stage
 */
export async function isParticipantEligibleForStage(
  participantId: string,
  subject: string,
  stage: StageName
): Promise<{ eligible: boolean; reason?: string }> {
  // Beginner stage is always available to enrolled participants
  if (stage === 'Beginner') {
    return { eligible: true };
  }

  // Check eligibility record
  const result = await sql`
    SELECT * FROM stage_eligibility
    WHERE participant_id = ${participantId}
      AND subject = ${subject}
      AND stage = ${stage}
  `;

  if (result.length === 0) {
    return {
      eligible: false,
      reason: 'Eligibility not computed yet. Complete previous stage first.',
    };
  }

  const eligibility = result[0] as StageEligibility;
  return {
    eligible: eligibility.is_eligible,
    reason: eligibility.eligibility_reason,
  };
}

/**
 * Get leaderboard for a stage
 */
export async function getLeaderboard(
  editionId: string,
  educationLevel: EducationLevel,
  subject: string,
  stage: StageName,
  limit: number = 50,
  offset: number = 0
): Promise<LeaderboardEntry[]> {
  const rankings = await sql`
    SELECT
      r.rank,
      r.score,
      r.participant_id,
      CASE
        WHEN op.participant_type = 'SELF' THEN g.full_name
        WHEN op.participant_type = 'MINOR' THEN mp.full_name
      END as participant_name,
      CASE
        WHEN op.participant_type = 'MINOR' THEN mp.school_name
        ELSE NULL
      END as school_name
    FROM rankings r
    INNER JOIN olympiad_participants op ON r.participant_id = op.id
    LEFT JOIN guardians g ON op.user_id = g.id
    LEFT JOIN minor_profiles mp ON op.minor_profile_id = mp.id
    WHERE r.edition_id = ${editionId}
      AND r.education_level = ${educationLevel}
      AND r.subject = ${subject}
      AND r.stage = ${stage}
    ORDER BY r.rank ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return rankings.map((r: any) => ({
    rank: parseInt(r.rank),
    participant_name: r.participant_name,
    school_name: r.school_name,
    score: parseFloat(r.score),
    participant_id: r.participant_id,
  }));
}

/**
 * Get participant's rank in a stage
 */
export async function getParticipantRank(
  participantId: string,
  subject: string,
  stage: StageName
): Promise<{ rank: number; total: number; score: number } | null> {
  const result = await sql`
    SELECT rank, total_participants, score
    FROM rankings
    WHERE participant_id = ${participantId}
      AND subject = ${subject}
      AND stage = ${stage}
  `;

  if (result.length === 0) {
    return null;
  }

  const ranking = result[0] as any;
  return {
    rank: parseInt(ranking.rank),
    total: parseInt(ranking.total_participants),
    score: parseFloat(ranking.score),
  };
}

/**
 * Run progression for all subjects in an edition after a stage completes
 */
export async function runProgressionForEdition(
  editionId: string,
  stage: StageName
): Promise<{ total_processed: number; total_qualified: number }> {
  // Get all unique combinations of education_level and subject for this edition
  const combinations = await sql`
    SELECT DISTINCT ec.education_level, ec.subject
    FROM exam_configs ec
    WHERE ec.edition_id = ${editionId}
      AND ec.stage = ${stage}
  `;

  let totalProcessed = 0;
  let totalQualified = 0;

  for (const combo of combinations as any[]) {
    const eligibilities = await computeStageEligibility(
      editionId,
      combo.education_level as EducationLevel,
      combo.subject,
      stage
    );

    totalProcessed += eligibilities.length;
    totalQualified += eligibilities.filter((e) => e.is_eligible).length;
  }

  return { total_processed: totalProcessed, total_qualified: totalQualified };
}

/**
 * Get stage statistics
 */
export async function getStageStatistics(
  editionId: string,
  educationLevel: EducationLevel,
  subject: string,
  stage: StageName
): Promise<{
  total_enrolled: number;
  total_attempted: number;
  total_completed: number;
  average_score: number;
  pass_rate: number;
  qualified_for_next: number;
}> {
  // Get total enrolled
  const enrolledResult = await sql`
    SELECT COUNT(DISTINCT ps.participant_id) as count
    FROM participant_subjects ps
    INNER JOIN olympiad_participants op ON ps.participant_id = op.id
    WHERE op.edition_id = ${editionId}
      AND op.education_level = ${educationLevel}
      AND ps.subject = ${subject}
  `;

  const totalEnrolled = parseInt(enrolledResult[0].count as string);

  // Get exam statistics
  const statsResult = await sql`
    SELECT
      COUNT(DISTINCT ea.participant_id) as attempted,
      COUNT(DISTINCT CASE WHEN ea.status = 'MARKED' THEN ea.participant_id END) as completed,
      AVG(CASE WHEN ea.status = 'MARKED' THEN ea.percentage END) as avg_score,
      COUNT(DISTINCT CASE WHEN ea.status = 'MARKED' AND ea.percentage >= 60 THEN ea.participant_id END) as passed
    FROM exam_attempts_v2 ea
    INNER JOIN exam_configs ec ON ea.exam_config_id = ec.id
    WHERE ec.edition_id = ${editionId}
      AND ec.education_level = ${educationLevel}
      AND ec.subject = ${subject}
      AND ec.stage = ${stage}
  `;

  const stats = statsResult[0] as any;
  const totalAttempted = parseInt(stats.attempted) || 0;
  const totalCompleted = parseInt(stats.completed) || 0;
  const averageScore = parseFloat(stats.avg_score) || 0;
  const passed = parseInt(stats.passed) || 0;

  // Get qualified for next stage
  const stageOrder: StageName[] = ['Beginner', 'Theory', 'Practical', 'Final'];
  const currentIndex = stageOrder.indexOf(stage);
  let qualifiedForNext = 0;

  if (currentIndex < stageOrder.length - 1) {
    const nextStage = stageOrder[currentIndex + 1];
    const qualifiedResult = await sql`
      SELECT COUNT(*) as count
      FROM stage_eligibility
      WHERE subject = ${subject}
        AND stage = ${nextStage}
        AND is_eligible = true
        AND participant_id IN (
          SELECT id FROM olympiad_participants
          WHERE edition_id = ${editionId}
            AND education_level = ${educationLevel}
        )
    `;
    qualifiedForNext = parseInt(qualifiedResult[0].count as string);
  }

  return {
    total_enrolled: totalEnrolled,
    total_attempted: totalAttempted,
    total_completed: totalCompleted,
    average_score: averageScore,
    pass_rate: totalCompleted > 0 ? (passed / totalCompleted) * 100 : 0,
    qualified_for_next: qualifiedForNext,
  };
}
