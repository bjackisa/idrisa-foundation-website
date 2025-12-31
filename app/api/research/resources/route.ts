import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

export async function GET() {
  if (!sql) {
    return NextResponse.json({ resources: [] })
  }
  
  try {
    const resources = await sql`
      SELECT * FROM featured_resources 
      WHERE is_active = true 
      ORDER BY display_order ASC
    `
    
    return NextResponse.json({ resources })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}