import { getOlympiadById } from "@/lib/olympiad"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const olympiad = await getOlympiadById(id)

    if (!olympiad) {
      return NextResponse.json({ error: "Olympiad not found" }, { status: 404 })
    }

    return NextResponse.json(olympiad)
  } catch (error) {
    console.error("[v0] Get olympiad error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
