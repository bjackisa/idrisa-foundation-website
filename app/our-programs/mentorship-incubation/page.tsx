
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default function MentorshipIncubationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Mentorship & Incubation Programs
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Empowering the Next Generation of Innovators in STEM
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Supporting Students and Young Innovators
            </h2>
            <p className="text-lg text-muted-foreground">
              The Idrisa Foundation’s Mentorship and Incubation programs are designed to support students and young innovators who are exploring or actively pursuing careers in Science, Technology, Engineering, and Mathematics (STEM). We believe that talent is everywhere, but opportunity is not. Through structured mentorship, practical guidance, and incubation support, we help students transform ideas into skills, projects, and long-term career pathways.
            </p>
          </div>
        </section>

        {/* Mentorship Program */}
        <section className="py-20 px-4 bg-secondary">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Mentorship Program</h2>
              <p className="text-muted-foreground mb-6">
                Our mentorship program connects students with experienced professionals, educators, and practitioners who provide guidance beyond the classroom.
              </p>
              <h3 className="text-xl font-semibold mb-4">Mentorship Areas Include:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Academic guidance in STEM disciplines</li>
                <li>Career exploration and pathway planning</li>
                <li>Research skills and project development</li>
                <li>Technology and innovation exposure</li>
                <li>Personal development and leadership skills</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Delivery Methods:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>One-on-one mentor matching</li>
                <li>Group mentorship sessions</li>
                <li>Workshops and seminars</li>
                <li>Virtual mentorship engagements</li>
              </ul>
              <p className="mt-6 text-muted-foreground">
                Mentors serve as role models, advisors, and accountability partners as students navigate academic and professional decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Incubation Program */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Incubation Program</h2>
              <p className="text-muted-foreground mb-6">
                Our incubation program supports students and young innovators who are developing STEM-based ideas, projects, or early-stage solutions.
              </p>
              <h3 className="text-xl font-semibold mb-4">Program Focus:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Idea validation and problem definition</li>
                <li>Technical skill development</li>
                <li>Research and prototype support</li>
                <li>Innovation ethics and social impact</li>
                <li>Basic entrepreneurship and sustainability concepts</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Participants Receive:</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Structured incubation sessions</li>
                <li>Access to learning resources and tools</li>
                <li>Guidance from technical and industry mentors</li>
                <li>Opportunities to showcase projects</li>
              </ul>
              <p className="mt-6 text-muted-foreground">
                The incubation program is not limited to startups; it also supports research projects, community-focused innovations, and academic initiatives.
              </p>
            </div>
          </div>
        </section>

        {/* Who Can Participate */}
        <section className="py-20 px-4 bg-secondary">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Who Can Participate?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Selection is based on interest, commitment, and alignment with program goals rather than prior experience alone.
            </p>
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="p-4 bg-background rounded-lg shadow-md">Secondary school students</div>
              <div className="p-4 bg-background rounded-lg shadow-md">University and tertiary institution students</div>
              <div className="p-4 bg-background rounded-lg shadow-md">Early-stage innovators and researchers</div>
              <div className="p-4 bg-background rounded-lg shadow-md">Scholarship recipients of the Idrisa Foundation</div>
            </div>
          </div>
        </section>

        {/* Get Involved CTA */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Students interested in mentorship or incubation opportunities are encouraged to apply through our programs portal. Mentors and partners interested in supporting this program are welcome to reach out.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/programs">
                <Button size="lg" className="bg-background text-primary hover:bg-muted w-full sm:w-auto">
                  Apply to a Program <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="mailto:info@idrisafoundation.org">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto">
                  Contact Us <Mail className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
