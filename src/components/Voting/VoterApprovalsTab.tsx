import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Check, X } from 'lucide-react'
import { PendingVoter } from '@/lib/types'
import { approveRejectVoter, fetchPendingVoters } from '@/lib/mockData'

interface VoterApprovalsTabProps {
  electionId: number
}

export default function VoterApprovalsTab({ electionId }: VoterApprovalsTabProps) {
  const [pendingVoters, setPendingVoters] = useState<PendingVoter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPendingVoters = async () => {
      try {
        setIsLoading(true);
        const voters = await fetchPendingVoters(electionId);
        setPendingVoters(voters);
      } catch (error) {
        console.error('Error loading pending voters:', error);
        alert('Failed to load pending voters. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPendingVoters();
  }, [electionId]);

  const handleApproveVoter = async (voterId: number) => {
    try {
      await approveRejectVoter(electionId, voterId, true);
      // Update local state to remove the approved voter
      setPendingVoters(current => current.filter(voter => voter.id !== voterId));
    } catch (error) {
      console.error('Error approving voter:', error);
      alert('Failed to approve voter. Please try again.');
    }
  }

  const handleRejectVoter = async (voterId: number) => {
    try {
      await approveRejectVoter(electionId, voterId, false);
      // Update local state to remove the rejected voter
      setPendingVoters(current => current.filter(voter => voter.id !== voterId));
    } catch (error) {
      console.error('Error rejecting voter:', error);
      alert('Failed to reject voter. Please try again.');
    }
  }

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
                        <VoterDetailsDialog voter={voter} onApprove={handleApproveVoter} onReject={handleRejectVoter} />
                        <Button variant="default" size="sm" onClick={() => handleApproveVoter(voter.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRejectVoter(voter.id)}>
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

interface VoterDetailsDialogProps {
  voter: PendingVoter
  onApprove: (voterId: number) => void
  onReject: (voterId: number) => void
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
          <Button onClick={() => onApprove(voter.id)}>Approve</Button>
          <Button variant="outline" onClick={() => onReject(voter.id)}>Reject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}