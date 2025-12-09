import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminToken } from "@/lib/admin-auth"
import { 
  startExamAttempt, 
  submitExam, 
  getExamAttempt,
  getExamQuestions,
  saveExamAnswers
} from "@/lib/olympiad-v2/exams"
import { ensureExamAttemptsTable } from "@/lib/olympiad-v2/database"

// GET exam attempt
export async function GET(request: Request) {
  try {
    // Ensure tables exist
    await ensureExamAttemptsTable()
    
    const { searchParams } = new URL(request.url)
    const attemptId = searchParams.get("attemptId")
    const includeQuestions = searchParams.get("includeQuestions") === "true"
    
    if (!attemptId) {
      return NextResponse.json({ error: "Attempt ID required" }, { status: 400 })
    }
    
    const attempt = await getExamAttempt(attemptId)
    
    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 })
    }
    
    let questions = null
    if (includeQuestions) {
      questions = await getExamQuestions(attempt.exam_config_id)
    }
    
    return NextResponse.json({ 
      attempt,
      questions: questions || undefined
    })
  } catch (error: any) {
    console.error("Get exam attempt error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST start exam attempt
export async function POST(request: Request) {
  try {
    // Ensure tables exist
    await ensureExamAttemptsTable()
    
    const body = await request.json()
    const { participant_id, exam_config_id } = body
    
    if (!participant_id || !exam_config_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    const attempt = await startExamAttempt(participant_id, exam_config_id)
    
    return NextResponse.json({ attempt }, { status: 201 })
  } catch (error: any) {
    console.error("Start exam attempt error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT save or submit exam
export async function PUT(request: Request) {
  try {
    // Ensure tables exist
    await ensureExamAttemptsTable()
    
    const body = await request.json()
    const { attempt_id, answers, action } = body
    
    if (!attempt_id || !answers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    if (action === "submit") {
      const result = await submitExam(attempt_id, answers)
      return NextResponse.json({ 
        success: true, 
        attempt: result,
        message: "Exam submitted successfully" 
      })
    } else {
      // Just save answers without submitting
      await saveExamAnswers(attempt_id, answers)
      return NextResponse.json({ 
        success: true,
        message: "Answers saved" 
      })
    }
  } catch (error: any) {
    console.error("Save/submit exam error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
