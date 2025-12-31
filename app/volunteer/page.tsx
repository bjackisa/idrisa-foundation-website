"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Calendar, Zap, Code } from "lucide-react"

// Types
type Role = 'Mentor' | 'Event Support' | 'Outreach Facilitator' | 'Technical Volunteer';
type FormType = 'Quick' | 'Full';
type SuccessInfo = { applicationId: string };

const roles: { name: Role; title: string; short: string; tasks: string; formType: FormType, icon: React.ElementType }[] = [
    { name: 'Mentor', title: 'STEM Mentorship', short: 'One-on-one or small-group mentoring — 1–3 hours/week.', tasks: 'Academic guidance, project feedback, mock interviews.', formType: 'Full', icon: User },
    { name: 'Event Support', title: 'Olympiad & Workshops', short: 'Event logistics, registration, timekeeping, and onsite support.', tasks: 'Time commitment: 4–12 hours per event.', formType: 'Quick', icon: Calendar },
    { name: 'Outreach Facilitator', title: 'School & Community Outreach', short: 'Run teacher training or school STEM club sessions — 2–8 hours/month.', tasks: 'Lead workshops and engage with local schools.', formType: 'Full', icon: Zap },
    { name: 'Technical Volunteer', title: 'Web / Data / DevOps', short: 'Short-term sprints for website, dashboards, data cleaning.', tasks: 'Contribute your technical skills to specific projects.', formType: 'Full', icon: Code }
];

const skillsList = ["Web Development", "Data Analysis", "DevOps", "Graphic Design", "Content Writing", "Project Management", "Teaching/Training"];

export default function VolunteerPage() {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<SuccessInfo | null>(null);

    const handleApplyClick = (role: Role) => {
        setSelectedRole(role);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(event.currentTarget);
        const currentRole = roles.find(r => r.name === selectedRole);
        if (!currentRole) return;

        const data = {
            full_name: formData.get('fullName'),
            email: formData.get('email'),
            phone_number: formData.get('phone'),
            role_type: currentRole.formType === 'Quick' ? 'Event' : 'Ongoing',
            roles_interested: [selectedRole],
            availability: formData.get('availability'),
            city_district: formData.get('city'),
            emergency_contact: formData.get('emergency_contact'),
            motivation: formData.get('motivation'),
            // ... capture other full form fields if they exist
        };

        try {
            const response = await fetch('/api/volunteers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Application failed');
            setSuccess({ applicationId: result.applicationId });
            setIsDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const QuickForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="fullName">Full name *</Label><Input id="fullName" name="fullName" required/></div>
                <div><Label htmlFor="email">Email address *</Label><Input id="email" name="email" type="email" required/></div>
            </div>
            <div><Label htmlFor="phone">Phone number *</Label><Input id="phone" name="phone" required/></div>
            <div><Label htmlFor="availability">Availability (date/time)</Label><Input id="availability" name="availability"/></div>
            <div><Label htmlFor="city">City/District</Label><Input id="city" name="city"/></div>
            <div><Label htmlFor="emergency_contact">Emergency contact (optional)</Label><Input id="emergency_contact" name="emergency_contact"/></div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing Up...' : 'Sign Up'}</Button>
            </DialogFooter>
        </form>
    );

    const FullForm = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="fullName">Full name *</Label><Input id="fullName" name="fullName" required/></div>
                <div><Label htmlFor="email">Email address *</Label><Input id="email" name="email" type="email" required/></div>
            </div>
            <div><Label htmlFor="phone">Phone number *</Label><Input id="phone" name="phone" required/></div>
            <div><Label htmlFor="address">Address</Label><Input id="address" name="address"/></div>
            <div><Label htmlFor="cv">CV Upload (PDF)</Label><Input id="cv" name="cv" type="file" accept=".pdf"/></div>
            <div>
                <Label>Relevant Skills</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {skillsList.map(skill => <div key={skill} className="flex items-center space-x-2"><Checkbox id={`skill-${skill}`} /><Label htmlFor={`skill-${skill}`}>{skill}</Label></div>)}
                </div>
            </div>
            <div><Label htmlFor="availability">Availability (days & hours)</Label><Input id="availability" name="availability"/></div>
            <div><Label htmlFor="motivation">Short motivation (200 words max) *</Label><Textarea id="motivation" name="motivation" required maxLength={1200} /></div>
             <div className="space-y-2">
                <div className="flex items-start space-x-2"><Checkbox id="bg-check" required /><Label htmlFor="bg-check" className="text-sm">I consent to a background check.</Label></div>
            </div>
             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <DialogFooter>
                <Button type="button" variant="outline">Save & Continue Later</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Application'}</Button>
            </DialogFooter>
        </form>
    );

    return (
        <div className="bg-white">
            <header className="bg-gray-50 border-b">
                <div className="container mx-auto px-4 py-16 lg:py-24 text-center">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Volunteer with Idrisa Foundation</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Give your time and expertise — mentor students, support events, teach workshops, or help behind the scenes.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" onClick={() => handleApplyClick('Mentor')}>
                            Sign Up to Volunteer
                        </Button>
                    </div>
                </div>
            </header>

            {success && (
                <div className="bg-green-50 border-y border-green-200">
                    <div className="container mx-auto px-4 py-8 text-center">
                        <h2 className="text-2xl font-bold text-green-800">Application Received</h2>
                        <p className="mt-2 text-green-700">
                            Thank you. Your volunteer application ID is <strong>{success.applicationId}</strong>.
                            We’ll review and contact you within 7 business days.
                        </p>
                    </div>
                </div>
            )}

            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {roles.map(role => (
                            <Card key={role.name} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <role.icon className="w-6 h-6 text-primary"/>
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">{role.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{role.title}</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground pt-2">{role.short}</p>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <h4 className="font-semibold">Key tasks:</h4>
                                    <p className="text-muted-foreground">{role.tasks}</p>
                                </CardContent>
                                <div className="p-6 pt-0">
                                    <Button className="w-full" onClick={() => handleApplyClick(role.name)}>
                                        Apply: {role.name}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Volunteer Application: {selectedRole}</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[80vh] overflow-y-auto pr-4">
                        {selectedRole && (roles.find(r => r.name === selectedRole)?.formType === 'Quick' ? <QuickForm /> : <FullForm />)}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
