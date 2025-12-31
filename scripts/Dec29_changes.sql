-- Dec29_changes.sql
-- Schema for new content management pages

-- Research & Publications
CREATE TABLE IF NOT EXISTS publications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  year INTEGER NOT NULL,
  summary TEXT NOT NULL,
  pdf_url VARCHAR(500),
  download_count INTEGER DEFAULT 0,
  citation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS featured_resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  link_url VARCHAR(500) NOT NULL,
  link_text VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donations
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  donation_id VARCHAR(50) UNIQUE NOT NULL, -- IDF-YYYYMMDD-XXXX
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  country VARCHAR(100) NOT NULL,
  cause VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  frequency VARCHAR(20) NOT NULL, -- One-time, Monthly, Annual, Pledge
  preferred_payment_date DATE,
  message TEXT,
  status VARCHAR(20) DEFAULT 'New', -- New, Contacted, Paid, Partially Paid, Cancelled
  payment_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partnerships
CREATE TABLE IF NOT EXISTS partnerships (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(50) UNIQUE NOT NULL, -- PAR-YYYYMMDD-XXXX
  organization_name VARCHAR(300) NOT NULL,
  contact_person VARCHAR(200) NOT NULL,
  contact_title VARCHAR(200),
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  partnership_tier VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  estimated_commitment VARCHAR(200),
  document_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'New', -- New, Under Review, Approved, Rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Volunteers
CREATE TABLE IF NOT EXISTS volunteers (
  id SERIAL PRIMARY KEY,
  application_id VARCHAR(50) UNIQUE NOT NULL, -- VOL-YYYYMMDD-XXXX
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT,
  role VARCHAR(100) NOT NULL,
  cv_url VARCHAR(500),
  skills TEXT,
  availability TEXT,
  background_check_consent BOOLEAN DEFAULT false,
  references TEXT,
  motivation TEXT,
  status VARCHAR(20) DEFAULT 'New', -- New, Under Review, Approved, Rejected
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Advocates
CREATE TABLE IF NOT EXISTS advocates (
  id SERIAL PRIMARY KEY,
  advocate_id VARCHAR(50) UNIQUE NOT NULL, -- ADV-YYYYMMDD-XXXX
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  advocacy_type VARCHAR(50) NOT NULL, -- Digital, Community, Policy
  plan TEXT NOT NULL,
  social_handles TEXT,
  estimated_hours INTEGER,
  status VARCHAR(20) DEFAULT 'Active', -- Active, Inactive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog & Articles
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  author VARCHAR(200) NOT NULL,
  author_role VARCHAR(200),
  author_email VARCHAR(200),
  lead_text TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT, -- JSON array as text
  featured_image VARCHAR(500),
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(50) UNIQUE NOT NULL, -- EVT-YYYYMMDD-XXXX
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(300) NOT NULL,
  category VARCHAR(100) NOT NULL, -- Competition, Training, etc.
  event_type VARCHAR(20) NOT NULL, -- In-person, Virtual
  capacity INTEGER,
  registration_fields TEXT, -- JSON as text
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  registration_id VARCHAR(50) UNIQUE NOT NULL, -- EVT-YYYYMMDD-XXXX
  participant_data TEXT NOT NULL, -- JSON as text
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO featured_resources (title, description, link_url, link_text, display_order) VALUES
('OpenStax — Free peer-reviewed textbooks', 'College-level, openly licensed textbooks covering Physics, Biology, Calculus, and more — free to read or download (PDF / web). Ideal for scholars and teachers.', 'https://openstax.org/', 'Open OpenStax', 1),
('LibreTexts — Interactive open textbooks', 'Large collection of open textbooks and interactive materials across 13+ STEM disciplines — customizable for class and self-study.', 'https://libretexts.org/', 'Open LibreTexts', 2),
('MIT OpenCourseWare — Course materials for CS, EE, and engineering', 'Lecture notes, videos, problem sets and exams from MIT courses — excellent for independent study in programming, algorithms, electrical engineering and more.', 'https://ocw.mit.edu/', 'Browse MIT OCW', 3),
('arXiv — Open preprints in physics, math, and CS', 'Fast public access to preprints and research papers — useful for advanced scholars, research mentors, and project reading lists.', 'https://arxiv.org/', 'Search arXiv', 4),
('PLOS — Open access journals', 'Peer-reviewed, open-access journals in biology, computational biology and interdisciplinary science — full-text freely available.', 'https://plos.org/', 'View PLOS journals', 5),
('DOAJ — Directory of Open Access Journals', 'Index of reputable open access journals across all STEM disciplines — search for peer-reviewed open journals and articles.', 'https://doaj.org/', 'Search DOAJ', 6),
('PubMed Central (PMC)', 'Free full-text archive of biomedical and life sciences research papers — useful for biology and applied sciences scholars.', 'https://www.ncbi.nlm.nih.gov/pmc/', 'Explore PMC', 7),
('Kaggle Datasets', 'Public datasets plus community notebooks for data science and machine-learning practice. Great for data-science projects and competitions.', 'https://www.kaggle.com/datasets', 'Browse Kaggle datasets', 8),
('Semantic Scholar', 'AI-powered search to surface influential papers and summaries across STEM fields. Helpful for literature reviews and citation discovery.', 'https://www.semanticscholar.org/', 'Search Semantic Scholar', 9);

INSERT INTO publications (title, year, summary) VALUES
('Idrisa Foundation — 2025 Baseline Report: STEM Outreach & Scholarship Pilots', 2025, 'Baseline enrollment and participation data from our first STEM Olympiad pilot and scholarship selection metrics.');

INSERT INTO blog_posts (title, slug, category, author, author_role, lead_text, content, tags, is_published, published_at) VALUES
('Idrisa Foundation Launches 2026 STEM Olympiad Pilot in Central Uganda', 'idrisa-foundation-launches-2026-stem-olympiad-pilot', 'Press Releases', 'Program Lead', 'Idrisa Foundation', 'Idrisa Foundation is launching a national pilot of its STEM Olympiad with 12 partner schools.', 'Kampala, Uganda — Idrisa Foundation today announced the launch of a pilot STEM Olympiad across 12 schools in Central Uganda. The pilot will test curriculum modules, competition formats, and mentorship pairings, with the aim of scaling to 100 schools in three years. Key partners include local schools and volunteer mentors.', '["STEM", "Olympiad", "Program Updates"]', true, '2026-02-12'),
('From Kitovu to Code: How a Scholarship Helped Aisha Build a Robotics Project', 'from-kitovu-to-code-aisha-robotics-project', 'Student Stories', 'Communications Officer', 'Idrisa Foundation', 'Aisha, a scholarship recipient, used a mentorship grant to build an affordable soil-moisture sensor for smallholder farmers.', 'Aisha used her mentorship stipend to design and test a low-cost moisture sensor that can help local farmers reduce water waste. Her project will be showcased at the Idrisa incubation demo day.', '["Student Stories", "Scholarships", "Mentorship"]', true, '2026-03-05'),
('Summary: Open Textbooks and STEM Performance — What We Learned from OpenStax Adoption', 'open-textbooks-stem-performance-openstax', 'Research Summaries', 'Research Team', 'Idrisa Foundation', 'Early evidence suggests using free, peer-reviewed open textbooks reduces course costs and improves resource access for rural students.', 'This brief summarizes research on the adoption of open textbooks (notably OpenStax) and implications for rural secondary schools. The full literature links are provided in our Research & Publications library.', '["Research", "Open Textbooks", "STEM"]', true, '2026-01-18');

INSERT INTO events (event_id, title, description, event_date, start_time, end_time, location, category, event_type, capacity, is_published) VALUES
('EVT-20260410-001', 'Idrisa STEM Olympiad — Regional Qualifiers (Central)', 'Regional qualifiers for the Idrisa STEM Olympiad. Schools competing will undertake written and practical challenges in math, physics, and computing. Selected students receive mentorship opportunities.', '2026-04-10', '09:00', '16:00', 'Makerere College School, Kampala (Room details provided on registration)', 'Competition', 'In-person', 120, true),
('EVT-20260420-001', 'Intro to Python for Educators — 2-hour virtual workshop', 'Practical Python workshop for secondary school teachers to integrate coding into the classroom using free tools (Colab, Jupyter). Materials will be shared after the session.', '2026-04-20', '14:00', '16:00', 'Online (Zoom link after registration)', 'Training', 'Virtual', 200, true);