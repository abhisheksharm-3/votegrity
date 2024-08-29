'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import LoggedInLayout from '@/components/LoggedInLayout'

// Mock data for a specific election
const election = {
  id: 1,
  title: "City Council Election 2023",
  description: "Election for selecting new city council members",
  status: "Active",
  startDate: new Date("2023-08-01"),
  endDate: new Date("2023-08-15"),
  voters: 1500,
  pendingApprovals: 50,
}

// Mock data for pending voter approvals
const pendingVoters = [
  { id: 1, name: "John Doe", email: "john@example.com", registrationDate: "2023-07-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", registrationDate: "2023-07-16" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", registrationDate: "2023-07-17" },
]

export default function ElectionManagement({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [electionData, setElectionData] = useState(election)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setElectionData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined, field: 'startDate' | 'endDate') => {
    if (date) {
      setElectionData(prev => ({ ...prev, [field]: date }))
    }
  }

  const handleSave = () => {
    console.log('Saving election data:', electionData)
    // Here you would typically send an API request to update the election data
    alert('Election details saved successfully!')
  }

  const handleApproveVoter = (voterId: number) => {
    console.log(`Approving voter with ID: ${voterId}`)
    // Here you would typically send an API request to approve the voter
  }

  const handleRejectVoter = (voterId: number) => {
    console.log(`Rejecting voter with ID: ${voterId}`)
    // Here you would typically send an API request to reject the voter
  }

  return (
<LoggedInLayout>    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" className="mb-4" onClick={() => router.push('/my-elections')}>
        Back to My Elections
      </Button>
      
      <h1 className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8">Manage Election: {electionData.title}</h1>
      
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Election Details</TabsTrigger>
          <TabsTrigger value="voters">Voter Approvals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Election Details</CardTitle>
              <CardDescription>Edit the details of your election</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="title">Election Title</Label>
                  <Input id="title" name="title" value={electionData.title} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={electionData.description} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Badge variant={electionData.status === "Active" ? "default" : electionData.status === "Upcoming" ? "secondary" : "outline"}>
                    {electionData.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {electionData.startDate ? format(electionData.startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={electionData.startDate}
                          onSelect={(date) => handleDateChange(date, 'startDate')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {electionData.endDate ? format(electionData.endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={electionData.endDate}
                          onSelect={(date) => handleDateChange(date, 'endDate')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div>
                  <Label>Total Voters</Label>
                  <p>{electionData.voters}</p>
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="voters">
          <Card>
            <CardHeader>
              <CardTitle>Voter Approvals</CardTitle>
              <CardDescription>Manage voter registration approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingVoters.map((voter) => (
                      <TableRow key={voter.id}>
                        <TableCell>{voter.name}</TableCell>
                        <TableCell>{voter.email}</TableCell>
                        <TableCell>{voter.registrationDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">View</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Voter Details</DialogTitle>
                                  <DialogDescription>
                                    Review the details of {voter.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Name</Label>
                                    <p>{voter.name}</p>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <p>{voter.email}</p>
                                  </div>
                                  <div>
                                    <Label>Registration Date</Label>
                                    <p>{voter.registrationDate}</p>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={() => handleApproveVoter(voter.id)}>Approve</Button>
                                  <Button variant="outline" onClick={() => handleRejectVoter(voter.id)}>Reject</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="default" size="sm" onClick={() => handleApproveVoter(voter.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleRejectVoter(voter.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div></LoggedInLayout>
  )
}