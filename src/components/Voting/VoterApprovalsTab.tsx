import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Check, X } from 'lucide-react'
import useVotingStore from '@/lib/store/useVotingStore'
import { PendingVoter } from '@/lib/types'

interface VoterApprovalsTabProps {
  electionId: number
}

export default function VoterApprovalsTab({ electionId }: VoterApprovalsTabProps) {
  const { 
    pendingVoters,
    fetchPendingVoters,
    approveRejectVoter
  } = useVotingStore();

  useEffect(() => {
    fetchPendingVoters(electionId);
  }, [electionId, fetchPendingVoters]);

  const handleApproveVoter = async (voterId: number) => {
    try {
      await approveRejectVoter(electionId, voterId, true);
    } catch (error) {
      console.error('Error approving voter:', error);
      alert('Failed to approve voter. Please try again.');
    }
  }

  const handleRejectVoter = async (voterId: number) => {
    try {
      await approveRejectVoter(electionId, voterId, false);
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
              {pendingVoters.map((voter) => (
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
              ))}
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