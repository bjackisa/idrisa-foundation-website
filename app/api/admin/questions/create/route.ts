import { getAdminSession } from "@/lib/session"
import { createQuestion } from "@/lib/questions"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { subject, educationLevel, questionType, hardness, questionText, options, correctOption } =
      await request.json()

    if (
      !subject ||
      !educationLevel ||
      !questionType ||
      !hardness ||
      !questionText ||
      !options ||
      correctOption === undefined
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const question = await createQuestion(
      session.adminId,
      subject,
      educationLevel,
      questionType,
      hardness,
      questionText,
      options,
      correctOption,
    )

    return NextResponse.json({ success: true, question })
  } catch (error) {
    console.error("[v0] Create question error:", error)
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
  }
}
