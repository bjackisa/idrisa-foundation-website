"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, PlusCircle, Edit, Trash2, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
type Event = {
  id: string;
  title: string;
  category: string;
  start_time: string;
  location: string;
  registrations: number;
  capacity: number;
};
type Registration = {
  id: string;
  registration_id: string;
  event_title: string;
  full_name: string;
  email: string;
  registered_at: string;
}

// Mock Data
const mockEvents: Event[] = [
    { id: 'evt1', title: 'Idrisa STEM Olympiad — Regional Qualifiers (Central)', category: 'Competition', start_time: '2026-04-10T09:00:00.000Z', location: 'Makerere College School', registrations: 85, capacity: 120 },
    { id: 'evt2', title: 'Intro to Python for Educators', category: 'Training', start_time: '2026-04-20T14:00:00.000Z', location: 'Online', registrations: 150, capacity: 200 },
];
const mockRegistrations: Registration[] = [
    {id: 'reg1', registration_id: 'EVT-20240721-ABCD', event_title: 'Idrisa STEM Olympiad', full_name: 'John Student', email: 'john.s@example.com', registered_at: new Date().toISOString()},
    {id: 'reg2', registration_id: 'EVT-20240721-EFGH', event_title: 'Intro to Python for Educators', full_name: 'Jane Teacher', email: 'jane.t@example.com', registered_at: new Date().toISOString()},
]

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-muted-foreground">Create and manage your events and registrations.</p>
        </div>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> New Event</Button>
      </div>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader><CardTitle>All Events</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Event</TableHead><TableHead>Category</TableHead><TableHead>Location</TableHead><TableHead>Registrations</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
                <TableBody>
                  {events.map(event => (
                    <TableRow key={event.id}>
                      <TableCell>{new Date(event.start_time).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell><div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">{event.category}</div></TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>{event.registrations} / {event.capacity}</TableCell>
                      <TableCell>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><Users className="mr-2 h-4 w-4"/> View Registrations</DropdownMenuItem>
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4"/> Edit Event</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4"/> Delete Event</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="registrations" className="mt-6">
            <Card>
                <CardHeader><CardTitle>All Registrations</CardTitle><CardDescription>A log of all event registrations.</CardDescription></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Event</TableHead><TableHead>Attendee</TableHead><TableHead>Reg. ID</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {registrations.map(reg => (
                                <TableRow key={reg.id}>
                                    <TableCell>{new Date(reg.registered_at).toLocaleDateString()}</TableCell>
                                    <TableCell>{reg.event_title}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{reg.full_name}</div>
                                        <div className="text-xs text-muted-foreground">{reg.email}</div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{reg.registration_id}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
