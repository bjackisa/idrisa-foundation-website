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
import { Megaphone, Users, Landmark, Download, CheckCircle } from "lucide-react"

// Types & Data
type AdvocacyType = 'Digital' | 'Community' | 'Policy';
type SuccessInfo = { advocateId: string };

const tiers: { name: AdvocacyType; short: string; expectations: string; icon: React.ElementType }[] = [
    { name: 'Digital', short: 'Share prepared social posts, campaign graphics and recruit supporters online.', expectations: '2–4 posts/month from toolkit.', icon: Megaphone },
    { name: 'Community', short: 'Organize local STEM meetups, school talks, or community discussions.', expectations: '1 event/quarter.', icon: Users },
    { name: 'Policy', short: 'Engage with local education stakeholders to promote STEM policies and partnerships.', expectations: 'By invitation only.', icon: Landmark }
];

const toolkitItems = [
    { name: '1-page Factsheet (print-ready)', description: 'Use for school visits' },
    { name: '10 ready-to-post social captions + image suggestions', description: 'Share on Facebook, X, WhatsApp' },
    { name: 'Outreach email template', description: 'To arrange meetings with schools/partners' },
    { name: 'Event checklist (one-page)', description: 'How to run a safe STEM meetup' },
    { name: 'Monthly reporting form (short)', description: 'Report activities & photos' },
];

export default function AdvocatePage() {
    const [selectedTier, setSelectedTier] = useState<AdvocacyType>('Digital');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<SuccessInfo | null>(null);

    const handleApplyClick = (tier: AdvocacyType) => {
        if (tier === 'Policy') {
            // In a real app, this might link to a contact page or mailto link
            alert("Policy advocacy is by invitation only. Please contact our policy team for more information.");
            return;
        }
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
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            phone_number: formData.get('phone_number'),
            location: formData.get('location'),
            advocacy_type: formData.get('advocacy_type'),
            advocacy_plan: formData.get('advocacy_plan'),
            estimated_monthly_hours: parseInt(formData.get('estimated_monthly_hours') as string) || null,
        };

        try {
            const response = await fetch('/api/advocates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.details?.fieldErrors?.advocacy_plan?.[0] || result.error || 'Registration failed');
            setSuccess({ advocateId: result.advocateId });
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
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Advocate & Share</h1>
                    <h2 className="text-2xl lg:text-3xl font-semibold text-primary mt-2">Become an Idrisa Ambassador</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Amplify Idrisa’s mission in your community: run awareness events, share social toolkits, or represent us locally.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" onClick={() => handleApplyClick('Community')}>
                            Apply to be an Advocate
                        </Button>
                    </div>
                </div>
            </header>

            {success && (
                <div className="bg-green-50 border-y border-green-200">
                    <div className="container mx-auto px-4 py-8 text-center">
                        <h2 className="text-2xl font-bold text-green-800">Registration Received</h2>
                        <p className="mt-2 text-green-700">
                            Thanks — your advocate registration is received. ID: <strong>{success.advocateId}</strong>.
                            We’ll send the toolkit and onboarding email within 3 business days.
                        </p>
                    </div>
                </div>
            )}

            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tiers.map(tier => (
                            <Card key={tier.name} className="flex flex-col text-center">
                                <CardHeader>
                                     <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <tier.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">{tier.name} Advocate</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground">{tier.short}</p>
                                    <div className="mt-4">
                                        <h4 className="font-semibold">Expectations:</h4>
                                        <p className="text-muted-foreground">{tier.expectations}</p>
                                    </div>
                                </CardContent>
                                <div className="p-6 pt-0">
                                    <Button className="w-full" onClick={() => handleApplyClick(tier.name)} disabled={tier.name === 'Policy'}>
                                        {tier.name === 'Policy' ? 'Contact Policy Team' : `Join as ${tier.name} Advocate`}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

             <section className="bg-gray-50 border-t py-16 lg:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Downloadable Advocate Toolkit</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-8">Get everything you need to start advocating for STEM education in your community.</p>
                    <div className="max-w-md mx-auto bg-white border rounded-lg p-6 text-left space-y-3 mb-8">
                        {toolkitItems.map(item => (
                            <div key={item.name} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 shrink-0" />
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button size="lg"><Download className="mr-2 h-5 w-5"/> Download Advocate Toolkit</Button>
                </div>
            </section>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Advocate Registration</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                        <div><Label htmlFor="full_name">Full name *</Label><Input id="full_name" name="full_name" required/></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" required/></div>
                           <div><Label htmlFor="phone_number">Phone</Label><Input id="phone_number" name="phone_number"/></div>
                        </div>
                        <div><Label htmlFor="location">Location (City/District) *</Label><Input id="location" name="location" required/></div>
                        <div>
                            <Label>Advocacy type</Label>
                            <Select name="advocacy_type" value={selectedTier} onValueChange={(v) => setSelectedTier(v as AdvocacyType)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {tiers.filter(t => t.name !== 'Policy').map(t => <SelectItem key={t.name} value={t.name}>{t.name} Advocate</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label htmlFor="advocacy_plan">Short plan: Describe how you will advocate (100–250 chars) *</Label><Textarea id="advocacy_plan" name="advocacy_plan" required minLength={100} maxLength={250}/></div>
                        <div><Label htmlFor="estimated_monthly_hours">Estimated monthly hours (optional)</Label><Input id="estimated_monthly_hours" name="estimated_monthly_hours" type="number"/></div>
                        <div className="flex items-start space-x-2">
                             <Checkbox id="agreement" name="agreement" required/>
                             <Label htmlFor="agreement" className="text-sm">I agree to use Idrisa’s brand assets responsibly and submit monthly activity reports.</Label>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Become an Advocate'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
