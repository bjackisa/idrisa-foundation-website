import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/session"
import { createScholarshipType, listScholarshipTypes, seedScholarshipsIfEmpty } from "@/lib/scholarship/database"

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await seedScholarshipsIfEmpty()
    const types = await listScholarshipTypes()
    return NextResponse.json({ types })
  } catch (error) {
    console.error("[admin] scholarship types list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const code = (body?.code || "").toString().trim().toUpperCase()
    const name = (body?.name || "").toString().trim()
    const description = (body?.description || "").toString().trim()

    if (!code || !name) {
      return NextResponse.json({ error: "Code and name are required" }, { status: 400 })
    }

    const created = await createScholarshipType({ code, name, description: description || undefined })
    return NextResponse.json({ success: true, type: created })
  } catch (error: any) {
    const message = error?.message || "Internal server error"
    if (typeof message === "string" && message.toLowerCase().includes("duplicate")) {
      return NextResponse.json({ error: "Type code already exists" }, { status: 409 })
    }
    console.error("[admin] scholarship types create error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
