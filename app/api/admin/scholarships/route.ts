import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/session"
import {
  createScholarship,
  listScholarshipsAdmin,
  seedScholarshipsIfEmpty,
  updateScholarship,
} from "@/lib/scholarship/database"

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await seedScholarshipsIfEmpty()
    const scholarships = await listScholarshipsAdmin()
    return NextResponse.json({ scholarships })
  } catch (error) {
    console.error("[admin] scholarships list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()

    const typeId = Number(body?.typeId)
    const slug = (body?.slug || "").toString().trim()
    const title = (body?.title || "").toString().trim()
    const tagline = (body?.tagline || "").toString().trim()
    const heroImageUrl = (body?.heroImageUrl || "").toString().trim()
    const isActive = body?.isActive === undefined ? true : Boolean(body.isActive)

    let content: any = body?.content
    if (typeof content === "string") {
      try {
        content = JSON.parse(content)
      } catch {
        return NextResponse.json({ error: "Invalid JSON in content" }, { status: 400 })
      }
    }

    if (!typeId || !slug || !title) {
      return NextResponse.json({ error: "typeId, slug and title are required" }, { status: 400 })
    }

    const created = await createScholarship({
      typeId,
      slug,
      title,
      tagline: tagline || undefined,
      heroImageUrl: heroImageUrl || undefined,
      content: content || {},
      isActive,
    })

    return NextResponse.json({ success: true, scholarship: created })
  } catch (error: any) {
    const message = error?.message || "Internal server error"
    if (typeof message === "string" && message.toLowerCase().includes("duplicate")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
    }
    console.error("[admin] scholarships create error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()

    const id = Number(body?.id)
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

    let content: any = body?.content
    if (typeof content === "string") {
      try {
        content = JSON.parse(content)
      } catch {
        return NextResponse.json({ error: "Invalid JSON in content" }, { status: 400 })
      }
    }

    const updated = await updateScholarship({
      id,
      typeId: body?.typeId === undefined ? undefined : Number(body.typeId),
      slug: body?.slug,
      title: body?.title,
      tagline: body?.tagline,
      heroImageUrl: body?.heroImageUrl,
      content,
      isActive: body?.isActive,
    })

    return NextResponse.json({ success: true, scholarship: updated })
  } catch (error: any) {
    const message = error?.message || "Internal server error"
    console.error("[admin] scholarships update error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
