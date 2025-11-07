import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OurPrograms() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Programs</h1>
            <p className="text-xl text-primary-foreground/90">
              Comprehensive pathways for youth empowerment and STEM excellence
            </p>
          </div>
        </section>

        <section className="py-24 px-4 bg-background">
          <div className="max-w-6xl mx-auto space-y-24">
            {/* STEM Olympiad */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div>
                  <h2 className="text-5xl font-bold text-primary mb-4">STEM Olympiad</h2>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    Our flagship competitive program is a comprehensive 3-5 month journey designed to identify,
                    challenge, and celebrate Uganda's brightest STEM minds across all education levels.
                  </p>
                </div>

                <div className="bg-card border-2 border-primary rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-primary mb-6">Education Levels & Subjects</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="font-bold text-primary mb-2">📚 Primary Level (P.4 - P.7)</p>
                      <p className="text-sm text-foreground/70 mb-2">Ages 10-14</p>
                      <p className="text-foreground/80">Mathematics • Integrated Science • Computer Knowledge</p>
                    </div>
                    <div className="border-t border-border pt-6">
                      <p className="font-bold text-primary mb-2">📖 O-Level (S.1 - S.4)</p>
                      <p className="text-sm text-foreground/70 mb-2">Ages 12-18</p>
                      <p className="text-foreground/80">
                        Mathematics • Biology • Physics • Chemistry • ICT • Agriculture
                      </p>
                    </div>
                    <div className="border-t border-border pt-6">
                      <p className="font-bold text-primary mb-2">🎓 A-Level (S.5 - S.6)</p>
                      <p className="text-sm text-foreground/70 mb-2">Ages 16-21</p>
                      <p className="text-foreground/80">
                        Physics • Chemistry • Mathematics • ICT • Biology • Agriculture
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary text-primary-foreground rounded-xl p-8">
                  <h3 className="text-2xl font-bold mb-6">How To Participate</h3>
                  <ol className="space-y-4">
                    <li className="flex gap-4">
                      <span className="font-bold text-accent text-xl min-w-fit">1.</span>
                      <span>Register as participant with your guardian</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-bold text-accent text-xl min-w-fit">2.</span>
                      <span>Select up to 2 subjects for your education level</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-bold text-accent text-xl min-w-fit">3.</span>
                      <span>Compete through 5 phases of challenges</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-bold text-accent text-xl min-w-fit">4.</span>
                      <span>Win prizes, scholarships, and recognition</span>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border-2 border-primary rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-primary mb-6">Five Competition Phases</h3>
                  <div className="space-y-4">
                    <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                      <p className="font-bold text-primary mb-1">Phase 1: Preparation</p>
                      <p className="text-sm text-foreground/70">Registration, olympiad launch, student onboarding</p>
                      <p className="text-xs text-foreground/60 mt-2">🎯 All participants qualify</p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                      <p className="font-bold text-primary mb-1">Phase 2: Quiz</p>
                      <p className="text-sm text-foreground/70">
                        30-60 min online assessments (1 hour max per subject)
                      </p>
                      <p className="text-xs text-foreground/60 mt-2">❌ Elimination: Below 70% removed</p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                      <p className="font-bold text-primary mb-1">Phase 3: Bronze</p>
                      <p className="text-sm text-foreground/70">Theory-based exam (1.5-2.5 hours per subject)</p>
                      <p className="text-xs text-foreground/60 mt-2">❌ Elimination: Bottom 30% + below 60%</p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg border-l-4 border-primary">
                      <p className="font-bold text-primary mb-1">Phase 4: Silver</p>
                      <p className="text-sm text-foreground/70">Practical exam online (2.5-3.25 hours per subject)</p>
                      <p className="text-xs text-foreground/60 mt-2">❌ Elimination: Bottom 50% + below 50%</p>
                    </div>
                    <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-accent">
                      <p className="font-bold text-accent mb-1">Phase 5: Golden Finale</p>
                      <p className="text-sm text-foreground/70">Offline grand finale at official venue</p>
                      <p className="text-xs text-foreground/60 mt-2">🏆 Winners announced • Prizes awarded</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border-2 border-primary rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-primary mb-6">Prizes & Rewards</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🏆</span>
                      <span className="text-foreground/80">Full & partial scholarships</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">💻</span>
                      <span className="text-foreground/80">Laptops & scholastic materials</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">📚</span>
                      <span className="text-foreground/80">Educational resource packages</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🎓</span>
                      <span className="text-foreground/80">Certificates & recognition</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🤝</span>
                      <span className="text-foreground/80">Internship opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Career Guidance */}
            <div className="border-t-4 border-primary pt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="bg-card border-2 border-primary rounded-xl p-8">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-3xl mb-6">
                  🎯
                </div>
                <h2 className="text-4xl font-bold text-primary mb-6">Career Guidance & Mentorship</h2>
                <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                  Beyond competition, we believe in holistic youth development. Our career guidance program connects
                  students with industry professionals, mentors, and real-world opportunities aligned with their
                  interests and strengths.
                </p>

                <div className="bg-primary text-primary-foreground rounded-lg p-6 mb-6">
                  <h3 className="font-bold mb-4">Who Can Participate?</h3>
                  <p className="text-sm text-primary-foreground/90">
                    All students—whether they participated in the Olympiad or not—are welcome to access our career
                    guidance services. Whether you're exploring STEM careers or understanding broader opportunities,
                    we're here to guide you.
                  </p>
                </div>

                <Link href="/participant/signup">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full">
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="space-y-6">
                <div className="bg-card p-8 rounded-xl border-2 border-primary">
                  <h3 className="text-2xl font-bold text-primary mb-6">What We Offer</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <span className="text-primary font-bold text-lg">✓</span>
                      <div>
                        <p className="font-semibold text-foreground">One-on-One Mentorship</p>
                        <p className="text-sm text-foreground/70">Direct guidance from STEM professionals</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-primary font-bold text-lg">✓</span>
                      <div>
                        <p className="font-semibold text-foreground">Career Pathway Planning</p>
                        <p className="text-sm text-foreground/70">Personalized education & career roadmaps</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-primary font-bold text-lg">✓</span>
                      <div>
                        <p className="font-semibold text-foreground">Industry Expert Talks</p>
                        <p className="text-sm text-foreground/70">Webinars & seminars with leading professionals</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-primary font-bold text-lg">✓</span>
                      <div>
                        <p className="font-semibold text-foreground">University Guidance</p>
                        <p className="text-sm text-foreground/70">Course selection & admission process support</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-primary font-bold text-lg">✓</span>
                      <div>
                        <p className="font-semibold text-foreground">Skills Development</p>
                        <p className="text-sm text-foreground/70">Workshops on professional & technical skills</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary text-primary-foreground p-6 rounded-xl text-center">
                    <p className="text-3xl font-bold mb-2">12+</p>
                    <p className="text-sm">Career Paths</p>
                  </div>
                  <div className="bg-primary text-primary-foreground p-6 rounded-xl text-center">
                    <p className="text-3xl font-bold mb-2">25+</p>
                    <p className="text-sm">Active Mentors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Internships & Jobs */}
            <div className="border-t-4 border-primary pt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="bg-card p-8 rounded-xl border-2 border-primary">
                  <h3 className="text-2xl font-bold text-primary mb-6">Eligibility</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span className="text-foreground/80">Current students (15+)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span className="text-foreground/80">Recent graduates (within 2 years)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span className="text-foreground/80">Olympiad participants (priority)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span className="text-foreground/80">All STEM enthusiasts welcome</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary text-primary-foreground p-6 rounded-xl text-center">
                    <p className="text-3xl font-bold mb-2">20+</p>
                    <p className="text-sm">Partner Organizations</p>
                  </div>
                  <div className="bg-primary text-primary-foreground p-6 rounded-xl text-center">
                    <p className="text-3xl font-bold mb-2">100+</p>
                    <p className="text-sm">Placements Annually</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-3xl mb-6">
                    💼
                  </div>
                  <h2 className="text-4xl font-bold text-primary mb-4">Internships & Holiday Jobs</h2>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    Real-world experience is invaluable. We connect talented students and fresh graduates with
                    internship and job opportunities that allow them to apply knowledge, develop professional skills,
                    and build industry networks.
                  </p>
                </div>

                <div className="bg-card border-2 border-primary rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-primary mb-6">Opportunity Types</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <span className="text-2xl">📌</span>
                      <div>
                        <p className="font-semibold text-foreground">Paid Internships</p>
                        <p className="text-sm text-foreground/70">During school terms for hands-on learning</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-2xl">🏖️</span>
                      <div>
                        <p className="font-semibold text-foreground">Holiday Jobs</p>
                        <p className="text-sm text-foreground/70">June & December paid placements</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-2xl">📈</span>
                      <div>
                        <p className="font-semibold text-foreground">Graduate Programs</p>
                        <p className="text-sm text-foreground/70">Entry-level positions for fresh graduates</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-2xl">🤝</span>
                      <div>
                        <p className="font-semibold text-foreground">Mentored Experience</p>
                        <p className="text-sm text-foreground/70">Guided learning with professional oversight</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Involved?</h2>
            <p className="text-xl mb-10 text-primary-foreground/90 leading-relaxed">
              Whether you're a student eager to grow, a professional wanting to mentor, or an organization seeking to
              partner with us, there's a place for you in The Idrisa Foundation.
            </p>
            <Link href="/participant/signup">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Get Started Today
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
