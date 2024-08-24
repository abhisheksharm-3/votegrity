import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginWithEmailAndWallet } from '@/lib/server/appwrite';

export async function POST(request: NextRequest) {
  try {
    const { email, password, walletAddress } = await request.json();

    if (!email || !password || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await loginWithEmailAndWallet(email, password, walletAddress);

    if (result.error) {
      if (result.error === 'Wallet address mismatch') {
        return NextResponse.json({ error: 'Invalid wallet address for this User' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (result.success && result.session) {
      cookies().set("votegrity-session", result.session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });


      return NextResponse.json({ success: true, message: 'Registration successful' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Unexpected error during login' }, { status: 500 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}