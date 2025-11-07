import { getParticipantSession } from "@/lib/participant-session"
import { getParticipantsByGuardian } from "@/lib/participant-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getParticipantSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const participants = await getParticipantsByGuardian(session.guardianId)
    return NextResponse.json(participants)
  } catch (error) {
    console.error("[v0] Fetch participants error:", error)
    return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 })
  }
}
