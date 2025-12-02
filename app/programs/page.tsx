import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Trophy, GraduationCap, Users, Search, Award, Briefcase } from "lucide-react"

export default function ProgramsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-accent font-semibold mb-4">Our Programs</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl">
              Comprehensive Support for Young Scientists
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl">
              From talent discovery to career launch, our programs create a complete pathway for STEM excellence.
            </p>
          </div>
        </section>

        {/* Program Categories */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto space-y-20">
            {/* Talent Scouting */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                  <Search className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Talent Scouting & Outreach</h2>
                  <p className="text-muted-foreground">Discovering brilliance across Uganda</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/programs/olympiad" className="group">
                  <div className="bg-card border border-border rounded-xl p-6 card-hover h-full">
                    <Trophy className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-lg font-bold mb-2 text-foreground">STEM Olympiad</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Multi-phase competition in Math, Sciences, and ICT with scholarships for winners.
                    </p>
                    <span className="text-primary font-medium text-sm group-hover:underline">Learn More →</span>
                  </div>
                </Link>

                <div className="bg-card border border-border rounded-xl p-6 card-hover">
                  <Award className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-foreground">Science Fairs</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Showcase innovative projects and connect with mentors and industry leaders.
                  </p>
                  <span className="text-muted-foreground text-sm">Coming Soon</span>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 card-hover">
                  <Users className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2 text-foreground">Innovation Challenges</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Solve real-world problems with creative STEM solutions.
                  </p>
                  <span className="text-muted-foreground text-sm">Coming Soon</span>
                </div>
              </div>
            </div>

            {/* Scholarships */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Scholarships & Bursaries</h2>
                  <p className="text-muted-foreground">Removing financial barriers to excellence</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-4 text-foreground">Types of Support</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <span className="font-semibold text-foreground">Research Grants</span>
                        <p className="text-sm text-muted-foreground">
                          Funding for specific scientific projects and experiments
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <span className="font-semibold text-foreground">Academic Scholarships</span>
                        <p className="text-sm text-muted-foreground">
                          Full or partial tuition coverage for outstanding students
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <span className="font-semibold text-foreground">Stipends & Living Support</span>
                        <p className="text-sm text-muted-foreground">
                          Monthly allowances to enable full-time study and research
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <span className="font-semibold text-foreground">In-Kind Support</span>
                        <p className="text-sm text-muted-foreground">
                          Lab equipment, software, materials, and learning resources
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary text-primary-foreground rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-4">Olympiad Winners Receive</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                        1
                      </div>
                      <span>Full scholarships for higher education</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                        2
                      </div>
                      <span>Laptops and learning devices</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                        3
                      </div>
                      <span>Complete scholastic materials</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                        4
                      </div>
                      <span>Mentorship from professionals</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                        5
                      </div>
                      <span>Internship opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mentorship */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Mentorship & Incubation</h2>
                  <p className="text-muted-foreground">More than funding—expert guidance for success</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-bold text-foreground mb-3">Career Guidance</h4>
                    <p className="text-sm text-muted-foreground">
                      One-on-one counseling to help students identify their ideal career paths in STEM fields.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-3">Expert Mentorship</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with working scientists, engineers, and professionals who guide your development.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-3">Internships & Jobs</h4>
                    <p className="text-sm text-muted-foreground">
                      Practical work experience through holiday jobs and internship placements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Join our programs and unlock your potential in STEM.
            </p>
            <Link href="/participant/signup">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
