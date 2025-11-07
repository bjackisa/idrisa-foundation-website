import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-32 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-balance">
              Every Young Person Deserves the Opportunity to Thrive
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-foreground/95 max-w-3xl mx-auto text-balance leading-relaxed">
              Transforming Uganda's future through STEM education, scholarships, and youth empowerment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/participant/signup">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto font-semibold text-base px-8"
                >
                  Register as Participant
                </Button>
              </Link>
              <Link href="/our-programs">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto bg-transparent font-semibold text-base px-8"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Founder Section */}
        <section className="py-20 px-4 bg-card">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Our Story</h2>
                <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
                  The Idrisa Foundation (U) Limited was established in 2025 by{" "}
                  <span className="font-semibold text-primary">Idrisa Kiryowa</span>, a visionary masters degree student
                  in Russia with significant research contributions to medical sciences.
                </p>
                <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
                  Having studied in India and conducted groundbreaking research across multiple disciplines, Idrisa
                  founded this organization as a way to give back to his homeland, Uganda, and his hometown, Entebbe.
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Today, the Idrisa Foundation empowers young minds through STEM competitions, career guidance, and
                  real-world work opportunities—building Uganda's next generation of innovators and leaders.
                </p>
              </div>
              <div className="bg-primary text-primary-foreground rounded-2xl p-12 shadow-2xl">
                <div className="space-y-6">
                  <div>
                    <div className="text-5xl font-bold text-accent mb-2">2025</div>
                    <p className="text-lg font-semibold">Year Founded in Entebbe, Uganda</p>
                  </div>
                  <div className="border-t border-primary-foreground/20 pt-6">
                    <p className="text-base text-primary-foreground/90">Founded by Idrisa Kiryowa</p>
                    <p className="text-sm text-primary-foreground/70 mt-2">
                      Master's Student | Medical Research | International Scholar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact Section */}
        <section className="py-24 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Our Impact</h2>
              <p className="text-xl text-foreground/70">Making a difference in Uganda's STEM education landscape</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-primary text-primary-foreground p-10 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="text-6xl font-bold mb-4 text-accent">500+</div>
                <h3 className="text-2xl font-bold mb-3">Students Empowered</h3>
                <p className="text-primary-foreground/90">
                  Youth trained and mentored in STEM disciplines across Uganda
                </p>
              </div>
              <div className="bg-primary text-primary-foreground p-10 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="text-6xl font-bold mb-4 text-accent">50+</div>
                <h3 className="text-2xl font-bold mb-3">Scholarships Awarded</h3>
                <p className="text-primary-foreground/90">
                  Full and partial scholarships for deserving high-achieving students
                </p>
              </div>
              <div className="bg-primary text-primary-foreground p-10 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="text-6xl font-bold mb-4 text-accent">15+</div>
                <h3 className="text-2xl font-bold mb-3">Partner Schools</h3>
                <p className="text-primary-foreground/90">
                  Institutions across Uganda collaborating with our foundation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Programs Section */}
        <section className="py-24 px-4 bg-card">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Our Programs</h2>
              <p className="text-xl text-foreground/70">Comprehensive opportunities for youth development</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-background border-2 border-primary rounded-2xl p-8 hover:shadow-2xl hover:border-accent transition">
                <h3 className="text-2xl font-bold mb-4 text-primary">STEM Olympiad</h3>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  Competitive examinations in Mathematics, Sciences (Biology, Physics, Chemistry), and ICT across
                  Primary, O-Level, and A-Level categories.
                </p>
                <ul className="space-y-2 text-sm text-foreground/70 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">•</span> 5-phase competition system
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">•</span> Quiz, Theory & Practical exams
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">•</span> Prizes & scholarships for winners
                  </li>
                </ul>
                <Link href="/olympiad">
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full bg-transparent"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="group bg-background border-2 border-primary rounded-2xl p-8 hover:shadow-2xl hover:border-accent transition">
                <h3 className="text-2xl font-bold mb-4 text-primary">Career Guidance</h3>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  Professional mentoring and comprehensive career counseling to help students identify their paths and
                  unlock their potential.
                </p>
                <ul className="space-y-2 text-sm text-foreground/70 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">•</span> One-on-one mentorship
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">•</span> Career pathway planning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">•</span> Industry expert talks
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full bg-transparent"
                >
                  Learn More
                </Button>
              </div>

              <div className="group bg-background border-2 border-primary rounded-2xl p-8 hover:shadow-2xl hover:border-accent transition">
                <h3 className="text-2xl font-bold mb-4 text-primary">Internships & Jobs</h3>
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  Real-world work experience and holiday job opportunities for students and fresh graduates to build
                  practical skills.
                </p>
                <ul className="space-y-2 text-sm text-foreground/70 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">•</span> Paid internships
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">•</span> Holiday job placements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary font-bold">•</span> Graduate opportunities
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How We Make a Difference */}
        <section className="py-24 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-primary">How We Make a Difference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-2">Identify Talent</h3>
                    <p className="text-foreground/80 leading-relaxed">
                      We discover promising STEM students across Uganda through our nationwide competitions and
                      partnerships with schools.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-2">Develop Skills</h3>
                    <p className="text-foreground/80 leading-relaxed">
                      Through rigorous competitions and mentorship, we help students master STEM subjects and develop
                      critical thinking.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-2">Provide Opportunities</h3>
                    <p className="text-foreground/80 leading-relaxed">
                      We connect winners and participants with scholarships, internships, and career opportunities with
                      leading organizations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary text-primary-foreground rounded-2xl p-12 shadow-2xl flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-8">Why It Matters</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-lg mb-2 leading-relaxed">
                      Uganda needs more STEM professionals to drive innovation and economic growth. The Idrisa
                      Foundation is building that future, one student at a time.
                    </p>
                  </div>
                  <div className="border-t border-primary-foreground/30 pt-6">
                    <p className="text-base text-primary-foreground/90">
                      By empowering young minds through education, mentorship, and real-world opportunities, we're
                      creating a generation of leaders equipped to solve Uganda's biggest challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Future?</h2>
            <p className="text-lg mb-10 text-primary-foreground/90 leading-relaxed">
              Join thousands of students participating in The Idrisa Foundation programs and unlock your full potential
              through STEM excellence.
            </p>
            <Link href="/participant/signup">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base px-8"
              >
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
