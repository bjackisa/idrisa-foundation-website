import { NextResponse } from "next/server"
import {
  createScholarshipApplicant,
  createScholarshipApplication,
  getScholarshipIdByTypeCode,
  getScholarshipBySlug,
  seedScholarshipsIfEmpty,
} from "@/lib/scholarship/database"

function mapLegacyTypeToTypeCode(type: string): string {
  if (type === "full" || type === "full-tuition" || type === "full-scholarship") return "FULL"
  if (type === "partial" || type === "partial-scholarship") return "PARTIAL"
  if (type === "grant" || type === "grants") return "GRANT"
  if (type === "excellence") return "GRANT"
  return "FULL"
}

export async function POST(request: Request) {
  try {
    await seedScholarshipsIfEmpty()

    const formData = await request.formData()

    const fullName = (formData.get("fullName") as string) || ""
    const email = (formData.get("email") as string) || ""
    const phoneNumber = (formData.get("phoneNumber") as string) || undefined
    const dateOfBirth = (formData.get("dateOfBirth") as string) || undefined
    const gender = (formData.get("gender") as string) || undefined
    const address = (formData.get("address") as string) || undefined
    const district = (formData.get("district") as string) || undefined
    const nationalId = (formData.get("nationalId") as string) || undefined
    const password = (formData.get("password") as string) || ""

    const scholarshipSlug = (formData.get("scholarshipSlug") as string) || ""
    const scholarshipType = (formData.get("scholarshipType") as string) || ""

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let scholarshipId: number | null = null

    if (scholarshipSlug) {
      const found = await getScholarshipBySlug(scholarshipSlug)
      scholarshipId = found?.id ?? null
    }

    if (!scholarshipId) {
      const typeCode = mapLegacyTypeToTypeCode(scholarshipType)
      scholarshipId = await getScholarshipIdByTypeCode(typeCode)
    }

    if (!scholarshipId) {
      return NextResponse.json({ error: "Scholarship not found" }, { status: 404 })
    }

    const applicant = await createScholarshipApplicant({
      fullName,
      email,
      phoneNumber,
      password,
      dateOfBirth,
      gender,
      address,
      district,
      nationalId,
    })

    const allEntries = Array.from(formData.entries())
    const data: Record<string, any> = {}
    for (const [k, v] of allEntries) {
      if (k === "password" || k === "confirmPassword") continue
      data[k] = v
    }

    const application = await createScholarshipApplication({
      applicantId: applicant.id,
      scholarshipId,
      data,
    })

    return NextResponse.json({ success: true, applicant, application, applicationFeeUgx: 0 })
  } catch (error: any) {
    const message = error?.message || "Internal server error"

    if (typeof message === "string" && message.toLowerCase().includes("duplicate")) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    console.error("[scholarship] signup error:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
