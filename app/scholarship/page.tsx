"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, GraduationCap, DollarSign, Award, BookOpen } from "lucide-react"

type ScholarshipListItem = {
  id: number
  type_code: string
  type_name: string
  slug: string
  title: string
  tagline: string | null
  application_fee_ugx: number
  is_active: boolean
}

export default function ScholarshipPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [items, setItems] = useState<ScholarshipListItem[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/scholarships", { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) {
          setError(json?.error || "Failed to load scholarships")
          return
        }
        setItems((json?.scholarships || []).filter((s: ScholarshipListItem) => s.is_active))
      } catch {
        setError("Failed to load scholarships")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const grouped = useMemo(() => {
    const map = new Map<string, { typeName: string; items: ScholarshipListItem[] }>()
    for (const s of items) {
      const key = s.type_code
      if (!map.has(key)) map.set(key, { typeName: s.type_name, items: [] })
      map.get(key)!.items.push(s)
    }
    return Array.from(map.entries()).map(([code, v]) => ({ code, ...v }))
  }, [items])

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-6">
              <GraduationCap className="w-16 h-16 mx-auto text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Scholarship Programs
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
              Financial support and educational opportunities for talented Ugandan students pursuing STEM education.
              Our scholarships make quality education accessible to deserving students across Uganda.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="#available-scholarships">
                <Button size="lg" className="bg-background text-primary hover:bg-muted">
                  Explore Scholarships <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/programs">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  View All Programs
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Scholarships */}
        <section id="available-scholarships" className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Available Scholarship Opportunities
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose a named scholarship to view its purpose, eligibility criteria, and application steps.
              </p>
            </div>

            {loading && <p className="text-muted-foreground text-center">Loading scholarships…</p>}
            {!loading && error && <p className="text-destructive text-center">{error}</p>}

            {!loading && !error && grouped.length > 0 && (
              <div className="space-y-12">
                {grouped.map((group) => (
                  <div key={group.code}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-foreground">{group.typeName}</h3>
                      <div className="text-sm text-muted-foreground">Application fee: UGX 0</div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {group.items.map((s) => (
                        <div key={s.id} className="bg-card border border-border rounded-2xl p-8 card-hover">
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                            {group.code === "FULL" ? (
                              <DollarSign className="w-7 h-7 text-primary" />
                            ) : group.code === "PARTIAL" ? (
                              <BookOpen className="w-7 h-7 text-primary" />
                            ) : (
                              <Award className="w-7 h-7 text-primary" />
                            )}
                          </div>
                          <h4 className="text-xl font-bold mb-2 text-foreground">{s.title}</h4>
                          <p className="text-muted-foreground mb-6">{s.tagline || "View details, eligibility, and how to apply."}</p>
                          <Link href={`/scholarship/${encodeURIComponent(s.slug)}`}>
                            <Button className="w-full">View Scholarship</Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Eligibility */}
        <section className="py-20 px-4 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Eligibility Criteria
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our scholarships are designed to support talented Ugandan students who demonstrate 
                academic potential and financial need.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-background rounded-2xl p-8 border border-border">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Academic Requirements</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Minimum grade point average of 3.5 or equivalent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Strong performance in STEM subjects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Demonstrated participation in academic activities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Teacher recommendations and references</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background rounded-2xl p-8 border border-border">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Financial Need</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Family income verification required</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Priority given to underserved communities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Consideration of family size and dependents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Special consideration for orphaned students</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Application Process
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our streamlined application process ensures fair evaluation of all candidates.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Online Application</h3>
                <p className="text-sm text-muted-foreground">
                  Complete the scholarship application form with personal and academic details
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Document Submission</h3>
                <p className="text-sm text-muted-foreground">
                  Upload required documents including transcripts, recommendations, and financial proof
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Review & Evaluation</h3>
                <p className="text-sm text-muted-foreground">
                  Applications are reviewed by our scholarship committee for merit and need assessment
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Award Notification</h3>
                <p className="text-sm text-muted-foreground">
                  Successful candidates are notified and provided with award details and next steps
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="py-20 px-4 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Scholarship Impact
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Transforming lives through educational opportunities since 2025.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-background rounded-2xl p-8 border border-border">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Students Supported</p>
              </div>
              <div className="bg-background rounded-2xl p-8 border border-border">
                <div className="text-4xl font-bold text-primary mb-2">UGX 50M+</div>
                <p className="text-muted-foreground">Scholarships Awarded</p>
              </div>
              <div className="bg-background rounded-2xl p-8 border border-border">
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">Academic Success Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Take the first step towards securing your educational future. 
              Our scholarship application is now open for the 2025-2026 academic year.
            </p>
            <Link href="#available-scholarships">
              <Button size="lg" className="bg-background text-primary hover:bg-muted">
                Choose a Scholarship <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
