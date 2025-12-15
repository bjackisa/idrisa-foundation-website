import { NextResponse } from "next/server"
import { getScholarshipBySlug, seedScholarshipsIfEmpty } from "@/lib/scholarship/database"

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    await seedScholarshipsIfEmpty()
    const scholarship = await getScholarshipBySlug(slug)

    if (!scholarship) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ scholarship })
  } catch (error) {
    console.error("[scholarships] get error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
