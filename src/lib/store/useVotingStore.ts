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

const MAX_INIT_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const useVotingStore = create<VotingStore>((set, get) => ({
  contract: null,
  owner: null,
  activeElections: [],
  currentElection: null,
  isInitializing: false,

  initContract: async (provider) => {
    try {
      set({ isInitializing: true });
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
    } finally {
      set({ isInitializing: false });
    }
  },

  ensureContract: async () => {
    const { contract, isInitializing } = get();
    if (contract) return contract;
    if (isInitializing) {
      let retries = 0;
      while (isInitializing && retries < MAX_INIT_RETRIES) {
        await sleep(RETRY_DELAY);
        retries++;
      }
      if (get().contract) return get().contract!;
    }
    try {
      // Check if window.ethereum exists
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await get().initContract(provider);
        if (get().contract) return get().contract!;
      }
    } catch (error) {
      console.error('Failed to auto-initialize contract:', error);
    }
    
    throw new Error("Contract not initialized and auto-initialization failed");
  },

  registerUser: async (userId) => {
    try {
      const contract = await get().ensureContract();
      const tx = await contract.registerUser(userId);
      await tx.wait();
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  },

  createElection: async (electionId, title, startTime, endTime, candidateIds) => {
    try {
      const contract = await get().ensureContract();
      const tx = await contract.createElection(
        electionId,
        title,
        startTime,
        endTime,
        candidateIds
      );
      await tx.wait();
      //TODO: Add this function to contract
      // await get().fetchActiveElections();
    } catch (error) {
      console.error('Failed to create election:', error);
      throw error;
    }
  },

  castVote: async (electionId, candidateId) => {
    try {
      const contract = await get().ensureContract();
      const tx = await contract.castVote(electionId, candidateId);
      await tx.wait();
      await get().fetchElection(electionId);
    } catch (error) {
      console.error('Failed to cast vote:', error);
      throw error;
    }
  },

  setAdmin: async (adminAddress, isAdmin) => {
    try {
      const contract = await get().ensureContract();
      const tx = await contract.setAdmin(adminAddress, isAdmin);
      await tx.wait();
    } catch (error) {
      console.error('Failed to set admin:', error);
      throw error;
    }
  },

  tallyElectionResults: async (electionId) => {
    try {
      const contract = await get().ensureContract();
      const tx = await contract.tallyElectionResults(electionId);
      await tx.wait();
      await get().fetchElection(electionId);
    } catch (error) {
      console.error('Failed to tally results:', error);
      throw error;
    }
  },

  getElectionDetails: async (electionId) => {
    try {
      const contract = await get().ensureContract();
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
    try {
      const contract = await get().ensureContract();
      const votes = await contract.getCandidateVotes(electionId, candidateId);
      return votes.toNumber();
    } catch (error) {
      console.error('Failed to get candidate votes:', error);
      throw error;
    }
  },

  isElectionActive: async (electionId) => {
    try {
      const contract = await get().ensureContract();
      return await contract.isElectionActive(electionId);
    } catch (error) {
      console.error('Failed to check election status:', error);
      throw error;
    }
  },

  getWinningCandidate: async (electionId) => {
    try {
      const contract = await get().ensureContract();
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
    try {
      const contract = await get().ensureContract();
      const count = await contract.getActiveElectionsCount();
      return count.toNumber();
    } catch (error) {
      console.error('Failed to get active elections count:', error);
      throw error;
    }
  },

  hasUserVoted: async (electionId, voterAddress) => {
    try {
      const contract = await get().ensureContract();
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
    try {
      const contract = await get().ensureContract();
      const activeElectionsArray = await contract.activeElections();
      set({ activeElections: activeElectionsArray });
    } catch (error) {
      console.error('Failed to fetch active elections:', error);
      throw error;
    }
  }
}));

export default useVotingStore;