import { create } from 'zustand';
import { ethers } from 'ethers';
import VotingContractJSON from '@/lib/Contracts/VotingPlatform.json';

const VotingABI = VotingContractJSON.abi;

interface Election {
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
}

interface VotingStore {
  contract: ethers.Contract | null;
  owner: string | null;
  activeElections: string[];
  currentElection: Election | null;

  // Contract Initialization
  initContract: (provider: ethers.BrowserProvider) => Promise<void>;

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
  
  // Voting Functions
  castVote: (electionId: string, candidateId: string) => Promise<void>;
  
  // Admin Functions
  setAdmin: (adminAddress: string, isAdmin: boolean) => Promise<void>;
  tallyElectionResults: (electionId: string) => Promise<void>;
  
  // View Functions
  getElectionDetails: (electionId: string) => Promise<Election>;
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
}

const useVotingStore = create<VotingStore>((set, get) => ({
  contract: null,
  owner: null,
  activeElections: [],
  currentElection: null,

  initContract: async (provider) => {
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS!,
        VotingABI,
        signer
      );
      const owner = await contract.owner();
      set({ contract, owner });
    } catch (error) {
      console.error('Failed to initialize contract:', error);
      throw error;
    }
  },

  registerUser: async (userId) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      const tx = await contract.registerUser(userId);
      await tx.wait();
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  },

  createElection: async (electionId, title, startTime, endTime, candidateIds) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      const tx = await contract.createElection(
        electionId,
        title,
        startTime,
        endTime,
        candidateIds
      );
      await tx.wait();
      await get().fetchActiveElections();
    } catch (error) {
      console.error('Failed to create election:', error);
      throw error;
    }
  },

  castVote: async (electionId, candidateId) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      const tx = await contract.castVote(electionId, candidateId);
      await tx.wait();
      await get().fetchElection(electionId);
    } catch (error) {
      console.error('Failed to cast vote:', error);
      throw error;
    }
  },

  setAdmin: async (adminAddress, isAdmin) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      const tx = await contract.setAdmin(adminAddress, isAdmin);
      await tx.wait();
    } catch (error) {
      console.error('Failed to set admin:', error);
      throw error;
    }
  },

  tallyElectionResults: async (electionId) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      const tx = await contract.tallyElectionResults(electionId);
      await tx.wait();
      await get().fetchElection(electionId);
    } catch (error) {
      console.error('Failed to tally results:', error);
      throw error;
    }
  },

  getElectionDetails: async (electionId) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      const details = await contract.getElectionDetails(electionId);
      return {
        electionId,
        creator: details[0],
        title: details[1],
        startTime: details[2].toNumber(),
        endTime: details[3].toNumber(),
        isActive: details[4],
        totalVotes: details[5].toNumber(),
        candidateIds: details[6],
        winningCandidateId: details[7],
        resultsTallied: details[8]
      };
    } catch (error) {
      console.error('Failed to get election details:', error);
      throw error;
    }
  },

  getCandidateVotes: async (electionId, candidateId) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      const votes = await contract.getCandidateVotes(electionId, candidateId);
      return votes.toNumber();
    } catch (error) {
      console.error('Failed to get candidate votes:', error);
      throw error;
    }
  },

  isElectionActive: async (electionId) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      return await contract.isElectionActive(electionId);
    } catch (error) {
      console.error('Failed to check election status:', error);
      throw error;
    }
  },

  getWinningCandidate: async (electionId) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      const [winningCandidateId, winningVoteCount] = await contract.getWinningCandidate(electionId);
      return {
        winningCandidateId,
        winningVoteCount: winningVoteCount.toNumber()
      };
    } catch (error) {
      console.error('Failed to get winning candidate:', error);
      throw error;
    }
  },

  getActiveElectionsCount: async () => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      const count = await contract.getActiveElectionsCount();
      return count.toNumber();
    } catch (error) {
      console.error('Failed to get active elections count:', error);
      throw error;
    }
  },

  hasUserVoted: async (electionId, voterAddress) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      return await contract.hasUserVoted(electionId, voterAddress);
    } catch (error) {
      console.error('Failed to check if user voted:', error);
      throw error;
    }
  },

  fetchElection: async (electionId) => {
    try {
      const election = await get().getElectionDetails(electionId);
      set({ currentElection: election });
    } catch (error) {
      console.error('Failed to fetch election:', error);
      throw error;
    }
  },

  fetchActiveElections: async () => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    try {
      // Get active elections array from contract
      const activeElectionsArray = await contract.activeElections();
      set({ activeElections: activeElectionsArray });
    } catch (error) {
      console.error('Failed to fetch active elections:', error);
      throw error;
    }
  }
}));

export default useVotingStore;