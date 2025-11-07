-- Create enums
CREATE TYPE user_role AS ENUM ('admin', 'participant', 'guardian');
CREATE TYPE education_level AS ENUM ('Primary', 'O-level', 'A-level');
CREATE TYPE class_level AS ENUM ('P.4', 'P.5', 'P.6', 'P.7', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6');
CREATE TYPE olympiad_phase AS ENUM ('Preparation', 'Quiz', 'Bronze', 'Silver', 'Golden Finale');
CREATE TYPE question_type AS ENUM ('Quiz', 'Theory', 'Practical');
CREATE TYPE question_hardness AS ENUM ('1-star', '2-star', '3-star');
CREATE TYPE exam_status AS ENUM ('Not Started', 'In Progress', 'Completed', 'Eliminated');

-- Admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Olympiads table
CREATE TABLE olympiads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  theme TEXT NOT NULL,
  starting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  closing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT,
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT date_range_check CHECK (
    EXTRACT(DAY FROM (closing_date - starting_date)) >= 90 
    AND EXTRACT(DAY FROM (closing_date - starting_date)) <= 150
  )
);

-- Olympiad phases table (auto-generated from olympiad dates)
CREATE TABLE olympiad_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  olympiad_id UUID NOT NULL REFERENCES olympiads(id) ON DELETE CASCADE,
  phase olympiad_phase NOT NULL,
  phase_number INT NOT NULL CHECK (phase_number BETWEEN 1 AND 5),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(olympiad_id, phase_number)
);

-- Guardians table
CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  occupation TEXT NOT NULL,
  address TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  education_level education_level NOT NULL,
  date_of_birth DATE NOT NULL,
  class class_level NOT NULL,
  school_name TEXT NOT NULL,
  district TEXT NOT NULL,
  photo_url TEXT,
  school_id_front_url TEXT,
  school_id_back_url TEXT,
  guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Participant olympiad registration
CREATE TABLE participant_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  olympiad_id UUID NOT NULL REFERENCES olympiads(id) ON DELETE CASCADE,
  selected_subjects TEXT[] NOT NULL CHECK (array_length(selected_subjects, 1) <= 2),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  current_phase olympiad_phase NOT NULL DEFAULT 'Preparation',
  is_eliminated BOOLEAN DEFAULT FALSE,
  elimination_phase olympiad_phase,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(participant_id, olympiad_id)
);

-- Question bank
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  education_level education_level NOT NULL,
  question_type question_type NOT NULL,
  hardness question_hardness NOT NULL,
  question_text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_option INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exams (generated exams for each phase)
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  olympiad_id UUID NOT NULL REFERENCES olympiads(id) ON DELETE CASCADE,
  phase olympiad_phase NOT NULL,
  subject TEXT NOT NULL,
  education_level education_level NOT NULL,
  question_ids UUID[] NOT NULL,
  duration_minutes INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(olympiad_id, phase, subject, education_level)
);

-- Exam attempts (participant taking an exam)
CREATE TABLE exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  olympiad_id UUID NOT NULL REFERENCES olympiads(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  phase olympiad_phase NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status exam_status NOT NULL DEFAULT 'Not Started',
  score DECIMAL(5, 2),
  answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(participant_id, exam_id)
);

-- Create indexes for performance
CREATE INDEX idx_olympiads_admin_id ON olympiads(admin_id);
CREATE INDEX idx_olympiad_phases_olympiad_id ON olympiad_phases(olympiad_id);
CREATE INDEX idx_participants_guardian_id ON participants(guardian_id);
CREATE INDEX idx_participant_registrations_olympiad_id ON participant_registrations(olympiad_id);
CREATE INDEX idx_participant_registrations_participant_id ON participant_registrations(participant_id);
CREATE INDEX idx_questions_admin_id ON questions(admin_id);
CREATE INDEX idx_questions_education_level ON questions(education_level);
CREATE INDEX idx_exams_olympiad_id ON exams(olympiad_id);
CREATE INDEX idx_exam_attempts_participant_id ON exam_attempts(participant_id);
CREATE INDEX idx_exam_attempts_exam_id ON exam_attempts(exam_id);
CREATE INDEX idx_exam_attempts_olympiad_id ON exam_attempts(olympiad_id);
