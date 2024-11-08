import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  getLoggedInUser, 
  getWalletAddress, 
  checkRegisteredVoter, 
  getUserElections, 
  joinElectionByCode,
  castVote,
  getVotingStatistics,
  createAdminClient
} from "@/lib/server/appwrite";
import { User } from "@/lib/types";
import { Models, Query, Databases } from "node-appwrite";

export interface VotingStatus {
  hasVoted: boolean;
  votedAt?: string;
  voteId?: string;
}

export interface ElectionStats {
  totalVotes: number;
  totalRegistered: number;
  turnoutPercentage: number;
}

interface VoteResult {
  success: boolean;
  message?: string;
  voteId?: string;
}

interface JoinElectionResult {
  success: boolean;
  message?: string;
  election?: Models.Document;
  error?: string;
}

interface StatsResult {
  success: boolean;
  totalVotes: number;
  totalRegistered: number;
  turnoutPercentage: number;
}

interface UserDataHookResult {
  user: User | null;
  walletAddress: string | null;
  registeredVoterData: Models.Document | null;
  elections: Models.Document[];
  isRegisteredVoter: boolean;
  isLoading: boolean;
  error: string | null;
  votingStatus: Record<string, VotingStatus>;
  electionStats: Record<string, ElectionStats>;
  joinElection: (joinCode: string) => Promise<JoinElectionResult>;
  submitVote: (electionId: string, candidateId: string) => Promise<VoteResult>;
  refreshElectionData: (electionId: string) => Promise<void>;
  fetchElectionStats: (electionId: string) => Promise<void>;
}

export const useUserData = (): UserDataHookResult => {
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [registeredVoterData, setRegisteredVoterData] = useState<Models.Document | null>(null);
  const [elections, setElections] = useState<Models.Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [votingStatus, setVotingStatus] = useState<Record<string, VotingStatus>>({});
  const [electionStats, setElectionStats] = useState<Record<string, ElectionStats>>({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData(): Promise<void> {
      try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
          router.push("/login");
          return;
        }

        setUser(loggedInUser);
        
        const [walletData, voterData, userElections] = await Promise.all([
          getWalletAddress(loggedInUser.$id),
          checkRegisteredVoter(loggedInUser.$id),
          getUserElections()
        ]);

        setWalletAddress(walletData.walletAddress);
        setRegisteredVoterData(voterData);
        setElections(userElections);

        // Fetch voting status for each election
        const votingStatusData: Record<string, VotingStatus> = {};
        for (const election of userElections) {
          const status = await checkVotingStatus(election.detail.$id);
          votingStatusData[election.detail.$id] = status;
        }
        setVotingStatus(votingStatusData);

      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error instanceof Error ? error.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, [router]);

  const checkVotingStatus = async (electionId: string): Promise<VotingStatus> => {
    if (!user) return { hasVoted: false };

    try {
      const { databases } = await createAdminClient();
      const votes = await (databases as Databases).listDocuments(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.VOTES_COLLECTION_ID!,
        [
          Query.equal('userID', user.$id),
          Query.equal('electionId', electionId),
          Query.limit(1)
        ]
      );

      if (votes.documents.length > 0) {
        return {
          hasVoted: true,
          votedAt: votes.documents[0].timestamp,
          voteId: votes.documents[0].$id
        };
      }

      return { hasVoted: false };
    } catch (error) {
      console.error(`Error checking voting status for election ${electionId}:`, error);
      return { hasVoted: false };
    }
  };

  const submitVote = async (electionId: string, candidateId: string): Promise<VoteResult> => {
    setError(null);
    
    try {
      const result = await castVote(electionId, candidateId);
      
      if (result.success) {
        // Update local voting status
        setVotingStatus(prev => ({
          ...prev,
          [electionId]: {
            hasVoted: true,
            votedAt: new Date().toISOString(),
            voteId: result.voteId
          }
        }));

        // Refresh election stats
        await fetchElectionStats(electionId);
        
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to cast vote";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const fetchElectionStats = async (electionId: string): Promise<void> => {
    try {
      const stats = await getVotingStatistics(electionId) as StatsResult;
      if (stats.success) {
        setElectionStats(prev => ({
          ...prev,
          [electionId]: {
            totalVotes: stats.totalVotes,
            totalRegistered: stats.totalRegistered,
            turnoutPercentage: stats.turnoutPercentage
          }
        }));
      }
    } catch (error) {
      console.error(`Error fetching election stats for election ${electionId}:`, error);
    }
  };

  const joinElection = async (joinCode: string): Promise<JoinElectionResult> => {
    try {
      const result = await joinElectionByCode(joinCode);
      if (result.success && result.election) {
        // Refresh elections list after successful join
        const updatedElections = await getUserElections();
        setElections(updatedElections);
        
        // Initialize voting status for the new election
        const status = await checkVotingStatus(result.election.$id);
        setVotingStatus(prev => ({
          ...prev,
          [result.election.$id]: status
        }));

        // Fetch initial stats for the new election
        await fetchElectionStats(result.election.$id);
      }
      return result;
    } catch (error) {
      console.error("Error joining election:", error);
      return {
        success: false,
        message: "Failed to join election",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  };

  const refreshElectionData = async (electionId: string): Promise<void> => {
    try {
      await Promise.all([
        checkVotingStatus(electionId).then(status => 
          setVotingStatus(prev => ({ ...prev, [electionId]: status }))
        ),
        fetchElectionStats(electionId)
      ]);
    } catch (error) {
      console.error(`Error refreshing election data for ${electionId}:`, error);
    }
  };

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
    joinElection,
    submitVote,
    refreshElectionData,
    fetchElectionStats
  };
};