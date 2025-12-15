import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function ScholarshipLoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">Scholarship Portal Login</h1>
            <p className="text-lg text-muted-foreground mb-8">
              This portal is being upgraded to support named scholarships with eligibility gateways. If you are applying
              for a scholarship, please start from the Scholarships page and choose the scholarship you are interested in.
            </p>

            <div className="bg-card border border-border rounded-2xl p-8 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">How to apply</h2>
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                <li>Choose a named scholarship.</li>
                <li>Read the full eligibility criteria and confirm the acknowledgment.</li>
                <li>Proceed to the online application form (application fee: UGX 0).</li>
              </ol>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/scholarship">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Go to Scholarships</Button>
              </Link>
              <Link href="/scholarship/dashboard">
                <Button variant="outline">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
