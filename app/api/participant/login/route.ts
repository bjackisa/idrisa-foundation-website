import { loginGuardian } from "@/lib/participant-auth"
import { createParticipantSession } from "@/lib/participant-session"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const guardian = await loginGuardian(email, password)

    if (!guardian) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    await createParticipantSession(guardian.id, guardian.email, guardian.full_name)

    return NextResponse.json({ success: true, guardian })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
