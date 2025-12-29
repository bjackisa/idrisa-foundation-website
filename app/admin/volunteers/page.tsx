"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
type ApplicationStatus = 'Pending' | 'Approved' | 'Contacted' | 'Rejected';
type RoleType = 'Event' | 'Ongoing';

type Application = {
  id: string;
  application_id: string;
  full_name: string;
  email: string;
  role_type: RoleType;
  roles_interested: string[];
  status: ApplicationStatus;
  submitted_at: string;
};

// Mock Data
const mockApplications: Application[] = [
  { id: 'app1', application_id: 'VOL-20240721-QWRS', full_name: 'Alice Volunteer', email: 'alice.v@example.com', role_type: 'Ongoing', roles_interested: ['Mentor'], status: 'Pending', submitted_at: new Date().toISOString() },
  { id: 'app2', application_id: 'VOL-20240720-ASDF', full_name: 'Bob Helper', email: 'bob.h@example.com', role_type: 'Event', roles_interested: ['Event Support'], status: 'Approved', submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'app3', application_id: 'VOL-20240719-ZXCV', full_name: 'Charlie Contributor', email: 'charlie.c@example.com', role_type: 'Ongoing', roles_interested: ['Technical Volunteer', 'Outreach'], status: 'Contacted', submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'app4', application_id: 'VOL-20240718-YUIO', full_name: 'Diana Do-good', email: 'diana.d@example.com', role_type: 'Ongoing', roles_interested: ['Mentor'], status: 'Rejected', submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

const statusColors: Record<ApplicationStatus, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Contacted': 'bg-blue-100 text-blue-800',
    'Rejected': 'bg-red-100 text-red-800',
}

export default function AdminVolunteersPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/volunteers');
        if (!response.ok) throw new Error('Failed to fetch applications');
        const data = await response.json();
        setApplications(data.applications.length > 0 ? data.applications : mockApplications);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Using mock data.');
        setApplications(mockApplications);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Volunteer Management</h1>
        <p className="text-muted-foreground">Review and manage volunteer applications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>A list of all individuals who have applied to volunteer.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading applications...</TableCell></TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={6} className="text-center text-red-500">{error}</TableCell></TableRow>
              ) : (
                applications.map(app => (
                  <TableRow key={app.id}>
                    <TableCell>{new Date(app.submitted_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="font-medium">{app.full_name}</div>
                      <div className="text-xs text-muted-foreground">{app.email}</div>
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {app.roles_interested.map(role => <div key={role} className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200 last:mr-0 mr-1">{role}</div>)}
                        </div>
                    </TableCell>
                    <TableCell>{app.role_type}</TableCell>
                    <TableCell><div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>{app.status}</div></TableCell>
                    <TableCell>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4"/> View Application</DropdownMenuItem>
                            <DropdownMenuItem><CheckCircle className="mr-2 h-4 w-4"/> Approve</DropdownMenuItem>
                            <DropdownMenuItem><XCircle className="mr-2 h-4 w-4"/> Reject</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
