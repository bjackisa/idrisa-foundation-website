import { getParticipantSession } from "@/lib/participant-session"
import { getGuardianById } from "@/lib/participant-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getParticipantSession()

    if (!session) {
      return NextResponse.json({ error: "No session" }, { status: 401 })
    }

    const guardian = await getGuardianById(session.guardianId)

    if (!guardian) {
      return NextResponse.json({ error: "Guardian not found" }, { status: 404 })
    }

    return NextResponse.json({ guardian })
  } catch (error) {
    console.error("[v0] Session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
