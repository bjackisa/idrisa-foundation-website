import { getAdminSession } from "@/lib/session"
import { getQuestionsByFilters } from "@/lib/questions"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject") || undefined
    const educationLevel = searchParams.get("educationLevel") || undefined
    const questionType = searchParams.get("questionType") || undefined

    const questions = await getQuestionsByFilters(session.adminId, subject, educationLevel, questionType)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("[v0] Get questions error:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}
