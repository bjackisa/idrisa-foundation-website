"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Search, ExternalLink, Download, BookOpen, Microscope, FileText } from "lucide-react"
import Link from "next/link"

// Types
type Publication = {
  id: string;
  title: string;
  year: number;
  summary: string;
  download_url: string | null;
  created_at: string;
};

type Resource = {
  title: string;
  description: string;
  link: string;
  linkText: string;
  icon: React.ElementType;
};

// Static data from prompt
const featuredResources: Resource[] = [
  { title: "OpenStax", description: "College-level, openly licensed textbooks covering Physics, Biology, Calculus, and more — free to read or download (PDF / web). Ideal for scholars and teachers.", link: "https://openstax.org/", linkText: "Open OpenStax", icon: BookOpen },
  { title: "LibreTexts", description: "Large collection of open textbooks and interactive materials across 13+ STEM disciplines — customizable for class and self-study.", link: "https://libretexts.org/", linkText: "Open LibreTexts", icon: BookOpen },
  { title: "MIT OpenCourseWare", description: "Lecture notes, videos, problem sets and exams from MIT courses — excellent for independent study in programming, algorithms, electrical engineering and more.", link: "https://ocw.mit.edu/", linkText: "Browse MIT OCW", icon: Microscope },
  { title: "arXiv", description: "Fast public access to preprints and research papers — useful for advanced scholars, research mentors, and project reading lists.", link: "https://arxiv.org/", linkText: "Search arXiv", icon: FileText },
  { title: "PLOS", description: "Peer-reviewed, open-access journals in biology, computational biology and interdisciplinary science — full-text freely available.", link: "https://plos.org/", linkText: "View PLOS journals", icon: Microscope },
  { title: "DOAJ", description: "Index of reputable open access journals across all STEM disciplines — search for peer-reviewed open journals and articles.", link: "https://doaj.org/", linkText: "Search DOAJ", icon: Search },
  { title: "PubMed Central (PMC)", description: "Free full-text archive of biomedical and life sciences research papers — useful for biology and applied sciences scholars.", link: "https://www.ncbi.nlm.nih.gov/pmc/", linkText: "Explore PMC", icon: Microscope },
  { title: "Kaggle Datasets", description: "Public datasets plus community notebooks for data science and machine-learning practice. Great for data-science projects and competitions.", link: "https://www.kaggle.com/datasets", linkText: "Browse Kaggle datasets", icon: FileText },
  { title: "Semantic Scholar", description: "AI-powered search to surface influential papers and summaries across STEM fields. Helpful for literature reviews and citation discovery.", link: "https://www.semanticscholar.org/", linkText: "Search Semantic Scholar", icon: Search },
];

const samplePublication: Publication = {
    id: "sample-1",
    title: "Idrisa Foundation — 2025 Baseline Report: STEM Outreach & Scholarship Pilots",
    year: 2025,
    summary: "Baseline enrollment and participation data from our first STEM Olympiad pilot and scholarship selection metrics.",
    download_url: "#",
    created_at: new Date().toISOString()
}

export default function ResearchAndPublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([samplePublication]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<{ message: string; submissionId: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/research-publications');
        if (!response.ok) throw new Error('Failed to fetch publications');
        const data = await response.json();
        // Prepend sample publication to the fetched list if it's not already there
        setPublications(prev => [samplePublication, ...data.publications.filter((p: Publication) => p.id !== 'sample-1')]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchPublications();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setSubmissionStatus(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      publication_title: formData.get('title'),
      submitter_name: formData.get('fullName'),
      submitter_email: formData.get('email'),
    };

    try {
      const response = await fetch('/api/research-publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      setSubmissionStatus({ message: result.message, submissionId: result.submissionId });
      setIsDialogOpen(false); // Close dialog on success
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-12 lg:py-20 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Research & Publications</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Open, verifiable research and program evidence that informs Idrisa Foundation’s STEM programs and supports scholars.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <a href="#publications-list">Browse Publications</a>
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline">Submit a Publication</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Submit a Publication</DialogTitle>
                  <DialogDescription>
                    Share your research with the Idrisa Foundation community. We will review for relevance before publishing.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">Title</Label>
                      <Input id="title" name="title" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fullName" className="text-right">Full Name</Label>
                      <Input id="fullName" name="fullName" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">Email</Label>
                      <Input id="email" name="email" type="email" className="col-span-3" required />
                    </div>
                  </div>
                   {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
                  <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
           {submissionStatus && (
            <div className="mt-6 p-4 bg-green-100 border border-green-200 text-green-800 rounded-md max-w-2xl mx-auto">
                <p className="font-semibold">{submissionStatus.message}</p>
                <p>Submission ID: {submissionStatus.submissionId}. Our research team will review and notify you within 7 business days.</p>
            </div>
          )}
        </div>
      </header>

      {/* Featured Resources */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <Card key={resource.title} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <resource.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600">{resource.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <a href={resource.link} target="_blank" rel="noopener noreferrer">
                      {resource.linkText}
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Idrisa Publications List */}
      <section id="publications-list" className="py-16 lg:py-24 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Idrisa Foundation Publications</h2>
            <p className="mt-2 text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input placeholder="Search publications, authors or keywords" className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Year ▾</Button>
              <Button variant="outline">Type ▾</Button>
              <Button variant="outline">Topic ▾</Button>
            </div>
            <div className="border-l pl-4 ml-2">
               <Button variant="ghost">Sort: Newest ▾</Button>
            </div>
          </div>

          {/* Publications Grid */}
          <div className="space-y-6">
            {loading ? (
                <p className="text-center text-gray-500">Loading publications...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
              publications.map((pub) => (
                <Card key={pub.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="p-6 flex-grow">
                      <p className="text-sm text-gray-500 mb-1">{pub.year}</p>
                      <h3 className="text-xl font-semibold mb-2">{pub.title}</h3>
                      <p className="text-gray-600">{pub.summary}</p>
                    </div>
                    <div className="p-6 bg-gray-50/70 flex items-center justify-center md:w-56 shrink-0">
                       <Button disabled={pub.download_url === "#"}>
                         <Download className="mr-2 w-4 h-4" />
                         Download PDF
                       </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
