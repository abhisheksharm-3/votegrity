import { create } from 'zustand';
import { ethers } from 'ethers';
import VotingContractJSON from '@/lib/Contracts/Voting.json';
import { Election, PendingVoter } from '../types';

const VotingABI = VotingContractJSON.abi;

interface VotingStore {
  contract: ethers.Contract | null;
  owner: string | null;
  workflowStatus: number;
  currentElection: Election | null;
  pendingVoters: PendingVoter[];

  initContract: (provider: ethers.BrowserProvider) => Promise<void>;
  registerVoter: (documentIPFSHash: string, profileImageIPFSHash: string) => Promise<void>;
  approveRejectVoter: (electionId: number, voterId: number, isApproved: boolean) => Promise<void>;
  updateVoter: (documentIPFSHash: string, profileImageIPFSHash: string) => Promise<void>;
  registerProposal: (name: string, documentIPFSHash: string, profileImageIPFSHash: string) => Promise<void>;
  approveRejectProposal: (proposalId: number, status: number) => Promise<void>;
  updateProposal: (proposalId: number, name: string, documentIPFSHash: string, profileImageIPFSHash: string) => Promise<void>;
  vote: (proposalId: number) => Promise<void>;
  getApprovedVoters: () => Promise<string[]>;
  getApprovedProposals: (status: number) => Promise<number[]>;
  setAdmin: (adminAddress: string, isAdmin: boolean) => Promise<void>;
  startProposalRegistration: () => Promise<void>;
  endProposalRegistration: () => Promise<void>;
  startVotingSession: () => Promise<void>;
  endVotingSession: () => Promise<void>;
  tallyVotes: () => Promise<void>;
  getWinningProposal: () => Promise<number>;
  getProposal: (proposalId: number) => Promise<any>;
  getVoter: (voterAddress: string) => Promise<any>;
  fetchElection: (id: string) => Promise<Election>;
  updateElection: (election: Election) => Promise<void>;
  fetchPendingVoters: (electionId: number) => Promise<void>;
}

const useVotingStore = create<VotingStore>((set, get) => ({
  contract: null,
  owner: null,
  workflowStatus: 0,
  currentElection: null,
  pendingVoters: [],

  initContract: async (provider) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS!, VotingABI, signer);
    const owner = await contract.owner();
    const workflowStatus = await contract.workflowStatus();
    set({ contract, owner, workflowStatus });
  },

  registerVoter: async (documentIPFSHash, profileImageIPFSHash) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.registerVoter(documentIPFSHash, profileImageIPFSHash);
  },

  approveRejectVoter: async (electionId: number, voterId: number, isApproved: boolean) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    
    try {
      // Replace with actual contract call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Voter ${voterId} ${isApproved ? 'approved' : 'rejected'} for election ${electionId}`);
      
      // Update the pendingVoters list
      set(state => ({
        pendingVoters: state.pendingVoters.filter(voter => voter.id !== voterId)
      }));
    } catch (error) {
      console.error('Error approving/rejecting voter:', error);
      throw error;
    }
  },

  updateVoter: async (documentIPFSHash, profileImageIPFSHash) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.updateVoter(documentIPFSHash, profileImageIPFSHash);
  },

  registerProposal: async (name, documentIPFSHash, profileImageIPFSHash) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.registerProposal(name, documentIPFSHash, profileImageIPFSHash);
  },

  approveRejectProposal: async (proposalId, status) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.approveRejectProposal(proposalId, status);
  },

  updateProposal: async (proposalId, name, documentIPFSHash, profileImageIPFSHash) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.updateProposal(proposalId, name, documentIPFSHash, profileImageIPFSHash);
  },

  vote: async (proposalId) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.vote(proposalId);
  },

  getApprovedVoters: async () => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    return await contract.getApprovedVoters();
  },

  getApprovedProposals: async (status) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    return await contract.getApprovedProposals(status);
  },

  setAdmin: async (adminAddress, isAdmin) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.setAdmin(adminAddress, isAdmin);
  },

  startProposalRegistration: async () => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.startProposalRegistration();
    set({ workflowStatus: 1 });
  },

  endProposalRegistration: async () => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.endProposalRegistration();
    set({ workflowStatus: 2 });
  },

  startVotingSession: async () => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.startVotingSession();
    set({ workflowStatus: 3 });
  },

  endVotingSession: async () => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.endVotingSession();
    set({ workflowStatus: 4 });
  },

  tallyVotes: async () => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.tallyVotes();
    set({ workflowStatus: 5 });
  },

  getWinningProposal: async () => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    return await contract.getWinningProposal();
  },

  getProposal: async (proposalId) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    return await contract.getProposal(proposalId);
  },

  getVoter: async (voterAddress) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    return await contract.getVoter(voterAddress);
  },

  fetchElection: async (id: string) => {
    // Simulate API call (replace with actual API call in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockElection: Election = {
      id: parseInt(id),
      title: "City Council Election 2023",
      description: "Election for selecting new city council members",
      status: "Active",
      startDate: new Date("2023-08-01"),
      endDate: new Date("2023-08-15"),
      voters: 1500,
    };
    set({ currentElection: mockElection });
    return mockElection;
  },

  updateElection: async (election: Election) => {
    // Simulate API call (replace with actual API call in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ currentElection: election });
  },

  fetchPendingVoters: async (electionId: number) => {
    // Simulate API call (replace with actual API call in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockPendingVoters: PendingVoter[] = [
      { id: 1, name: "John Doe", email: "john@example.com", registrationDate: "2023-07-15" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", registrationDate: "2023-07-16" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", registrationDate: "2023-07-17" },
    ];
    set({ pendingVoters: mockPendingVoters });
  },
}));

export default useVotingStore;