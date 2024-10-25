// src/lib/server/appwrite.js
"use server";
import { Client, Account, ID, Databases, Models } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Create a base client
const createBaseClient = () => {
  return new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT!);
};

// Create a session client
export async function createSessionClient() {
  const client = createBaseClient();
  const session = cookies().get("votegrity-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }
  client.setSession(session.value);
  return { account: new Account(client) };
}

// Create an admin client
export async function createAdminClient() {
  const client = createBaseClient().setKey(process.env.APPWRITE_KEY!);
  return { 
    account: new Account(client),
    databases: new Databases(client)
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const walletAddress = formData.get("walletAddress") as string;

  const { account, databases } = await createAdminClient();

  try {
    const user = await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("votegrity-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      user.$id,
      { walletAddress }
    );

    return { success: true, user, session };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed", details: error };
  }
}

export async function signOut() {
  try {
    const { account } = await createSessionClient();
    cookies().delete("votegrity-session");
    await account.deleteSession("current");
    return { success: true, message: "Signed out successfully" };
  } catch (error) {
    return { error: "Sign out failed", details: error };
  }
}

export async function getWalletAddress(userId: string) {
  const { databases } = await createAdminClient();

  try {
    const document = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      userId
    );
    return { success: true, walletAddress: document.walletAddress };
  } catch (error) {
    console.error("Error fetching wallet address:", error);
    return { error: "Failed to fetch wallet address", details: error };
  }
}

export async function loginWithEmailAndWallet(email: string, password: string, walletAddress: string) {
  const { account, databases } = await createAdminClient();
  try {
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("votegrity-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const document = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      session.userId
    );

    if (document.walletAddress !== walletAddress) {
      return { error: "Wallet address mismatch" };
    }

    return { success: true, session };
  } catch (error) {
    console.error('Login error:', error);
    return { error: "Login failed", details: error };
  }
}

export async function checkRegisteredVoter(userId: string): Promise<Models.Document | null> {
  const { databases } = await createAdminClient();

  try {
    const document = await databases.getDocument<Models.Document>(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.REGISTERED_USER_DETAILS!,
      userId
    );
    return document;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 404) {
      return null;
    }
    console.error("Error checking registered user:", error);
    throw error;
  }
}