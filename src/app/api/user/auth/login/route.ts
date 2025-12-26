import { NextRequest, NextResponse } from "next/server";
import { loginWithEmailAndWallet } from "@/actions";

/**
 * Handles user login with email, password, and wallet verification
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, walletAddress } = await request.json();

    if (!email || !password || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await loginWithEmailAndWallet(email, password, walletAddress);

    if (!result.success) {
      const statusCode = result.error === "Wallet address mismatch" ? 401 : 401;
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({ success: true, message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 });
  }
}
