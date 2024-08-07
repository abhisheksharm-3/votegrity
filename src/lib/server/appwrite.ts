// src/lib/server/appwrite.js
"use server";
import { Client, Account, ID, Databases } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT!!);

  const session = cookies().get("votegrity-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
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

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT!)
    .setKey(process.env.APPWRITE_KEY!);

  const account = new Account(client);
  const databases = new Databases(client);

  try {
    const user = await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      user.$id,
      {
        walletAddress: walletAddress,
      }
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
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT!)
    .setKey(process.env.APPWRITE_KEY!);

  const databases = new Databases(client);

  try {
    const document = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_USER_ID!,
      userId
    );
    return { success: true, walletAddress: document.walletAddress };
  } catch (error) {
    console.error("Error fetching wallet address:", error);
    return { error: "Failed to fetch wallet address", details: error };
  }
}
export async function loginWithEmailAndWallet(email: string, password: string, walletAddress: string) {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT!)
      .setKey(process.env.APPWRITE_KEY!);

    const databases = new Databases(client);

    const document = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      user.$id
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