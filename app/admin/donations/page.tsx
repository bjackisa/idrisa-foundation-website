"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Download, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

// Types
type PledgeStatus = 'New' | 'Contacted' | 'Paid' | 'Partially Paid' | 'Cancelled';
type Pledge = {
  id: string;
  donation_id: string;
  full_name: string;
  email: string;
  cause: string;
  amount: number;
  currency: string;
  frequency: string;
  status: PledgeStatus;
  created_at: string;
};

// Mock Data
const mockPledges: Pledge[] = [
  { id: 'plg1', donation_id: 'IDF-20240721-XYZW', full_name: 'John Donor', email: 'john.donor@example.com', cause: 'Scholarship Fund', amount: 200, currency: 'USD', frequency: 'One-time', status: 'New', created_at: new Date().toISOString() },
  { id: 'plg2', donation_id: 'IDF-20240720-ABCD', full_name: 'Jane Giver', email: 'jane.giver@example.com', cause: 'School STEM Kits', amount: 150, currency: 'USD', frequency: 'Pledge', status: 'Contacted', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'plg3', donation_id: 'IDF-20240719-EFGH', full_name: 'Sam Contributor', email: 'sam.c@example.com', cause: 'Mentorship & Incubation', amount: 300, currency: 'UGX', frequency: 'Monthly', status: 'Paid', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'plg4', donation_id: 'IDF-20240718-IJKL', full_name: 'Grace Funder', email: 'grace.f@example.com', cause: 'General Operating Support', amount: 50, currency: 'GBP', frequency: 'One-time', status: 'Cancelled', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

const statusColors: Record<PledgeStatus, string> = {
    'New': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-yellow-100 text-yellow-800',
    'Paid': 'bg-green-100 text-green-800',
    'Partially Paid': 'bg-indigo-100 text-indigo-800',
    'Cancelled': 'bg-red-100 text-red-800',
}

export default function AdminDonationsPage() {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPledges = async () => {
      try {
        const response = await fetch('/api/donations');
        if (!response.ok) throw new Error('Failed to fetch pledges');
        const data = await response.json();
        // Fallback to mock data if the API returns an empty array, useful for dev
        setPledges(data.pledges.length > 0 ? data.pledges : mockPledges);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Using mock data.');
        setPledges(mockPledges); // fallback to mock data on error
      } finally {
        setLoading(false);
      }
    };
    fetchPledges();
  }, []);

  const handleStatusChange = (pledgeId: string, newStatus: PledgeStatus) => {
      setPledges(pledges.map(p => p.id === pledgeId ? {...p, status: newStatus} : p));
      // Here you would make an API call to PATCH the status
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Donations & Pledges</h1>
          <p className="text-muted-foreground">Manage incoming donations and pledges.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pledges</CardTitle>
          <CardDescription>A record of all pledges made to the foundation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Donation ID</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center">Loading pledges...</TableCell></TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={7} className="text-center text-red-500">{error}</TableCell></TableRow>
              ) : (
                pledges.map(pledge => (
                  <TableRow key={pledge.id}>
                    <TableCell>{new Date(pledge.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono text-sm">{pledge.donation_id}</TableCell>
                    <TableCell>
                        <div className="font-medium">{pledge.full_name}</div>
                        <div className="text-xs text-muted-foreground">{pledge.email}</div>
                    </TableCell>
                    <TableCell>{pledge.cause}</TableCell>
                    <TableCell className="font-medium">{pledge.currency} {pledge.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[pledge.status]}`}>
                        {pledge.status}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Send Reminder (7d)</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                           {Object.keys(statusColors).map((status) => (
                              <DropdownMenuItem key={status} onClick={() => handleStatusChange(pledge.id, status as PledgeStatus)}>
                                Set as {status}
                              </DropdownMenuItem>
                           ))}
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
