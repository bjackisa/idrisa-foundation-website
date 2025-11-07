import { getAdminSession } from "@/lib/session"
import { getAdminById } from "@/lib/admin-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()

    if (!session) {
      return NextResponse.json({ error: "No session" }, { status: 401 })
    }

    const admin = await getAdminById(session.adminId)

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({ admin })
  } catch (error) {
    console.error("[v0] Session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
