"use client";
/**
 * Hook for managing user data and election interactions
 */

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getLoggedInUser,
  getWalletAddress,
  checkRegisteredVoter,
  getUserElections,
  joinElectionByCode,
  castVote,
  getVotingStatistics,
  checkVotingStatus,
} from "@/actions";
import type { UserType, ElectionType, RegisteredVoterType, VotingStatusType, ElectionStatsType } from "@/types";
import { APP_ROUTES } from "@/lib/constants";

type JoinElectionResultType = {
  success: boolean;
  message?: string;
  electionId?: string;
  error?: string;
};

type VoteResultType = {
  success: boolean;
  message?: string;
  voteId?: string;
};

type UserDataHookResultType = {
  user: UserType | null;
  walletAddress: string | null;
  registeredVoterData: RegisteredVoterType | null;
  elections: ElectionType[];
  isRegisteredVoter: boolean;
  isLoading: boolean;
  error: string | null;
  votingStatus: Record<string, VotingStatusType>;
  electionStats: Record<string, ElectionStatsType>;
  handleJoinElection: (joinCode: string) => Promise<JoinElectionResultType>;
  handleSubmitVote: (electionId: string, candidateId: string) => Promise<VoteResultType>;
  handleRefreshElectionData: (electionId: string) => Promise<void>;
  handleFetchElectionStats: (electionId: string) => Promise<void>;
};

export function useUserData(): UserDataHookResultType {
  const [user, setUser] = useState<UserType | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [registeredVoterData, setRegisteredVoterData] = useState<RegisteredVoterType | null>(null);
  const [elections, setElections] = useState<ElectionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votingStatus, setVotingStatus] = useState<Record<string, VotingStatusType>>({});
  const [electionStats, setElectionStats] = useState<Record<string, ElectionStatsType>>({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
          router.push(APP_ROUTES.LOGIN);
          return;
        }

        setUser(loggedInUser);

        const [walletResult, voterResult, electionsResult] = await Promise.all([
          getWalletAddress(loggedInUser.$id),
          checkRegisteredVoter(loggedInUser.$id),
          getUserElections(),
        ]);

        if (walletResult.success) {
          setWalletAddress(walletResult.data.walletAddress);
        }

        if (voterResult.success && voterResult.data) {
          setRegisteredVoterData(voterResult.data);
        }

        if (electionsResult.success) {
          setElections(electionsResult.data);

          const votingStatusData: Record<string, VotingStatusType> = {};
          for (const election of electionsResult.data) {
            const statusResult = await checkVotingStatus(election.id, loggedInUser.$id);
            if (statusResult.success) {
              votingStatusData[election.id] = statusResult.data;
            }
          }
          setVotingStatus(votingStatusData);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, [router]);

  const handleFetchElectionStats = useCallback(async (electionId: string) => {
    try {
      const result = await getVotingStatistics(electionId);
      if (result.success) {
        setElectionStats((prev) => ({
          ...prev,
          [electionId]: result.data,
        }));
      }
    } catch (err) {
      console.error(`Error fetching election stats for ${electionId}:`, err);
    }
  }, []);

  const handleSubmitVote = useCallback(
    async (electionId: string, candidateId: string): Promise<VoteResultType> => {
      setError(null);

      try {
        const result = await castVote(electionId, candidateId);

        if (result.success) {
          setVotingStatus((prev) => ({
            ...prev,
            [electionId]: {
              hasVoted: true,
              votedAt: new Date().toISOString(),
              voteId: result.data.voteId,
            },
          }));

          await handleFetchElectionStats(electionId);

          return { success: true, voteId: result.data.voteId };
        } else {
          setError(result.error);
          return { success: false, message: result.error };
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to cast vote";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    },
    [handleFetchElectionStats]
  );

  const handleJoinElection = useCallback(
    async (joinCode: string): Promise<JoinElectionResultType> => {
      try {
        const result = await joinElectionByCode(joinCode);

        if (result.success) {
          const electionsResult = await getUserElections();
          if (electionsResult.success) {
            setElections(electionsResult.data);

            if (user) {
              const statusResult = await checkVotingStatus(result.data.electionId, user.$id);
              if (statusResult.success) {
                setVotingStatus((prev) => ({
                  ...prev,
                  [result.data.electionId]: statusResult.data,
                }));
              }
            }

            await handleFetchElectionStats(result.data.electionId);
          }

          return { success: true, electionId: result.data.electionId };
        }

        return { success: false, error: result.error };
      } catch (err) {
        console.error("Error joining election:", err);
        return {
          success: false,
          message: "Failed to join election",
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    },
    [handleFetchElectionStats, user]
  );

  const handleRefreshElectionData = useCallback(
    async (electionId: string) => {
      if (!user) return;

      try {
        const [statusResult] = await Promise.all([
          checkVotingStatus(electionId, user.$id),
          handleFetchElectionStats(electionId),
        ]);

        if (statusResult.success) {
          setVotingStatus((prev) => ({ ...prev, [electionId]: statusResult.data }));
        }
      } catch (err) {
        console.error(`Error refreshing election data for ${electionId}:`, err);
      }
    },
    [handleFetchElectionStats, user]
  );

  return {
    user,
    walletAddress,
    registeredVoterData,
    elections,
    isRegisteredVoter: registeredVoterData !== null,
    isLoading,
    error,
    votingStatus,
    electionStats,
    handleJoinElection,
    handleSubmitVote,
    handleRefreshElectionData,
    handleFetchElectionStats,
  };
}