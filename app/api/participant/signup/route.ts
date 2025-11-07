import { createGuardian, createParticipant } from "@/lib/participant-auth"
import { createParticipantSession } from "@/lib/participant-session"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const guardianFullName = formData.get("guardianFullName") as string
    const guardianEmail = formData.get("guardianEmail") as string
    const guardianPassword = formData.get("guardianPassword") as string
    const relationship = formData.get("relationship") as string
    const occupation = formData.get("occupation") as string
    const address = formData.get("address") as string
    const phoneNumber = formData.get("phoneNumber") as string

    const participantFullName = formData.get("participantFullName") as string
    const educationLevel = formData.get("educationLevel") as "Primary" | "O-level" | "A-level"
    const dateOfBirth = formData.get("dateOfBirth") as string
    const studentClass = formData.get("class") as string
    const schoolName = formData.get("schoolName") as string
    const district = formData.get("district") as string

    if (!guardianFullName || !guardianEmail || !guardianPassword || !participantFullName || !schoolName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      const guardian = await createGuardian(
        guardianEmail,
        guardianPassword,
        guardianFullName,
        relationship,
        occupation,
        address,
        phoneNumber,
      )

      const participant = await createParticipant(
        guardian.id,
        participantFullName,
        educationLevel,
        new Date(dateOfBirth),
        studentClass,
        schoolName,
        district,
      )

      await createParticipantSession(guardian.id, guardian.email, guardian.full_name)

      return NextResponse.json({ success: true, guardian, participant })
    } catch (err: any) {
      if (err.message?.includes("duplicate")) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 })
      }
      return NextResponse.json({ error: err.message || "Registration failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
