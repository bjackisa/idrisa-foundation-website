import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Target, Eye, Heart, Lightbulb, Users, Globe, Award, BookOpen } from "lucide-react"

export default function OurStoryPage() {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We embrace creative solutions and forward-thinking approaches to education",
    },
    {
      icon: Heart,
      title: "Compassion",
      description: "Every decision is guided by genuine care for our students' wellbeing",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of partnerships and collective action",
    },
    { icon: Award, title: "Excellence", description: "We pursue the highest standards in everything we do" },
    {
      icon: Globe,
      title: "Inclusivity",
      description: "Every talented mind deserves opportunity, regardless of background",
    },
    { icon: BookOpen, title: "Integrity", description: "Transparency and honesty are the foundation of our work" },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-accent font-semibold mb-4">Our Story</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
              Born from a Vision to Transform Lives
            </h1>
          </div>
        </section>

        {/* Founder Story */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                The Idrisa Foundation (U) Limited was established in 2025 by{" "}
                <strong className="text-foreground">Idrisa Kiryowa</strong>, inspired by a personal journey of
                overcoming adversity and discovering untapped STEM potential in Ugandan classrooms.
                His scientific credibility can be verified through his{" "}
                <a 
                  href="https://orcid.org/0009-0007-3178-0424" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline underline"
                >
                  ORCID profile (0009-0007-3178-0424)
                </a>
                ,{" "}
                <a 
                  href="https://www.webofscience.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline underline"
                >
                  Web of Science publications
                </a>
                , and{" "}
                <a 
                  href="https://www.researchgate.net" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline underline"
                >
                  ResearchGate contributions
                </a>
                .
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Idrisa's path showed him a critical gap in his homeland: brilliant young minds across Uganda are often
                overlooked and under-supported. Many students have curiosity and talent, but lack the guidance,
                mentorship, learning resources, and platforms needed to develop their ideas into real solutions.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                With hands-on scientific training and experience—documented through reputable{" "}
                <a 
                  href="https://www.elsevier.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline underline"
                >
                  publishing houses
                </a>
                and verified by international scientific databases—Idrisa founded The Idrisa Foundation to give back to
                Uganda and his hometown of Entebbe. The Foundation exists to find young scientists, nurture their
                curiosity, and ensure their ideas can be heard, seen, and developed into the solutions of tomorrow.
              </p>

              <div className="bg-primary text-primary-foreground rounded-2xl p-8 my-12">
                <blockquote className="text-xl italic leading-relaxed">
                  "Challenges and problems are like strong storms; they won’t last forever, but their effects can last
                  generations. Don’t trust them."
                </blockquote>
                <p className="mt-4 font-semibold">— Idrisa Kiryowa, Founder</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 px-4 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-background rounded-2xl p-10 border border-border">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To discover, nurture, and empower young STEM talent across Uganda through competitive programs,
                  scholarships, mentorship, and real-world opportunities—creating a pipeline of scientists and
                  innovators who will solve Africa's greatest challenges.
                </p>
              </div>

              <div className="bg-background rounded-2xl p-10 border border-border">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  A Uganda where every talented young person has access to world-class STEM education and the support
                  needed to become leaders in science, technology, engineering, and mathematics—driving innovation and
                  progress for generations to come.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-accent font-semibold mb-3 text-sm uppercase tracking-wider">What Guides Us</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Core Values</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value) => (
                <div key={value.title} className="bg-card border border-border rounded-xl p-6 card-hover">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
