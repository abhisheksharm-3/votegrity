"use server";
/**
 * Appwrite client configuration and initialization
 */

import { Client, Account, Databases, Storage } from "node-appwrite";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, APPWRITE_CONFIG } from "@/lib/constants";

/**
 * Creates a base Appwrite client with endpoint and project configured
 */
function createBaseClient(): Client {
    return new Client()
        .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
        .setProject(APPWRITE_CONFIG.PROJECT);
}

/**
 * Creates an authenticated session client using the stored session cookie
 * @throws Error if no valid session exists
 */
export async function createSessionClient(): Promise<{ account: Account }> {
    const client = createBaseClient();
    const session = cookies().get(SESSION_COOKIE_NAME);

    if (!session?.value) {
        throw new Error("No session");
    }

    client.setSession(session.value);
    return { account: new Account(client) };
}

/**
 * Creates an admin client with full API access
 */
export async function createAdminClient(): Promise<{
    client: Client;
    account: Account;
    databases: Databases;
    storage: Storage;
}> {
    const client = createBaseClient().setKey(APPWRITE_CONFIG.KEY);
    return {
        client,
        account: new Account(client),
        databases: new Databases(client),
        storage: new Storage(client),
    };
}
