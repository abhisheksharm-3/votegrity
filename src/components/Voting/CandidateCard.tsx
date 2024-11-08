import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Candidate } from '@/lib/types';

interface CandidateCardProps {
  candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <div className="relative">
      <RadioGroupItem
        value={candidate.candidateId}
        id={`candidate-${candidate.candidateId}`}
        className="peer sr-only"
      />
      <Label
        htmlFor={`candidate-${candidate.candidateId}`}
        className="flex flex-col p-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl cursor-pointer transition-all duration-300 hover:bg-opacity-20 peer-data-[state=checked]:bg-secondary/30 peer-data-[state=checked]:border-secondary border-2 border-transparent"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-semibold">{candidate.name}</span>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value={`details-${candidate.candidateId}`}>
            <AccordionTrigger>View Details</AccordionTrigger>
            <AccordionContent>
              <div className="mt-2 space-y-1 text-sm">
                {candidate.name && <p><strong>Full Name:</strong> {candidate.name}</p>}
                {candidate.age && <p><strong>Age:</strong> {candidate.age}</p>}
                {candidate.qualifications && <p><strong>Qualifications:</strong> {candidate.qualifications}</p>}
                {candidate.pitch && <p><strong>Pitch:</strong> {candidate.pitch}</p>}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Label>
    </div>
  );
}