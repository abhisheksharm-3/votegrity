"use client"
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from 'lucide-react'
import LoggedInLayout from '@/components/LoggedInLayout'

// Mock data for elections
const elections = [
  { id: 1, title: "City Council Election 2023", status: "Active", startDate: "2023-08-01", endDate: "2023-08-15", voters: 1500, pendingApprovals: 50 },
  { id: 2, title: "School Board Election", status: "Upcoming", startDate: "2023-09-01", endDate: "2023-09-15", voters: 0, pendingApprovals: 100 },
  { id: 3, title: "Local Referendum on Park Development", status: "Ended", startDate: "2023-07-01", endDate: "2023-07-15", voters: 2000, pendingApprovals: 0 },
  { id: 4, title: "Neighborhood Association Board Election", status: "Draft", startDate: "", endDate: "", voters: 0, pendingApprovals: 0 },
]

export default function MyElections() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredElections = elections.filter(election =>
    election.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
<LoggedInLayout>    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8">My Elections</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Election
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Election Management</CardTitle>
          <CardDescription>View and manage your created elections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search elections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Election Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Total Voters</TableHead>
                <TableHead>Pending Approvals</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredElections.map((election) => (
                <TableRow key={election.id}>
                  <TableCell className="font-medium">{election.title}</TableCell>
                  <TableCell>
                    <Badge variant={
                      election.status === "Active" ? "default" :
                      election.status === "Upcoming" ? "secondary" :
                      election.status === "Ended" ? "outline" :
                      "destructive"
                    }>
                      {election.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{election.startDate || "Not set"}</TableCell>
                  <TableCell>{election.endDate || "Not set"}</TableCell>
                  <TableCell>{election.voters}</TableCell>
                  <TableCell>{election.pendingApprovals}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/elections/${election.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/elections/${election.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div></LoggedInLayout>
  )
}