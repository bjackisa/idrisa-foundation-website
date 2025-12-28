import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"

export default function PartnersPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-accent font-semibold mb-4">Partners & Supporters</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl">
              Building Impact Together
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl">
              The Idrisa Foundation is proud to work alongside a small but committed group of partners and supporters who believe in empowering young people through education, innovation, and opportunity. As a growing organization, we value meaningful collaboration over numbers, and we are grateful for every individual and institution that supports our mission.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>Founding Supporters</h2>

            <h3>Individual Supporters</h3>
            <p>Our early work has been made possible through the generosity, guidance, and encouragement of individuals who believe in the vision of the Idrisa Foundation.</p>
            <p>These founding supporters have contributed through:</p>
            <ul>
              <li>Mentorship and advisory support</li>
              <li>Program volunteering</li>
              <li>Financial and in-kind contributions</li>
              <li>Community advocacy and outreach</li>
            </ul>
            <p>Their trust at this early stage helps us lay a strong foundation for long-term impact.</p>

            <h3>Educational & Community Collaborators</h3>
            <p>We collaborate informally with:</p>
            <ul>
              <li>Local educators and mentors</li>
              <li>Schools and learning communities</li>
              <li>Youth leaders and volunteers</li>
            </ul>
            <p>These collaborations support our programs in STEM education, academic competitions, and student mentorship as we continue to grow our reach.</p>

            <h2>Why Partnerships Matter to Us</h2>
            <p>At Idrisa Foundation, partnerships are not just logos — they are relationships built on shared values. Every supporter plays a role in:</p>
            <ul>
              <li>Expanding access to quality education</li>
              <li>Encouraging innovation and critical thinking</li>
              <li>Supporting talented students with limited resources</li>
              <li>Strengthening community-led solutions</li>
            </ul>

            <h2>Become a Partner or Supporter</h2>
            <p>As we officially launch, we welcome organizations, institutions, and individuals who would like to grow with us.</p>
            <p>Ways to partner with us include:</p>
            <ul>
              <li>Program sponsorship</li>
              <li>Educational collaboration</li>
              <li>Mentorship and skills support</li>
              <li>Resource or equipment donations</li>
            </ul>
            <p>
              <Link href="/contact" className="text-primary hover:underline">
                👉 Partner with us to shape the future of young innovators.
              </Link>
            </p>
            <p>
              📩 Contact us at: <a href="mailto:info@idrisafoundation.org" className="text-primary hover:underline">info@idrisafoundation.org</a> or use our <Link href="/contact" className="text-primary hover:underline">Contact Us page</Link> to start the conversation.
            </p>

            <h2>Looking Ahead</h2>
            <p>This page will continue to grow as our community of partners expands. We look forward to recognizing and celebrating the organizations and individuals who join us on this journey.</p>

            <div className="text-center mt-12">
              <p className="text-xl italic text-muted-foreground">“Impact is strongest when built together.”</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
