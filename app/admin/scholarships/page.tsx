"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type ScholarshipType = {
  id: number
  code: string
  name: string
  description: string | null
}

type Scholarship = {
  id: number
  type_id: number
  type_code: string
  type_name: string
  slug: string
  title: string
  tagline: string | null
  hero_image_url: string | null
  content: any
  application_fee_ugx: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function AdminScholarshipsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [types, setTypes] = useState<ScholarshipType[]>([])
  const [items, setItems] = useState<Scholarship[]>([])

  const [createForm, setCreateForm] = useState({
    typeId: "",
    slug: "",
    title: "",
    tagline: "",
    heroImageUrl: "",
    isActive: true,
    contentJson: "{\n  \"hero\": {\n    \"title\": \"\",\n    \"tagline\": \"\"\n  }\n}\n",
  })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const [typesRes, itemsRes] = await Promise.all([
        fetch("/api/admin/scholarship-types", { cache: "no-store" }),
        fetch("/api/admin/scholarships", { cache: "no-store" }),
      ])

      const typesJson = await typesRes.json()
      const itemsJson = await itemsRes.json()

      if (!typesRes.ok) {
        setError(typesJson?.error || "Failed to load scholarship types")
        return
      }
      if (!itemsRes.ok) {
        setError(itemsJson?.error || "Failed to load scholarships")
        return
      }

      setTypes(typesJson.types || [])
      setItems(itemsJson.scholarships || [])
    } catch {
      setError("Failed to load scholarships")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const typeOptions = useMemo(() => types.map((t) => ({ value: String(t.id), label: `${t.name} (${t.code})` })), [types])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const payload: any = {
        typeId: Number(createForm.typeId),
        slug: createForm.slug,
        title: createForm.title,
        tagline: createForm.tagline,
        heroImageUrl: createForm.heroImageUrl,
        isActive: createForm.isActive,
        content: createForm.contentJson,
      }

      const res = await fetch("/api/admin/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json?.error || "Failed to create scholarship")
        return
      }

      setCreateForm({
        typeId: "",
        slug: "",
        title: "",
        tagline: "",
        heroImageUrl: "",
        isActive: true,
        contentJson: "{\n  \"hero\": {\n    \"title\": \"\",\n    \"tagline\": \"\"\n  }\n}\n",
      })

      await load()
    } catch {
      setError("Failed to create scholarship")
    } finally {
      setSaving(false)
    }
  }

  const onToggleActive = async (s: Scholarship) => {
    setError("")
    try {
      const res = await fetch("/api/admin/scholarships", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, isActive: !s.is_active }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json?.error || "Failed to update scholarship")
        return
      }
      await load()
    } catch {
      setError("Failed to update scholarship")
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Dashboard
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-bold">Scholarships</h1>
            <p className="text-muted-foreground">Manage named scholarships and their public gateway content.</p>
          </div>
          <Link href="/admin/scholarships/types">
            <Button variant="outline">Manage Types</Button>
          </Link>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Add a Named Scholarship</h2>
        <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={createForm.typeId}
              onChange={(e) => setCreateForm({ ...createForm, typeId: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              required
            >
              <option value="">Select type</option>
              {typeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              value={createForm.slug}
              onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              placeholder="the-vijaya-kumari-scholarship"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              placeholder="The Vijaya Kumari Scholarship"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tagline</label>
            <input
              value={createForm.tagline}
              onChange={(e) => setCreateForm({ ...createForm, tagline: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              placeholder="A single powerful line"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hero Image URL (optional)</label>
            <input
              value={createForm.heroImageUrl}
              onChange={(e) => setCreateForm({ ...createForm, heroImageUrl: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background"
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={createForm.isActive}
              onChange={(e) => setCreateForm({ ...createForm, isActive: e.target.checked })}
            />
            <span className="text-sm">Active</span>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Content JSON (gateway page)</label>
            <textarea
              value={createForm.contentJson}
              onChange={(e) => setCreateForm({ ...createForm, contentJson: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background min-h-[200px] font-mono text-xs"
            />
          </div>
          <div className="md:col-span-2">
            <Button disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? "Saving…" : "Create Scholarship"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Existing Scholarships</h2>
          <Button variant="outline" onClick={load} disabled={loading}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="p-6 text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-muted-foreground">No scholarships found.</div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((s) => (
              <div key={s.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{s.title}</div>
                    <div className="text-sm text-muted-foreground">Type: {s.type_name}</div>
                    <div className="text-sm text-muted-foreground">Slug: {s.slug}</div>
                    {s.tagline && <div className="text-sm text-muted-foreground mt-2">{s.tagline}</div>}
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Link href={`/scholarship/${encodeURIComponent(s.slug)}`}>
                        <Button size="sm" variant="outline">View Public Page</Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => onToggleActive(s)}>
                        {s.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">ID: {s.id}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
