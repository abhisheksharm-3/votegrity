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
import fetchElection from '@/lib/mockData'

// Dummy update election function
const updateElection = async (election: Election): Promise<Election> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, you would make an API call here
  console.log('Updating election:', election);
  
  // Return the updated election data
  return {
    ...election,
  };
};

export default function ElectionManagementPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [electionData, setElectionData] = useState<Election | null>(null)

  useEffect(() => {
    const loadElection = async () => {
      try {
        const fetchedElection = await fetchElection(params.id)
        // Only update state if we received valid election data
        if (fetchedElection) {
          setElectionData(fetchedElection)
        } else {
          console.error('No election data received')
          setElectionData(null)
        }
      } catch (error) {
        console.error('Error loading election:', error)
        setElectionData(null)
      }
    }
    loadElection()
  }, [params.id, fetchElection])

  const handleSave = async (updatedElection: Election) => {
    try {
      const result = await updateElection(updatedElection)
      setElectionData(result)
      alert('Election details saved successfully!')
    } catch (error) {
      console.error('Error saving election:', error)
      alert('Failed to save election details. Please try again.')
    }
  }

  if (!electionData) {
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