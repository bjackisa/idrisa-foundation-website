"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function CreateOlympiad() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    theme: "",
    venue: "",
    startingDate: "",
    closingDate: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.theme || !formData.venue || !formData.startingDate || !formData.closingDate) {
      setError("All fields are required")
      return
    }

    const startDate = new Date(formData.startingDate)
    const endDate = new Date(formData.closingDate)

    if (startDate >= endDate) {
      setError("Starting date must be before closing date")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/admin/olympiad/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          theme: formData.theme,
          venue: formData.venue,
          startingDate: startDate.toISOString(),
          closingDate: endDate.toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create olympiad")
        return
      }

      router.push("/admin/olympiads")
    } catch (err) {
      setError("An error occurred")
      console.log("[v0] Create olympiad error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Olympiad</h1>
          <Link href="/admin/dashboard">
            <Button variant="outline" className="text-primary border-primary-foreground bg-transparent">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Create a New Olympiad</h2>

          {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Olympiad Name (e.g., The Kiryowa Olympiad)
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name your olympiad"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
              <Input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                placeholder="Olympiad theme"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Starting Date</label>
              <Input
                type="datetime-local"
                name="startingDate"
                value={formData.startingDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Closing Date (must be 3-5 months after starting date)
              </label>
              <Input
                type="datetime-local"
                name="closingDate"
                value={formData.closingDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Golden Finale Venue</label>
              <Input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Location of the final event"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800">
              <p>
                <strong>Note:</strong> The competition timeline will be automatically divided into 5 equal phases:
                Preparation, Quiz, Bronze (Theory), Silver (Practical), and Golden Finale.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Creating..." : "Create Olympiad"}
              </Button>
              <Link href="/admin/olympiads">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
