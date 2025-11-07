import { createAdmin } from "@/lib/admin-auth"
import { createAdminSession } from "@/lib/session"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Email, password, and full name required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    try {
      const admin = await createAdmin(email, password, fullName)
      await createAdminSession(admin.id, admin.email, admin.full_name)
      return NextResponse.json({ success: true, admin })
    } catch (err: any) {
      if (err.message?.includes("duplicate")) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 })
      }
      throw err
    }
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
