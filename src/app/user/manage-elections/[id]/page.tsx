'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoggedInLayout from '@/components/LoggedInLayout'
import { Election } from '@/lib/types'
import useVotingStore from '@/lib/store/useVotingStore'
import ElectionDetailsTab from '@/components/Voting/ElectionDetailsTab'
import VoterApprovalsTab from '@/components/Voting/VoterApprovalsTab'

export default function ElectionManagementPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [electionData, setElectionData] = useState<Election | null>(null)
  const { 
    fetchElection,
    updateElection,
  } = useVotingStore();

  useEffect(() => {
    const loadElection = async () => {
      const election = await fetchElection(params.id)
      setElectionData(election)
    }
    loadElection()
  }, [params.id])

  const handleSave = async (updatedElection: Election) => {
    try {
      await updateElection(updatedElection)
      setElectionData(updatedElection)
      alert('Election details saved successfully!')
    } catch (error) {
      console.error('Error saving election:', error)
      alert('Failed to save election details. Please try again.')
    }
  }

  if (!electionData) {
    return <div>Loading...</div>
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
            <ElectionDetailsTab election={electionData} onSave={handleSave} />
          </TabsContent>
          
          <TabsContent value="voters">
            <VoterApprovalsTab electionId={electionData.id} />
          </TabsContent>
        </Tabs>
      </div>
    </LoggedInLayout>
  )
}