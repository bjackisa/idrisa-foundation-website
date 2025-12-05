# Olympiad V2 System - Complete Implementation Guide

## Overview

This document describes the comprehensive Olympiad V2 system that has been implemented for The Idrisa Foundation. The system supports:

- **Self and Minor Enrollment**: Users can enroll themselves or register minors (children/students)
- **Four-Stage Competition**: Beginner → Theory → Practical → Final
- **Multiple Education Levels**: Primary, O-Level, A-Level
- **Multiple Subjects**: Math, Science, ICT, Biology, Chemistry, Physics, Agriculture
- **Auto-Marking Engine**: Automatic grading for MCQ, True/False, Numeric questions
- **Manual Marking**: Support for essays, file uploads, and structured questions
- **Stage Progression**: Automatic eligibility computation based on scores and rankings
- **Final Physical Events**: Venue management and score entry for finals

## System Architecture

### Database Schema

The new schema is defined in `/scripts/03-olympiad-v2-schema.sql` and includes:

#### Core Tables

1. **minor_profiles** - Profiles for minors (children/students)
2. **olympiad_editions** - Olympiad editions with configurable rules
3. **olympiad_participants** - Participant enrollments (SELF or MINOR)
4. **participant_subjects** - Subject selections per participant
5. **questions_v2** - Enhanced question bank with multiple question types
6. **exam_configs** - Exam configurations per edition/level/subject/stage
7. **exam_attempts_v2** - Exam attempts with auto and manual marking
8. **manual_marks** - Manual marking records
9. **stage_eligibility** - Computed eligibility for next stages
10. **final_venues** - Physical venue information for finals
11. **final_results** - Final stage results and awards
12. **rankings** - Cached rankings per stage
13. **audit_log** - Audit trail for important actions
14. **notifications** - User notifications

### TypeScript Types

All types are defined in `/lib/olympiad-v2/types.ts`:

- Education levels, stages, question types
- Participant types (SELF/MINOR)
- Enrollment structures
- Question and exam structures
- Marking and progression types
- Dashboard and view types

### Constants

Configuration values in `/lib/olympiad-v2/constants.ts`:

- Age rules (default: Primary 9-15, O-Level 11-18, A-Level 15-21)
- Subjects by level
- Progression rules (score thresholds and percentiles)
- Exam durations
- Question types by stage
- Award thresholds

## Core Library Functions

### 1. Minor Management (`/lib/olympiad-v2/minors.ts`)

```typescript
// Create a minor profile
const minor = await createMinorProfile(userId, {
  full_name: "John Doe",
  date_of_birth: "2010-05-15",
  school_name: "Example School",
  class_grade: "S.2"
});

// Get user's minors
const minors = await getMinorProfilesByUser(userId);

// Update minor
await updateMinorProfile(minorId, userId, { school_name: "New School" });
```

### 2. Enrollment (`/lib/olympiad-v2/enrollment.ts`)

```typescript
// Check eligibility
const eligibility = await checkEnrollmentEligibility(userId, {
  edition_id: editionId,
  participant_type: 'MINOR',
  minor_profile_id: minorId,
  education_level: 'O-Level',
  subjects: ['Math', 'Physics']
});

// Enroll if eligible
if (eligibility.eligible) {
  const participant = await enrollParticipant(userId, enrollmentInput);
}

// Get user's participations
const { self, minors } = await getUserParticipants(userId);
```

### 3. Auto-Marking (`/lib/olympiad-v2/marking.ts`)

```typescript
// Auto-grade an exam attempt
const result = await autoGradeExamAttempt(attemptId);
// Returns: { auto_marks, max_auto_marks, requires_manual }

// Submit manual marks
await submitManualMark(adminId, {
  exam_attempt_id: attemptId,
  question_id: questionId,
  marks_awarded: 8.5,
  feedback: "Good answer but missing key point"
});

// Get pending marking tasks
const tasks = await getPendingMarkingTasks(editionId, 'Math', 'O-Level');
```

### 4. Progression & Rankings (`/lib/olympiad-v2/progression.ts`)

```typescript
// Compute rankings after a stage
const rankings = await computeRankings(
  editionId,
  'O-Level',
  'Math',
  'Beginner'
);

// Compute eligibility for next stage
const eligibilities = await computeStageEligibility(
  editionId,
  'O-Level',
  'Math',
  'Beginner' // Current stage, computes eligibility for Theory
);

// Check if participant is eligible
const { eligible, reason } = await isParticipantEligibleForStage(
  participantId,
  'Math',
  'Theory'
);

// Get leaderboard
const leaderboard = await getLeaderboard(
  editionId,
  'O-Level',
  'Math',
  'Beginner',
  50, // limit
  0   // offset
);

// Run progression for entire edition after a stage
const { total_processed, total_qualified } = await runProgressionForEdition(
  editionId,
  'Beginner'
);
```

## Business Rules

### Age Validation

- **Primary**: 9-15 years
- **O-Level**: 11-18 years  
- **A-Level**: 15-21 years

Age is calculated relative to a reference date (configurable per edition, defaults to current date).

### Progression Rules

#### Beginner → Theory
- Minimum score: **70%**
- No percentile requirement

#### Theory → Practical
- Minimum score: **60%**
- Must be in **top 50%** of participants

#### Practical → Final
- Minimum score: **60%**
- Must be in **top 40%** of participants

### Question Types by Stage

#### Beginner (Quiz)
- MCQ (single choice)
- Multiple Select
- True/False
- Numeric

#### Theory
- Short Answer
- Essay
- Structured (multi-part)
- Numeric

#### Practical
- Essay
- File Upload
- Structured
- Numeric

#### Final
- Physical event, no online exam

### Exam Durations

| Stage      | Primary | O-Level | A-Level |
|------------|---------|---------|---------|
| Beginner   | 45 min  | 60 min  | 60 min  |
| Theory     | 90 min  | 120 min | 150 min |
| Practical  | 150 min | 180 min | 195 min |

## Workflow Examples

### Admin Workflow

#### 1. Create Olympiad Edition

```typescript
// Create edition
const edition = await createEdition({
  name: "2025 National STEM Olympiad",
  year: 2025,
  enrollment_start: "2025-01-01T00:00:00Z",
  enrollment_end: "2025-02-28T23:59:59Z",
  active_levels: ['Primary', 'O-Level', 'A-Level'],
  active_subjects: {
    'Primary': ['Math', 'Science', 'ICT'],
    'O-Level': ['Math', 'Biology', 'Chemistry', 'Physics', 'ICT'],
    'A-Level': ['Math', 'Biology', 'Chemistry', 'Physics', 'ICT']
  },
  max_subjects_per_participant: 2
});
```

#### 2. Add Questions to Question Bank

```typescript
// Add MCQ question
await createQuestion({
  edition_id: editionId,
  education_level: 'O-Level',
  subject: 'Math',
  stage: 'Beginner',
  question_type: 'MCQ',
  question_text: "What is 2 + 2?",
  question_data: {
    options: ['2', '3', '4', '5']
  },
  correct_answer: 2, // Index of correct option
  marks: 1,
  difficulty: 'easy'
});

// Add essay question
await createQuestion({
  education_level: 'O-Level',
  subject: 'Biology',
  stage: 'Theory',
  question_type: 'ESSAY',
  question_text: "Explain the process of photosynthesis.",
  marking_guide: "Should mention: chlorophyll, light, CO2, glucose, oxygen",
  marks: 10,
  difficulty: 'medium'
});
```

#### 3. Create Exam Configuration

```typescript
// Select questions and create exam
const examConfig = await createExamConfig({
  edition_id: editionId,
  education_level: 'O-Level',
  subject: 'Math',
  stage: 'Beginner',
  start_datetime: "2025-03-01T09:00:00Z",
  end_datetime: "2025-03-01T18:00:00Z",
  duration_minutes: 60,
  question_ids: selectedQuestionIds,
  randomize_questions: true,
  randomize_options: true,
  show_score_immediately: false
});
```

#### 4. Run Progression After Stage

```typescript
// After Beginner stage exams are marked
const result = await runProgressionForEdition(editionId, 'Beginner');
console.log(`Processed: ${result.total_processed}, Qualified: ${result.total_qualified}`);

// Send notifications to qualified participants
// (Notification system implementation)
```

#### 5. Setup Final Venue

```typescript
const venue = await createFinalVenue({
  edition_id: editionId,
  education_level: 'O-Level',
  subject: 'Math',
  venue_name: "Kampala International School",
  venue_address: "Plot 123, Kampala Road",
  event_date: "2025-06-15T09:00:00Z",
  capacity: 100
});
```

#### 6. Enter Final Results

```typescript
// After physical final event
await submitFinalResult({
  participant_id: participantId,
  final_venue_id: venueId,
  subject: 'Math',
  attendance_status: 'PRESENT',
  final_score: 85.5,
  final_rank: 3,
  award_category: 'SILVER'
});
```

### User Workflow

#### 1. Create Minor Profile

```typescript
const minor = await createMinorProfile(userId, {
  full_name: "Jane Doe",
  date_of_birth: "2008-03-20",
  school_name: "Kampala High School",
  class_grade: "S.3"
});
```

#### 2. Enroll Minor in Olympiad

```typescript
// Check eligibility first
const eligibility = await checkEnrollmentEligibility(userId, {
  edition_id: editionId,
  participant_type: 'MINOR',
  minor_profile_id: minor.id,
  education_level: 'O-Level',
  subjects: ['Math', 'Physics']
});

if (eligibility.eligible) {
  const participant = await enrollParticipant(userId, {
    edition_id: editionId,
    participant_type: 'MINOR',
    minor_profile_id: minor.id,
    education_level: 'O-Level',
    subjects: ['Math', 'Physics']
  });
}
```

#### 3. Take Exam

```typescript
// Start exam
const attempt = await startExamAttempt(participantId, examConfigId);

// Submit answers
await submitExamAnswers(attempt.id, {
  [questionId1]: 2,  // MCQ answer (option index)
  [questionId2]: [0, 2, 3],  // Multiple select
  [questionId3]: "Photosynthesis is...",  // Essay
});

// Auto-grading happens automatically
// Manual marking happens later by admin
```

#### 4. View Progress

```typescript
// Get participant's stage progress
const progress = await getParticipantStageProgress(participantId);
// Returns array of stages with status: LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED, FAILED

// Check eligibility for next stage
const { eligible, reason } = await isParticipantEligibleForStage(
  participantId,
  'Math',
  'Theory'
);
```

## Database Migration

To migrate from the old system to the new one:

### Step 1: Run New Schema

```bash
# Connect to your Neon database and run:
psql $DATABASE_URL -f scripts/03-olympiad-v2-schema.sql
```

### Step 2: Data Migration (if needed)

If you have existing data, you'll need to:

1. Map existing `participants` to `olympiad_participants` (as SELF type)
2. Map existing `participant_registrations` to `participant_subjects`
3. Map existing `questions` to `questions_v2`
4. Map existing `exam_attempts` to `exam_attempts_v2`

### Step 3: Update API Endpoints

Create new API endpoints in `/app/api/olympiad-v2/` for:

- Minor management
- Enrollment
- Exam taking
- Marking
- Progression
- Rankings
- Final venues

## API Endpoint Structure (Recommended)

```
/api/olympiad-v2/
├── minors/
│   ├── route.ts (GET list, POST create)
│   └── [id]/
│       └── route.ts (GET, PUT, DELETE)
├── editions/
│   ├── route.ts (GET list, POST create)
│   └── [id]/
│       ├── route.ts (GET, PUT)
│       ├── enroll/route.ts (POST enrollment)
│       └── participants/route.ts (GET participants)
├── enrollment/
│   ├── check/route.ts (POST check eligibility)
│   └── enroll/route.ts (POST enroll)
├── exams/
│   ├── [id]/
│   │   ├── start/route.ts (POST start attempt)
│   │   ├── submit/route.ts (POST submit answers)
│   │   └── status/route.ts (GET attempt status)
├── marking/
│   ├── auto/route.ts (POST trigger auto-grading)
│   ├── manual/route.ts (POST submit manual marks)
│   └── pending/route.ts (GET pending marking tasks)
├── progression/
│   ├── compute/route.ts (POST compute eligibility)
│   └── rankings/route.ts (GET rankings)
└── finals/
    ├── venues/route.ts (GET, POST venues)
    └── results/route.ts (GET, POST results)
```

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: 
   - Users can only access their own data and minors they created
   - Admins have full access
3. **Validation**: All inputs are validated against business rules
4. **Audit Logging**: Important actions are logged in `audit_log` table
5. **SQL Injection**: Using parameterized queries via Neon SQL
6. **Rate Limiting**: Implement rate limiting on exam submission endpoints

## Testing Checklist

- [ ] Create minor profile
- [ ] Enroll self in olympiad
- [ ] Enroll minor in olympiad
- [ ] Age validation works correctly
- [ ] Subject validation works correctly
- [ ] Cannot enroll twice in same edition
- [ ] Take Beginner exam (auto-graded questions)
- [ ] Auto-grading calculates correct scores
- [ ] Progression to Theory based on 70% threshold
- [ ] Take Theory exam (manual grading required)
- [ ] Admin can submit manual marks
- [ ] Progression to Practical based on 60% + top 50%
- [ ] Rankings are computed correctly
- [ ] Leaderboard displays correctly
- [ ] Final venue creation
- [ ] Final results entry
- [ ] Notifications are sent

## Next Steps

1. **Create API Endpoints**: Implement REST APIs for all functionality
2. **Build UI Components**: Create React components for:
   - User dashboard (self + minors)
   - Admin dashboard
   - Exam taking interface
   - Marking interface
   - Leaderboards
3. **Implement Notifications**: Email/SMS notifications for key events
4. **Add File Upload**: Implement file upload for practical exams
5. **Generate Certificates**: PDF certificate generation
6. **Analytics Dashboard**: Admin analytics and reporting
7. **Mobile Optimization**: Ensure mobile-friendly exam interface

## Support

For questions or issues:
- Review this documentation
- Check the type definitions in `/lib/olympiad-v2/types.ts`
- Examine the database schema in `/scripts/03-olympiad-v2-schema.sql`
- Review business rules in `/lib/olympiad-v2/constants.ts`

---

**Built for The Idrisa Foundation (U) Limited**  
*Empowering Tomorrow's Minds Through STEM Education*
