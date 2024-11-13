"use client";

import React from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

import LoggedInLayout from "@/components/LoggedInLayout";
import WinnerCard from "@/components/Result/WinnerCard";
import VotingStatistics from "@/components/Voting/VotingStatistics";
import { VoterProfile } from "@/components/UserDashboard/VoterProfile";

import useVotingStore from "@/lib/store/useVotingStore";
import { getCandidateDetails } from "@/lib/server/appwrite";
import { Candidate } from "@/lib/types";

// Animation variants
const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  },
};

const WinnerPage: React.FC = () => {
  const { id: electionId } = useParams<{ id: string }>();
  const { getWinningCandidate } = useVotingStore();
  
  const [winnerDetails, setWinnerDetails] = React.useState<Candidate | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch winner details
  React.useEffect(() => {
    let isMounted = true;

    const fetchWinnerDetails = async () => {
      if (!electionId) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await getWinningCandidate(electionId);
        
        if (!result.winningCandidateId) {
          throw new Error("No winning candidate found");
        }

        const details = await getCandidateDetails(result.winningCandidateId, electionId);

        if (!details?.candidate) {
          throw new Error("Candidate details not found");
        }

        if (isMounted) {
          setWinnerDetails({
            candidateId: details.candidate.$id,
            name: details.candidate.name,
            age: details.candidate.age,
            gender: details.candidate.gender,
            qualifications: details.candidate.qualifications,
            pitch: details.candidate.pitch,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An error occurred");
          console.error("Error fetching winner details:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWinnerDetails();

    return () => {
      isMounted = false;
    };
  }, [electionId, getWinningCandidate]);

  if (!electionId) {
    return (
      <div className="text-red-500 p-4">
        Election ID is required
      </div>
    );
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-red-500 p-4 rounded-lg bg-red-100/10">
          {error}
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <motion.div
          className="md:col-span-2"
          variants={animations.fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <WinnerCard 
            winnerDetails={winnerDetails}
            electionId={electionId}
            isLoading={isLoading}
          />
        </motion.div>
        
        <motion.div
          className="md:col-span-1 space-y-6"
          variants={animations.fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5 }}
        >
          <VoterProfile />
          <VotingStatistics />
        </motion.div>
      </div>
    );
  };

  return (
    <LoggedInLayout>
      <div className="container mx-auto p-6 md:p-8 space-y-8">
        <motion.h1
          className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8"
          variants={animations.fadeInDown}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8 }}
        >
          Winner Panel
        </motion.h1>

        {renderContent()}
      </div>
    </LoggedInLayout>
  );
};

export default WinnerPage;