/**
 * Blockchain/smart contract related types
 */

import { ethers } from "ethers";

/**
 * Blockchain election representation (from smart contract)
 */
export type BlockchainElectionStateType = {
    electionId: string;
    creator: string;
    title: string;
    startTime: number;
    endTime: number;
    isActive: boolean;
    totalVotes: number;
    candidateIds: string[];
    winningCandidateId: string;
    resultsTallied: boolean;
};

/**
 * Voting store state and methods
 */
export type VotingStoreType = {
    contract: ethers.Contract | null;
    owner: string | null;
    activeElections: string[];
    currentElection: BlockchainElectionStateType | null;
    isInitializing: boolean;

    // Contract Initialization
    initContract: (provider: ethers.BrowserProvider) => Promise<void>;
    ensureContract: () => Promise<ethers.Contract>;

    // User Management
    registerUser: (userId: string) => Promise<void>;

    // Election Management
    createElection: (
        electionId: string,
        title: string,
        startTime: number,
        endTime: number,
        candidateIds: string[]
    ) => Promise<void>;

    updateElection: (
        electionId: string,
        title: string,
        startTime: number,
        endTime: number,
        candidateIds: string[]
    ) => Promise<void>;

    // Voting Functions
    castVoteOnChain: (electionId: string, candidateId: string) => Promise<void>;

    // Admin Functions
    setAdmin: (adminAddress: string, isAdmin: boolean) => Promise<void>;
    tallyElectionResults: (electionId: string) => Promise<void>;

    // View Functions
    getElectionDetails: (electionId: string) => Promise<BlockchainElectionStateType>;
    getCandidateVotes: (electionId: string, candidateId: string) => Promise<number>;
    isElectionActive: (electionId: string) => Promise<boolean>;
    getWinningCandidate: (electionId: string) => Promise<{
        winningCandidateId: string;
        winningVoteCount: number;
    }>;
    getActiveElectionsCount: () => Promise<number>;
    hasUserVoted: (electionId: string, voterAddress: string) => Promise<boolean>;

    // Election State Management
    fetchElection: (electionId: string) => Promise<void>;
    fetchActiveElections: () => Promise<void>;
};

/**
 * Vote error type for voting hook
 */
export type VoteErrorType = {
    message: string;
    code?: string;
};

/**
 * Winning candidate result from blockchain
 */
export type WinningCandidateResultType = {
    winningCandidateId: string;
    winningVoteCount: number;
};
