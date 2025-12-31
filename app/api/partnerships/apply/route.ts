import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

function generateRequestId(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `PAR-${dateStr}-${randomNum}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      organizationName,
      contactPerson,
      contactTitle,
      email,
      phone,
      country,
      city,
      partnershipTier,
      description,
      estimatedCommitment
    } = body

    const requestId = generateRequestId()

    await sql`
      INSERT INTO partnerships (
        request_id, organization_name, contact_person, contact_title,
        email, phone, country, city, partnership_tier, description, estimated_commitment
      ) VALUES (
        ${requestId}, ${organizationName}, ${contactPerson}, ${contactTitle || null},
        ${email}, ${phone}, ${country}, ${city}, ${partnershipTier}, ${description}, ${estimatedCommitment || null}
      )
    `

    return NextResponse.json({ 
      success: true, 
      requestId,
      message: "Partnership request submitted successfully" 
    })
  } catch (error) {
    console.error("Error creating partnership:", error)
    return NextResponse.json({ error: "Failed to submit partnership request" }, { status: 500 })
  }
}