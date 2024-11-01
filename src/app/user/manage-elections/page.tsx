"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {Snippet} from "@nextui-org/snippet";
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
import { Search, Plus, Edit, Eye, CalendarCheck, Users, Code } from 'lucide-react'
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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-10 w-48" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-center">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardContent className="p-0 rounded-xl">
              <Table className="rounded-xl">
                <TableHeader>
                  <TableRow>
                    {['Title', 'Category', 'Dates', 'Candidates', 'Join Code', 'Actions'].map((header, index) => (
                      <TableHead key={index}><Skeleton className="h-4 w-24" /></TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      {[...Array(6)].map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </LoggedInLayout>
    )
  }

  if (error) {
    return (
      <LoggedInLayout>
        <div className="container mx-auto px-4 py-8 text-red-500">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
            <p>Error loading elections: {error.message}</p>
          </div>
        </div>
      </LoggedInLayout>
    )
  }

  return (
    <LoggedInLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair">
            My Elections
            <span className="text-sm text-white/60 ml-4">
              ({filteredElections.length} total)
            </span>
          </h1>
          <Button 
            variant="default" 
            className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300"
            asChild
          >
            <Link href="/user/create-proposal" className="flex items-center">
              <Plus className="mr-2 h-5 w-5" /> Create New Election
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-6 w-6 text-primary" />
                Election Management
              </CardTitle>
              <CardDescription>View, search, and manage your created elections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search elections by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 border-primary/50 focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <Button variant="outline" className="hover:bg-gray-100">
                  Advanced Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-center">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="text-lg font-semibold">Total Elections</h3>
                <p className="text-3xl font-bold text-primary">{filteredElections.length}</p>
              </div>
              <CalendarCheck className="h-10 w-10 text-primary/70" />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="p-0">
            {filteredElections.length === 0 ? (
              <div className="text-center py-12 px-4 bg-gray-50 rounded-b-lg">
                <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No Elections Found
                </h3>
                <p className="text-gray-500">
                  You haven't created any elections yet. Get started by creating your first election!
                </p>
                <Button 
                  variant="default" 
                  className="mt-4 bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link href="/user/create-proposal" className="flex items-center">
                    <Plus className="mr-2 h-5 w-5" /> Create Election
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-1/4">Election Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Candidates</TableHead>
                    <TableHead>
                      <Code className="h-4 w-4 inline-block mr-1" />
                      Join Code
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredElections.map((election) => (
                    <TableRow 
                      key={election.id} 
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <TableCell className="font-medium">{election.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {election.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">
                            Start: {formatDate(election.startDate) || "Not set"}
                          </span>
                          <span className="text-xs text-gray-500">
                            End: {formatDate(election.endDate) || "Not set"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-primary" />
                          {election.candidates?.length || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Snippet className="flex items-center" color="success">
                          {election.joinByCode || "N/A"}
                        </Snippet>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:bg-gray-100"
                            asChild
                          >
                            <Link href={`/user/manage-elections/${election.id}`}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="hover:bg-gray-100"
                            asChild
                          >
                            <Link href={`/user/edit-election/${election.id}`}>
                              <Edit className="h-4 w-4 mr-1" /> Edit
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