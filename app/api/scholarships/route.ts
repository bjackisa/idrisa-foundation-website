import { NextResponse } from "next/server"
import { getScholarships, seedScholarshipsIfEmpty } from "@/lib/scholarship/database"

export async function GET() {
  try {
    await seedScholarshipsIfEmpty()
    const scholarships = await getScholarships()

    return NextResponse.json({ scholarships })
  } catch (error) {
    console.error("[scholarships] list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
