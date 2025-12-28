
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book, FlaskConical, Database, Laptop, Edit, ArrowRight } from "lucide-react";

const resourceSections = [
  {
    title: "Open-Access Textbooks",
    icon: <Book className="w-6 h-6" />,
    resources: [
      {
        name: "OpenStax",
        description: "Rice University’s OpenStax initiative provides over 50 free, peer-reviewed, openly licensed textbooks (for high school and college) covering STEM and social sciences. These high-quality digital texts (available under Creative Commons) can be downloaded or studied online.",
        url: "https://openstax.org",
      },
      {
        name: "LibreTexts",
        description: "A non-profit open-education platform hosting thousands of interactive, openly licensed textbooks across 17 subject libraries (including mathematics, physics, engineering, chemistry, biology, and computer science). LibreTexts materials are freely customizable and downloadable for students and instructors.",
        url: "https://libretexts.org",
      },
      {
        name: "Open Textbook Library",
        description: "An open-access collection of 1,760+ peer-reviewed textbooks spanning many STEM (and other) disciplines. All books are free to use, download, and adapt under open licenses, supporting affordable learning.",
        url: "https://open.umn.edu/opentextbooks",
      },
    ],
  },
  {
    title: "Online Courses & Learning Platforms",
    icon: <Laptop className="w-6 h-6" />,
    resources: [
      {
        name: "MIT OpenCourseWare",
        description: "A free repository of course materials (lecture notes, exams, videos) from over 2,500 courses at MIT. OCW covers engineering, science, math, computer science, and more, allowing learners worldwide to study MIT course content at their own pace.",
        url: "https://ocw.mit.edu",
      },
      {
        name: "Khan Academy",
        description: "A nonprofit offering free instructional videos and interactive exercises across K–12 and early-college subjects. Its library covers mathematics, natural sciences (physics, chemistry, biology), economics, computer programming, and test prep. The platform personalizes learning with practice problems and progress tracking.",
        url: "https://khanacademy.org",
      },
      {
        name: "edX",
        description: "A massive open online course (MOOC) platform founded by Harvard and MIT. edX provides free (audit) access to thousands of courses from top universities worldwide, covering STEM topics (AI, data science, engineering, etc.) as well as humanities. Courses can be taken asynchronously, and certificates or credit-bearing programs are available for a fee.",
        url: "https://edx.org",
      },
      {
        name: "Coursera",
        description: "Online education platform partnering with leading universities and companies. Coursera offers thousands of courses and specializations in fields like computer science, engineering, data science, and more. Users can often audit courses for free (preview video lectures and some content), while paid enrollment unlocks graded assignments and certificates.",
        url: "https://coursera.org",
      },
      {
        name: "Saylor Academy",
        description: "A nonprofit providing 150+ free, self-paced college-level courses in mathematics, science, engineering, business, and more. All courses are open to anyone; learners can earn certificates and even college credit by passing exams. Content is designed for both secondary and undergraduate learners.",
        url: "https://saylor.org",
      },
      {
        name: "Academic Earth",
        description: "A curated catalog of free online college courses (primarily video lectures) from top universities (Yale, MIT, Stanford, etc.). Academic Earth organizes courses by subject (physics, biology, engineering, etc.), providing easy access to high-quality lectures and curricula across STEM and beyond.",
        url: "https://academicearth.org",
      },
      {
        name: "freeCodeCamp",
        description: "A 501(c)(3) nonprofit coding education platform offering thousands of free tutorials, videos, and interactive coding lessons in programming, web development, and data science. Learners can build projects and earn certificates by completing hands-on coding challenges in languages like Python, JavaScript, and SQL.",
        url: "https://freecodecamp.org",
      },
    ],
  },
  {
    title: "Research Databases & Repositories",
    icon: <Database className="w-6 h-6" />,
    resources: [
      {
        name: "arXiv",
        description: "A free open-access repository of preprints in physics, mathematics, computer science, quantitative biology, and related fields. Researchers worldwide deposit draft papers on arXiv, making over 2 million eprints freely available. The content is open to all users (no paywall) and is widely used for timely dissemination of new results.",
        url: "https://arxiv.org",
      },
      {
        name: "PubMed",
        description: "A free search engine for biomedical and life-science literature. PubMed (by the U.S. NLM) indexes 39+ million citations from MEDLINE and other journals. While not all items have full text, it links to open-access articles in PubMed Central or publisher sites. It’s an essential tool for finding peer-reviewed articles in medicine, biology, chemistry, and related STEM fields.",
        url: "https://pubmed.ncbi.nlm.nih.gov",
      },
      {
        name: "PubMed Central (PMC)",
        description: "A free full-text archive of biomedical and life science journals maintained by the U.S. National Library of Medicine. Over 11 million articles are freely available here, including NIH-funded and other open-access journal papers. Users can search or browse PMC to read complete research articles without subscription.",
        url: "https://ncbi.nlm.nih.gov/pmc",
      },
      {
        name: "DOAJ (Directory of Open Access Journals)",
        description: "An online directory that indexes 20,000+ peer-reviewed open-access journals across all fields of science and technology. DOAJ helps students and scholars find reputable journals where all content is freely available. It is community-curated to ensure quality open access publishing.",
        url: "https://doaj.org",
      },
      {
        name: "Google Scholar",
        description: "A free web search engine for scholarly literature (articles, theses, books, abstracts) across disciplines. Google Scholar indexes articles from a wide range of journals, conference proceedings, books, and repositories. It provides citation metrics and often links to full-text versions if available (including preprints and open access).",
        url: "https://scholar.google.com",
      },
      {
        name: "Kaggle",
        description: "A platform and community for data science and machine learning. Kaggle offers thousands of public datasets and provides free cloud-based Jupyter notebooks for analysis. It also hosts data competitions, where learners can practice real-world problems. Kaggle’s resources (datasets, code notebooks, tutorials) make it a valuable research and learning tool for statistics and data science.",
        url: "https://kaggle.com",
      },
      {
        name: "Semantic Scholar",
        description: "A free, AI-powered search engine for scientific literature. It indexes over 230 million papers across science and technology. Semantic Scholar uses machine learning to highlight key concepts (methods, influential citations) and helps researchers discover relevant papers faster. The interface often links to free PDFs and tracks influential citations.",
        url: "https://semanticscholar.org",
      },
    ],
  },
  {
    title: "Citation & Research Tools",
    icon: <Edit className="w-6 h-6" />,
    resources: [
      {
        name: "Zotero",
        description: "A free, open-source reference manager and research assistant. Zotero lets users collect citations from web browsers, organize sources into folders or tags, annotate PDFs, and generate bibliographies in thousands of citation styles. It integrates with Word and Google Docs for easy citation formatting, helping students manage research literature at no cost.",
        url: "https://zotero.org",
      },
      {
        name: "Overleaf",
        description: "An online LaTeX editor for writing research papers, theses, and technical documents. Overleaf provides a collaborative environment (real-time co-author editing) with hundreds of free templates for academic journals and reports. Users can start writing LaTeX online without installation, manage bibliographies, and export documents to PDF. A free tier offers unlimited projects and one collaborator per document.",
        url: "https://overleaf.com",
      },
      {
        name: "Jupyter Notebook / JupyterLab",
        description: "Open-source web applications for interactive computing. Jupyter Notebook (and its next-generation interface, JupyterLab) lets students create documents that combine live code (Python, R, Julia, etc.), math equations, visualizations, and narrative text. This free tool is widely used in data science, engineering, and education to write and share computational analysis and research in a reproducible way.",
        url: "https://jupyter.org",
      },
    ],
  },
];

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
              A curated collection of academic and research tools to support your STEM journey.
            </p>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto space-y-12">
            {resourceSections.map((section, index) => (
              <div key={index}>
                <h2 className="text-3xl font-bold flex items-center gap-3 mb-8">
                  <span className="text-primary">{section.icon}</span>
                  {section.title}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.resources.map((resource, rIndex) => (
                    <Card key={rIndex} className="flex flex-col">
                      <CardHeader>
                        <CardTitle>{resource.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{resource.description}</p>
                      </CardContent>
                      <div className="p-6 pt-0">
                        <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full">
                            Visit Resource <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
