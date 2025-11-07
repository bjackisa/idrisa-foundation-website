"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Olympiad {
  id: string
  name: string
  theme: string
}

const SUBJECTS_BY_LEVEL: Record<string, string[]> = {
  Primary: ["Mathematics", "Integrated Science", "Computer Knowledge"],
  "O-level": ["Mathematics", "Biology", "Physics", "Chemistry", "ICT", "Agriculture"],
  "A-level": ["Physics", "Chemistry", "Mathematics", "ICT", "Biology", "Agriculture"],
}

export default function RegisterOlympiad() {
  const params = useParams()
  const router = useRouter()
  const olympiadId = params.olympiadId as string
  const studentId = params.studentId as string

  const [olympiad, setOlympiad] = useState<Olympiad | null>(null)
  const [educationLevel, setEducationLevel] = useState("Primary")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchOlympiad = async () => {
      try {
        const response = await fetch(`/api/olympiad/${olympiadId}`)
        const data = await response.json()

        if (response.ok) {
          setOlympiad(data)
          // Get student's education level
          const studentRes = await fetch(`/api/participant/student/${studentId}`)
          const studentData = await studentRes.json()
          if (studentRes.ok) {
            setEducationLevel(studentData.education_level)
          }
        }
      } catch (err) {
        console.log("[v0] Fetch olympiad error:", err)
        setError("Failed to load olympiad")
      } finally {
        setLoading(false)
      }
    }

    fetchOlympiad()
  }, [olympiadId, studentId])

  const handleSubjectToggle = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject))
    } else if (selectedSubjects.length < 2) {
      setSelectedSubjects([...selectedSubjects, subject])
    }
  }

  const handleRegister = async () => {
    setError("")

    if (selectedSubjects.length === 0) {
      setError("Please select at least one subject")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/participant/register-olympiad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          olympiadId,
          studentId,
          subjects: selectedSubjects,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        return
      }

      router.push(`/participant/student/${studentId}/competitions`)
    } catch (err) {
      setError("An error occurred during registration")
      console.log("[v0] Register olympiad error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!olympiad) {
    return <div className="text-center py-12 text-red-600">Failed to load olympiad</div>
  }

  const availableSubjects = SUBJECTS_BY_LEVEL[educationLevel] || []

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Register for Olympiad</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-2">{olympiad.name}</h2>
          <p className="text-muted-foreground mb-6">{olympiad.theme}</p>

          {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">Select Subjects (Maximum 2)</h3>
            <div className="space-y-3">
              {availableSubjects.map((subject) => (
                <label
                  key={subject}
                  className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(subject)}
                    onChange={() => handleSubjectToggle(subject)}
                    disabled={selectedSubjects.length === 2 && !selectedSubjects.includes(subject)}
                    className="w-5 h-5"
                  />
                  <span className="text-lg font-medium">{subject}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p>
              <strong>Note:</strong> You can select a maximum of 2 subjects. You will compete in these subjects across
              all phases of the olympiad.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleRegister}
              disabled={submitting || selectedSubjects.length === 0}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? "Registering..." : "Register"}
            </Button>
            <Link href={`/participant/student/${studentId}/competitions`} className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
