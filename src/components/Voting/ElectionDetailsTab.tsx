import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import type { Election, Candidate } from '@/lib/types'

interface ElectionDetailsTabProps {
  election: Election;
  candidates: Candidate[];
}

export default function ElectionDetailsTab({ election, candidates }: ElectionDetailsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Election Details</CardTitle>
          <CardDescription>View the details of this election</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Election Title</h3>
            <p className="text-base">{election.title}</p>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Description</h3>
            <p className="text-base whitespace-pre-wrap">{election.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Start Date</h3>
              <div className="flex items-center text-base">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(election.startDate, "PPP")}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">End Date</h3>
              <div className="flex items-center text-base">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(election.endDate, "PPP")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
          <CardDescription>
            {candidates.length} registered candidates for this election
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {candidates.map((candidate) => (
              <Card key={candidate.candidateId}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      {candidate.name}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {candidate.age} years old • {candidate.gender}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <h4 className="font-medium text-sm">Qualifications</h4>
                    <p className="text-sm text-muted-foreground">
                      {candidate.qualifications}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Election Pitch</h4>
                    <p className="text-sm text-muted-foreground">
                      {candidate.pitch}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}