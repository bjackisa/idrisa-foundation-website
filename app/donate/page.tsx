"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, School, Users, Building, Handshake, Gift } from "lucide-react"

// Types
type Cause = 'Scholarship Fund' | 'School STEM Kits' | 'Mentorship & Incubation' | 'General Operating Support' | 'Corporate / Multi-year Support';

type PledgeDetails = {
  donationId: string;
  amount: number;
  currency: string;
  cause: Cause;
  email: string;
};

const causes: { name: Cause; short: string; suggested: string[]; icon: React.ElementType }[] = [
  { name: 'Scholarship Fund', short: 'Fund tuition, exam fees, or full scholarships for talented students.', suggested: ['$20', '$50', '$200', 'Other'], icon: Heart },
  { name: 'School STEM Kits', short: 'Provide lab kits, calculators, and classroom materials for rural schools.', suggested: ['$10', '$40', '$150', 'Other'], icon: School },
  { name: 'Mentorship & Incubation', short: 'Support mentorship matching, prototyping materials and incubation stipends.', suggested: ['$15', '$75', '$300', 'Other'], icon: Users },
  { name: 'General Operating Support', short: 'Help Idrisa run programs, logistics, and expand reach.', suggested: ['$10', '$50', '$250', 'Other'], icon: Building },
  { name: 'Corporate / Multi-year Support', short: 'For partners wishing to sponsor programs or commit multi-year funds.', suggested: [], icon: Handshake }
];

export default function DonatePage() {
  const [selectedCause, setSelectedCause] = useState<Cause | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [frequency, setFrequency] = useState('One-time');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<PledgeDetails | null>(null);

  const handlePledgeClick = (cause: Cause) => {
    setSelectedCause(cause);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      full_name: formData.get('fullName'),
      email: formData.get('email'),
      phone_number: formData.get('phone'),
      country: formData.get('country'),
      cause: selectedCause,
      amount: parseFloat(formData.get('amount') as string),
      currency: formData.get('currency'),
      frequency: formData.get('frequency'),
      preferred_payment_date: formData.get('paymentDate'),
      message: formData.get('message'),
      // Add consent checkboxes if needed for validation
    };

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Pledge submission failed');
      }

      setSuccess({
          donationId: result.donationId,
          amount: result.pledgeDetails.amount,
          currency: result.pledgeDetails.currency,
          cause: result.pledgeDetails.cause,
          email: result.pledgeDetails.email
      });
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-white">
      {/* Header */}
      <header className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-16 lg:py-24 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Donate — Support STEM Opportunity</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Support scholarships, STEM kits, mentorship and incubation for students across Uganda. Choose a cause below, pledge an amount, and we’ll issue a Donation ID so you can complete payment later or now.
          </p>
          <div className="mt-8">
            <Button size="lg" onClick={() => handlePledgeClick('General Operating Support')}>
                <Gift className="mr-2 h-5 w-5"/> Pledge or Give Now
            </Button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {success && (
          <div className="bg-green-50 border-b border-t border-green-200">
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-green-800">Thank you — your pledge is recorded</h2>
                <p className="mt-4 text-green-700 max-w-2xl mx-auto">
                    We have recorded your pledge of {success.currency}{success.amount} toward {success.cause}.
                    Your Donation ID is <strong>{success.donationId}</strong>.
                    We’ve sent a confirmation to {success.email} and a member of our team will contact you within 3 business days to confirm payment details.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <Button variant="outline">Download Pledge Receipt (PDF)</Button>
                    <Button onClick={() => setSuccess(null)}>Return to Donate</Button>
                </div>
            </div>
          </div>
      )}

      {/* Donation Causes */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {causes.map((cause) => (
              <Card key={cause.name} className="flex flex-col text-center">
                <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <cause.icon className="w-8 h-8 text-primary" />
                    </div>
                  <CardTitle className="text-xl">{cause.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600">{cause.short}</p>
                   {cause.suggested.length > 0 && (
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {cause.suggested.map(amount => (
                          <Button key={amount} variant="outline" size="sm">{amount}</Button>
                        ))}
                      </div>
                    )}
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full" onClick={() => handlePledgeClick(cause.name)}>
                    {cause.name === 'Corporate / Multi-year Support' ? 'Start Partnership Pledge' : `Pledge to ${cause.name.split(' ')[0]}`}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pledge Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pledge to: {selectedCause}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            <div>
              <Label htmlFor="fullName">Full name *</Label>
              <Input id="fullName" name="fullName" placeholder="Jane Doe" required />
            </div>
            <div>
              <Label htmlFor="email">Email address *</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required />
            </div>
            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" name="phone" placeholder="+256 7XXXXXXXX" />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" placeholder="Uganda" />
            </div>
             <div className="flex gap-4">
                <div className="flex-grow">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input id="amount" name="amount" type="number" placeholder="0.00" required />
                </div>
                <div>
                    <Label htmlFor="currency">Currency</Label>
                     <Select name="currency" defaultValue="USD">
                        <SelectTrigger id="currency">
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
                <RadioGroup name="frequency" defaultValue="One-time" className="flex mt-2" onValueChange={setFrequency}>
                    <Label className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer"><RadioGroupItem value="One-time" /><span>One-time</span></Label>
                    <Label className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer"><RadioGroupItem value="Monthly" /><span>Monthly</span></Label>
                    <Label className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer"><RadioGroupItem value="Annual" /><span>Annual</span></Label>
                    <Label className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer"><RadioGroupItem value="Pledge" /><span>Pledge</span></Label>
                </RadioGroup>
            </div>
            {frequency === 'Pledge' && (
                <div>
                    <Label htmlFor="paymentDate">Preferred payment date</Label>
                    <Input id="paymentDate" name="paymentDate" type="date" />
                </div>
            )}
             <div>
                <Label htmlFor="message">Message / Note (optional)</Label>
                <Input id="message" name="message" placeholder="200 chars max" />
            </div>
            <div className="space-y-2">
                <div className="flex items-start space-x-2">
                    <Checkbox id="confirm-pledge" name="confirmPledge" required />
                    <Label htmlFor="confirm-pledge" className="text-sm">I confirm this pledge and consent to be contacted about payment arrangements.</Label>
                </div>
                <div className="flex items-start space-x-2">
                    <Checkbox id="privacy-policy" name="privacyPolicy" required />
                    <Label htmlFor="privacy-policy" className="text-sm">I agree to the Idrisa Foundation Privacy Policy.</Label>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Pledge'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
