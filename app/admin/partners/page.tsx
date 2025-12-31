"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, PlusCircle, CheckCircle, XCircle, Eye, Edit, Archive } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
type PartnershipStatus = 'Pending' | 'Approved' | 'Active' | 'Rejected' | 'Archived';
type PartnershipTier = 'Founding' | 'Program' | 'Education' | 'In-Kind' | 'Other';

type Application = {
  id: string;
  request_id: string;
  organization_name: string;
  contact_person: string;
  email: string;
  partnership_tier: PartnershipTier;
  status: PartnershipStatus;
  created_at: string;
};

type Partner = {
  id: string;
  name: string;
  tier: PartnershipTier;
  status: PartnershipStatus;
  joined_at: string;
};

// Mock Data
const mockApplications: Application[] = [
  { id: 'app1', request_id: 'PAR-20240721-ASDF', organization_name: 'Tech Innovators Uganda', contact_person: 'Sarah Doe', email: 'sarah@tiu.org', partnership_tier: 'Program', status: 'Pending', created_at: new Date().toISOString() },
  { id: 'app2', request_id: 'PAR-20240720-QWER', organization_name: 'Makerere University', contact_person: 'Prof. John Smith', email: 'jsmith@mak.ac.ug', partnership_tier: 'Education', status: 'Approved', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'app3', request_id: 'PAR-20240719-ZXCV', organization_name: 'Global Bank Inc.', contact_person: 'Peter Jones', email: 'peter.j@globalbank.com', partnership_tier: 'Founding', status: 'Rejected', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];

const mockPartners: Partner[] = [
  { id: 'p1', name: 'MTN Uganda', tier: 'Founding', status: 'Active', joined_at: '2023-01-15' },
  { id: 'p2', name: 'Makerere University', tier: 'Education', status: 'Active', joined_at: '2024-07-21' },
];

const statusColors: Record<PartnershipStatus, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-blue-100 text-blue-800',
    'Active': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Archived': 'bg-gray-100 text-gray-800'
}


export default function AdminPartnersPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/partners');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setApplications(data.applications.length > 0 ? data.applications : mockApplications);
        setPartners(data.partners.length > 0 ? data.partners : mockPartners);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Using mock data.');
        setApplications(mockApplications);
        setPartners(mockPartners);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Partnership Management</h1>
          <p className="text-muted-foreground">Review applications and manage active partners.</p>
        </div>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Partner</Button>
      </div>

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="partners">Active Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Applications</CardTitle>
              <CardDescription>Review and process new partnership requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Organization</TableHead><TableHead>Tier</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
                <TableBody>
                  {applications.map(app => (
                    <TableRow key={app.id}>
                      <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                          <div className="font-medium">{app.organization_name}</div>
                          <div className="text-xs text-muted-foreground">{app.contact_person} ({app.email})</div>
                      </TableCell>
                      <TableCell>{app.partnership_tier}</TableCell>
                      <TableCell><div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>{app.status}</div></TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4"/> View Details</DropdownMenuItem>
                            <DropdownMenuItem><CheckCircle className="mr-2 h-4 w-4"/> Approve</DropdownMenuItem>
                            <DropdownMenuItem><XCircle className="mr-2 h-4 w-4"/> Reject</DropdownMenuItem>
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

        <TabsContent value="partners" className="mt-6">
           <Card>
            <CardHeader>
              <CardTitle>Active Partners</CardTitle>
              <CardDescription>Manage current foundation partners.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Partner Name</TableHead><TableHead>Tier</TableHead><TableHead>Joined Date</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
                <TableBody>
                  {partners.map(p => (
                     <TableRow key={p.id}>
                       <TableCell className="font-medium">{p.name}</TableCell>
                       <TableCell>{p.tier}</TableCell>
                       <TableCell>{new Date(p.joined_at).toLocaleDateString()}</TableCell>
                       <TableCell><div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[p.status]}`}>{p.status}</div></TableCell>
                       <TableCell>
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4"/> Edit Details</DropdownMenuItem>
                            <DropdownMenuItem><Archive className="mr-2 h-4 w-4"/> Archive Partner</DropdownMenuItem>
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
      </Tabs>
    </div>
  )
}
