"use server";
/**
 * Authentication server actions
 */

import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { createSessionClient, createAdminClient } from "./appwrite-client";
import { SESSION_COOKIE_NAME, APPWRITE_CONFIG } from "@/lib/constants";
import type { UserType, AuthResultType } from "@/types";
import type { ApiResponseType } from "@/types";

/**
 * Gets the currently logged-in user from session
 */
export async function getLoggedInUser(): Promise<UserType | null> {
    try {
        const { account } = await createSessionClient();
        const user = await account.get();
        return {
            $id: user.$id,
            name: user.name,
            email: user.email,
        };
    } catch {
        return null;
    }
}

/**
 * Registers a new user with email, password, and wallet address
 */
export async function signUpWithEmail(
    name: string,
    email: string,
    password: string,
    walletAddress: string
): Promise<ApiResponseType<{ userId: string }>> {
    const { account, databases } = await createAdminClient();

    try {
        const user = await account.create(ID.unique(), email, password, name);
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set(SESSION_COOKIE_NAME, session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        await databases.createDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.USERS,
            user.$id,
            { walletAddress }
        );

        return { success: true, data: { userId: user.$id } };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Registration failed",
        };
    }
}

/**
 * Logs in a user with email, password, and wallet address verification
 */
export async function loginWithEmailAndWallet(
    email: string,
    password: string,
    walletAddress: string
): Promise<ApiResponseType<{ sessionId: string }>> {
    const { account, databases } = await createAdminClient();

    try {
        const session = await account.createEmailPasswordSession(email, password);

        const document = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.USERS,
            session.userId
        );

        if (document.walletAddress !== walletAddress) {
            await account.deleteSession(session.$id);
            return { success: false, error: "Wallet address mismatch" };
        }

        cookies().set(SESSION_COOKIE_NAME, session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return { success: true, data: { sessionId: session.$id } };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Login failed",
        };
    }
}

/**
 * Signs out the current user
 */
export async function signOut(): Promise<ApiResponseType<null>> {
    try {
        const { account } = await createSessionClient();
        cookies().delete(SESSION_COOKIE_NAME);
        await account.deleteSession("current");
        return { success: true, data: null, message: "Signed out successfully" };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Sign out failed",
        };
    }
}

/**
 * Gets the wallet address for a user
 */
export async function getWalletAddress(
    userId: string
): Promise<ApiResponseType<{ walletAddress: string }>> {
    const { databases } = await createAdminClient();

    try {
        const document = await databases.getDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.USERS,
            userId
        );
        return { success: true, data: { walletAddress: document.walletAddress } };
    } catch (error) {
        console.error("Error fetching wallet address:", error);
        return {
            success: false,
            error: "Failed to fetch wallet address",
        };
    }
}
