import { getAdminSession } from "@/lib/session"
import { getOlympiadsByAdmin } from "@/lib/olympiad"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const olympiads = await getOlympiadsByAdmin(session.adminId)
    return NextResponse.json({ olympiads })
  } catch (error) {
    console.error("[v0] Get olympiads error:", error)
    return NextResponse.json({ error: "Failed to fetch olympiads" }, { status: 500 })
  }
}
