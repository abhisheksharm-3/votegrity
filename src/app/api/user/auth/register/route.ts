import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import VotingContractJSON from '@/lib/Contracts/Voting.json';
import { signUpWithEmail } from '@/lib/server/appwrite';

const VotingABI = VotingContractJSON.abi;

export async function POST(request: NextRequest) {
  try {
    const { name, email, walletAddress, password } = await request.json();

    if (!name || !email || !walletAddress || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('walletAddress', walletAddress);

    const signUpResult = await signUpWithEmail(formData);

    if (signUpResult.error) {
      return NextResponse.json({ error: signUpResult.error }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider();
    const signer = provider.getSigner(0);
    const contract = new ethers.Contract(process.env.VOTING_CONTRACT_ADDRESS!, VotingABI, await signer);

    const documentIPFSHash = 'placeholder_document_hash';
    const profileImageIPFSHash = 'placeholder_image_hash';

    const tx = await contract.registerVoter(documentIPFSHash, profileImageIPFSHash);
    await tx.wait();
    console.log(tx)

    return NextResponse.redirect(`${request.nextUrl.origin}/user/home`);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}