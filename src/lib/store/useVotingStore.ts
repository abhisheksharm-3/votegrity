import create from 'zustand';
import { ethers } from 'ethers';
import VotingContractJSON from '@/lib/Contracts/Voting.json';

const VotingABI = VotingContractJSON.abi;

interface VotingStore {
  contract: ethers.Contract | null;
  owner: string | null;
  workflowStatus: number;
  initContract: (provider: ethers.BrowserProvider) => Promise<void>;
  registerVoter: (documentIPFSHash: string, profileImageIPFSHash: string) => Promise<void>;
  approveRejectVoter: (voterAddress: string, status: number) => Promise<void>;
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
}

const useVotingStore = create<VotingStore>((set, get) => ({
  contract: null,
  owner: null,
  workflowStatus: 0,

  initContract: async (provider) => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(process.env.VOTING_CONTRACT_ADDRESS!, VotingABI, await signer);
    const owner = await contract.owner();
    const workflowStatus = await contract.workflowStatus();
    set({ contract, owner, workflowStatus });
  },

  registerVoter: async (documentIPFSHash, profileImageIPFSHash) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.registerVoter(documentIPFSHash, profileImageIPFSHash);
  },

  approveRejectVoter: async (voterAddress, status) => {
    const { contract } = get();
    if (!contract) throw new Error("Contract not initialized");
    await contract.approveRejectVoter(voterAddress, status);
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
}));

export default useVotingStore;