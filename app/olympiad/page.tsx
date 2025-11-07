import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Olympiad() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">The STEM Olympiad</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Discover, compete, and excel in Uganda's premier STEM competition
          </p>

          <div className="space-y-12">
            <section className="border border-border rounded-lg p-8 bg-card">
              <h2 className="text-3xl font-bold mb-4">About the Olympiad</h2>
              <p className="text-lg text-muted-foreground mb-6">
                The Idrisa Foundation STEM Olympiad is designed to challenge and inspire young minds across Uganda. Each
                year, we honor remarkable individuals through our competition, bringing students together to showcase
                their knowledge, problem-solving skills, and passion for STEM.
              </p>
              <p className="text-lg text-muted-foreground">
                The olympiad is open to Primary, O-Level, and A-Level students and features multiple phases to ensure
                fair competition and comprehensive assessment.
              </p>
            </section>

            <section className="border border-border rounded-lg p-8 bg-card">
              <h2 className="text-3xl font-bold mb-6">How the Olympiad Works</h2>

              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-bold mb-2">Phase 1: Preparation</h3>
                  <p className="text-muted-foreground">
                    Registration period where students can prepare and select their subjects (max 2 subjects).
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-bold mb-2">Phase 2: Quiz</h3>
                  <p className="text-muted-foreground">
                    Initial screening through quiz examinations. Students must score 70% or above to advance. Duration:
                    30 minutes to 1 hour.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-bold mb-2">Phase 3: Bronze (Theory)</h3>
                  <p className="text-muted-foreground">
                    Theory-based examination testing conceptual understanding. Bottom 30% plus those scoring below 60%
                    are eliminated. Duration: 1.5 to 2.5 hours depending on level and subject.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-bold mb-2">Phase 4: Silver (Practical)</h3>
                  <p className="text-muted-foreground">
                    Online practical examination testing applied skills. Bottom 50% plus those scoring below 50% are
                    eliminated. Duration: 2.5 to 3.25 hours.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-xl font-bold mb-2">Phase 5: Golden Finale</h3>
                  <p className="text-muted-foreground">
                    Offline finale at a determined venue featuring top performers. Winners are announced and prizes
                    awarded.
                  </p>
                </div>
              </div>
            </section>

            <section className="border border-border rounded-lg p-8 bg-card">
              <h2 className="text-3xl font-bold mb-4">Eligibility Requirements</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Primary Level</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Age: 10-14 years</li>
                    <li>Classes: P.4, P.5, P.6, P.7</li>
                    <li>Subjects: Mathematics, Integrated Science, Computer Knowledge</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">O-Level</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Age: 12-18 years</li>
                    <li>Classes: S.1, S.2, S.3, S.4</li>
                    <li>Subjects: Mathematics, Biology, Physics, Chemistry, ICT, Agriculture</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">A-Level</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Age: 16-21 years</li>
                    <li>Classes: S.5, S.6</li>
                    <li>Subjects: Physics, Chemistry, Mathematics, ICT, Biology, Agriculture</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Compete?</h2>
              <p className="text-lg mb-8 text-primary-foreground/90">
                Register as a participant and select your olympiad and subjects to get started.
              </p>
              <Link href="/participant/signup">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Register Now
                </Button>
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
