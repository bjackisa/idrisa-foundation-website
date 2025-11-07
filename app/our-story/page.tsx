import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function OurStory() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Story</h1>
            <p className="text-xl text-primary-foreground/90">
              How the Idrisa Foundation came to empower Uganda's youth
            </p>
          </div>
        </section>

        <section className="py-24 px-4 bg-background">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Founder Story */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Meet Our Founder</h2>
                <div className="space-y-6">
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    The Idrisa Foundation (U) Limited was established in 2025 by{" "}
                    <span className="font-semibold text-primary">Idrisa Kiryowa</span>, a visionary scholar and
                    researcher dedicated to transforming Uganda's educational landscape.
                  </p>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    Idrisa is a Master's degree student in Russia with an impressive international academic
                    journey—studying in India and conducting significant research across multiple disciplines,
                    particularly in medical sciences. His achievements stand as testament to the power of quality
                    education and dedicated mentorship.
                  </p>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    Despite his international success and opportunities abroad, Idrisa never forgot his roots. He
                    recognized that Uganda—his beloved homeland and hometown of Entebbe—had immense talent but lacked
                    accessible platforms for young people to discover and develop their STEM potential.
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    "I wanted to be the bridge my younger self needed. That's why I created The Idrisa Foundation."
                  </p>
                </div>
              </div>
              <div className="bg-primary text-primary-foreground rounded-2xl p-12 shadow-2xl h-fit">
                <div className="space-y-8">
                  <div>
                    <p className="text-sm text-primary-foreground/70 font-semibold uppercase tracking-wide">
                      Idrisa Kiryowa
                    </p>
                    <p className="text-3xl font-bold mt-2">Founder & Vision Bearer</p>
                  </div>
                  <div className="border-t border-primary-foreground/20 pt-8 space-y-6">
                    <div>
                      <p className="text-sm text-primary-foreground/70 mb-2">Education</p>
                      <p className="font-semibold">Master's Degree Student, Russia</p>
                      <p className="text-sm text-primary-foreground/80">
                        Studied in India • Medical Research Specialist
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground/70 mb-2">Mission</p>
                      <p className="font-semibold">Empower Tomorrow's Minds</p>
                      <p className="text-sm text-primary-foreground/80">Transforming Uganda through STEM education</p>
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground/70 mb-2">Location</p>
                      <p className="font-semibold">Entebbe, Uganda</p>
                      <p className="text-sm text-primary-foreground/80">Headquarters & Community Base</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* The Beginning */}
            <div className="space-y-6 bg-card p-12 rounded-2xl">
              <h2 className="text-4xl font-bold text-primary">The Beginning</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                The Idrisa Foundation was born from a simple but powerful conviction: Uganda's talented young minds
                deserve world-class STEM education, career guidance, and real-world opportunities regardless of their
                socioeconomic background or location.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                In 2025, Idrisa took action. Rather than pursue a solely personal career path, he invested his
                knowledge, resources, and passion into creating an organization that would give Uganda's youth the
                opportunities he had received—and the opportunities he wished he'd had earlier.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Starting from Entebbe, the foundation quickly expanded its reach across Uganda, identifying talented
                students in primary, secondary, and tertiary institutions and providing them with transformative STEM
                competition, mentorship, and career development opportunities.
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-primary text-primary-foreground p-10 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
                <p className="text-lg leading-relaxed">
                  To empower Uganda's youth through excellence in STEM education, comprehensive career guidance, and
                  transformative work opportunities—unlocking their potential and shaping Africa's future.
                </p>
              </div>
              <div className="bg-accent text-accent-foreground p-10 rounded-2xl shadow-lg">
                <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
                <p className="text-lg leading-relaxed">
                  A Uganda where STEM excellence is celebrated and accessible to all; where young people possess the
                  knowledge, confidence, and networks to solve tomorrow's challenges and lead innovation globally.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-primary">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border-l-4 border-primary pl-6 py-4">
                  <h3 className="text-2xl font-bold text-primary mb-3">Excellence</h3>
                  <p className="text-foreground/80">
                    We pursue the highest standards in every aspect of education, mentorship, and program delivery.
                    Mediocrity is never acceptable.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6 py-4">
                  <h3 className="text-2xl font-bold text-primary mb-3">Accessibility</h3>
                  <p className="text-foreground/80">
                    Quality education knows no zip code. We ensure our programs reach deserving students regardless of
                    school location or financial background.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6 py-4">
                  <h3 className="text-2xl font-bold text-primary mb-3">Innovation</h3>
                  <p className="text-foreground/80">
                    We foster creative thinking, problem-solving, and scientific curiosity. We encourage students to
                    think beyond textbooks and imagine possibilities.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6 py-4">
                  <h3 className="text-2xl font-bold text-primary mb-3">Empowerment</h3>
                  <p className="text-foreground/80">
                    We build confidence, agency, and self-belief in every young person. We believe they have what it
                    takes to succeed at the highest levels.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6 py-4">
                  <h3 className="text-2xl font-bold text-primary mb-3">Community</h3>
                  <p className="text-foreground/80">
                    We work collaboratively with schools, parents, professionals, and partners. No single organization
                    can transform education alone.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-6 py-4">
                  <h3 className="text-2xl font-bold text-primary mb-3">Integrity</h3>
                  <p className="text-foreground/80">
                    We operate with transparency, fairness, and unwavering commitment to our mission. We do what we say
                    we'll do.
                  </p>
                </div>
              </div>
            </div>

            {/* Why This Matters */}
            <div className="bg-primary/10 border-2 border-primary rounded-2xl p-12">
              <h2 className="text-4xl font-bold text-primary mb-8">Why This Matters</h2>
              <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
                <p>
                  Uganda faces a critical shortage of skilled STEM professionals. According to various studies, the
                  continent needs millions more scientists, engineers, and technicians to drive innovation and economic
                  growth. Yet many talented young Ugandans never get the chance to explore STEM careers because they
                  lack access to quality education, mentorship, and opportunities.
                </p>
                <p>
                  The Idrisa Foundation changes that narrative. By identifying talented students early, providing
                  rigorous training, connecting them with mentors, and creating pathways to real work experience, we're
                  building Uganda's next generation of innovators, leaders, and change-makers.
                </p>
                <p>
                  Every student we empower has the potential to transform not just their own lives, but their families,
                  their communities, and ultimately, the entire nation. That's the power of education. That's the power
                  of opportunity. That's why we do what we do.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
