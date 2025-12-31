"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Download, Search, Filter, Calendar, TrendingUp } from "lucide-react"

interface FeaturedResource {
  id: number
  title: string
  description: string
  link_url: string
  link_text: string
}

interface Publication {
  id: number
  title: string
  year: number
  summary: string
  pdf_url?: string
  download_count: number
  citation_count: number
}

export default function ResearchPublications() {
  const [resources, setResources] = useState<FeaturedResource[]>([])
  const [publications, setPublications] = useState<Publication[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [resourcesRes, publicationsRes] = await Promise.all([
        fetch("/api/research/resources"),
        fetch("/api/research/publications")
      ])
      
      if (resourcesRes.ok) {
        const data = await resourcesRes.json()
        setResources(data.resources || [])
      }
      
      if (publicationsRes.ok) {
        const data = await publicationsRes.json()
        setPublications(data.publications || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPublications = publications.filter(pub =>
    pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.summary.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Research & Publications
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Open, verifiable research and program evidence that informs Idrisa Foundation's STEM programs and supports scholars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Browse Publications
              </Button>
              <Button size="lg" variant="outline">
                Submit a Publication
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg leading-tight">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-sm leading-relaxed">
                      {resource.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(resource.link_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {resource.link_text}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className="text-3xl font-bold mb-4 md:mb-0">Idrisa Foundation Publications</h2>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Search & Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search publications, authors or keywords"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Year <Filter className="w-4 h-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Type <Filter className="w-4 h-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Topic <Filter className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Publications List */}
            <div className="space-y-6">
              {filteredPublications.map((publication) => (
                <Card key={publication.id}>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {publication.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {publication.year}
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {publication.download_count} downloads
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {publication.citation_count} citations
                          </div>
                        </div>
                        <CardDescription className="text-base">
                          {publication.summary}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="whitespace-nowrap">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {filteredPublications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No publications found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}