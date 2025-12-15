"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

type ScholarshipResponse = {
  scholarship: {
    id: number
    type_code: string
    type_name: string
    slug: string
    title: string
    tagline: string | null
    hero_image_url: string | null
    content: any
    application_fee_ugx: number
    is_active: boolean
  }
}

export default function ScholarshipDetailPage() {
  const params = useParams()
  const slug = useMemo(() => {
    const raw = (params as any)?.slug
    return typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : ""
  }, [params])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [ack, setAck] = useState(false)
  const [data, setData] = useState<ScholarshipResponse["scholarship"] | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!slug) return
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`/api/scholarships/${slug}`, { cache: "no-store" })
        const json = (await res.json()) as ScholarshipResponse
        if (!res.ok) {
          setError((json as any)?.error || "Failed to load scholarship")
          return
        }
        setData(json.scholarship)
      } catch (e) {
        setError("Failed to load scholarship")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [slug])

  const content = data?.content || {}
  const heroTitle = content?.hero?.title || data?.title
  const heroTagline = content?.hero?.tagline || data?.tagline

  return (
    <>
      <Header />
      <main>
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-accent font-semibold mb-4">Scholarship</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">{heroTitle}</h1>
            {heroTagline && <p className="text-xl text-primary-foreground/90 max-w-3xl">{heroTagline}</p>}
          </div>
        </section>

        <section className="py-16 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            {loading && <p className="text-muted-foreground">Loading scholarship…</p>}
            {!loading && error && <p className="text-destructive">{error}</p>}

            {!loading && !error && data && (
              <div className="space-y-14">
                {/* The Why */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">{content?.why?.heading || "The ‘Why’ Behind the Scholarship"}</h2>
                  {(content?.why?.body || []).map((p: string, idx: number) => (
                    <p key={idx} className="text-lg text-muted-foreground leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Quick Facts */}
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Scholarship at a Glance</h2>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <div className="text-muted-foreground">Award Value</div>
                      <div className="font-semibold text-foreground">{content?.quickFacts?.awardValue || "To be announced"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Field Priority</div>
                      <div className="font-semibold text-foreground">{content?.quickFacts?.fieldPriority || "STEM"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Education Level</div>
                      <div className="font-semibold text-foreground">{content?.quickFacts?.educationLevel || "To be announced"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Number of Awards</div>
                      <div className="font-semibold text-foreground">{content?.quickFacts?.numberOfAwards || "To be announced"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Application Deadline</div>
                      <div className="font-semibold text-foreground">{content?.quickFacts?.applicationDeadline || "To be announced"}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Application Fee</div>
                      <div className="font-semibold text-foreground">UGX {data.application_fee_ugx}</div>
                    </div>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">{content?.eligibility?.heading || "Detailed Eligibility & Criteria"}</h2>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Mandatory Criteria</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      {(content?.eligibility?.mandatoryCriteria || []).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Personal Statement Prompts</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      {(content?.eligibility?.essayPrompts || []).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Required Documents</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      {(content?.eligibility?.requiredDocuments || []).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-2 border-primary rounded-2xl p-6 bg-primary/5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ack}
                        onChange={(e) => setAck(e.target.checked)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-semibold text-foreground">Mandatory Acknowledgment</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {content?.eligibility?.acknowledgmentText ||
                            "I have read and understood all the eligibility criteria and the purpose of this scholarship as established by The Idrisa Foundation."}
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link href={`/scholarship/signup?scholarship=${encodeURIComponent(data.slug)}`} aria-disabled={!ack}>
                      <Button disabled={!ack} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Proceed to Application
                      </Button>
                    </Link>
                    <Link href="/scholarship">
                      <Button variant="outline">Back to Scholarships</Button>
                    </Link>
                  </div>
                </div>

                {/* Process */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">{content?.process?.heading || "Application Process & Timeline"}</h2>
                  <ol className="space-y-3 text-muted-foreground list-decimal pl-5">
                    {(content?.process?.steps || []).map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                  {(content?.process?.notes || []).length > 0 && (
                    <div className="bg-muted/40 border border-border rounded-xl p-5">
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {content.process.notes.map((n: string, idx: number) => (
                          <li key={idx}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Commitments */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">{content?.commitments?.heading || "Scholar Commitments & Expectations"}</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    {(content?.commitments?.items || []).map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-2 w-2 h-2 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
