import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const publications = await sql`
      SELECT * FROM publications 
      ORDER BY year DESC, created_at DESC
    `
    
    return NextResponse.json({ publications })
  } catch (error) {
    console.error("Error fetching publications:", error)
    return NextResponse.json({ error: "Failed to fetch publications" }, { status: 500 })
  }
}