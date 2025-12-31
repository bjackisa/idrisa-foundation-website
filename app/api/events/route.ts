import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const events = await sql`
      SELECT * FROM events 
      WHERE is_published = true 
      AND event_date >= CURRENT_DATE
      ORDER BY event_date ASC, start_time ASC
    `
    
    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}