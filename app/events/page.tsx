"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Users, Video } from "lucide-react"

// Types
type EventCategory = 'Competition / In-person' | 'Training / Virtual';
type Event = {
    id: string;
    title: string;
    start_time: string;
    end_time: string;
    location: string;
    category: EventCategory;
    description: string;
    capacity: number;
};
type SuccessInfo = { registrationId: string; email: string };

// Mock Data
const sampleEvents: Event[] = [
    { id: 'evt1', title: 'Idrisa STEM Olympiad — Regional Qualifiers (Central)', start_time: '2026-04-10T09:00:00.000Z', end_time: '2026-04-10T16:00:00.000Z', location: 'Makerere College School, Kampala', category: 'Competition / In-person', description: 'Regional qualifiers for the Idrisa STEM Olympiad. Schools competing will undertake written and practical challenges in math, physics, and computing.', capacity: 120 },
    { id: 'evt2', title: 'Intro to Python for Educators — 2-hour virtual workshop', start_time: '2026-04-20T14:00:00.000Z', end_time: '2026-04-20T16:00:00.000Z', location: 'Online (Zoom link after registration)', category: 'Training / Virtual', description: 'Practical Python workshop for secondary school teachers to integrate coding into the classroom using free tools (Colab, Jupyter).', capacity: 200 },
];

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'EAT' });

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<SuccessInfo | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch from /api/events
                await new Promise(res => setTimeout(res, 500)); // Simulate delay
                setEvents(sampleEvents);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleRegisterClick = (event: Event) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedEvent) return;
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const data = {
            event_id: selectedEvent.id,
            full_name: formData.get('name'),
            email: email,
            phone_number: formData.get('phone'),
            school_name: formData.get('school_name'),
            role: formData.get('role'),
        };

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Registration failed");
            setSuccess({ registrationId: result.registrationId, email });
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
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Events & Calendar</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Discover Idrisa Foundation events — workshops, Olympiad rounds, mentor training, and public webinars.
                    </p>
                </div>
            </header>

            {success && (
                <div className="bg-green-50 border-y border-green-200">
                    <div className="container mx-auto px-4 py-8 text-center">
                        <h2 className="text-2xl font-bold text-green-800">You are registered!</h2>
                        <p className="mt-2 text-green-700">
                            Your Registration ID is <strong>{success.registrationId}</strong>. A confirmation email with event details and a calendar invite has been sent to {success.email}.
                        </p>
                    </div>
                </div>
            )}

            <main className="container mx-auto px-4 py-16 lg:py-24">
                <div className="space-y-8">
                    {loading ? <p>Loading events...</p> : events.map(event => (
                        <Card key={event.id} className="overflow-hidden md:flex">
                            <div className="p-6 flex-grow">
                                <div className="text-sm font-medium text-gray-500 mb-2 w-fit">{event.category.split('/')[0].trim()}</div>
                                <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                                <div className="space-y-2 text-muted-foreground">
                                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/><span>{formatDate(event.start_time)}</span></div>
                                    <div className="flex items-center gap-2"><Clock className="w-4 h-4"/><span>{formatTime(event.start_time)} – {formatTime(event.end_time)} (EAT)</span></div>
                                    <div className="flex items-center gap-2">{event.category.includes('Virtual') ? <Video className="w-4 h-4"/> : <MapPin className="w-4 h-4"/>}<span>{event.location}</span></div>
                                </div>
                                <p className="mt-4">{event.description}</p>
                            </div>
                            <div className="p-6 bg-gray-50/70 flex flex-col items-center justify-center md:w-64 shrink-0">
                                <Button size="lg" className="w-full" onClick={() => handleRegisterClick(event)}>
                                    {event.category.includes('Training') ? 'Reserve Your Seat' : 'Register for Qualifiers'}
                                </Button>
                                <p className="text-sm text-muted-foreground mt-2">
                                    <Users className="w-3 h-3 inline mr-1"/>
                                    {event.capacity} spots available
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </main>

            {selectedEvent && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Register for: {selectedEvent.title}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><Label htmlFor="name">Full Name *</Label><Input id="name" name="name" required /></div>
                            <div><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" required /></div>
                            <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" name="phone" /></div>
                            {selectedEvent.category.includes('Competition') && (
                                <>
                                    <div><Label htmlFor="school_name">School Name *</Label><Input id="school_name" name="school_name" required /></div>
                                    <div><Label htmlFor="role">Role (Student / Teacher / Observer) *</Label><Input id="role" name="role" required /></div>
                                </>
                            )}
                             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Confirm Registration'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
