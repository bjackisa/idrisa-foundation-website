import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

function generateDonationId(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `IDF-${dateStr}-${randomNum}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      fullName,
      email,
      phone,
      country,
      cause,
      amount,
      currency,
      frequency,
      paymentDate,
      message
    } = body

    const donationId = generateDonationId()

    await sql`
      INSERT INTO donations (
        donation_id, full_name, email, phone, country, cause, 
        amount, currency, frequency, preferred_payment_date, message
      ) VALUES (
        ${donationId}, ${fullName}, ${email}, ${phone}, ${country}, ${cause},
        ${amount}, ${currency}, ${frequency}, ${paymentDate || null}, ${message || null}
      )
    `

    return NextResponse.json({ 
      success: true, 
      donationId,
      message: "Pledge recorded successfully" 
    })
  } catch (error) {
    console.error("Error creating donation:", error)
    return NextResponse.json({ error: "Failed to record pledge" }, { status: 500 })
  }
}