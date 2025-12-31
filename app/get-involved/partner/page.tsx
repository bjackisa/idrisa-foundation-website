"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, GraduationCap, Heart, Handshake } from "lucide-react"

const partnershipTiers = [
  {
    id: "founding",
    title: "Founding Partner (limited)",
    description: "Strategic multi-year commitment to underwrite scholarships and program expansion.",
    benefits: ["Logo on homepage", "Annual impact report feature", "Co-branded events", "Dedicated program updates"],
    commitment: "US$20,000+ over 2 years",
    icon: Building,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "program",
    title: "Program Partner",
    description: "Sponsor a specific program (e.g., annual STEM Olympiad, incubation cohort).",
    benefits: ["Program naming rights", "On-site speaking opportunity", "Periodic impact reports"],
    commitment: "US$5,000–20,000",
    icon: GraduationCap,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "education",
    title: "Education Partner (Schools & Universities)",
    description: "Register your institution to host programs, refer students, and offer internships.",
    benefits: ["Participation access", "Training for teachers", "Candidate pipelines"],
    commitment: "Institutional partnership",
    icon: Heart,
    color: "from-green-500 to-green-600"
  },
  {
    id: "in-kind",
    title: "In-Kind Partner",
    description: "Donate equipment (computers, lab kits) or services (printing, venue space).",
    benefits: ["Acknowledgement in donor list", "Project-specific recognition"],
    commitment: "Equipment or services",
    icon: Handshake,
    color: "from-orange-500 to-orange-600"
  }
]

export default function PartnerPage() {
  const [selectedTier, setSelectedTier] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    contactTitle: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    partnershipTier: "",
    description: "",
    estimatedCommitment: "",
    consent: false
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [requestId, setRequestId] = useState("")

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId)
    setFormData(prev => ({ ...prev, partnershipTier: tierId }))
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.consent) return

    setLoading(true)
    try {
      const response = await fetch("/api/partnerships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setRequestId(data.requestId)
        setSuccess(true)
      }
    } catch (error) {
      console.error("Error submitting partnership:", error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-600">Partnership Request Received</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>
                Thank you for your interest in partnering with Idrisa Foundation. 
                Your request ID is <strong>{requestId}</strong>. Our Partnerships team will review 
                and contact you within 5 business days to discuss next steps.
              </p>
              <Button onClick={() => window.location.href = "/get-involved/partner"}>
                Submit Another Request
              </Button>
            </CardContent>
          </Card>
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
              Partner With Idrisa Foundation
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join us as a partner to fund scholarships, scale STEM programs, and mentor the next generation of innovators.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Apply to Partner
            </Button>
          </div>
        </div>
      </section>

      {!showForm ? (
        /* Partnership Tiers */
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {partnershipTiers.map((tier) => (
                  <Card key={tier.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                        <tier.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{tier.title}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Benefits:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {tier.benefits.map((benefit, i) => (
                              <li key={i}>• {benefit}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Suggested commitment:</p>
                          <p className="text-sm text-muted-foreground">{tier.commitment}</p>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => handleTierSelect(tier.id)}
                        >
                          Apply: {tier.title.split(" ")[0]} Partner
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Application Form */
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Partnership Application</CardTitle>
                  <CardDescription>
                    Applying for: {partnershipTiers.find(t => t.id === selectedTier)?.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="organizationName">Organization or individual name *</Label>
                      <Input
                        id="organizationName"
                        value={formData.organizationName}
                        onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Contact person (name & title) *</Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactTitle">Title</Label>
                        <Input
                          id="contactTitle"
                          value={formData.contactTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactTitle: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Short description of partnership idea *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your partnership idea (150-400 characters)"
                        minLength={150}
                        maxLength={400}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="estimatedCommitment">Estimated commitment (USD or in-kind value)</Label>
                      <Input
                        id="estimatedCommitment"
                        placeholder="Optional"
                        value={formData.estimatedCommitment}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedCommitment: e.target.value }))}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: !!checked }))}
                      />
                      <Label htmlFor="consent" className="text-sm">
                        I consent to be contacted by Idrisa Foundation about this partnership. *
                      </Label>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                      >
                        Back to Tiers
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading || !formData.consent}
                        className="flex-1"
                      >
                        {loading ? "Submitting..." : "Submit Partnership Request"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}