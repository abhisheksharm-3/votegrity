"use client"
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, Users, HelpCircle, Loader2 } from 'lucide-react'
import { useUserData } from '@/hooks/useUserData'
import LoggedInLayout from '@/components/LoggedInLayout'
import { toast } from "sonner"

export default function VoteList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [electionCode, setElectionCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const { elections, joinElection, isLoading } = useUserData()

  // Helper function to determine election status
  const getElectionStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return "Upcoming"
    if (now > end) return "Ended"
    return "Ongoing"
  }

  const filteredElections = elections?.filter(election => {
    if (!election?.detail.title || !election?.detail.category) return false;
    return (
      election.detail.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.detail.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }) || [];

  const handleJoinElection = async () => {
    if (!electionCode.trim()) {
      toast.error("Error", {
        description: "Please enter an election code",
      })
      return
    }

    try {
      setIsJoining(true)
      const result = await joinElection(electionCode)
      
      if (result.success) {
        toast.success("Success", {
          description: result.message,
        })
        setElectionCode('')
      } else {
        toast.error("Error", {
          description: result.message,
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to join election. Please try again.",
      })
    } finally {
      setIsJoining(false)
    }
  }
  if (isLoading) {
    return (
      <LoggedInLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading elections...</p>
          </div>
        </div>
      </LoggedInLayout>
    );
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
              {filteredElections.length > 0 ? (
                filteredElections.map(election => {
                  const status = getElectionStatus(election.detail.startDate, election.detail.endDate)
                  return (
                    <Card key={election.detail.$id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle>{election.detail.title}</CardTitle>
                        <CardDescription>{election.detail.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(election.detail.startDate).toLocaleDateString()} - {new Date(election.detail.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{election.detail.category}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <Badge 
                          variant={
                            status === "Ongoing" ? "default" : 
                            status === "Upcoming" ? "secondary" : 
                            "outline"
                          }
                        >
                          {status}
                        </Badge>
                        <Button variant="outline" size="sm">View Details</Button>
                      </CardFooter>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No elections found
                </div>
              )}
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
                <Button 
                  onClick={handleJoinElection} 
                  className="w-full h-12"
                  disabled={isJoining}
                >
                  {isJoining ? "Joining..." : "Join Election"}
                </Button>
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