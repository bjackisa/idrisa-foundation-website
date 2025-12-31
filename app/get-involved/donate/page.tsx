"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, GraduationCap, Microscope, Users, Building } from "lucide-react"

const donationCauses = [
  {
    id: "scholarship",
    title: "Scholarship Fund",
    description: "Fund tuition, exam fees, or full scholarships for talented students.",
    amounts: [20, 50, 200],
    icon: GraduationCap,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "stem-kits",
    title: "School STEM Kits",
    description: "Provide lab kits, calculators, and classroom materials for rural schools.",
    amounts: [10, 40, 150],
    icon: Microscope,
    color: "from-green-500 to-green-600"
  },
  {
    id: "mentorship",
    title: "Mentorship & Incubation",
    description: "Support mentorship matching, prototyping materials and incubation stipends.",
    amounts: [15, 75, 300],
    icon: Users,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "general",
    title: "General Operating Support",
    description: "Help Idrisa run programs, logistics, and expand reach.",
    amounts: [10, 50, 250],
    icon: Heart,
    color: "from-pink-500 to-pink-600"
  },
  {
    id: "corporate",
    title: "Corporate / Multi-year Support",
    description: "For partners wishing to sponsor programs or commit multi-year funds.",
    amounts: [],
    icon: Building,
    color: "from-orange-500 to-orange-600"
  }
]

export default function DonatePage() {
  const [selectedCause, setSelectedCause] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Uganda",
    amount: "",
    currency: "USD",
    frequency: "One-time",
    paymentDate: "",
    message: "",
    consent: false,
    privacy: false
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [donationId, setDonationId] = useState("")

  const handleCauseSelect = (cause: string) => {
    setSelectedCause(cause)
    setFormData(prev => ({ ...prev, cause }))
    setShowForm(true)
  }

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.consent || !formData.privacy) return

    setLoading(true)
    try {
      const response = await fetch("/api/donations/pledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cause: selectedCause,
          amount: parseFloat(formData.amount)
        })
      })

      if (response.ok) {
        const data = await response.json()
        setDonationId(data.donationId)
        setSuccess(true)
      }
    } catch (error) {
      console.error("Error submitting pledge:", error)
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
              <CardTitle className="text-2xl text-green-600">Thank you — your pledge is recorded</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>
                We have recorded your pledge of {formData.currency}{formData.amount} toward {selectedCause}. 
                Your Donation ID is <strong>{donationId}</strong>. We've sent a confirmation to {formData.email} 
                and a member of our team will contact you within 3 business days to confirm payment details.
              </p>
              <div className="flex gap-4 justify-center">
                <Button>Download Pledge Receipt (PDF)</Button>
                <Button variant="outline" onClick={() => window.location.href = "/get-involved/donate"}>
                  Return to Donate
                </Button>
              </div>
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
              Donate — Support STEM Opportunity
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Support scholarships, STEM kits, mentorship and incubation for students across Uganda.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Choose a cause below, pledge an amount, and we'll issue a Donation ID so you can complete payment later or now.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Pledge or Give Now
            </Button>
          </div>
        </div>
      </section>

      {!showForm ? (
        /* Donation Causes */
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donationCauses.map((cause) => (
                  <Card key={cause.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${cause.color} flex items-center justify-center mb-4`}>
                        <cause.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{cause.title}</CardTitle>
                      <CardDescription>{cause.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {cause.amounts.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Suggested amounts:</p>
                          <div className="flex gap-2 flex-wrap">
                            {cause.amounts.map((amount) => (
                              <span key={amount} className="text-sm bg-muted px-2 py-1 rounded">
                                ${amount}
                              </span>
                            ))}
                            <span className="text-sm bg-muted px-2 py-1 rounded">Other</span>
                          </div>
                        </div>
                      )}
                      <Button 
                        className="w-full" 
                        onClick={() => handleCauseSelect(cause.id)}
                      >
                        {cause.id === "corporate" ? "Start Partnership Pledge" : `Pledge to ${cause.title}`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Pledge Form */
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Pledge</CardTitle>
                  <CardDescription>
                    Pledging to: {donationCauses.find(c => c.id === selectedCause)?.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full name *</Label>
                        <Input
                          id="fullName"
                          placeholder="Jane Doe"
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
                          placeholder="name@example.com"
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
                          placeholder="+256 7XXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          placeholder="Uganda"
                          value={formData.country}
                          onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="amount">Amount *</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                          required
                        />
                        {selectedCause !== "corporate" && (
                          <div className="flex gap-2 mt-2">
                            {donationCauses.find(c => c.id === selectedCause)?.amounts.map((amount) => (
                              <Button
                                key={amount}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleAmountSelect(amount)}
                              >
                                ${amount}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="UGX">UGX</SelectItem>
                            <SelectItem value="KES">KES</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Frequency</Label>
                      <RadioGroup value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="One-time" id="onetime" />
                          <Label htmlFor="onetime">One-time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Monthly" id="monthly" />
                          <Label htmlFor="monthly">Monthly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Annual" id="annual" />
                          <Label htmlFor="annual">Annual</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Pledge" id="pledge" />
                          <Label htmlFor="pledge">Pledge (I will pay on specific date)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.frequency === "Pledge" && (
                      <div>
                        <Label htmlFor="paymentDate">Preferred payment date</Label>
                        <Input
                          id="paymentDate"
                          type="date"
                          value={formData.paymentDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="message">Message / Note (optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Any additional message..."
                        maxLength={200}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="consent"
                          checked={formData.consent}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: !!checked }))}
                        />
                        <Label htmlFor="consent" className="text-sm">
                          I confirm this pledge and consent to be contacted about payment arrangements. *
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="privacy"
                          checked={formData.privacy}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, privacy: !!checked }))}
                        />
                        <Label htmlFor="privacy" className="text-sm">
                          I agree to the Idrisa Foundation Privacy Policy. *
                        </Label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                      >
                        Back to Causes
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading || !formData.consent || !formData.privacy}
                        className="flex-1"
                      >
                        {loading ? "Submitting..." : "Submit Pledge"}
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