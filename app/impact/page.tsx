import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Impact() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Our Impact</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Transforming lives and communities through STEM education
          </p>

          <div className="space-y-12">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-primary text-primary-foreground p-8 rounded-lg">
                <div className="text-6xl font-bold mb-4">500+</div>
                <h3 className="text-2xl font-bold mb-4">Students Empowered</h3>
                <p>Young minds trained in STEM disciplines, gaining knowledge and skills for their future.</p>
              </div>
              <div className="bg-primary text-primary-foreground p-8 rounded-lg">
                <div className="text-6xl font-bold mb-4">50+</div>
                <h3 className="text-2xl font-bold mb-4">Scholarships Awarded</h3>
                <p>Full and partial scholarships enabling deserving students to pursue quality education.</p>
              </div>
              <div className="bg-primary text-primary-foreground p-8 rounded-lg">
                <div className="text-6xl font-bold mb-4">15+</div>
                <h3 className="text-2xl font-bold mb-4">Partner Schools</h3>
                <p>Institutions across Uganda collaborating with us to reach and uplift students.</p>
              </div>
              <div className="bg-primary text-primary-foreground p-8 rounded-lg">
                <div className="text-6xl font-bold mb-4">2025</div>
                <h3 className="text-2xl font-bold mb-4">Year Founded</h3>
                <p>Starting our mission to transform Uganda's youth through STEM education and empowerment.</p>
              </div>
            </section>

            <section className="border border-border rounded-lg p-8 bg-card">
              <h2 className="text-3xl font-bold mb-6">Student Success Stories</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our programs have helped students discover their potential and achieve remarkable outcomes:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-2xl">✓</span>
                  <span>
                    <strong>Academic Excellence:</strong> Participants have achieved top grades in national and regional
                    competitions.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl">✓</span>
                  <span>
                    <strong>Scholarship Opportunities:</strong> Many students have secured scholarships to pursue
                    tertiary education.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl">✓</span>
                  <span>
                    <strong>Career Development:</strong> Career guidance has helped students identify and pursue STEM
                    career paths.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl">✓</span>
                  <span>
                    <strong>Work Experience:</strong> Internship and job programs have provided real-world experience
                    and income opportunities.
                  </span>
                </li>
              </ul>
            </section>

            <section className="border border-border rounded-lg p-8 bg-card">
              <h2 className="text-3xl font-bold mb-4">Community Impact</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Beyond individual students, The Idrisa Foundation creates positive ripple effects across communities:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <strong>Educational Excellence:</strong> Partner schools see improved STEM outcomes and student
                  engagement.
                </li>
                <li>
                  <strong>Youth Inspiration:</strong> Our programs inspire younger students to pursue STEM education.
                </li>
                <li>
                  <strong>Economic Empowerment:</strong> Internship and job programs create income-generating
                  opportunities.
                </li>
                <li>
                  <strong>National Development:</strong> Building Uganda's STEM workforce contributes to national
                  innovation and competitiveness.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
