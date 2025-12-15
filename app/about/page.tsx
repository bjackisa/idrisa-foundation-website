import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, BookOpen, Users, Building2, FileText } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-accent font-semibold mb-4">About Us</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl">
              Building Africa's Next Generation of Scientists
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl">
              The Idrisa Foundation is a Ugandan non-profit dedicated to discovering, nurturing, and empowering young
              STEM talent through education, scholarships, and mentorship.
            </p>
          </div>
        </section>

        {/* Sub-pages Navigation */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Link href="/about/story" className="group">
                <div className="bg-card border border-border rounded-2xl p-8 card-hover h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition">
                    <BookOpen className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-foreground">Our Story & Mission</h2>
                  <p className="text-muted-foreground mb-6">
                    Learn how a personal journey of resilience and purpose is transforming STEM education in Uganda.
                    Discover our mission, vision, and the values that drive our work.
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    Read Our Story <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>

              <Link href="/about/team" className="group">
                <div className="bg-card border border-border rounded-2xl p-8 card-hover h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition">
                    <Users className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-foreground">Our Team</h2>
                  <p className="text-muted-foreground mb-6">
                    Meet the dedicated leaders, board members, and scientific advisors who guide our mission to empower
                    young scientists across Uganda.
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    Meet the Team <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>

              <Link href="/about/partners" className="group">
                <div className="bg-card border border-border rounded-2xl p-8 card-hover h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition">
                    <Building2 className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-foreground">Partners & Supporters</h2>
                  <p className="text-muted-foreground mb-6">
                    Explore our partnerships with corporations, universities, government bodies, and fellow NGOs that
                    amplify our impact.
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    View Partners <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>

              <Link href="/about/financials" className="group">
                <div className="bg-card border border-border rounded-2xl p-8 card-hover h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition">
                    <FileText className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-foreground">Financials & Transparency</h2>
                  <p className="text-muted-foreground mb-6">
                    Access our annual reports, financial statements, and impact reports. We believe in complete
                    transparency with our donors and community.
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    View Reports <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
