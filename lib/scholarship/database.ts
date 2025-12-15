import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

async function ensureTable(tableName: string, createSQL: string): Promise<void> {
  const exists = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = ${tableName}
    ) as exists
  `

  if (!exists[0]?.exists) {
    await sql.query(createSQL)
  }
}

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
    }
  } catch {
    // Ignore: column may already exist with different casing
  }
}

export async function ensureScholarshipTypesTable(): Promise<void> {
  await ensureTable(
    "scholarship_types",
    `
    CREATE TABLE scholarship_types (
      id SERIAL PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
  )

  await ensureColumn("scholarship_types", "description", "TEXT")
}

export async function ensureScholarshipsTable(): Promise<void> {
  await ensureScholarshipTypesTable()

  await ensureTable(
    "scholarships",
    `
    CREATE TABLE scholarships (
      id SERIAL PRIMARY KEY,
      type_id INT NOT NULL REFERENCES scholarship_types(id) ON DELETE RESTRICT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      tagline TEXT,
      hero_image_url TEXT,
      content JSONB NOT NULL DEFAULT '{}'::jsonb,
      application_fee_ugx INT NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
  )

  await ensureColumn("scholarships", "tagline", "TEXT")
  await ensureColumn("scholarships", "hero_image_url", "TEXT")
  await ensureColumn("scholarships", "content", "JSONB DEFAULT '{}'::jsonb")
  await ensureColumn("scholarships", "application_fee_ugx", "INT NOT NULL DEFAULT 0")
  await ensureColumn("scholarships", "is_active", "BOOLEAN NOT NULL DEFAULT TRUE")
}

export async function ensureScholarshipApplicantsTable(): Promise<void> {
  await ensureTable(
    "scholarship_applicants",
    `
    CREATE TABLE scholarship_applicants (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone_number TEXT,
      password_hash TEXT NOT NULL,
      date_of_birth DATE,
      gender TEXT,
      address TEXT,
      district TEXT,
      national_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `
  )
}

export async function ensureScholarshipApplicationsTable(): Promise<void> {
  await ensureScholarshipApplicantsTable()
  await ensureScholarshipsTable()

  await ensureTable(
    "scholarship_applications",
    `
    CREATE TABLE scholarship_applications (
      id SERIAL PRIMARY KEY,
      applicant_id INT NOT NULL REFERENCES scholarship_applicants(id) ON DELETE CASCADE,
      scholarship_id INT NOT NULL REFERENCES scholarships(id) ON DELETE RESTRICT,
      application_fee_ugx INT NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'SUBMITTED',
      submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(applicant_id, scholarship_id)
    )
  `
  )

  await ensureColumn("scholarship_applications", "data", "JSONB NOT NULL DEFAULT '{}'::jsonb")
}

export async function initializeScholarshipDatabase(): Promise<void> {
  await ensureScholarshipTypesTable()
  await ensureScholarshipsTable()
  await ensureScholarshipApplicantsTable()
  await ensureScholarshipApplicationsTable()
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export async function seedScholarshipsIfEmpty(): Promise<void> {
  await initializeScholarshipDatabase()

  const typeCount = await sql`SELECT COUNT(*)::int as count FROM scholarship_types`
  if ((typeCount[0]?.count ?? 0) === 0) {
    await sql`
      INSERT INTO scholarship_types (code, name, description)
      VALUES
        ('FULL', 'Full Scholarships', 'Comprehensive support covering tuition and essential learning needs.'),
        ('PARTIAL', 'Partial Scholarships', 'Partial tuition support for students with strong potential.'),
        ('GRANT', 'Grants', 'Targeted support for materials, projects, or time-bound learning needs.')
    `
  }

  const scholarshipCount = await sql`SELECT COUNT(*)::int as count FROM scholarships`
  if ((scholarshipCount[0]?.count ?? 0) > 0) return

  const types = await sql`SELECT id, code FROM scholarship_types`
  const typeByCode = new Map<string, number>(types.map((t: any) => [t.code as string, t.id as number]))

  const vijayaTitle = "The Vijaya Kumari Scholarship"
  const vijayaSlug = slugify(vijayaTitle)

  const vijayaContent = {
    hero: {
      title: vijayaTitle,
      tagline: "Honoring an Unfulfilled Dream by Fueling the Ambition of Another.",
    },
    why: {
      heading: "The Story Behind the Scholarship: A Mother's Investment",
      body: [
        "This scholarship is not merely a financial award; it is the living legacy of Mrs. Vijaya Kumari, a woman whose own academic dreams were deferred, but whose belief in the potential of others was boundless.",
        "When the cofounder of TIFUL was once in need of help in one of his academic journeys, his friend (Shree Vidya, a daughter of Vijaya Kumari) proposed to help by requesting her mother for a specific sum of money to help her friend.",
        "Her mother said: ‘I was once a merit student whose dream of higher education was blessed with free education, yet my family prevented me from pursuing my professional dream. That unfulfilled life is why I value a genuine thirst for knowledge above all else.’",
        "In her spirit, this scholarship seeks out students who embody that same genuine thirst for knowledge—those for whom a financial barrier is the only thing standing between them and a transformative STEM education.",
      ],
    },
    quickFacts: {
      awardValue: "Trimester school fees coverage up to UGX 500,000 plus UGX 75,000 monthly stipend.",
      fieldPriority: "Science (P6–P7), Sciences (O-Level), and Biology/Chemistry/Physics (A-Level).",
      educationLevel: "Primary (P6–P7 first term), O-Level (S3–S4 first term), A-Level (S5 students).",
      numberOfAwards: "3 scholarships available per academic year.",
      applicationDeadline: "To be announced.",
      applicationFee: "UGX 0",
    },
    eligibility: {
      heading: "Who We Are Looking For: Eligibility & Criteria",
      mandatoryCriteria: [
        "Academic Merit: A consistent top performer (top 10% of the class) in STEM subjects (Biology, Chemistry, Mathematics, Physics) with a proven academic record for three previous consecutive trimesters.",
        "Financial Need: Must demonstrate a clear financial barrier that threatens the pursuit of education.",
        "Admission Status: Must provide proof of student status (certified ID card, certified letter from school or student portal screen capture with all detailed information). Only active status students are eligible.",
        "Personal Character: Exhibits resilience, integrity, and a clear, passionate vision for their future in science.",
      ],
      essayPrompts: [
        "Describe your ‘genuine thirst for knowledge.’ How has this passion shaped your journey so far, and what magnificent life in STEM do you believe you are meant to build?",
      ],
      requiredDocuments: [
        "Certified copies of: UCE (for A-Level), previous three trimester report cards (O-Level and primary).",
        "Proof of student status: certified copy of student ID or letter of student status from the school.",
        "Two signed and stamped recommendation letters: one academic and one character reference.",
        "A brief description of your financial situation and contact of guardian for confirmation.",
      ],
      acknowledgmentText:
        "I have read, and I deeply understand, the story of Mrs. Vijaya Kumari and the core mission of this scholarship. I confirm that I meet all the eligibility criteria listed above.",
    },
    process: {
      heading: "Application Process & Timeline",
      steps: [
        "Check your eligibility and confirm you understand the purpose of this scholarship.",
        "Prepare your required documents and personal statement.",
        "Submit your application online before the announced deadline.",
        "Shortlisting and interviews (if any) will follow, then final announcement.",
      ],
      notes: [
        "Selection focuses on both academic merit and alignment with the values and purpose of the scholarship.",
      ],
    },
    commitments: {
      heading: "Scholar Commitments & Expectations",
      items: [
        "Maintain strong academic performance and good conduct.",
        "Participate in mentorship events where possible.",
        "Submit simple progress updates when requested.",
        "Contribute a short testimonial to inspire other learners (with consent).",
      ],
    },
  }

  const placeholders = [
    { title: "Kapera Sulaiman Scholarship", type: "FULL", tagline: "", slug: slugify("Kapera Sulaiman Scholarship") },
    {
      title: "TIFUL Founder’s Scholarship",
      type: "FULL",
      tagline: "Pushing all limits to see that the young generation thrives through education.",
      slug: slugify("TIFUL Founder’s Scholarship"),
    },
    { title: "Namala Aisha’s Scholarship", type: "PARTIAL", tagline: "", slug: slugify("Namala Aisha’s Scholarship") },
    { title: "Amina Naiga’s Scholarship", type: "PARTIAL", tagline: "", slug: slugify("Amina Naiga’s Scholarship") },
    { title: "Kirill’s Stipendium Scholarship", type: "GRANT", tagline: "", slug: slugify("Kirill’s Stipendium Scholarship") },
  ]

  await sql`
    INSERT INTO scholarships (type_id, slug, title, tagline, hero_image_url, content, application_fee_ugx, is_active)
    VALUES (
      ${typeByCode.get("FULL")},
      ${vijayaSlug},
      ${vijayaTitle},
      ${vijayaContent.hero.tagline},
      ${null},
      ${JSON.stringify(vijayaContent)}::jsonb,
      0,
      TRUE
    )
  `

  for (const p of placeholders) {
    await sql`
      INSERT INTO scholarships (type_id, slug, title, tagline, hero_image_url, content, application_fee_ugx, is_active)
      VALUES (
        ${typeByCode.get(p.type)},
        ${p.slug},
        ${p.title},
        ${p.tagline || null},
        ${null},
        ${JSON.stringify({ hero: { title: p.title, tagline: p.tagline || "" } })}::jsonb,
        0,
        TRUE
      )
    `
  }
}

export async function createScholarshipApplicant(input: {
  fullName: string
  email: string
  phoneNumber?: string
  password: string
  dateOfBirth?: string
  gender?: string
  address?: string
  district?: string
  nationalId?: string
}): Promise<{ id: number; email: string; full_name: string }> {
  await ensureScholarshipApplicantsTable()

  const passwordHash = await bcrypt.hash(input.password, 10)

  const result = await sql`
    INSERT INTO scholarship_applicants (
      full_name, email, phone_number, password_hash, date_of_birth, gender, address, district, national_id
    )
    VALUES (
      ${input.fullName},
      ${input.email},
      ${input.phoneNumber || null},
      ${passwordHash},
      ${input.dateOfBirth || null},
      ${input.gender || null},
      ${input.address || null},
      ${input.district || null},
      ${input.nationalId || null}
    )
    RETURNING id, email, full_name
  `

  if (result.length === 0) throw new Error("Failed to create applicant")
  return result[0] as any
}

export async function createScholarshipApplication(input: {
  applicantId: number
  scholarshipId: number
  data: any
}): Promise<{ id: number }> {
  await ensureScholarshipApplicationsTable()

  const result = await sql`
    INSERT INTO scholarship_applications (applicant_id, scholarship_id, application_fee_ugx, status, data)
    VALUES (${input.applicantId}, ${input.scholarshipId}, 0, 'SUBMITTED', ${JSON.stringify(input.data)}::jsonb)
    RETURNING id
  `

  if (result.length === 0) throw new Error("Failed to create application")
  return result[0] as any
}

export async function getScholarships(): Promise<
  Array<{
    id: number
    type_code: string
    type_name: string
    slug: string
    title: string
    tagline: string | null
    application_fee_ugx: number
    is_active: boolean
  }>
> {
  await ensureScholarshipsTable()

  const rows = await sql`
    SELECT
      s.id,
      t.code as type_code,
      t.name as type_name,
      s.slug,
      s.title,
      s.tagline,
      s.application_fee_ugx,
      s.is_active
    FROM scholarships s
    JOIN scholarship_types t ON t.id = s.type_id
    ORDER BY t.id, s.id
  `

  return rows as any
}

export async function getScholarshipBySlug(slug: string): Promise<
  | {
      id: number
      type_code: string
      type_name: string
      slug: string
      title: string
      tagline: string | null
      hero_image_url: string | null
      content: any
      application_fee_ugx: number
      is_active: boolean
    }
  | null
> {
  await ensureScholarshipsTable()

  const rows = await sql`
    SELECT
      s.id,
      t.code as type_code,
      t.name as type_name,
      s.slug,
      s.title,
      s.tagline,
      s.hero_image_url,
      s.content,
      s.application_fee_ugx,
      s.is_active
    FROM scholarships s
    JOIN scholarship_types t ON t.id = s.type_id
    WHERE s.slug = ${slug}
    LIMIT 1
  `

  if (rows.length === 0) return null
  return rows[0] as any
}

export async function getScholarshipIdByTypeCode(typeCode: string): Promise<number | null> {
  await ensureScholarshipsTable()
  await seedScholarshipsIfEmpty()

  const rows = await sql`
    SELECT s.id
    FROM scholarships s
    JOIN scholarship_types t ON t.id = s.type_id
    WHERE t.code = ${typeCode}
    AND s.is_active = TRUE
    ORDER BY s.id
    LIMIT 1
  `

  if (rows.length === 0) return null
  return (rows[0] as any).id as number
}

export async function listScholarshipTypes(): Promise<Array<{ id: number; code: string; name: string; description: string | null }>> {
  await ensureScholarshipTypesTable()
  const rows = await sql`
    SELECT id, code, name, description
    FROM scholarship_types
    ORDER BY id
  `
  return rows as any
}

export async function createScholarshipType(input: {
  code: string
  name: string
  description?: string
}): Promise<{ id: number; code: string; name: string; description: string | null }> {
  await ensureScholarshipTypesTable()
  const rows = await sql`
    INSERT INTO scholarship_types (code, name, description)
    VALUES (${input.code}, ${input.name}, ${input.description || null})
    RETURNING id, code, name, description
  `
  if (rows.length === 0) throw new Error("Failed to create scholarship type")
  return rows[0] as any
}

export async function listScholarshipsAdmin(): Promise<
  Array<{
    id: number
    type_id: number
    type_code: string
    type_name: string
    slug: string
    title: string
    tagline: string | null
    hero_image_url: string | null
    content: any
    application_fee_ugx: number
    is_active: boolean
    created_at: string
    updated_at: string
  }>
> {
  await ensureScholarshipsTable()
  await seedScholarshipsIfEmpty()

  const rows = await sql`
    SELECT
      s.id,
      s.type_id,
      t.code as type_code,
      t.name as type_name,
      s.slug,
      s.title,
      s.tagline,
      s.hero_image_url,
      s.content,
      s.application_fee_ugx,
      s.is_active,
      s.created_at,
      s.updated_at
    FROM scholarships s
    JOIN scholarship_types t ON t.id = s.type_id
    ORDER BY s.id
  `

  return rows as any
}

export async function createScholarship(input: {
  typeId: number
  slug: string
  title: string
  tagline?: string
  heroImageUrl?: string
  content?: any
  isActive?: boolean
}): Promise<{ id: number }> {
  await ensureScholarshipsTable()

  const rows = await sql`
    INSERT INTO scholarships (type_id, slug, title, tagline, hero_image_url, content, application_fee_ugx, is_active)
    VALUES (
      ${input.typeId},
      ${input.slug},
      ${input.title},
      ${input.tagline || null},
      ${input.heroImageUrl || null},
      ${JSON.stringify(input.content || {})}::jsonb,
      0,
      ${input.isActive ?? true}
    )
    RETURNING id
  `

  if (rows.length === 0) throw new Error("Failed to create scholarship")
  return rows[0] as any
}

export async function updateScholarship(input: {
  id: number
  typeId?: number
  slug?: string
  title?: string
  tagline?: string | null
  heroImageUrl?: string | null
  content?: any
  isActive?: boolean
}): Promise<{ id: number }> {
  await ensureScholarshipsTable()

  const existing = await sql`SELECT * FROM scholarships WHERE id = ${input.id} LIMIT 1`
  if (existing.length === 0) throw new Error("Scholarship not found")
  const current = existing[0] as any

  const typeId = input.typeId ?? (current.type_id as number)
  const slug = input.slug ?? (current.slug as string)
  const title = input.title ?? (current.title as string)
  const tagline = input.tagline === undefined ? (current.tagline as string | null) : input.tagline
  const heroImageUrl = input.heroImageUrl === undefined ? (current.hero_image_url as string | null) : input.heroImageUrl
  const content = input.content === undefined ? (current.content as any) : input.content
  const isActive = input.isActive === undefined ? (current.is_active as boolean) : input.isActive

  const rows = await sql`
    UPDATE scholarships
    SET
      type_id = ${typeId},
      slug = ${slug},
      title = ${title},
      tagline = ${tagline},
      hero_image_url = ${heroImageUrl},
      content = ${JSON.stringify(content)}::jsonb,
      is_active = ${isActive},
      application_fee_ugx = 0,
      updated_at = NOW()
    WHERE id = ${input.id}
    RETURNING id
  `

  if (rows.length === 0) throw new Error("Failed to update scholarship")
  return rows[0] as any
}

export { sql }
