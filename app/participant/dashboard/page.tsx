"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Participant {
  id: string
  full_name: string
  education_level: string
  school_name: string
}

interface OlympiadReg {
  id: string
  olympiad_id: string
  olympiad_name: string
  selected_subjects: string[]
  current_phase: string
  is_eliminated: boolean
}

export default function ParticipantDashboard() {
  const router = useRouter()
  const [guardian, setGuardian] = useState<any>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [registrations, setRegistrations] = useState<OlympiadReg[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/participant/session")
        const data = await response.json()

        if (!response.ok || !data.guardian) {
          router.push("/participant/login")
          return
        }

        setGuardian(data.guardian)

        // Fetch participants and registrations
        const participantsRes = await fetch("/api/participant/participants")
        const regRes = await fetch("/api/participant/registrations")

        if (participantsRes.ok) {
          setParticipants(await participantsRes.json())
        }
        if (regRes.ok) {
          setRegistrations(await regRes.json())
        }
      } catch (err) {
        console.log("[v0] Session check error:", err)
        router.push("/participant/login")
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/participant/logout", { method: "POST" })
      router.push("/participant/login")
    } catch (err) {
      console.log("[v0] Logout error:", err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Participant Dashboard</h1>
            <p className="text-sm text-primary-foreground/80">The Idrisa Foundation</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold">{guardian?.fullName}</p>
              <p className="text-sm text-primary-foreground/80">{guardian?.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-primary border-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Welcome, {guardian?.fullName}!</h2>
          <p className="text-muted-foreground">Manage your children's olympiad registrations</p>
        </div>

        {/* Participants Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Your Students</h3>
            <Link href="/participant/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Register New Student</Button>
            </Link>
          </div>

          {participants.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">No students registered yet</p>
              <Link href="/participant/register">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Register First Student
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {participants.map((participant) => (
                <div key={participant.id} className="bg-card border border-border rounded-lg p-6">
                  <h4 className="text-xl font-bold mb-2">{participant.full_name}</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Level:</strong> {participant.education_level}
                    </p>
                    <p>
                      <strong>School:</strong> {participant.school_name}
                    </p>
                  </div>
                  <Link href={`/participant/student/${participant.id}/competitions`}>
                    <Button variant="outline" className="mt-4 w-full bg-transparent">
                      View Competitions
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Competitions */}
        {registrations.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Active Competitions</h3>
            <div className="space-y-4">
              {registrations
                .filter((reg) => !reg.is_eliminated)
                .map((reg) => (
                  <div key={reg.id} className="bg-card border border-border rounded-lg p-6">
                    <h4 className="text-lg font-bold mb-2">{reg.olympiad_name}</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Current Phase:</strong> {reg.current_phase}
                      </p>
                      <p>
                        <strong>Subjects:</strong> {reg.selected_subjects.join(", ")}
                      </p>
                    </div>
                    <Link href={`/participant/competition/${reg.olympiad_id}`}>
                      <Button variant="outline" className="mt-4 bg-transparent">
                        View Details
                      </Button>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
