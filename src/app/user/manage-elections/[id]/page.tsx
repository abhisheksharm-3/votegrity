'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoggedInLayout from '@/components/LoggedInLayout'
import ElectionDetailsTab from '@/components/Voting/ElectionDetailsTab'
import VoterApprovalsTab from '@/components/Voting/VoterApprovalsTab'
import type { Election } from '@/lib/types'
import { useElectionData } from '@/lib/Hooks/useElectionData'

export default function ElectionManagementPage() {
  const router = useRouter()
  const params = useParams();
  const electionId = params.id as string;
  const { candidates, electionData, isLoading, error } = useElectionData(electionId)

  if (isLoading) {
    return (
      <LoggedInLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-32">
            Loading...
          </div>
        </div>
      </LoggedInLayout>
    )
  }

  if (error || !electionData) {
    return (
      <LoggedInLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-red-500 mb-4">
              {error || 'Failed to load election data'}
            </p>
            <Button variant="outline" onClick={() => router.push('/my-elections')}>
              Back to My Elections
            </Button>
          </div>
        </div>
      </LoggedInLayout>
    )
  }

  return (
    <LoggedInLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" className="mb-4" onClick={() => router.push('/my-elections')}>
          Back to My Elections
        </Button>
        
        <h1 className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8">
          Manage Election: {electionData.title}
        </h1>
        
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Election Details</TabsTrigger>
            <TabsTrigger value="voters">Voter Approvals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <ElectionDetailsTab 
              election={electionData} 
              candidates={candidates}
            />
          </TabsContent>
          
          <TabsContent value="voters">
            <VoterApprovalsTab electionId={electionData.id} />
          </TabsContent>
        </Tabs>
      </div>
    </LoggedInLayout>
  )
}