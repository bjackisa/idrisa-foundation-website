"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type ScholarshipType = {
  id: number
  code: string
  name: string
  description: string | null
}

export default function AdminScholarshipTypesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [types, setTypes] = useState<ScholarshipType[]>([])

  const [form, setForm] = useState({ code: "", name: "", description: "" })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/scholarship-types", { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error || "Failed to load scholarship types")
        return
      }
      setTypes(json.types || [])
    } catch {
      setError("Failed to load scholarship types")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/admin/scholarship-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          name: form.name,
          description: form.description,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error || "Failed to create scholarship type")
        return
      }
      setForm({ code: "", name: "", description: "" })
      await load()
    } catch {
      setError("Failed to create scholarship type")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-2">Scholarship Types</h1>
        <p className="text-muted-foreground">Manage the scholarship categories shown on the portal.</p>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Add a Scholarship Type</h2>
        <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              placeholder="FULL"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              placeholder="Full Scholarships"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              placeholder="Short description"
            />
          </div>
          <div className="md:col-span-3">
            <Button disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? "Saving…" : "Create Type"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Existing Types</h2>
          <Button variant="outline" onClick={load} disabled={loading}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="p-6 text-muted-foreground">Loading…</div>
        ) : types.length === 0 ? (
          <div className="p-6 text-muted-foreground">No scholarship types found.</div>
        ) : (
          <div className="divide-y divide-border">
            {types.map((t) => (
              <div key={t.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-foreground">{t.name}</div>
                    <div className="text-sm text-muted-foreground">Code: {t.code}</div>
                    {t.description && <div className="text-sm text-muted-foreground mt-2">{t.description}</div>}
                  </div>
                  <div className="text-sm text-muted-foreground">ID: {t.id}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
