"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Eye, UserCheck, UserX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
type AdvocacyType = 'Digital' | 'Community' | 'Policy';
type AdvocateStatus = 'Active' | 'Inactive';

type Advocate = {
  id: string;
  advocate_id: string;
  full_name: string;
  email: string;
  location: string;
  advocacy_type: AdvocacyType;
  status: AdvocateStatus;
  registered_at: string;
};

// Mock Data
const mockAdvocates: Advocate[] = [
  { id: 'adv1', advocate_id: 'ADV-20240721-ABCD', full_name: 'David Ambassador', email: 'david.a@example.com', location: 'Kampala, Uganda', advocacy_type: 'Community', status: 'Active', registered_at: new Date().toISOString() },
  { id: 'adv2', advocate_id: 'ADV-20240720-EFGH', full_name: 'Eva Supporter', email: 'eva.s@example.com', location: 'Jinja, Uganda', advocacy_type: 'Digital', status: 'Active', registered_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'adv3', advocate_id: 'ADV-20240719-IJKL', full_name: 'Frank Promoter', email: 'frank.p@example.com', location: 'Gulu, Uganda', advocacy_type: 'Community', status: 'Inactive', registered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];

const statusColors: Record<AdvocateStatus, string> = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-gray-100 text-gray-800',
}

export default function AdminAdvocatesPage() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const response = await fetch('/api/advocates');
        if (!response.ok) throw new Error('Failed to fetch advocates');
        const data = await response.json();
        setAdvocates(data.advocates.length > 0 ? data.advocates : mockAdvocates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Using mock data.');
        setAdvocates(mockAdvocates);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvocates();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Advocate Management</h1>
        <p className="text-muted-foreground">Review and manage registered advocates.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Advocates</CardTitle>
          <CardDescription>A list of all individuals registered as Idrisa Ambassadors.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registered</TableHead>
                <TableHead>Advocate</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center">Loading advocates...</TableCell></TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={6} className="text-center text-red-500">{error}</TableCell></TableRow>
              ) : (
                advocates.map(adv => (
                  <TableRow key={adv.id}>
                    <TableCell>{new Date(adv.registered_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="font-medium">{adv.full_name}</div>
                      <div className="text-xs text-muted-foreground">{adv.email}</div>
                    </TableCell>
                    <TableCell>{adv.location}</TableCell>
                    <TableCell><div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">{adv.advocacy_type}</div></TableCell>
                    <TableCell><div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[adv.status]}`}>{adv.status}</div></TableCell>
                    <TableCell>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4"/> View Details</DropdownMenuItem>
                            <DropdownMenuItem><UserCheck className="mr-2 h-4 w-4"/> Set Active</DropdownMenuItem>
                            <DropdownMenuItem><UserX className="mr-2 h-4 w-4"/> Set Inactive</DropdownMenuItem>
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
