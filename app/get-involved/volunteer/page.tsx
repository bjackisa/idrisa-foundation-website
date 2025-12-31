"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Calendar, Megaphone, Code } from "lucide-react"

const volunteerRoles = [
  {
    id: "mentor",
    title: "Mentor — STEM Mentorship",
    description: "One-on-one or small-group mentoring — 1–3 hours/week.",
    tasks: "Academic guidance, project feedback, mock interviews.",
    icon: Users,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "event",
    title: "Event Support — Olympiad & Workshops",
    description: "Event logistics, registration, timekeeping, and onsite support.",
    commitment: "4–12 hours per event.",
    icon: Calendar,
    color: "from-green-500 to-green-600"
  },
  {
    id: "outreach",
    title: "Outreach Facilitator",
    description: "Run teacher training or school STEM club sessions — 2–8 hours/month.",
    icon: Megaphone,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "technical",
    title: "Technical Volunteer (Web / Data / DevOps)",
    description: "Short-term sprints for website, dashboards, data cleaning.",
    icon: Code,
    color: "from-orange-500 to-orange-600"
  }
]

export default function VolunteerPage() {
  const [selectedRole, setSelectedRole] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    role: "",
    availability: "",
    emergencyContact: "",
    consent: false
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [applicationId, setApplicationId] = useState("")

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    setFormData(prev => ({ ...prev, role: roleId }))
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.consent) return

    setLoading(true)
    try {
      const response = await fetch("/api/volunteers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        setApplicationId(data.applicationId)
        setSuccess(true)
      }
    } catch (error) {
      console.error("Error submitting application:", error)
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
              <CardTitle className="text-2xl text-green-600">Application Received</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>
                Thank you. Your volunteer application ID is <strong>{applicationId}</strong>. 
                We'll review and contact you within 7 business days.
              </p>
              <Button onClick={() => window.location.href = "/get-involved/volunteer"}>
                Submit Another Application
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
              Volunteer with Idrisa Foundation
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Give your time and expertise — mentor students, support events, teach workshops, or help behind the scenes.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Sign Up to Volunteer
            </Button>
          </div>
        </div>
      </section>

      {!showForm ? (
        /* Volunteer Roles */
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {volunteerRoles.map((role) => (
                  <Card key={role.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}>
                        <role.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{role.title}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {role.tasks && (
                          <div>
                            <p className="text-sm font-medium">Key tasks:</p>
                            <p className="text-sm text-muted-foreground">{role.tasks}</p>
                          </div>
                        )}
                        {role.commitment && (
                          <div>
                            <p className="text-sm font-medium">Time commitment:</p>
                            <p className="text-sm text-muted-foreground">{role.commitment}</p>
                          </div>
                        )}
                        <Button 
                          className="w-full" 
                          onClick={() => handleRoleSelect(role.id)}
                        >
                          {role.id === "technical" ? "Offer Skills" : `Apply: ${role.title.split(" ")[0]}`}
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
                  <CardTitle>Volunteer Application</CardTitle>
                  <CardDescription>
                    Applying for: {volunteerRoles.find(r => r.id === selectedRole)?.title}
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
                        <Label htmlFor="email">Email address *</Label>
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
                        <Label htmlFor="phone">Phone number *</Label>
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
                      <Label htmlFor="availability">Availability (days & hours) *</Label>
                      <Textarea
                        id="availability"
                        placeholder="e.g., Weekends, 2-4 hours per week"
                        value={formData.availability}
                        onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="emergencyContact">Emergency contact (optional)</Label>
                      <Input
                        id="emergencyContact"
                        placeholder="Name and phone number"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: !!checked }))}
                      />
                      <Label htmlFor="consent" className="text-sm">
                        I consent to background checks and agree to volunteer terms. *
                      </Label>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                      >
                        Back to Roles
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading || !formData.consent}
                        className="flex-1"
                      >
                        {loading ? "Submitting..." : "Sign Up"}
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