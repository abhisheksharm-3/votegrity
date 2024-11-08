import React, { useState } from "react";
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CandidateCard } from './CandidateCard';
import { SubmitVoteButton } from './SubmitVoteButton';
import type { CandidateSelectionProps } from '@/lib/types';
import { useElectionData } from "@/lib/Hooks/useElectionData";

export default function CandidateSelection({
  selectedCandidate,
  setSelectedCandidate,
  isVoting,
  handleVoteSubmit,
  electionId
}: CandidateSelectionProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { candidates, electionData, isLoading, error } = useElectionData(electionId);

  const selectedCandidateInfo = candidates.find(c => c.candidateId === selectedCandidate);

  if (isLoading) {
    return (
      <Card className="bg-primary/5 backdrop-blur-xl shadow-2xl rounded-2xl">
        <CardContent className="p-8 text-center">
          Loading candidates...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-primary/5 backdrop-blur-xl shadow-2xl rounded-2xl">
        <CardContent className="p-8 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-primary/5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-secondary/90 to-primary/90 text-primary-foreground py-6 px-8">
        <CardTitle className="text-2xl font-semibold flex items-center">
          <Users className="mr-3" size={28} />
          {electionData?.title} Candidates
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <RadioGroup
          value={selectedCandidate}
          onValueChange={(value) => {
            setSelectedCandidate(value);
            setIsConfirmed(false);
          }}
          className="space-y-4"
        >
          {candidates.map((candidate) => (
            <CandidateCard 
              key={candidate.candidateId} 
              candidate={candidate} 
            />
          ))}
        </RadioGroup>
        
        {selectedCandidateInfo && (
          <div className="mt-8 flex items-center space-x-2">
            <Checkbox
              id="confirmation"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
              className="text-secondary"
            />
            <Label
              htmlFor="confirmation"
              className="text-sm text-foreground"
            >
              I confirm my selection of {selectedCandidateInfo.name} as my candidate.
            </Label>
          </div>
        )}

        <SubmitVoteButton 
          isVoting={isVoting}
          isDisabled={!isConfirmed || !selectedCandidate}
          onSubmit={handleVoteSubmit}
        />
      </CardContent>
    </Card>
  );
}