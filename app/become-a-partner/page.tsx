"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Handshake, Zap, BookOpen, Truck, ChevronRight } from "lucide-react"

// Types & Data
type PartnershipTier = 'Founding' | 'Program' | 'Education' | 'In-Kind' | 'Other';
type SuccessInfo = { requestId: string };

const tiers: { name: PartnershipTier; short: string; benefits: string[]; commitment: string; icon: React.ElementType }[] = [
    { name: 'Founding', short: 'Strategic multi-year commitment to underwrite scholarships and program expansion.', benefits: ['Logo on homepage', 'Annual impact report feature', 'Co-branded events', 'Dedicated program updates'], commitment: 'US$20,000+ over 2 years', icon: Handshake },
    { name: 'Program', short: 'Sponsor a specific program (e.g., annual STEM Olympiad, incubation cohort).', benefits: ['Program naming rights', 'On-site speaking opportunity', 'Periodic impact reports'], commitment: 'US$5,000–20,000', icon: Zap },
    { name: 'Education', short: 'Register your institution to host programs, refer students, and offer internships.', benefits: ['Participation access', 'Training for teachers', 'Candidate pipelines'], commitment: '', icon: BookOpen },
    { name: 'In-Kind', short: 'Donate equipment (computers, lab kits) or services (printing, venue space).', benefits: ['Acknowledgement in donor list', 'Project-specific recognition'], commitment: '', icon: Truck }
];

export default function PartnerPage() {
    const [selectedTier, setSelectedTier] = useState<PartnershipTier>('Program');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<SuccessInfo | null>(null);

    const handleApplyClick = (tier: PartnershipTier) => {
        setSelectedTier(tier);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(event.currentTarget);
        const data = {
            organization_name: formData.get('organization_name'),
            contact_person: formData.get('contact_person'),
            email: formData.get('email'),
            phone_number: formData.get('phone_number'),
            country_city: formData.get('country_city'),
            partnership_tier: formData.get('partnership_tier'),
            partnership_idea: formData.get('partnership_idea'),
            estimated_commitment: formData.get('estimated_commitment'),
        };

        try {
            const response = await fetch('/api/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.details?.fieldErrors?.partnership_idea?.[0] || result.error || 'Submission failed');
            setSuccess({ requestId: result.requestId });
            setIsDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white">
            <header className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 py-16 lg:py-24 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Partner With Idrisa Foundation</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Join us as a partner to fund scholarships, scale STEM programs, and mentor the next generation of innovators.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" onClick={() => handleApplyClick('Program')}>
                            Apply to Partner
                        </Button>
                    </div>
                </div>
            </header>

            {success && (
                <div className="bg-blue-50 border-y border-blue-200">
                    <div className="container mx-auto px-4 py-8 text-center">
                        <h2 className="text-2xl font-bold text-blue-800">Partnership Request Received</h2>
                        <p className="mt-2 text-blue-700">
                            Thank you for your interest. Your request ID is <strong>{success.requestId}</strong>.
                            Our Partnerships team will review and contact you within 5 business days.
                        </p>
                    </div>
                </div>
            )}

            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {tiers.map(tier => (
                            <Card key={tier.name} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <tier.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-2xl">{tier.name} Partner</CardTitle>
                                    </div>
                                    <p className="text-muted-foreground">{tier.short}</p>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <h4 className="font-semibold mb-2">Benefits:</h4>
                                    <ul className="space-y-2 text-muted-foreground">
                                        {tier.benefits.map(benefit => (
                                            <li key={benefit} className="flex items-start">
                                                <ChevronRight className="w-4 h-4 mr-2 mt-1 text-primary shrink-0"/>
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {tier.commitment && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold">Suggested commitment:</h4>
                                            <p className="text-muted-foreground">{tier.commitment}</p>
                                        </div>
                                    )}
                                </CardContent>
                                <div className="p-6 pt-0">
                                    <Button className="w-full" onClick={() => handleApplyClick(tier.name)}>Apply: {tier.name} Partner</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Partner Application Form</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                         <div>
                            <Label>Partnership tier interested in</Label>
                            <Select name="partnership_tier" value={selectedTier} onValueChange={(v) => setSelectedTier(v as PartnershipTier)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {tiers.map(t => <SelectItem key={t.name} value={t.name}>{t.name} Partner</SelectItem>)}
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="organization_name">Organization or individual name *</Label>
                            <Input id="organization_name" name="organization_name" required/>
                        </div>
                        <div>
                            <Label htmlFor="contact_person">Contact person (name & title) *</Label>
                            <Input id="contact_person" name="contact_person" required/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="email">Email address *</Label>
                                <Input id="email" name="email" type="email" required/>
                            </div>
                            <div>
                                <Label htmlFor="phone_number">Phone number</Label>
                                <Input id="phone_number" name="phone_number"/>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="country_city">Country & City</Label>
                            <Input id="country_city" name="country_city"/>
                        </div>
                        <div>
                            <Label htmlFor="partnership_idea">Short description of partnership idea * (150–400 chars)</Label>
                            <Textarea id="partnership_idea" name="partnership_idea" required minLength={150} maxLength={400}/>
                        </div>
                        <div>
                            <Label htmlFor="estimated_commitment">Estimated commitment (USD or in-kind value)</Label>
                            <Input id="estimated_commitment" name="estimated_commitment"/>
                        </div>
                        <div>
                             <Label htmlFor="attachment">Upload: letter of interest or MOA (PDF)</Label>
                             <Input id="attachment" name="attachment" type="file" accept=".pdf"/>
                        </div>
                        <div className="flex items-start space-x-2">
                             <Checkbox id="consent" name="consent" required/>
                             <Label htmlFor="consent" className="text-sm">I consent to be contacted by Idrisa Foundation about this partnership.</Label>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Partnership Request'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
