import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingContractJSON from '@/lib/Contracts/VotingPlatform.json';
import useVotingStore from '../store/useVotingStore';
import { MetaMaskInpageProvider } from "@metamask/providers";

const VotingABI = VotingContractJSON.abi;
declare global {
    interface Window {
      ethereum?: MetaMaskInpageProvider;
    }
  }
export function useVotingContract() {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const initContract = useVotingStore(state => state.initContract);

  useEffect(() => {
    async function init() {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const votingContract = new ethers.Contract(process.env.VOTING_CONTRACT_ADDRESS!, VotingABI, await signer);
        setContract(votingContract);
        initContract(provider);
      }
    }
    init();
  }, []);

  return contract;
}