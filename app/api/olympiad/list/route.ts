import { getAllOlympiaads } from "@/lib/olympiad"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const olympiads = await getAllOlympiaads()
    return NextResponse.json(olympiads)
  } catch (error) {
    console.error("[v0] Get olympiads error:", error)
    return NextResponse.json({ error: "Failed to fetch olympiads" }, { status: 500 })
  }
}
