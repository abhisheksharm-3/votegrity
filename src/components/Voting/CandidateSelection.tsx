import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

interface Candidate {
  name: string;
  fullName?: string;
  party: string;
  age?: number;
  education?: string;
}

const candidates: Candidate[] = [
  {
    name: 'FOLAYOWON',
    fullName: 'Folayowon Oladapo',
    party: 'Independent Party',
    age: 26,
    education: 'B.Tech Meteorology'
  },
  { name: 'CANDIDATE 2', party: "Candidate's Party" },
  { name: 'CANDIDATE 3', party: "Candidate's Party" }
];

interface CandidateSelectionProps {
  selectedCandidate: string;
  setSelectedCandidate: (candidate: string) => void;
  isVoting: boolean;
  handleVoteSubmit: () => void;
}

export default function CandidateSelection({
  selectedCandidate,
  setSelectedCandidate,
  isVoting,
  handleVoteSubmit
}: CandidateSelectionProps) {
  const [isConfirmed, setIsConfirmed] = React.useState(false);

  const selectedCandidateInfo = candidates.find(c => c.name === selectedCandidate);

  return (
    <Card className="bg-primary/5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-secondary/90 to-primary/90 text-primary-foreground py-6 px-8">
        <CardTitle className="text-2xl font-semibold flex items-center">
          <Users className="mr-3" size={28} />
          Presidential Candidates
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
          {candidates.map((candidate, index) => (
            <div key={index} className="relative">
              <RadioGroupItem
                value={candidate.name}
                id={`candidate-${index}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`candidate-${index}`}
                className="flex flex-col p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl cursor-pointer transition-all duration-300 hover:bg-opacity-20 peer-data-[state=checked]:bg-secondary/30 peer-data-[state=checked]:border-secondary border-2 border-transparent"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-semibold">{candidate.name}</span>
                  <span className="text-sm text-foreground">{candidate.party}</span>
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value={`details-${index}`}>
                    <AccordionTrigger>View Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="mt-2 space-y-1 text-sm">
                        {candidate.fullName && <p><strong>Full Name:</strong> {candidate.fullName}</p>}
                        {candidate.age && <p><strong>Age:</strong> {candidate.age}</p>}
                        {candidate.education && <p><strong>Education:</strong> {candidate.education}</p>}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Label>
            </div>
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
              I confirm my selection of {selectedCandidateInfo.fullName || selectedCandidateInfo.name} 
              from {selectedCandidateInfo.party} as my candidate.
            </Label>
          </div>
        )}
        <Button 
          className="mt-8 w-full bg-gradient-to-r from-secondary to-primary hover:from-secondary/80 hover:to-primary/80 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          size="lg"
          onClick={handleVoteSubmit}
          disabled={isVoting || !isConfirmed || !selectedCandidate}
        >
          {isVoting ? (
            <span className="flex items-center justify-center">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                ⏳
              </motion.span>
              Submitting Vote...
            </span>
          ) : (
            "Submit Vote"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}