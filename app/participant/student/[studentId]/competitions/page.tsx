"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Olympiad {
  id: string
  name: string
  theme: string
  starting_date: string
  closing_date: string
}

interface Registration {
  id: string
  olympiad_id: string
  selected_subjects: string[]
  current_phase: string
  is_eliminated: boolean
}

export default function StudentCompetitions() {
  const params = useParams()
  const studentId = params.studentId as string
  const [olympiads, setOlympiads] = useState<Olympiad[]>([])
  const [registrations, setRegistrations] = useState<Record<string, Registration>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available olympiads
        const olympRes = await fetch("/api/olympiad/list")
        if (olympRes.ok) {
          setOlympiads(await olympRes.json())
        }

        // Fetch student registrations
        const regRes = await fetch(`/api/participant/student/${studentId}/registrations`)
        if (regRes.ok) {
          const regs = await regRes.json()
          const regMap: Record<string, Registration> = {}
          regs.forEach((reg: any) => {
            regMap[reg.olympiad_id] = reg
          })
          setRegistrations(regMap)
        }
      } catch (err) {
        console.log("[v0] Fetch competitions error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [studentId])

  if (loading) {
    return <div className="text-center py-12">Loading competitions...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Available Competitions</h1>
          <Link href="/participant/dashboard">
            <Button variant="outline" className="text-primary border-primary-foreground bg-transparent">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {olympiads.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-4">No competitions available yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {olympiads.map((olympiad) => {
              const reg = registrations[olympiad.id]
              return (
                <div key={olympiad.id} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-2xl font-bold mb-2">{olympiad.name}</h3>
                  <p className="text-muted-foreground mb-4">{olympiad.theme}</p>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      {new Date(olympiad.starting_date).toLocaleDateString()} -{" "}
                      {new Date(olympiad.closing_date).toLocaleDateString()}
                    </p>
                  </div>

                  {reg ? (
                    <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                      <p className="text-sm mb-2">
                        <strong>Status:</strong> {reg.is_eliminated ? "Eliminated" : `Phase: ${reg.current_phase}`}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Subjects:</strong> {reg.selected_subjects.join(", ")}
                      </p>
                      {!reg.is_eliminated && (
                        <Link href={`/participant/competition/${olympiad.id}/student/${studentId}`}>
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            Take Exam
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <Link href={`/participant/register-olympiad/${olympiad.id}/${studentId}`}>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Register for This Olympiad
                      </Button>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
