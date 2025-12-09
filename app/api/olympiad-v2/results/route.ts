import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminToken } from "@/lib/admin-auth"
import { 
  calculateRankings, 
  getLeaderboard,
  getParticipantRanking
} from "@/lib/olympiad-v2/results"
import { ensureRankingsTable } from "@/lib/olympiad-v2/database"
import type { EducationLevel, StageName } from "@/lib/olympiad-v2/types"

// GET leaderboard or participant ranking
export async function GET(request: Request) {
  try {
    // Ensure tables exist
    await ensureRankingsTable()
    
    const { searchParams } = new URL(request.url)
    const editionId = searchParams.get("editionId")
    const educationLevel = searchParams.get("educationLevel") as EducationLevel
    const subject = searchParams.get("subject")
    const stage = searchParams.get("stage") as StageName
    const participantId = searchParams.get("participantId")
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10
    
    // Validate required parameters
    if (!editionId || !educationLevel || !subject || !stage) {
      return NextResponse.json({ 
        error: "Missing required parameters: editionId, educationLevel, subject, stage" 
      }, { status: 400 })
    }
    
    // Get participant ranking if participantId is provided
    if (participantId) {
      const ranking = await getParticipantRanking(participantId, subject, stage)
      return NextResponse.json({ ranking })
    }
    
    // Get leaderboard
    const leaderboard = await getLeaderboard(editionId, educationLevel, subject, stage, limit)
    return NextResponse.json({ leaderboard })
  } catch (error: any) {
    console.error("Get results error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST calculate rankings
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
    
    // Ensure tables exist
    await ensureRankingsTable()
    
    const body = await request.json()
    const { editionId, educationLevel, subject, stage } = body
    
    // Validate required fields
    if (!editionId || !educationLevel || !subject || !stage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    // Calculate rankings
    const rankings = await calculateRankings(
      editionId, 
      educationLevel as EducationLevel, 
      subject, 
      stage as StageName
    )
    
    return NextResponse.json({ 
      success: true, 
      rankings,
      message: `Calculated ${rankings.length} rankings for ${subject} ${stage}`
    })
  } catch (error: any) {
    console.error("Calculate rankings error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
