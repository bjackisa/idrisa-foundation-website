import { NextResponse } from "next/server"
import { initializeOlympiadDatabase, checkDatabaseStatus } from "@/lib/olympiad-v2/database"

export async function POST() {
  try {
    const result = await initializeOlympiadDatabase()
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      tables: result.tables
    })
  } catch (error: any) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const status = await checkDatabaseStatus()
    
    return NextResponse.json({
      initialized: status.initialized,
      tables: status.tables
    })
  } catch (error: any) {
    console.error("Database status check error:", error)
    return NextResponse.json(
      { 
        initialized: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}
