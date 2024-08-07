import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import VotingContractJSON from '@/lib/Contracts/Voting.json';

const VotingABI = VotingContractJSON.abi;

export async function POST(request: Request) {
  try {
    const { name, email, walletAddress, password } = await request.json();

    // Validate input
    if (!name || !email || !walletAddress || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // For localhost, we can use a default provider
    const provider = new ethers.JsonRpcProvider();
    
    // For local development, you might want to use a specific account
    // You can get this from your local blockchain (e.g., the first account in Hardhat)
    const signer = provider.getSigner(0);  // Use the first account
    
    const contract = new ethers.Contract(process.env.VOTING_CONTRACT_ADDRESS!, VotingABI, await signer);

    // For this example, we're not handling IPFS. You might want to add IPFS handling here.
    const documentIPFSHash = 'placeholder_document_hash';
    const profileImageIPFSHash = 'placeholder_image_hash';

    // Call the contract method
    const tx = await contract.registerVoter(documentIPFSHash, profileImageIPFSHash);
    await tx.wait();

    // Here you would typically save the user info to your database
    // For this example, we're just logging it
    console.log('User registered:', { name, email, walletAddress });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 200 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}