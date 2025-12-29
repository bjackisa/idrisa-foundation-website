"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, MoreHorizontal, Check, X, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock Types
type Submission = {
  id: string;
  submission_id: string;
  publication_title: string;
  submitter_name: string;
  submitter_email: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
};

type Publication = {
  id: string;
  title: string;
  year: number;
  summary: string;
  download_url: string | null;
};

// Mock Data
const mockSubmissions: Submission[] = [
  { id: 'sub1', submission_id: 'RPU-20240721-ABCD', publication_title: 'The Impact of STEM Education in Rural Uganda', submitter_name: 'Jane Doe', submitter_email: 'jane.doe@example.com', status: 'pending', submitted_at: new Date().toISOString() },
  { id: 'sub2', submission_id: 'RPU-20240720-EFGH', publication_title: 'A Study on Low-Cost Robotics for Schools', submitter_name: 'John Smith', submitter_email: 'john.smith@example.com', status: 'approved', submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];

const mockPublications: Publication[] = [
    { id: 'pub1', title: 'Idrisa Foundation — 2025 Baseline Report: STEM Outreach & Scholarship Pilots', year: 2025, summary: 'Baseline enrollment and participation data from our first STEM Olympiad pilot...', download_url: '#' },
    { id: 'pub2', title: 'A Study on Low-Cost Robotics for Schools', year: 2024, summary: 'This paper explores the feasibility of introducing affordable robotics kits...', download_url: '/path/to/robotics.pdf' },
];


export default function AdminResearchPublicationsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [publications, setPublications] = useState<Publication[]>(mockPublications);
  const [loading, setLoading] = useState(false); // In a real app, this would be true initially

  const handleSubmissionStatusChange = (id: string, status: 'approved' | 'rejected') => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status } : s));
    // Here you would also make an API call to update the status
  };

  const handleAddNewPublication = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPub: Publication = {
        id: `pub${publications.length + 2}`,
        title: formData.get('title') as string,
        year: parseInt(formData.get('year') as string),
        summary: formData.get('summary') as string,
        download_url: formData.get('download_url') as string,
    };
    setPublications([newPub, ...publications]);
    // API call to POST new publication
    return true; // to close dialog
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Research & Publications</h1>
          <p className="text-muted-foreground">Manage submissions and published articles.</p>
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Publication</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Publication</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                    const success = handleAddNewPublication(e);
                    if (success) {
                        // Find a way to close the dialog. A bit tricky without passing state down.
                        // In a real app, you might use a form library that handles this better.
                        // For now, the form submission will just add to the state.
                    }
                }}>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" required/>
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" name="year" type="number" required/>
                        <Label htmlFor="summary">Summary</Label>
                        <Input id="summary" name="summary" />
                        <Label htmlFor="download_url">Download URL</Label>
                        <Input id="download_url" name="download_url" />
                    </div>
                    <DialogFooter>
                       <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                       <Button type="submit">Save Publication</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="submissions">
        <TabsList>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Publication Submissions</CardTitle>
                    <CardDescription>Review and approve new submissions from the community.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Submitter</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.map(sub => (
                                <TableRow key={sub.id}>
                                    <TableCell>{new Date(sub.submitted_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">{sub.publication_title}</TableCell>
                                    <TableCell>{sub.submitter_name} ({sub.submitter_email})</TableCell>
                                    <TableCell>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : sub.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {sub.status}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleSubmissionStatusChange(sub.id, 'approved')}><Check className="mr-2 h-4 w-4"/>Approve</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleSubmissionStatusChange(sub.id, 'rejected')}><X className="mr-2 h-4 w-4"/>Reject</DropdownMenuItem>
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

        <TabsContent value="published" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Published Articles</CardTitle>
                    <CardDescription>Manage the articles visible on the public page.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Year</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Has PDF</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {publications.map(pub => (
                                <TableRow key={pub.id}>
                                    <TableCell>{pub.year}</TableCell>
                                    <TableCell className="font-medium">{pub.title}</TableCell>
                                    <TableCell>{pub.download_url && pub.download_url !== '#' ? 'Yes' : 'No'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="mr-2"><Edit className="h-4 w-4 mr-2"/>Edit</Button>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4 mr-2"/>Delete</Button>
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
