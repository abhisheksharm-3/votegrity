
"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import LoggedInLayout from "@/components/layout/LoggedInLayout";
import VotingStatistics from "@/components/voting/VotingStatistics";
import CandidateSelection from "@/components/voting/CandidateSelection";
import VoteConfirmation from "@/components/voting/VoteConfirmation";
import { VoterProfile } from "@/components/dashboard/VoterProfile";
import { useVoting } from "@/hooks";

// Animation variants
const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  }
};

// Header Component
function VotePageHeader() {
  return (
    <motion.h1
      className="text-primary-foreground font-medium text-4xl lg:text-5xl font-playfair mb-8"
      variants={animations.fadeInDown}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.8 }}
    >
      Voting Panel
    </motion.h1>
  );
}

// Voter Info Panel Component
function VoterInfoPanel() {
  return (
    <motion.div
      className="md:col-span-1"
      variants={animations.fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5 }}
    >
      <VoterProfile />
      <VotingStatistics />
    </motion.div>
  );
}

// Voting Panel Component
interface VotingPanelProps {
  isVoteSubmitted: boolean;
  selectedCandidate: string;
  onSelectCandidate: (candidate: string) => void;
  isVoting: boolean;
  onVoteSubmit: () => void;
  electionId: string;
}

function VotingPanel({
  isVoteSubmitted,
  selectedCandidate,
  onSelectCandidate,
  isVoting,
  onVoteSubmit,
  electionId,
}: VotingPanelProps) {
  return (
    <motion.div
      className="md:col-span-2"
      variants={animations.fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {!isVoteSubmitted ? (
        <CandidateSelection
          selectedCandidate={selectedCandidate}
          onSelectCandidate={onSelectCandidate}
          isVoting={isVoting}
          onVoteSubmit={onVoteSubmit}
          electionId={electionId}
        />
      ) : (
        <VoteConfirmation electionId={electionId} />
      )}
    </motion.div>
  );
}

// Main Page Component
export default function VotePage() {
  const router = useRouter();
  const params = useParams();
  const electionId = params.id as string;

  const {
    selectedCandidate,
    handleSelectCandidate,
    isVoting,
    isVoteSubmitted,
    handleVoteSubmit,
  } = useVoting(electionId);

  return (
    <LoggedInLayout>
      <div className="min-h-screen p-6 md:p-8 space-y-8 container mx-auto">
        <VotePageHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <VoterInfoPanel />

          <VotingPanel
            isVoteSubmitted={isVoteSubmitted}
            selectedCandidate={selectedCandidate}
            onSelectCandidate={handleSelectCandidate}
            isVoting={isVoting}
            onVoteSubmit={handleVoteSubmit}
            electionId={electionId}
          />
        </div>
      </div>
    </LoggedInLayout>
  );
}