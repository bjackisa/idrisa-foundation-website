import { getAdminSession } from "@/lib/session"
import { createOlympiad } from "@/lib/olympiad"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { name, theme, venue, startingDate, closingDate } = await request.json()

    if (!name || !theme || !venue || !startingDate || !closingDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const olympiad = await createOlympiad(
      session.adminId,
      name,
      theme,
      new Date(startingDate),
      new Date(closingDate),
      venue,
    )

    return NextResponse.json({ success: true, olympiad })
  } catch (error: any) {
    console.error("[v0] Create olympiad error:", error)
    return NextResponse.json({ error: error.message || "Failed to create olympiad" }, { status: 500 })
  }
}
