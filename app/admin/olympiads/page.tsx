"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Olympiad {
  id: string
  name: string
  theme: string
  starting_date: string
  closing_date: string
  venue: string
  created_at: string
}

export default function OlympiadsManagement() {
  const [olympiads, setOlympiads] = useState<Olympiad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOlympiads = async () => {
      try {
        const response = await fetch("/api/admin/olympiads")
        const data = await response.json()

        if (response.ok) {
          setOlympiads(data.olympiads)
        }
      } catch (err) {
        console.log("[v0] Fetch olympiads error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOlympiads()
  }, [])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Olympiads</h1>
          <div className="flex gap-2">
            <Link href="/admin/olympiad/create">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Create Olympiad</Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant="outline" className="text-primary border-primary-foreground bg-transparent">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading olympiads...</p>
          </div>
        ) : olympiads.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No olympiads yet</p>
            <Link href="/admin/olympiad/create">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Your First Olympiad
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {olympiads.map((olympiad) => (
              <Link key={olympiad.id} href={`/admin/olympiad/${olympiad.id}`}>
                <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
                  <h3 className="text-2xl font-bold mb-2">{olympiad.name}</h3>
                  <p className="text-muted-foreground mb-4">{olympiad.theme}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">Starting Date</p>
                      <p className="text-muted-foreground">{formatDate(olympiad.starting_date)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Closing Date</p>
                      <p className="text-muted-foreground">{formatDate(olympiad.closing_date)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Venue</p>
                      <p className="text-muted-foreground">{olympiad.venue}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Created</p>
                      <p className="text-muted-foreground">{formatDate(olympiad.created_at)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
