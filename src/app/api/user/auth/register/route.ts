import { NextRequest, NextResponse } from 'next/server';
import { signUpWithEmail } from '@/lib/server/appwrite';

export async function POST(request: NextRequest) {
  try {
    // Extract request data
    const { name, email, walletAddress, password } = await request.json();

    // Validate required fields
    if (!name || !email || !walletAddress || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Prepare form data for Appwrite
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('walletAddress', walletAddress);

    // Handle Appwrite signup
    const signUpResult = await signUpWithEmail(formData);
    if (signUpResult.error) {
      return NextResponse.json(
        { error: signUpResult.error }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful',
        userId: signUpResult.user?.$id,
        user: signUpResult.user  // Include user data from Appwrite if available
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' }, 
      { status: 500 }
    );
  }
}