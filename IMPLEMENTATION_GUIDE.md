# Olympiad V2 Implementation Guide

## Quick Start

This guide will help you implement the complete Olympiad V2 system step by step.

## Prerequisites

- PostgreSQL database (Neon) already configured
- Next.js 16 project setup
- Authentication system in place (JWT-based)

## Step 1: Database Setup

### Run the Schema Migration

```bash
# Connect to your Neon database
psql $DATABASE_URL -f scripts/03-olympiad-v2-schema.sql
```

This will create all necessary tables, types, indexes, triggers, and views.

### Verify Tables Created

```sql
-- Check that all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%olympiad%' OR table_name LIKE '%minor%'
ORDER BY table_name;
```

## Step 2: Library Functions Overview

All core functionality is organized in `/lib/olympiad-v2/`:

| File | Purpose |
|------|---------|
| `types.ts` | TypeScript type definitions |
| `constants.ts` | Configuration and business rules |
| `minors.ts` | Minor profile management |
| `editions.ts` | Olympiad edition management |
| `enrollment.ts` | Enrollment and eligibility |
| `exams.ts` | Exam configuration and attempts |
| `marking.ts` | Auto-marking and manual marking |
| `progression.ts` | Stage progression and rankings |
| `notifications.ts` | Notification system |

## Step 3: API Endpoints Structure

Create the following API endpoints in `/app/api/olympiad-v2/`:

### User-Facing Endpoints

```
/api/olympiad-v2/
├── minors/
│   ├── route.ts (GET list, POST create)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── enrollment/
│   └── route.ts (POST check/enroll)
├── exams/
│   ├── available/route.ts (GET available exams)
│   ├── [id]/
│   │   ├── start/route.ts (POST start attempt)
│   │   ├── save/route.ts (POST auto-save answers)
│   │   └── submit/route.ts (POST submit exam)
├── dashboard/
│   └── route.ts (GET user dashboard data)
└── notifications/
    └── route.ts (GET notifications)
```

### Admin Endpoints

```
/api/olympiad-v2/admin/
├── editions/
│   ├── route.ts (GET list, POST create)
│   └── [id]/
│       ├── route.ts (GET, PUT, DELETE)
│       ├── participants/route.ts (GET participants)
│       └── statistics/route.ts (GET stats)
├── questions/
│   ├── route.ts (GET list, POST create)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── exams/
│   ├── route.ts (GET list, POST create config)
│   └── [id]/route.ts (GET, PUT)
├── marking/
│   ├── pending/route.ts (GET pending tasks)
│   └── submit/route.ts (POST manual marks)
├── progression/
│   ├── compute/route.ts (POST compute eligibility)
│   └── rankings/route.ts (GET rankings)
└── finals/
    ├── venues/route.ts (GET, POST venues)
    └── results/route.ts (GET, POST results)
```

## Step 4: Example Implementation

### Example 1: Create Minor Profile

```typescript
// API: POST /api/olympiad-v2/minors
import { createMinorProfile } from '@/lib/olympiad-v2/minors';

const minor = await createMinorProfile(userId, {
  full_name: "Jane Doe",
  date_of_birth: "2008-03-20",
  school_name: "Kampala High School",
  class_grade: "S.3",
  gender: "Female"
});
```

### Example 2: Check Enrollment Eligibility

```typescript
// API: POST /api/olympiad-v2/enrollment (action: check)
import { checkEnrollmentEligibility } from '@/lib/olympiad-v2/enrollment';

const eligibility = await checkEnrollmentEligibility(userId, {
  edition_id: editionId,
  participant_type: 'MINOR',
  minor_profile_id: minorId,
  education_level: 'O-Level',
  subjects: ['Math', 'Physics']
});

if (eligibility.eligible) {
  // Proceed with enrollment
} else {
  // Show errors: eligibility.errors
}
```

### Example 3: Enroll Participant

```typescript
// API: POST /api/olympiad-v2/enrollment (action: enroll)
import { enrollParticipant } from '@/lib/olympiad-v2/enrollment';
import { sendEnrollmentConfirmation } from '@/lib/olympiad-v2/notifications';

const participant = await enrollParticipant(userId, {
  edition_id: editionId,
  participant_type: 'MINOR',
  minor_profile_id: minorId,
  education_level: 'O-Level',
  subjects: ['Math', 'Physics']
});

// Send confirmation
await sendEnrollmentConfirmation(userId, editionName, ['Math', 'Physics']);
```

### Example 4: Take Exam

```typescript
// API: POST /api/olympiad-v2/exams/[id]/start
import { startExamAttempt, submitExam } from '@/lib/olympiad-v2/exams';

// Start exam
const attempt = await startExamAttempt(participantId, examConfigId);

// Student answers questions...
const answers = {
  [questionId1]: 2,  // MCQ answer
  [questionId2]: [0, 2, 3],  // Multiple select
  [questionId3]: "Essay answer...",
};

// Submit exam
const result = await submitExam(attempt.id, answers);
// Auto-grading happens automatically
```

### Example 5: Manual Marking

```typescript
// API: POST /api/olympiad-v2/admin/marking/submit
import { submitManualMark } from '@/lib/olympiad-v2/marking';

await submitManualMark(adminId, {
  exam_attempt_id: attemptId,
  question_id: questionId,
  marks_awarded: 8.5,
  feedback: "Good answer but missing key point about photosynthesis"
});
```

### Example 6: Run Progression

```typescript
// API: POST /api/olympiad-v2/admin/progression/compute
import { runProgressionForEdition } from '@/lib/olympiad-v2/progression';
import { sendStageQualificationNotification } from '@/lib/olympiad-v2/notifications';

// After Beginner stage exams are marked
const result = await runProgressionForEdition(editionId, 'Beginner');

console.log(`Processed: ${result.total_processed}`);
console.log(`Qualified for Theory: ${result.total_qualified}`);

// Send notifications to qualified participants
// (Implementation depends on your notification strategy)
```

## Step 5: Frontend Components

### User Dashboard Component

```typescript
// app/participant/dashboard/page.tsx
import { getUserParticipants } from '@/lib/olympiad-v2/enrollment';
import { getMinorProfilesByUser } from '@/lib/olympiad-v2/minors';

export default async function Dashboard() {
  const session = await getParticipantSession();
  const { self, minors } = await getUserParticipants(session.guardianId);
  const minorProfiles = await getMinorProfilesByUser(session.guardianId);

  return (
    <div>
      <h1>My Dashboard</h1>
      
      {/* Self Participations */}
      <section>
        <h2>My Participations</h2>
        {self.map(participant => (
          <ParticipantCard key={participant.id} participant={participant} />
        ))}
      </section>

      {/* Minors */}
      <section>
        <h2>My Children/Students</h2>
        {minorProfiles.map(minor => (
          <MinorCard key={minor.id} minor={minor} />
        ))}
      </section>
    </div>
  );
}
```

### Exam Taking Component

```typescript
// app/participant/exam/[attemptId]/page.tsx
import { getExamAttempt } from '@/lib/olympiad-v2/exams';
import { getExamQuestions } from '@/lib/olympiad-v2/exams';

export default async function ExamPage({ params }) {
  const attempt = await getExamAttempt(params.attemptId);
  const questions = await getExamQuestions(attempt.exam_config_id, true);

  return (
    <ExamInterface 
      attempt={attempt}
      questions={questions}
    />
  );
}
```

## Step 6: Scheduled Tasks

### Auto-Submit Expired Exams

Create a cron job or scheduled task:

```typescript
// scripts/auto-submit-exams.ts
import { autoSubmitExpiredExams } from '@/lib/olympiad-v2/exams';

async function runAutoSubmit() {
  const count = await autoSubmitExpiredExams();
  console.log(`Auto-submitted ${count} expired exams`);
}

// Run every 5 minutes
setInterval(runAutoSubmit, 5 * 60 * 1000);
```

### Send Exam Reminders

```typescript
// scripts/send-exam-reminders.ts
import { getActiveEditions } from '@/lib/olympiad-v2/editions';
import { sendExamReminder } from '@/lib/olympiad-v2/notifications';

async function sendReminders() {
  // Get upcoming exams in next 24 hours
  // Send reminders to enrolled participants
  // Implementation depends on your needs
}

// Run hourly
setInterval(sendReminders, 60 * 60 * 1000);
```

## Step 7: Testing Checklist

### User Flow Testing

- [ ] User can create minor profile
- [ ] User can view list of minors
- [ ] User can update minor profile
- [ ] User can delete minor profile (if not enrolled)
- [ ] User can check enrollment eligibility
- [ ] Age validation works correctly
- [ ] Subject validation works correctly
- [ ] User cannot enroll twice in same edition
- [ ] User can enroll self
- [ ] User can enroll minor
- [ ] User receives enrollment confirmation notification

### Exam Flow Testing

- [ ] Participant can see available exams
- [ ] Participant cannot access exam before start time
- [ ] Participant cannot access exam after end time
- [ ] Participant can start exam
- [ ] Answers are auto-saved periodically
- [ ] Participant can submit exam
- [ ] Exam auto-submits when time expires
- [ ] MCQ questions are auto-graded correctly
- [ ] Multiple select questions are auto-graded correctly
- [ ] True/False questions are auto-graded correctly
- [ ] Numeric questions are auto-graded correctly
- [ ] Essay questions require manual marking

### Admin Flow Testing

- [ ] Admin can create olympiad edition
- [ ] Admin can update edition settings
- [ ] Admin can change edition status
- [ ] Admin can add questions to question bank
- [ ] Admin can create exam configurations
- [ ] Admin can view pending marking tasks
- [ ] Admin can submit manual marks
- [ ] Admin can run progression computation
- [ ] Rankings are computed correctly
- [ ] Eligibility is computed correctly

### Progression Testing

- [ ] Beginner → Theory: 70% threshold works
- [ ] Theory → Practical: 60% + top 50% works
- [ ] Practical → Final: 60% + top 40% works
- [ ] Participants below threshold are not eligible
- [ ] Participants outside percentile are not eligible
- [ ] Notifications sent to qualified participants

## Step 8: Security Considerations

### Authentication

```typescript
// Verify user session in all endpoints
const session = await getParticipantSession();
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Authorization

```typescript
// Verify user owns the minor
import { userOwnsMinor } from '@/lib/olympiad-v2/minors';

if (!await userOwnsMinor(userId, minorId)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// Verify user can access participant data
import { canAccessParticipant } from '@/lib/olympiad-v2/enrollment';

if (!await canAccessParticipant(userId, participantId)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### Input Validation

```typescript
// Validate all inputs
if (!body.full_name || !body.date_of_birth) {
  return NextResponse.json(
    { error: 'Missing required fields' },
    { status: 400 }
  );
}

// Validate date formats
const date = new Date(body.date_of_birth);
if (isNaN(date.getTime())) {
  return NextResponse.json(
    { error: 'Invalid date format' },
    { status: 400 }
  );
}
```

## Step 9: Performance Optimization

### Database Indexes

All necessary indexes are created by the schema. Key indexes:

- `olympiad_participants` by edition_id, user_id, minor_profile_id
- `participant_subjects` by participant_id
- `exam_attempts_v2` by participant_id, exam_config_id
- `rankings` by edition_id, level, subject, stage
- `stage_eligibility` by participant_id, subject, stage

### Caching Strategy

Consider caching:
- Edition details
- Question bank
- Leaderboards
- User dashboard data

```typescript
// Example with Next.js cache
import { unstable_cache } from 'next/cache';

const getCachedEdition = unstable_cache(
  async (editionId) => getEditionById(editionId),
  ['edition'],
  { revalidate: 3600 } // 1 hour
);
```

## Step 10: Deployment

### Environment Variables

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_key (for emails)
TWILIO_ACCOUNT_SID=your_twilio_sid (for SMS)
TWILIO_AUTH_TOKEN=your_twilio_token
```

### Database Backup

```bash
# Regular backups
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Monitoring

Monitor:
- API response times
- Database query performance
- Exam submission success rate
- Notification delivery rate
- Auto-grading accuracy

## Troubleshooting

### Common Issues

**Issue**: "Cannot find module '@neondatabase/serverless'"
- **Solution**: Already installed in package.json, TypeScript error will resolve on build

**Issue**: Age validation failing
- **Solution**: Check reference_date in edition settings, ensure DOB format is correct

**Issue**: Progression not working
- **Solution**: Ensure all exams are marked (status = 'MARKED') before running progression

**Issue**: Notifications not sending
- **Solution**: Implement email/SMS sending in `notifications.ts` (currently placeholders)

## Next Steps

1. Implement remaining API endpoints
2. Build frontend UI components
3. Implement email/SMS sending
4. Add file upload for practical exams
5. Generate PDF certificates
6. Create admin analytics dashboard
7. Add comprehensive error logging
8. Implement rate limiting
9. Add end-to-end tests
10. Deploy to production

## Support Resources

- **Database Schema**: `/scripts/03-olympiad-v2-schema.sql`
- **Type Definitions**: `/lib/olympiad-v2/types.ts`
- **Business Rules**: `/lib/olympiad-v2/constants.ts`
- **Full Documentation**: `/OLYMPIAD_V2_README.md`

---

**Need Help?**

Review the comprehensive documentation in `OLYMPIAD_V2_README.md` for detailed information about:
- System architecture
- Business rules
- Workflow examples
- API structure
- Testing guidelines
