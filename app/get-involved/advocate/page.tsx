"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Smartphone, Users, Building, Download } from "lucide-react"

const advocateTiers = [
  {
    id: "digital",
    title: "Digital Advocate",
    description: "Share prepared social posts, campaign graphics and recruit supporters online.",
    expectations: "2–4 posts/month from toolkit.",
    icon: Smartphone,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "community",
    title: "Community Advocate",
    description: "Organize local STEM meetups, school talks, or community discussions.",
    expectations: "1 event/quarter.",
    icon: Users,
    color: "from-green-500 to-green-600"
  },
  {
    id: "policy",
    title: "Policy Advocate (by invitation only)",
    description: "Engage with local education stakeholders to promote STEM policies and partnerships.",
    expectations: "By invitation only.",
    icon: Building,
    color: "from-purple-500 to-purple-600"
  }
]

export default function AdvocatePage() {
  const [selectedTier, setSelectedTier] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    district: "",
    advocacyType: "",
    plan: "",
    socialHandles: "",
    estimatedHours: "",
    agreement: false
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [advocateId, setAdvocateId] = useState("")

  const handleTierSelect = (tierId: string) => {
    if (tierId === "policy") {
      // Redirect to contact for policy advocacy
      return
    }
    setSelectedTier(tierId)
    setFormData(prev => ({ ...prev, advocacyType: tierId }))
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreement) return

    setLoading(true)
    try {
      const response = await fetch("/api/advocates/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setAdvocateId(data.advocateId)
        setSuccess(true)
      }
    } catch (error) {
      console.error("Error submitting registration:", error)
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
              <CardTitle className="text-2xl text-green-600">Advocate Registration Received</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>
                Thanks — your advocate registration is received. ID: <strong>{advocateId}</strong>. 
                We'll send the toolkit and onboarding email within 3 business days.
              </p>
              <Button onClick={() => window.location.href = "/get-involved/advocate"}>
                Register Another Advocate
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
              Advocate & Share — Become an Idrisa Ambassador
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Amplify Idrisa's mission in your community: run awareness events, share social toolkits, or represent us locally.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Apply to be an Advocate
            </Button>
          </div>
        </div>
      </section>

      {!showForm ? (
        /* Advocate Tiers */
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {advocateTiers.map((tier) => (
                  <Card key={tier.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                        <tier.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{tier.title}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Expectations:</p>
                          <p className="text-sm text-muted-foreground">{tier.expectations}</p>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => handleTierSelect(tier.id)}
                          disabled={tier.id === "policy"}
                        >
                          {tier.id === "policy" ? "Contact Policy Team" : `Join as ${tier.title.split(" ")[0]} Advocate`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Toolkit Download */}
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Advocate Toolkit
                  </CardTitle>
                  <CardDescription>
                    Everything you need to start advocating for STEM education
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-medium mb-2">Toolkit Contents:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 1-page Factsheet (print-ready) — Use for school visits</li>
                        <li>• 10 ready-to-post social captions + image suggestions</li>
                        <li>• Outreach email template — To arrange meetings</li>
                        <li>• Event checklist (one-page) — How to run a safe STEM meetup</li>
                        <li>• Monthly reporting form (short) — Report activities & photos</li>
                      </ul>
                    </div>
                    <div className="flex items-center">
                      <Button size="lg" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Advocate Toolkit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      ) : (
        /* Registration Form */
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Advocate Registration</CardTitle>
                  <CardDescription>
                    Registering as: {advocateTiers.find(t => t.id === selectedTier)?.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full name *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City/District *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="plan">Short plan: Describe how you will advocate (100–250 chars) *</Label>
                      <Textarea
                        id="plan"
                        placeholder="Describe your advocacy plan..."
                        minLength={100}
                        maxLength={250}
                        value={formData.plan}
                        onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="socialHandles">Social handles (optional)</Label>
                        <Input
                          id="socialHandles"
                          placeholder="@username, @handle"
                          value={formData.socialHandles}
                          onChange={(e) => setFormData(prev => ({ ...prev, socialHandles: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="estimatedHours">Estimated monthly hours (optional)</Label>
                        <Input
                          id="estimatedHours"
                          type="number"
                          placeholder="5"
                          value={formData.estimatedHours}
                          onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreement"
                        checked={formData.agreement}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreement: !!checked }))}
                      />
                      <Label htmlFor="agreement" className="text-sm">
                        I agree to use Idrisa's brand assets responsibly and submit monthly activity reports. *
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
                        disabled={loading || !formData.agreement}
                        className="flex-1"
                      >
                        {loading ? "Submitting..." : "Become an Advocate"}
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