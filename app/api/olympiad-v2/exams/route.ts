import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminToken } from "@/lib/admin-auth"
import { createExamConfig } from "@/lib/olympiad-v2/exams"
import { sql, ensureExamConfigsTable } from "@/lib/olympiad-v2/database"

// GET exam configs for a stage
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await verifyAdminToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Ensure tables exist
    await ensureExamConfigsTable()
    
    const { searchParams } = new URL(request.url)
    const stageId = searchParams.get("stageId")
    const editionId = searchParams.get("editionId")

    // Build query parameters
    let whereClause = ''
    const params: any[] = []
    
    if (stageId) {
      whereClause += ' AND ec.stage = $1'
      params.push(stageId)
    }
    
    if (editionId) {
      whereClause += ` AND ec.edition_id = $${params.length + 1}`
      params.push(editionId)
    }

    // Execute query with proper SQL template
    const examConfigs = await sql.query(
      `SELECT 
        ec.*,
        oe.name as edition_name,
        (SELECT COUNT(*) FROM exam_questions WHERE exam_config_id = ec.id) as question_count
      FROM exam_configs ec
      JOIN olympiad_editions oe ON ec.edition_id = oe.id
      WHERE 1=1 ${whereClause}
      ORDER BY ec.stage, ec.education_level`,
      params
    )

    return NextResponse.json({ examConfigs })
  } catch (error: any) {
    console.error("Get exam configs error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST create exam config
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await verifyAdminToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Ensure tables exist
    await ensureExamConfigsTable()
    
    const body = await request.json()
    const { 
      edition_id, 
      stage, 
      education_level, 
      subject,
      duration_minutes, 
      start_datetime,
      end_datetime,
      question_ids 
    } = body

    if (!edition_id || !stage || !education_level || !subject || !duration_minutes || !start_datetime || !end_datetime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const examConfig = await createExamConfig({
      edition_id,
      stage,
      education_level,
      subject,
      duration_minutes,
      start_datetime,
      end_datetime,
      question_ids: question_ids || [],
      randomize_questions: body.randomize_questions,
      randomize_options: body.randomize_options,
      show_score_immediately: body.show_score_immediately,
      score_release_datetime: body.score_release_datetime
    })

    return NextResponse.json({ examConfig }, { status: 201 })
  } catch (error: any) {
    console.error("Create exam config error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE exam config
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await verifyAdminToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Ensure tables exist
    await ensureExamConfigsTable()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Exam config ID required" }, { status: 400 })
    }

    // Check if there are any attempts for this exam
    const attemptsResult = await sql.query(
      "SELECT COUNT(*) as count FROM exam_attempts_v2 WHERE exam_config_id = $1",
      [id]
    )
    
    if (attemptsResult[0].count > 0) {
      return NextResponse.json({ 
        error: "Cannot delete exam config with existing attempts" 
      }, { status: 400 })
    }
    
    await sql`DELETE FROM exam_configs WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete exam config error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
