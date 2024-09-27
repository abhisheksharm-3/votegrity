"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LoggedInLayout from "@/components/LoggedInLayout";
import VotingStatistics from "@/components/Voting/VotingStatistics";
import CandidateSelection from "@/components/Voting/CandidateSelection";
import VoteConfirmation from "@/components/Voting/VoteConfirmation";
import { VoterProfile } from "@/components/UserDashboard/VoterProfile";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function VotePage() {
  const [selectedCandidate, setSelectedCandidate] = useState('FOLAYOWON');
  const [isVoting, setIsVoting] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const router = useRouter();

  const handleVoteSubmit = () => {
    setIsVoting(true);
    setTimeout(() => {
      setIsVoting(false);
      setVoteSubmitted(true);
    }, 3000);
  };

  return (
    <LoggedInLayout>
      <div className="min-h-screen p-6 md:p-8 space-y-8 container mx-auto">
        <motion.h1 
          className="text-primary-foreground font-medium text-4xl lg:text-5xl font-playfair mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Voting Panel
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          
          <motion.div 
            className="md:col-span-2"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {!voteSubmitted ? (
              <CandidateSelection
                selectedCandidate={selectedCandidate}
                setSelectedCandidate={setSelectedCandidate}
                isVoting={isVoting}
                handleVoteSubmit={handleVoteSubmit}
              />
            ) : (
              <VoteConfirmation />
            )}
          </motion.div>
        </div>
      </div>
    </LoggedInLayout>
  );
}