import { loginAdmin } from "@/lib/admin-auth"
import { createAdminSession } from "@/lib/session"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const admin = await loginAdmin(email, password)

    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    await createAdminSession(admin.id, admin.email, admin.full_name)

    return NextResponse.json({ success: true, admin })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
