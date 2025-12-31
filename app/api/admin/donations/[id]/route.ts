import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, payment_reference } = body
    const id = parseInt(params.id)

    await sql`
      UPDATE donations 
      SET status = ${status}, 
          payment_reference = ${payment_reference || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating donation:", error)
    return NextResponse.json({ error: "Failed to update donation" }, { status: 500 })
  }
}