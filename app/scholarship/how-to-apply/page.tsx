
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function HowToApplyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              How to Apply for a Scholarship
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Supporting promising students in STEM with financial and structural barriers to education.
            </p>
          </div>
        </section>

        {/* Eligibility Criteria */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Eligibility Criteria</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-secondary p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Applicants Must:</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3"><Check className="text-primary w-5 h-5 mt-1" />Be enrolled or intending to enroll in a STEM-related program</li>
                  <li className="flex items-start gap-3"><Check className="text-primary w-5 h-5 mt-1" />Demonstrate academic potential or strong interest in STEM</li>
                  <li className="flex items-start gap-3"><Check className="text-primary w-5 h-5 mt-1" />Show financial need or limited access to educational resources</li>
                  <li className="flex items-start gap-3"><Check className="text-primary w-5 h-5 mt-1" />Commit to ethical conduct and community contribution</li>
                </ul>
              </div>
              <div className="bg-secondary p-6 rounded-lg flex items-center">
                <p className="text-muted-foreground">
                  Additional criteria may apply depending on the scholarship category. Our selection process is transparent, merit-based, and needs-aware.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-20 px-4 bg-secondary">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Application Process</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="p-6 bg-background rounded-lg shadow-md">
                <div className="text-3xl font-bold text-primary mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-muted-foreground">Access the application portal and create a personal applicant account.</p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-md">
                <div className="text-3xl font-bold text-primary mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Complete the Form</h3>
                <p className="text-muted-foreground">Provide accurate personal, academic, and background information.</p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-md">
                <div className="text-3xl font-bold text-primary mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Upload Documents</h3>
                <p className="text-muted-foreground">Upload academic transcripts, proof of enrollment, personal statement, and recommendation letters.</p>
              </div>
              <div className="p-6 bg-background rounded-lg shadow-md">
                <div className="text-3xl font-bold text-primary mb-4">4</div>
                <h3 className="text-xl font-semibold mb-2">Review & Submit</h3>
                <p className="text-muted-foreground">Ensure all information is complete before submitting your application.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Selection Process */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Selection Process</h2>
            <p className="text-center text-muted-foreground mb-8">
              Applications are reviewed based on academic performance, commitment to STEM, personal motivation, and financial need. Shortlisted candidates may be contacted for interviews.
            </p>
          </div>
        </section>

        {/* Application Portal CTA */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Application Portal</h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Ready to take the next step? Our application portal is now open.
            </p>
            <Link href="/participant/signup">
              <Button size="lg" className="bg-background text-primary hover:bg-muted">
                Go to Application Portal <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <p className="mt-8 text-sm text-primary-foreground/80">
              For questions, contact: <a href="mailto:scholars@idrisafoundation.org" className="underline">scholars@idrisafoundation.org</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
