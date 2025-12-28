
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the Idrisa Foundation Scholarship Program?",
    answer: "It is a program supporting students pursuing STEM education through financial, academic, and mentorship support.",
  },
  {
    question: "Who is eligible to apply?",
    answer: "Students enrolled or intending to enroll in STEM-related programs who demonstrate academic potential and financial need.",
  },
  {
    question: "Which fields qualify as STEM?",
    answer: "Science, Technology, Engineering, Mathematics, and related interdisciplinary fields.",
  },
  {
    question: "Is the scholarship fully funded?",
    answer: "Funding levels vary depending on available resources and scholarship category.",
  },
  {
    question: "Can secondary school students apply?",
    answer: "Yes, depending on the specific scholarship call.",
  },
  {
    question: "Can university students apply?",
    answer: "Yes.",
  },
  {
    question: "Is the scholarship limited to Uganda?",
    answer: "Primary focus is Uganda, but future expansion may occur.",
  },
  {
    question: "How often are scholarships awarded?",
    answer: "Typically annually or per announced cycle.",
  },
  {
    question: "Is there an age limit?",
    answer: "No strict age limit, but academic status is considered.",
  },
  {
    question: "How are scholars selected?",
    answer: "Through a merit-based and needs-aware review process.",
  },
  {
    question: "Do I need perfect grades?",
    answer: "No. Potential, motivation, and context are also considered.",
  },
  {
    question: "Is mentorship included?",
    answer: "Yes, selected scholars may receive mentorship support.",
  },
  {
    question: "Are scholars required to give back?",
    answer: "Scholars are encouraged to engage in mentorship, volunteering, or community service.",
  },
  {
    question: "Can I apply if I already receive another scholarship?",
    answer: "Yes, but you must disclose existing funding.",
  },
  {
    question: "Are part-time students eligible?",
    answer: "Eligibility depends on the specific scholarship call.",
  },
  {
    question: "What documents are required?",
    answer: "Transcripts, proof of enrollment, and personal statements are common requirements.",
  },
  {
    question: "Is an interview required?",
    answer: "Some applicants may be invited for interviews.",
  },
  {
    question: "Can I reapply if not selected?",
    answer: "Yes.",
  },
  {
    question: "How will I know if I am selected?",
    answer: "Successful applicants will be contacted via email.",
  },
  {
    question: "Are applications free?",
    answer: "Yes. There is no application fee.",
  },
  {
    question: "Can false information lead to disqualification?",
    answer: "Yes. Accuracy and honesty are required.",
  },
  {
    question: "Are online courses covered?",
    answer: "Some programs may support accredited online learning.",
  },
  {
    question: "What expenses are covered?",
    answer: "Tuition support, learning materials, or academic needs depending on funding.",
  },
  {
    question: "Are living expenses covered?",
    answer: "This depends on the scholarship category.",
  },
  {
    question: "What happens if my academic performance drops?",
    answer: "Support plans may be discussed; continued support depends on engagement.",
  },
  {
    question: "Can scholars defer the scholarship?",
    answer: "Deferrals are considered on a case-by-case basis.",
  },
  {
    question: "Can I change my field of study?",
    answer: "Changes must be communicated and approved.",
  },
  {
    question: "Will scholars receive certificates?",
    answer: "Yes, upon completion or as recognition of participation.",
  },
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Find answers to common questions about the Idrisa Foundation Scholarship Program.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg font-semibold text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
