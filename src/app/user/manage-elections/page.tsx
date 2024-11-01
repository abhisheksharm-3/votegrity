"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { fetchOwnedElections } from '@/lib/server/appwrite'
import {formatDate} from "@/lib/utils"

// Define Election interface
interface Election {
  id: string;
  title: string;
  description: string;
  category: string;
  candidates: string[];
  startDate?: string;
  endDate?: string;
  joinByCode: string;
}

export default function MyElections() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [elections, setElections] = useState<Election[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadElections() {
      try {
        setIsLoading(true)
        const fetchedElections = await fetchOwnedElections()
        setElections(fetchedElections.map(doc => ({
          id: doc.$id,
          title: doc.title,
          description: doc.description,
          category: doc.category,
          candidates: doc.candidates,
          startDate: doc.startDate,
          endDate: doc.endDate,
          joinByCode: doc.joinByCode
        })))
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
        setIsLoading(false)
      }
    }
    
    loadElections()
  }, [])

  const filteredElections = elections.filter(election =>
    election.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <LoggedInLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          Loading elections...
        </div>
      </LoggedInLayout>
    )
  }

  if (error) {
    return (
      <LoggedInLayout>
        <div className="container mx-auto px-4 py-8 text-red-500">
          Error loading elections: {error.message}
        </div>
      </LoggedInLayout>
    )
  }

  return (
    <LoggedInLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8">My Elections</h1>
          <Button asChild>
            <Link href="/user/create-proposal">
              <Plus className="mr-2 h-4 w-4" /> Create New Election
            </Link>
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
            {filteredElections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No elections found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Election Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Total Candidates</TableHead>
                    <TableHead>Joining Code</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredElections.map((election) => (
                    <TableRow key={election.id}>
                      <TableCell className="font-medium">{election.title}</TableCell>
                      <TableCell>
                        <Badge>
                          {election.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(election.startDate) || "Not set"}</TableCell>
                      <TableCell>{formatDate(election.endDate) || "Not set"}</TableCell>
                      <TableCell>{election.candidates || 0}</TableCell>
                      <TableCell>{election.joinByCode || 0}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/user/manage-elections/${election.id}`}>
                              View
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/user/manage-elections/${election.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </LoggedInLayout>
  )
}