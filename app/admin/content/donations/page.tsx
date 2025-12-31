"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, Mail, CheckCircle, Clock, XCircle } from "lucide-react"

interface Donation {
  id: number
  donation_id: string
  full_name: string
  email: string
  phone: string
  country: string
  cause: string
  amount: number
  currency: string
  frequency: string
  status: string
  created_at: string
}

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDonations()
  }, [])

  useEffect(() => {
    let filtered = donations
    
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.donation_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(d => d.status === statusFilter)
    }
    
    setFilteredDonations(filtered)
  }, [donations, searchTerm, statusFilter])

  const loadDonations = async () => {
    try {
      const response = await fetch("/api/admin/donations")
      if (response.ok) {
        const data = await response.json()
        setDonations(data.donations || [])
      }
    } catch (error) {
      console.error("Error loading donations:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/donations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        loadDonations()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      "New": "bg-blue-100 text-blue-800",
      "Contacted": "bg-yellow-100 text-yellow-800", 
      "Paid": "bg-green-100 text-green-800",
      "Partially Paid": "bg-orange-100 text-orange-800",
      "Cancelled": "bg-red-100 text-red-800"
    }
    return <Badge className={variants[status as keyof typeof variants] || ""}>{status}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid": return <CheckCircle className="w-4 h-4 text-green-600" />
      case "New": return <Clock className="w-4 h-4 text-blue-600" />
      case "Cancelled": return <XCircle className="w-4 h-4 text-red-600" />
      default: return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Donation Management</h1>
        <p className="text-muted-foreground">Track and manage donation pledges and payments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pledges</p>
                <p className="text-2xl font-bold">{donations.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">
                  ${donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold">
                  {donations.filter(d => d.status === "Paid").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {donations.filter(d => d.status === "New" || d.status === "Contacted").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name, email, or donation ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Partially Paid">Partially Paid</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Pledges</CardTitle>
          <CardDescription>
            Showing {filteredDonations.length} of {donations.length} donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donation ID</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-mono text-sm">
                    {donation.donation_id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{donation.full_name}</p>
                      <p className="text-sm text-muted-foreground">{donation.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{donation.cause}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {donation.currency}{donation.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{donation.frequency}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(donation.status)}
                      {getStatusBadge(donation.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(donation.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Select
                        value={donation.status}
                        onValueChange={(value) => updateStatus(donation.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}