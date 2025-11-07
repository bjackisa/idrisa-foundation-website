import { neon } from "@neondatabase/serverless"
import { submitExamAnswers } from "@/lib/exams"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { olympiadId: string; studentId: string } }) {
  try {
    const { olympiadId, studentId } = params
    const { answers } = await request.json()

    // Get the exam attempt
    const attempts = (await sql`
      SELECT * FROM exam_attempts
      WHERE participant_id = ${studentId} AND olympiad_id = ${olympiadId}
      ORDER BY created_at DESC
      LIMIT 1
    `) as any

    if (!attempts || attempts.length === 0) {
      return NextResponse.json({ error: "Exam attempt not found" }, { status: 404 })
    }

    const attemptId = attempts[0].id

    // Get correct answers from questions
    const questionIds = Object.keys(answers)
    const correctAnswersData = await sql`
      SELECT id, correct_option FROM questions WHERE id = ANY($1::uuid[])
    `,
      [questionIds]

    const correctAnswers: Record<string, number> = {}
    correctAnswersData.forEach((q: any) => {
      correctAnswers[q.id] = q.correct_option
    })

    // Calculate and save score
    const score = await submitExamAnswers(attemptId, answers, correctAnswers)

    return NextResponse.json({ success: true, score })
  } catch (error) {
    console.error("[v0] Submit exam error:", error)
    return NextResponse.json({ error: "Failed to submit exam" }, { status: 500 })
  }
}
