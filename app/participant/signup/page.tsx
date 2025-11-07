"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const UGANDA_DISTRICTS = [
  "Kampala",
  "Wakiso",
  "Mukono",
  "Entebbe",
  "Mpigi",
  "Masaka",
  "Jinja",
  "Soroti",
  "Kigezi",
  "Kabale",
  "Kanungu",
  "Kisoro",
  "Bundibugyo",
  "Kasese",
  "Kabarole",
  "Kyenjojo",
  "Kibale",
  "Hoima",
  "Masindi",
  "Mubende",
  "Semliki",
  "Bunyoro",
  "Arua",
  "Nebbi",
  "Yumbe",
  "Pakwach",
  "Moyo",
  "Adjumani",
  "Gulu",
  "Lira",
  "Pader",
  "Kitgum",
  "Moroto",
  "Napak",
  "Katakwi",
  "Karenga",
  "Kaabong",
  "Kotido",
]

type Step = "guardian" | "participant"

export default function ParticipantSignup() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("guardian")
  const [guardianData, setGuardianData] = useState({
    fullName: "",
    email: "",
    relationship: "",
    occupation: "",
    address: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [participantData, setParticipantData] = useState({
    fullName: "",
    educationLevel: "Primary",
    dateOfBirth: "",
    class: "P.4",
    schoolName: "",
    district: "Kampala",
    photo: null as File | null,
    schoolIdFront: null as File | null,
    schoolIdBack: null as File | null,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGuardianChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGuardianData({
      ...guardianData,
      [e.target.name]: e.target.value,
    })
  }

  const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement
    setParticipantData({
      ...participantData,
      [name]: files ? files[0] : value,
    })
  }

  const handleGuardianSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (guardianData.password !== guardianData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (guardianData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (!guardianData.fullName || !guardianData.email || !guardianData.relationship || !guardianData.occupation) {
      setError("All fields are required")
      return
    }

    setStep("participant")
  }

  const handleParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!participantData.fullName || !participantData.schoolName) {
      setError("All fields are required")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("guardianFullName", guardianData.fullName)
      formData.append("guardianEmail", guardianData.email)
      formData.append("guardianPassword", guardianData.password)
      formData.append("relationship", guardianData.relationship)
      formData.append("occupation", guardianData.occupation)
      formData.append("address", guardianData.address)
      formData.append("phoneNumber", guardianData.phoneNumber)
      formData.append("participantFullName", participantData.fullName)
      formData.append("educationLevel", participantData.educationLevel)
      formData.append("dateOfBirth", participantData.dateOfBirth)
      formData.append("class", participantData.class)
      formData.append("schoolName", participantData.schoolName)
      formData.append("district", participantData.district)

      if (participantData.photo) formData.append("photo", participantData.photo)
      if (participantData.schoolIdFront) formData.append("schoolIdFront", participantData.schoolIdFront)
      if (participantData.schoolIdBack) formData.append("schoolIdBack", participantData.schoolIdBack)

      const response = await fetch("/api/participant/signup", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Signup failed")
        return
      }

      router.push("/participant/dashboard")
    } catch (err) {
      setError("An error occurred during signup")
      console.log("[v0] Participant signup error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getClassOptions = () => {
    switch (participantData.educationLevel) {
      case "Primary":
        return ["P.4", "P.5", "P.6", "P.7"]
      case "O-level":
        return ["S.1", "S.2", "S.3", "S.4"]
      case "A-level":
        return ["S.5", "S.6"]
      default:
        return []
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl">
            IF
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {step === "guardian" ? "Guardian Registration" : "Participant Information"}
          </h1>
          <p className="text-muted-foreground mt-2">Step {step === "guardian" ? "1" : "2"} of 2</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        {step === "guardian" ? (
          <form onSubmit={handleGuardianSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <Input
                type="text"
                name="fullName"
                value={guardianData.fullName}
                onChange={handleGuardianChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <Input
                type="email"
                name="email"
                value={guardianData.email}
                onChange={handleGuardianChange}
                placeholder="your@email.ug"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Relationship to Student</label>
              <Input
                type="text"
                name="relationship"
                value={guardianData.relationship}
                onChange={handleGuardianChange}
                placeholder="e.g., Parent, Guardian"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Occupation</label>
              <Input
                type="text"
                name="occupation"
                value={guardianData.occupation}
                onChange={handleGuardianChange}
                placeholder="Your occupation"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Address</label>
              <Input
                type="text"
                name="address"
                value={guardianData.address}
                onChange={handleGuardianChange}
                placeholder="Your address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
              <Input
                type="tel"
                name="phoneNumber"
                value={guardianData.phoneNumber}
                onChange={handleGuardianChange}
                placeholder="+256..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <Input
                type="password"
                name="password"
                value={guardianData.password}
                onChange={handleGuardianChange}
                placeholder="At least 8 characters"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                value={guardianData.confirmPassword}
                onChange={handleGuardianChange}
                placeholder="Confirm password"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Continue to Student Info
            </Button>
          </form>
        ) : (
          <form onSubmit={handleParticipantSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Student Full Name</label>
              <Input
                type="text"
                name="fullName"
                value={participantData.fullName}
                onChange={handleParticipantChange}
                placeholder="Student's full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Education Level</label>
              <select
                name="educationLevel"
                value={participantData.educationLevel}
                onChange={handleParticipantChange}
                className="w-full border border-border rounded px-3 py-2"
              >
                <option value="Primary">Primary</option>
                <option value="O-level">O-level</option>
                <option value="A-level">A-level</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Class</label>
              <select
                name="class"
                value={participantData.class}
                onChange={handleParticipantChange}
                className="w-full border border-border rounded px-3 py-2"
              >
                {getClassOptions().map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Date of Birth</label>
              <Input
                type="date"
                name="dateOfBirth"
                value={participantData.dateOfBirth}
                onChange={handleParticipantChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">School Name</label>
              <Input
                type="text"
                name="schoolName"
                value={participantData.schoolName}
                onChange={handleParticipantChange}
                placeholder="School name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">District</label>
              <select
                name="district"
                value={participantData.district}
                onChange={handleParticipantChange}
                className="w-full border border-border rounded px-3 py-2"
              >
                {UGANDA_DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button type="button" onClick={() => setStep("guardian")} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Creating..." : "Complete Registration"}
              </Button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/participant/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
