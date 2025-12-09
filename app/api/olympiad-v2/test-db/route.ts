import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminToken } from "@/lib/admin-auth"
import { initializeAllTables, checkDatabaseStatus } from "@/lib/olympiad-v2/database"

// GET database status
export async function GET(request: Request) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const admin = await verifyAdminToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    
    // Check database status
    const status = await checkDatabaseStatus()
    
    return NextResponse.json({
      initialized: status.initialized,
      tables: status.tables
    })
  } catch (error: any) {
    console.error("Database status check error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST initialize database
export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const admin = await verifyAdminToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    
    // Initialize all tables
    const result = await initializeAllTables()
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      tables: result.tables
    })
  } catch (error: any) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
