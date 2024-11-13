import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Check, X } from 'lucide-react'
import { useVoterManagement } from '@/lib/Hooks/useVoterManagement'
import { toast } from 'sonner'

interface VoterApprovalsTabProps {
  electionId: string
}

export default function VoterApprovalsTab({ electionId }: VoterApprovalsTabProps) {
  const { 
    pendingVoters, 
    isLoading, 
    error, 
    lastAction, 
    updateVoter 
  } = useVoterManagement(electionId);


  useEffect(() => {
    if (error) {
      toast.error("Error", {
        description: error
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (lastAction.type && lastAction.message) {
      toast.info(lastAction.success ? "Success" : "Error", {
        description: lastAction.message
      });
    }
  }, [lastAction, toast]);

  const handleApproveVoter = async (userId: string) => {
    await updateVoter(userId, 'approved');
  };

  const handleRejectVoter = async (userId: string) => {
    await updateVoter(userId, 'rejected');
  };

  return (
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading voters...
                  </TableCell>
                </TableRow>
              ) : pendingVoters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No pending voters to approve
                  </TableCell>
                </TableRow>
              ) : (
                pendingVoters.map((voter) => (
                  <TableRow key={voter.id}>
                    <TableCell>{voter.name}</TableCell>
                    <TableCell>{voter.email}</TableCell>
                    <TableCell>{voter.registrationDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <VoterDetailsDialog 
                          voter={voter} 
                          onApprove={handleApproveVoter} 
                          onReject={handleRejectVoter} 
                        />
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleApproveVoter(voter.userId)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleRejectVoter(voter.userId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
interface PendingVoter {
  id: string;
  userId: string;
  name: string;
  email: string;
  registrationDate: string;
}
interface VoterDetailsDialogProps {
  voter: PendingVoter
  onApprove: (userId: string) => void
  onReject: (userId: string) => void
}

function VoterDetailsDialog({ voter, onApprove, onReject }: VoterDetailsDialogProps) {
  return (
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
          <Button onClick={() => onApprove(voter.userId)}>Approve</Button>
          <Button variant="outline" onClick={() => onReject(voter.userId)}>Reject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}