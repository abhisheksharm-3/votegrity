import { NextRequest, NextResponse } from "next/server";
import { signUpWithEmail } from "@/actions";

/**
 * Handles user registration with email, password, and wallet address
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, walletAddress, password } = await request.json();

    if (!name || !email || !walletAddress || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await signUpWithEmail(name, email, password, walletAddress);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, message: "Registration successful", userId: result.data.userId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
