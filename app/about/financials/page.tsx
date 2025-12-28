import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinancialsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-accent font-semibold mb-4">Financials & Transparency</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl">
              Your Trust. Our Responsibility.
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl">
              The Idrisa Foundation is committed to responsible financial management, openness, and ethical use of resources. Every contribution directly supports our mission to expand educational access, STEM learning, and student opportunity.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>How Your Donation Is Used</h2>
            <p>We focus on high-impact, low-overhead operations. Contributions support:</p>
            <ul>
              <li>Educational programs & STEM initiatives</li>
              <li>Student scholarships and academic support</li>
              <li>Learning materials, competitions, and mentorship</li>
              <li>Essential program administration</li>
            </ul>
            <p>Our priority is ensuring that resources reach students and communities where they are needed most.</p>

            <h2>Our Financial Approach</h2>
            <p>As a newly launched organization:</p>
            <ul>
              <li>We operate with lean costs to maximize impact</li>
              <li>Core leadership currently serves on a voluntary or minimal-cost basis</li>
              <li>Funds are allocated based on program needs and mission alignment</li>
              <li>Organizational finances are kept separate from personal accounts</li>
            </ul>
            <p>This approach allows us to scale responsibly while maintaining accountability from the start.</p>

            <h2>Transparency & Oversight</h2>
            <p>We are committed to clear and ethical financial practices, including:</p>
            <ul>
              <li>Accurate tracking of all donations and expenses</li>
              <li>Internal review of financial activity</li>
              <li>Documented approval for expenditures</li>
              <li>Compliance with applicable legal and regulatory requirements</li>
            </ul>
            <p>As the foundation grows, we will strengthen oversight and publish summarized financial and impact reports.</p>

            <h2>Why Support Idrisa Foundation?</h2>
            <p>When you donate, you are supporting:</p>
            <ul>
              <li>Students with limited access to quality educational resources</li>
              <li>Early-stage programs with strong long-term potential</li>
              <li>A foundation built on integrity, not excess</li>
              <li>Sustainable, community-focused solutions</li>
            </ul>
            <p>Your support at this stage plays a critical role in shaping our impact.</p>

            <h2>Support Our Work</h2>
            <p>Every contribution — no matter the size — helps us deliver programs, support students, and expand opportunity.</p>
            <p>
                <Link href="/get-involved/donate">
                    <Button>Make a donation today and be part of our mission.</Button>
                </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
