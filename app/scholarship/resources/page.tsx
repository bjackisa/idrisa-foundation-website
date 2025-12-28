
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, FlaskConical, Database, Laptop, Edit } from "lucide-react";

const resources = {
  books: [
    { title: "A Brief History of Time", author: "Stephen Hawking" },
    { title: "The Innovators", author: "Walter Isaacson" },
    { title: "Surely You’re Joking, Mr. Feynman!", author: "Richard Feynman" },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
    { title: "Engineering Fundamentals", author: "Saeed Moaveni" },
    { title: "Introduction to Algorithms", author: "Cormen et al." },
    { title: "Clean Code", author: "Robert C. Martin" },
    { title: "The Pragmatic Programmer", author: "Hunt & Thomas" },
    { title: "The Selfish Gene", author: "Richard Dawkins" },
    { title: "Molecular Biology of the Cell", author: "Alberts et al." },
    { title: "Physics for Scientists and Engineers", author: "Serway & Jewett" },
  ],
  journals: [
    "Google Scholar",
    "PubMed",
    "IEEE Xplore",
    "SpringerLink",
    "ScienceDirect",
    "JSTOR",
  ],
  openAccessPlatforms: [
    "arXiv.org (Physics, Mathematics, Computer Science)",
    "PubMed Central",
    "Directory of Open Access Journals (DOAJ)",
    "Open Research Library",
  ],
  learningPlatforms: [
    "MIT OpenCourseWare",
    "Coursera (selected free courses)",
    "edX",
    "Khan Academy",
    "CS50 by Harvard University",
  ],
  researchTools: [
    "Zotero (reference management)",
    "Mendeley",
    "Overleaf (LaTeX writing)",
    "Grammarly (academic writing support)",
  ],
};

export default function ScholarsResourcesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Scholars Resources
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Academic and research support for STEM scholars to enhance their studies and professional development.
            </p>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Recommended STEM Books */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Book /> Recommended STEM Books</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {resources.books.map((book, index) => (
                  <div key={index}>
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Academic Journals & Research Databases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database /> Academic Journals & Databases</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {resources.journals.map((journal, index) => <li key={index} className="text-muted-foreground">{journal}</li>)}
                </ul>
              </CardContent>
            </Card>

            {/* Open-Access Research Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FlaskConical /> Open-Access Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {resources.openAccessPlatforms.map((platform, index) => <li key={index} className="text-muted-foreground">{platform}</li>)}
                </ul>
              </CardContent>
            </Card>

            {/* Skills & Learning Platforms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Laptop /> Skills & Learning Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {resources.learningPlatforms.map((platform, index) => <li key={index} className="text-muted-foreground">{platform}</li>)}
                </ul>
              </CardContent>
            </Card>

            {/* Research & Writing Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Edit /> Research & Writing Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {resources.researchTools.map((tool, index) => <li key={index} className="text-muted-foreground">{tool}</li>)}
                </ul>
              </CardContent>
            </Card>

            {/* Ethics & Responsible Research */}
            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle>Ethics & Responsible Research</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Scholars are expected to uphold:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Academic integrity</li>
                  <li>Proper citation and attribution</li>
                  <li>Ethical research practices</li>
                  <li>Respect for intellectual property</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
