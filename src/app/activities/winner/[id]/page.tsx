"use client";
import React from "react";
import { motion } from "framer-motion";
import LoggedInLayout from "@/components/LoggedInLayout";
import WinnerCard from "@/components/Result/WinnerCard";
import VotingStatistics from "@/components/Voting/VotingStatistics";
import { VoterProfile } from "@/components/UserDashboard/VoterProfile";
import useVotingStore from "@/lib/store/useVotingStore";
import { useParams } from "next/navigation";
import { getCandidateDetails } from "@/lib/server/appwrite";
import { AppwriteDocument, Candidate } from "@/lib/types"; // Adjust the import path as needed

interface WinnerCardProps {
  winnerDetails: Candidate;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function WinnerPage() {
  const { getWinningCandidate } = useVotingStore();
  const [winnerDetails, setWinnerDetails] = React.useState<Candidate | null>(null);
  const params = useParams();
  const electionId = params.id as string;

  React.useEffect(() => {
    const fetchWinnerDetails = async () => {
      try {
        const result = await getWinningCandidate(electionId);
        if (result.winningCandidateId) {
          const details = await getCandidateDetails(result.winningCandidateId, electionId);
          
          // Convert AppwriteDocument to Candidate
          if (details.candidate) {
            const candidateData: Candidate = {
              candidateId: details.candidate.$id,
              name: details.candidate.name,
              age: details.candidate.age,
              gender: details.candidate.gender,
              qualifications: details.candidate.qualifications,
              pitch: details.candidate.pitch,
            };
            setWinnerDetails(candidateData);
          }
        }
      } catch (error) {
        console.error("Error fetching winner details:", error);
      }
    };

    if (electionId) {
      fetchWinnerDetails();
    }
  }, [electionId, getWinningCandidate]);

  return (
    <LoggedInLayout>
      <div className="p-6 md:p-8 space-y-8 container mx-auto">
        <motion.h1 
          className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Winner Panel
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <motion.div 
            className="md:col-span-2"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {winnerDetails && <WinnerCard winnerDetails={winnerDetails} />}
          </motion.div>
          <motion.div 
            className="md:col-span-1"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
          >
            <VoterProfile />
            <VotingStatistics />
          </motion.div>
        </div>
      </div>
    </LoggedInLayout>
  );
}