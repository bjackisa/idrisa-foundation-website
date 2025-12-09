import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// ============================================================================
// SELF-HEALING DATABASE MODULE
// Each function ensures its required tables/columns exist before operating
// ============================================================================

/**
 * Ensure a table exists, create if not
 */
async function ensureTable(tableName: string, createSQL: string): Promise<void> {
  try {
    const exists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      ) as exists
    `
    if (!exists[0]?.exists) {
      await sql.query(createSQL)
      console.log(`Created table: ${tableName}`)
    }
  } catch (error) {
    console.error(`Error ensuring table ${tableName}:`, error)
    throw error
  }
}

/**
 * Ensure a column exists in a table, add if not
 */
async function ensureColumn(tableName: string, columnName: string, columnDef: string): Promise<void> {
  try {
    const exists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
        AND column_name = ${columnName}
      ) as exists
    `
    if (!exists[0]?.exists) {
      await sql.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef}`)
      console.log(`Added column ${columnName} to ${tableName}`)
    }
  } catch (error) {
    console.error(`Error ensuring column ${columnName} in ${tableName}:`, error)
    // Don't throw - column might already exist with different case
  }
}

// ============================================================================
// OLYMPIAD EDITIONS TABLE
// ============================================================================
export async function ensureOlympiadEditionsTable(): Promise<void> {
  await ensureTable('olympiad_editions', `
    CREATE TABLE olympiad_editions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      year INT NOT NULL,
      theme TEXT,
      description TEXT,
      enrollment_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      enrollment_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + INTERVAL '30 days',
      status TEXT NOT NULL DEFAULT 'DRAFT',
      active_levels JSONB NOT NULL DEFAULT '["Primary", "O-Level", "A-Level"]',
      active_subjects JSONB NOT NULL DEFAULT '{"Primary": ["Math", "Science", "ICT"], "O-Level": ["Math", "Biology", "Chemistry", "Physics", "ICT", "Agriculture"], "A-Level": ["Math", "Biology", "Chemistry", "Physics", "ICT", "Agriculture"]}',
      age_rules JSONB NOT NULL DEFAULT '{"Primary": {"min": 9, "max": 15}, "O-Level": {"min": 11, "max": 18}, "A-Level": {"min": 15, "max": 21}}',
      max_subjects_per_participant INT DEFAULT 3,
      reference_date DATE,
      created_by_admin_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
  // Ensure all columns exist (for migrations)
  await ensureColumn('olympiad_editions', 'theme', 'TEXT')
  await ensureColumn('olympiad_editions', 'description', 'TEXT')
  await ensureColumn('olympiad_editions', 'active_levels', "JSONB DEFAULT '[]'")
  await ensureColumn('olympiad_editions', 'active_subjects', "JSONB DEFAULT '{}'")
  await ensureColumn('olympiad_editions', 'age_rules', "JSONB DEFAULT '{}'")
}

// ============================================================================
// EDITION STAGES TABLE (for stage configuration per edition)
// ============================================================================
export async function ensureEditionStagesTable(): Promise<void> {
  await ensureOlympiadEditionsTable()
  await ensureTable('edition_stages', `
    CREATE TABLE edition_stages (
      id SERIAL PRIMARY KEY,
      edition_id INT NOT NULL REFERENCES olympiad_editions(id) ON DELETE CASCADE,
      stage_number INT NOT NULL,
      stage_name TEXT NOT NULL,
      stage_type TEXT NOT NULL DEFAULT 'ONLINE_QUIZ',
      start_date TIMESTAMP WITH TIME ZONE,
      end_date TIMESTAMP WITH TIME ZONE,
      pass_percentage DECIMAL(5,2) DEFAULT 70,
      pass_count INT,
      education_level TEXT,
      subject TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(edition_id, stage_number, education_level, subject)
    )
  `)
}

// ============================================================================
// QUESTION BANK TABLE
// ============================================================================
export async function ensureQuestionBankTable(): Promise<void> {
  await ensureTable('question_bank', `
    CREATE TABLE question_bank (
      id SERIAL PRIMARY KEY,
      question_text TEXT NOT NULL,
      question_type TEXT NOT NULL DEFAULT 'MCQ',
      question_format TEXT NOT NULL DEFAULT 'Quiz',
      difficulty TEXT NOT NULL DEFAULT 'medium',
      subject TEXT NOT NULL,
      education_level TEXT NOT NULL DEFAULT 'Primary',
      stage TEXT NOT NULL DEFAULT 'Beginner',
      options JSONB,
      correct_answer TEXT,
      correct_answers JSONB,
      marking_guide TEXT,
      explanation TEXT,
      marks DECIMAL(5,2) DEFAULT 1,
      time_limit_seconds INT DEFAULT 60,
      file_types JSONB,
      max_file_size INT,
      word_limit INT,
      sub_questions JSONB,
      topic TEXT,
      subtopic TEXT,
      tags JSONB,
      is_active BOOLEAN DEFAULT TRUE,
      created_by_admin_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
  // Ensure all columns exist
  await ensureColumn('question_bank', 'question_format', "TEXT DEFAULT 'Quiz'")
  await ensureColumn('question_bank', 'marking_guide', 'TEXT')
  await ensureColumn('question_bank', 'correct_answers', 'JSONB')
  await ensureColumn('question_bank', 'file_types', 'JSONB')
  await ensureColumn('question_bank', 'max_file_size', 'INT')
  await ensureColumn('question_bank', 'word_limit', 'INT')
  await ensureColumn('question_bank', 'sub_questions', 'JSONB')
  await ensureColumn('question_bank', 'topic', 'TEXT')
  await ensureColumn('question_bank', 'subtopic', 'TEXT')
  await ensureColumn('question_bank', 'tags', 'JSONB')
}

// ============================================================================
// PARTICIPANTS TABLE
// ============================================================================
export async function ensureParticipantsTable(): Promise<void> {
  await ensureOlympiadEditionsTable()
  await ensureTable('olympiad_participants', `
    CREATE TABLE olympiad_participants (
      id SERIAL PRIMARY KEY,
      edition_id INT NOT NULL REFERENCES olympiad_editions(id) ON DELETE CASCADE,
      participant_type TEXT NOT NULL DEFAULT 'SELF',
      user_id TEXT,
      guardian_id TEXT,
      minor_profile_id INT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      date_of_birth DATE,
      education_level TEXT NOT NULL,
      school_name TEXT,
      district TEXT,
      subjects JSONB DEFAULT '[]',
      current_stage TEXT DEFAULT 'Beginner',
      status TEXT DEFAULT 'ACTIVE',
      parent_consent BOOLEAN DEFAULT FALSE,
      consent_given_by TEXT,
      consent_contact TEXT,
      enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
  await ensureColumn('olympiad_participants', 'participant_type', "TEXT DEFAULT 'SELF'")
  await ensureColumn('olympiad_participants', 'guardian_id', 'TEXT')
  await ensureColumn('olympiad_participants', 'minor_profile_id', 'INT')
  await ensureColumn('olympiad_participants', 'subjects', "JSONB DEFAULT '[]'")
  await ensureColumn('olympiad_participants', 'status', "TEXT DEFAULT 'ACTIVE'")
}

// ============================================================================
// PARTICIPANT SUBJECTS TABLE
// ============================================================================
export async function ensureParticipantSubjectsTable(): Promise<void> {
  await ensureParticipantsTable()
  await ensureTable('participant_subjects', `
    CREATE TABLE participant_subjects (
      id SERIAL PRIMARY KEY,
      participant_id INT NOT NULL REFERENCES olympiad_participants(id) ON DELETE CASCADE,
      subject TEXT NOT NULL,
      current_stage TEXT DEFAULT 'Beginner',
      stage_status TEXT DEFAULT 'PENDING',
      enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(participant_id, subject)
    )
  `)
}

// ============================================================================
// MINOR PROFILES TABLE
// ============================================================================
export async function ensureMinorProfilesTable(): Promise<void> {
  await ensureTable('minor_profiles', `
    CREATE TABLE minor_profiles (
      id SERIAL PRIMARY KEY,
      guardian_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      date_of_birth DATE NOT NULL,
      gender TEXT,
      school_name TEXT,
      class_grade TEXT,
      district TEXT,
      national_id TEXT,
      student_number TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
}

// ============================================================================
// EXAM CONFIGURATIONS TABLE
// ============================================================================
export async function ensureExamConfigsTable(): Promise<void> {
  await ensureOlympiadEditionsTable()
  await ensureQuestionBankTable()
  await ensureTable('exam_configs', `
    CREATE TABLE exam_configs (
      id SERIAL PRIMARY KEY,
      edition_id INT NOT NULL REFERENCES olympiad_editions(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      education_level TEXT NOT NULL,
      subject TEXT NOT NULL,
      stage TEXT NOT NULL DEFAULT 'Beginner',
      question_ids JSONB DEFAULT '[]',
      total_questions INT DEFAULT 0,
      duration_minutes INT NOT NULL DEFAULT 60,
      start_datetime TIMESTAMP WITH TIME ZONE,
      end_datetime TIMESTAMP WITH TIME ZONE,
      randomize_questions BOOLEAN DEFAULT TRUE,
      randomize_options BOOLEAN DEFAULT TRUE,
      show_score_immediately BOOLEAN DEFAULT TRUE,
      pass_percentage DECIMAL(5,2) DEFAULT 70,
      max_attempts INT DEFAULT 1,
      status TEXT DEFAULT 'DRAFT',
      created_by_admin_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
}

// PARTICIPANT SUBJECTS TABLE is already defined above

// ============================================================================
// EXAM ATTEMPTS TABLE
// ============================================================================
export async function ensureExamAttemptsTable(): Promise<void> {
  await ensureParticipantsTable()
  await ensureExamConfigsTable()
  await ensureTable('exam_attempts_v2', `
    CREATE TABLE exam_attempts_v2 (
      id SERIAL PRIMARY KEY,
      participant_id INT NOT NULL REFERENCES olympiad_participants(id) ON DELETE CASCADE,
      exam_config_id INT NOT NULL REFERENCES exam_configs(id) ON DELETE CASCADE,
      started_at TIMESTAMP DEFAULT NOW(),
      submitted_at TIMESTAMP,
      time_taken_minutes INT,
      is_submitted BOOLEAN DEFAULT FALSE,
      auto_submitted BOOLEAN DEFAULT FALSE,
      answers JSONB,
      auto_marks DECIMAL(5,2) DEFAULT 0,
      manual_marks DECIMAL(5,2) DEFAULT 0,
      total_marks DECIMAL(5,2) DEFAULT 0,
      max_marks INT,
      percentage DECIMAL(5,2) DEFAULT 0,
      status VARCHAR(20) DEFAULT 'NOT_STARTED',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)
}

// ============================================================================
// EXAM ANSWERS TABLE (individual answers for marking)
// ============================================================================
export async function ensureExamAnswersTable(): Promise<void> {
  await ensureExamAttemptsTable()
  await ensureQuestionBankTable()
  await ensureTable('exam_answers', `
    CREATE TABLE exam_answers (
      id SERIAL PRIMARY KEY,
      attempt_id INT NOT NULL REFERENCES exam_attempts_v2(id) ON DELETE CASCADE,
      question_id INT NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
      answer_text TEXT,
      answer_file_url TEXT,
      selected_option INT,
      selected_options JSONB,
      is_correct BOOLEAN,
      auto_score DECIMAL(5,2),
      manual_score DECIMAL(5,2),
      final_score DECIMAL(5,2),
      max_score DECIMAL(5,2) DEFAULT 1,
      marking_status TEXT DEFAULT 'PENDING',
      marker_feedback TEXT,
      marked_by_admin_id TEXT,
      marked_at TIMESTAMP WITH TIME ZONE,
      answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      time_taken_seconds INT,
      UNIQUE(attempt_id, question_id)
    )
  `)
}

// ============================================================================
// MARKING QUEUE TABLE
// ============================================================================
export async function ensureMarkingQueueTable(): Promise<void> {
  await ensureExamAnswersTable()
  await ensureTable('marking_queue', `
    CREATE TABLE marking_queue (
      id SERIAL PRIMARY KEY,
      answer_id INT NOT NULL REFERENCES exam_answers(id) ON DELETE CASCADE,
      attempt_id INT NOT NULL,
      question_id INT NOT NULL,
      participant_id INT NOT NULL,
      edition_id INT NOT NULL,
      subject TEXT NOT NULL,
      education_level TEXT NOT NULL,
      stage TEXT NOT NULL,
      question_type TEXT NOT NULL,
      assigned_marker_id TEXT,
      status TEXT DEFAULT 'PENDING',
      priority INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
}

// ============================================================================
// STAGE RESULTS TABLE
// ============================================================================
export async function ensureStageResultsTable(): Promise<void> {
  await ensureParticipantsTable()
  await ensureTable('stage_results', `
    CREATE TABLE stage_results (
      id SERIAL PRIMARY KEY,
      participant_id INT NOT NULL REFERENCES olympiad_participants(id) ON DELETE CASCADE,
      edition_id INT NOT NULL,
      subject TEXT NOT NULL,
      stage TEXT NOT NULL,
      attempt_id INT,
      total_marks DECIMAL(8,2) DEFAULT 0,
      marks_obtained DECIMAL(8,2) DEFAULT 0,
      percentage DECIMAL(5,2) DEFAULT 0,
      rank INT,
      total_participants INT,
      is_qualified BOOLEAN DEFAULT FALSE,
      qualification_reason TEXT,
      computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(participant_id, edition_id, subject, stage)
    )
  `)
}

// ============================================================================
// FINAL VENUES TABLE
// ============================================================================
export async function ensureFinalVenuesTable(): Promise<void> {
  await ensureOlympiadEditionsTable()
  await ensureTable('final_venues', `
    CREATE TABLE final_venues (
      id SERIAL PRIMARY KEY,
      edition_id INT NOT NULL REFERENCES olympiad_editions(id) ON DELETE CASCADE,
      education_level TEXT,
      subject TEXT,
      venue_name TEXT NOT NULL,
      venue_address TEXT,
      venue_map_link TEXT,
      district TEXT,
      event_date DATE NOT NULL,
      event_time TIME,
      capacity INT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
}

// ============================================================================
// FINAL RESULTS TABLE
// ============================================================================
export async function ensureFinalResultsTable(): Promise<void> {
  await ensureParticipantsTable()
  await ensureFinalVenuesTable()
  await ensureTable('final_results', `
    CREATE TABLE final_results (
      id SERIAL PRIMARY KEY,
      participant_id INT NOT NULL REFERENCES olympiad_participants(id) ON DELETE CASCADE,
      venue_id INT REFERENCES final_venues(id) ON DELETE SET NULL,
      edition_id INT NOT NULL,
      subject TEXT NOT NULL,
      attendance_status TEXT,
      final_score DECIMAL(8,2),
      final_rank INT,
      award_category TEXT,
      certificate_url TEXT,
      remarks TEXT,
      entered_by_admin_id TEXT,
      entered_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(participant_id, edition_id, subject)
    )
  `)
}

// ============================================================================
// NOTIFICATIONS TABLE
// ============================================================================
export async function ensureNotificationsTable(): Promise<void> {
  await ensureTable('olympiad_notifications', `
    CREATE TABLE olympiad_notifications (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      participant_id INT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      data JSONB,
      is_read BOOLEAN DEFAULT FALSE,
      sent_via_email BOOLEAN DEFAULT FALSE,
      sent_via_sms BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
}

// ============================================================================
// AUDIT LOG TABLE
// ============================================================================
export async function ensureAuditLogTable(): Promise<void> {
  await ensureTable('audit_log', `
    CREATE TABLE audit_log (
      id SERIAL PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      action TEXT NOT NULL,
      changes JSONB,
      performed_by_user_id TEXT,
      performed_by_admin_id TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `)
}

// ============================================================================
// INITIALIZE ALL TABLES
// ============================================================================
export async function initializeAllTables(): Promise<{ success: boolean; message: string; tables: string[] }> {
  try {
    await ensureOlympiadEditionsTable()
    await ensureEditionStagesTable()
    await ensureQuestionBankTable()
    await ensureMinorProfilesTable()
    await ensureParticipantsTable()
    await ensureParticipantSubjectsTable()
    await ensureExamConfigsTable()
    await ensureExamAttemptsTable()
    await ensureExamAnswersTable()
    await ensureManualMarksTable()
    await ensureRankingsTable()
    await ensureMarkingQueueTable()
    await ensureStageResultsTable()
    await ensureFinalVenuesTable()
    await ensureFinalResultsTable()
    await ensureNotificationsTable()
    await ensureAuditLogTable()

    // Get list of created tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    const tableNames = tables.map(t => t.table_name as string)

    return {
      success: true,
      message: 'All Olympiad tables initialized successfully',
      tables: tableNames
    }
  } catch (error) {
    console.error('Failed to initialize tables:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      tables: []
    }
  }
}

// ============================================================================
// DATABASE STATUS CHECK
// ============================================================================
export async function checkDatabaseStatus(): Promise<{ initialized: boolean; tables: string[] }> {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    
    const tableNames = tables.map(t => t.table_name as string)
    const requiredTables = [
      'olympiad_editions', 
      'edition_stages',
      'olympiad_participants', 
      'participant_subjects',
      'question_bank',
      'exam_configs', 
      'exam_attempts_v2',
      'exam_answers',
      'manual_marks',
      'rankings'
    ]
    
    const initialized = requiredTables.every(table => tableNames.includes(table))
    
    return {
      initialized,
      tables: tableNames
    }
  } catch (error) {
    console.error('Database status check failed:', error)
    return {
      initialized: false,
      tables: []
    }
  }
}

/**
 * Ensure manual_marks table exists
 */
export async function ensureManualMarksTable(): Promise<void> {
  await ensureExamAttemptsTable()
  await ensureQuestionBankTable()
  await ensureTable('manual_marks', `
    CREATE TABLE manual_marks (
      id SERIAL PRIMARY KEY,
      exam_attempt_id INT NOT NULL REFERENCES exam_attempts_v2(id) ON DELETE CASCADE,
      question_id INT NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
      marks_awarded DECIMAL(5,2) NOT NULL,
      max_marks INT NOT NULL,
      feedback TEXT,
      marked_by_admin_id VARCHAR(255) NOT NULL,
      marked_at TIMESTAMP DEFAULT NOW(),
      moderated_by_admin_id VARCHAR(255),
      moderated_at TIMESTAMP,
      moderation_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(exam_attempt_id, question_id)
    )
  `)
}

/**
 * Ensure rankings table exists
 */
export async function ensureRankingsTable(): Promise<void> {
  await ensureOlympiadEditionsTable()
  await ensureParticipantsTable()
  await ensureTable('rankings', `
    CREATE TABLE rankings (
      id VARCHAR(255) PRIMARY KEY,
      edition_id VARCHAR(255) NOT NULL,
      education_level VARCHAR(50) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      stage VARCHAR(50) NOT NULL,
      participant_id VARCHAR(255) NOT NULL,
      score DECIMAL(10,2) NOT NULL,
      rank INT NOT NULL,
      total_participants INT NOT NULL,
      computed_at TIMESTAMP NOT NULL,
      UNIQUE(edition_id, education_level, subject, stage, participant_id)
    )
  `)
}

// Alias initializeAllTables as initializeOlympiadDatabase for backward compatibility
export const initializeOlympiadDatabase = initializeAllTables;

// Export sql for use in other modules
export { sql }
