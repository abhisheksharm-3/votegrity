"use client"
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, Users, HelpCircle } from 'lucide-react'
import LoggedInLayout from '@/components/LoggedInLayout'

export default function VoteList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [electionCode, setElectionCode] = useState('')

  const elections = [
    { id: 1, title: "City Council Election", description: "Vote for your local city council representatives", startDate: "2023-08-01", endDate: "2023-08-15", status: "Ongoing", category: "Local" },
    { id: 2, title: "Student Union Board", description: "Elect the new student union board members", startDate: "2023-09-01", endDate: "2023-09-07", status: "Upcoming", category: "Education" },
    { id: 3, title: "Environmental Policy Referendum", description: "Vote on new environmental policies", startDate: "2023-08-20", endDate: "2023-09-03", status: "Upcoming", category: "Policy" },
    { id: 4, title: "Company Board Election", description: "Shareholders vote for new board members", startDate: "2023-07-15", endDate: "2023-07-30", status: "Ended", category: "Corporate" },
  ]

  const filteredElections = elections.filter(election => 
    election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    election.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleJoinElection = () => {
    console.log(`Joining election with code: ${electionCode}`)
  }

  return (
    <LoggedInLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8 text-center">Votegrity Elections</h1>
        
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="browse">Browse Elections</TabsTrigger>
            <TabsTrigger value="join">Join an Election</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search elections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredElections.map(election => (
                <Card key={election.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{election.title}</CardTitle>
                    <CardDescription>{election.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{election.startDate} - {election.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{election.category}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Badge variant={election.status === "Ongoing" ? "default" : election.status === "Upcoming" ? "secondary" : "outline"}>
                      {election.status}
                    </Badge>
                    <Button variant="outline" size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="join" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Join an Election</CardTitle>
                <CardDescription>Enter the election code provided by the organizer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter election code"
                  value={electionCode}
                  onChange={(e) => setElectionCode(e.target.value)}
                  className="h-12"
                />
                <Button onClick={handleJoinElection} className="w-full h-12">Join Election</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center">
          <Button variant="link" className="text-muted-foreground">
            <HelpCircle className="h-4 w-4 mr-2" />
            Need help? Contact support
          </Button>
        </footer>
      </div>
    </LoggedInLayout>
  )
}