# The Idrisa Foundation - STEM Olympiad Platform

A comprehensive web application for managing STEM education competitions, career guidance, and youth empowerment programs for Uganda's students.

## Overview

The Idrisa Foundation website provides a complete platform for:
- **STEM Olympiad Management**: Annual competitions across Mathematics, Sciences, and ICT
- **Career Guidance**: Professional mentoring and counseling
- **Internship & Job Programs**: Real-world work experience opportunities

## Project Structure

### Public Pages
- `/` - Landing page with hero section and impact statistics
- `/our-story` - Foundation history and mission
- `/our-programs` - Detailed program descriptions
- `/olympiad` - Olympiad information and phases
- `/impact` - Impact metrics and success stories

### Admin Portal
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Main admin dashboard
- `/admin/olympiad/create` - Create new olympiad with auto-phase splitting
- `/admin/olympiads` - Manage all olympiads
- `/admin/question-bank` - Question bank management
- `/admin/question-bank/add` - Add new exam questions

### Participant Portal
- `/participant/login` - Participant login (Guardian account)
- `/participant/signup` - Two-step guardian and student registration
- `/participant/dashboard` - View registered students and competitions
- `/participant/student/[id]/competitions` - Available competitions for a student
- `/participant/register-olympiad/[id]/[studentId]` - Register for specific olympiad
- `/participant/competition/[olympiadId]/student/[studentId]` - Take exam

## Key Features

### Olympiad Management
- **Automated Phase Division**: System automatically divides competition timeline into 5 equal phases:
  1. Preparation (Registration)
  2. Quiz (Initial screening)
  3. Bronze (Theory exam)
  4. Silver (Practical exam)
  5. Golden Finale (Offline event)

- **Date Validation**: Ensures dates are 3-5 months (90-150 days) apart

### Question Bank System
- **Organized by Subject & Level**:
  - Primary: Mathematics, Integrated Science, Computer Knowledge
  - O-Level: Math, Biology, Physics, Chemistry, ICT, Agriculture
  - A-Level: Physics, Chemistry, Math, ICT, Biology, Agriculture

- **Question Types**: Quiz, Theory, Practical
- **Difficulty Levels**: 1-star (Easy), 2-star (Medium), 3-star (Hard)
- **Balanced Exam Generation**: Auto-selects questions with equal difficulty distribution

### Participant Registration
- **Multi-Step Process**: Guardian details first, then student information
- **Age Validation**:
  - Primary: 10-14 years (Classes P.4-P.7)
  - O-Level: 12-18 years (Classes S.1-S.4)
  - A-Level: 16-21 years (Classes S.5-S.6)

- **Document Uploads**: Student photo and school ID (front & back)
- **Multi-Participant Support**: One guardian can register multiple students

### Competition System
- **Subject Selection**: Students choose up to 2 subjects per olympiad
- **Timed Exams**: Variable durations by phase and education level:
  - Quiz: 45-60 minutes
  - Theory: 90-150 minutes
  - Practical: 150-195 minutes

- **Interactive Exam Interface**:
  - Question progress tracker
  - Real-time countdown
  - Answer recording
  - Auto-submit on time expiration

### Auto-Elimination System
- **Quiz Phase**: Eliminate students scoring below 70%
- **Bronze Phase**: Eliminate bottom 30% plus those below 60%
- **Silver Phase**: Eliminate bottom 50% plus those below 50%
- **Eliminated Status**: Students cannot retake or advance

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Neon PostgreSQL with serverless functions
- **Authentication**: JWT-based session management
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Password Security**: Bcryptjs

## Database Schema

### Core Tables
- `admins` - Admin accounts
- `olympiads` - Olympiad events
- `olympiad_phases` - Auto-generated 5 phases per olympiad
- `guardians` - Participant guardians/parents
- `participants` - Student information
- `participant_registrations` - Olympiad registration with phase tracking
- `questions` - Question bank
- `exams` - Generated exams from question pool
- `exam_attempts` - Student exam attempts with scoring

## Setup Instructions

### 1. Database Setup
Run the migration scripts to create tables:
\`\`\`bash
# Run from scripts folder in v0
node scripts/01-schema.sql  # Creates tables
node scripts/02-seed-data.sql  # Adds sample admin
\`\`\`

### 2. Environment Variables
Add to your Vercel project:
\`\`\`
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret_key
\`\`\`

### 3. First Time Setup
1. Create admin account at `/admin/signup`
2. Create an olympiad at `/admin/olympiad/create`
3. Add questions to question bank
4. Advertise competition to students

### 4. Running Competition
1. Students register at `/participant/signup`
2. Students register for olympiad and select subjects
3. During exam phases, students can access exams
4. System automatically eliminates based on scores
5. Finalists participate in Golden Finale

## Admin Workflow

### Week 1-2: Setup
1. Create olympiad with dates
2. Add 20+ questions per subject/level combination
3. Test exam generation

### Week 3+: Competition
1. Monitor participant registrations
2. View competition progress
3. Manage phase transitions (manual or automatic)
4. Record Golden Finale results

## Participant Workflow

### Registration
1. Create guardian account
2. Register student details
3. Upload required documents

### Competition
1. Login to dashboard
2. Browse available olympiads
3. Register for olympiad with subject selection
4. Take exams during each phase
5. View results and advancement status

## Exam Duration Reference

| Type | Primary | O-Level | A-Level |
|------|---------|---------|---------|
| Quiz | 45 min | 60 min | 60 min |
| Theory | 90 min | 120 min | 150 min |
| Practical | 150 min | 150 min | 195 min |

## Important Notes

- All dates must be 3-5 months apart when creating olympiad
- Questions are auto-selected with balanced difficulty (1/3 each level)
- Eliminated students cannot retake exams or advance
- Session cookies expire after 7 days (admin) / 30 days (participants)
- All data is stored in Neon PostgreSQL

## Future Enhancements

- Email notifications for phase transitions
- Results dashboard and leaderboards
- Scholarship management system
- Admin analytics and reporting
- Mobile app for exam taking
- Real-time notifications
- Payment integration for registrations

## Support

For issues or questions about the platform, contact the development team or submit a ticket through the support portal.

---

**Built for The Idrisa Foundation (U) Limited**  
*Empowering Tomorrow's Minds*
