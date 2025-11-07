import { getAdminSession } from "@/lib/session"
import { deleteQuestion } from "@/lib/questions"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    await deleteQuestion(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete question error:", error)
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 })
  }
}
