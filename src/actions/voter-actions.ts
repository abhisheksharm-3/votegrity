"use server";
/**
 * Voter registration and management server actions
 */

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "./appwrite-client";
import { getLoggedInUser } from "./auth-actions";
import { APPWRITE_CONFIG } from "@/lib/constants";
import type { ApiResponseType, RegisteredVoterType, PendingVoterType, VoterStatusType, RegisteredVoterDocumentType, UserElectionDocumentType } from "@/types";

/**
 * Checks if a user is registered as a voter
 */

export async function checkRegisteredVoter(
    userId: string
): Promise<ApiResponseType<RegisteredVoterType | null>> {
    const { databases } = await createAdminClient();

    try {
        const documents = await databases.listDocuments<RegisteredVoterDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.REGISTERED_VOTERS,
            [Query.equal("userID", userId), Query.limit(1)]
        );

        if (documents.documents.length === 0) {
            return { success: true, data: null };
        }

        const doc = documents.documents[0];
        return {
            success: true,
            data: {
                id: doc.$id,
                userId: doc.userID,
                firstName: doc.firstName,
                lastName: doc.lastName,
                dateOfBirth: new Date(doc.dateOfBirth),
                gender: doc.gender,
                address: doc.address,
                city: doc.city,
                state: doc.state,
                zipCode: doc.zipCode,
                email: doc.email,
                phone: doc.phone,
                idType: doc.idType as RegisteredVoterType["idType"],
                idNumber: doc.idNumber,
                idDocumentUrl: doc.idURL,
                citizenship: doc.citizenship as RegisteredVoterType["citizenship"],
                termsAccepted: doc.termsAccepted,
            },
        };
    } catch (error) {
        console.error("Error checking registered voter:", error);
        return { success: false, error: "Failed to check voter registration" };
    }
}

/**
 * Submits voter registration with ID document upload
 */
export async function submitVoterRegistration(
    formData: FormData
): Promise<ApiResponseType<{ registrationId: string }>> {
    const user = await getLoggedInUser();
    if (!user) {
        return { success: false, error: "User not authenticated" };
    }

    const { databases, storage } = await createAdminClient();

    try {
        const idDocument = formData.get("idDocument") as File | null;
        let idDocumentUrl: string | null = null;

        if (idDocument) {
            const uploadResponse = await storage.createFile(
                APPWRITE_CONFIG.BUCKETS.ID_DOCUMENTS,
                user.$id,
                idDocument
            );

            idDocumentUrl = `${APPWRITE_CONFIG.ENDPOINT}/storage/buckets/${APPWRITE_CONFIG.BUCKETS.ID_DOCUMENTS}/files/${uploadResponse.$id}/view?project=${APPWRITE_CONFIG.PROJECT}`;
        }

        const registrationDocument = await databases.createDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.REGISTERED_VOTERS,
            ID.unique(),
            {
                userID: user.$id,
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                dateOfBirth: formData.get("dateOfBirth") as string,
                gender: formData.get("gender") as string,
                address: formData.get("address") as string,
                city: formData.get("city") as string,
                state: formData.get("state") as string,
                zipCode: formData.get("zipCode") as string,
                email: formData.get("email") as string,
                phone: formData.get("phone") as string,
                idType: formData.get("idType") as string,
                idNumber: formData.get("idNumber") as string,
                idURL: idDocumentUrl,
                citizenship: formData.get("citizenship") as string,
                termsAccepted: formData.get("termsAccepted") === "true",
            }
        );

        return { success: true, data: { registrationId: registrationDocument.$id } };
    } catch (error) {
        console.error("Voter registration error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Registration failed",
        };
    }
}

/**
 * Fetches pending voters for an election
 */
export async function fetchPendingVoters(
    electionId: string
): Promise<ApiResponseType<PendingVoterType[]>> {
    if (!electionId) {
        return { success: false, error: "Election ID is required" };
    }

    const { databases } = await createAdminClient();

    try {
        const registrations = await databases.listDocuments<UserElectionDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.USER_ELECTIONS,
            [Query.equal("electionId", electionId), Query.equal("status", "pending")]
        );

        if (registrations.documents.length === 0) {
            return { success: true, data: [] };
        }

        const userIds = registrations.documents.map((reg) => reg.userID);
        const users = await databases.listDocuments<RegisteredVoterDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.REGISTERED_VOTERS,
            [Query.equal("userID", userIds)]
        );

        const userMap = new Map(users.documents.map((user) => [user.userID, user]));

        const pendingVoters: PendingVoterType[] = registrations.documents
            .map((registration) => {
                const user = userMap.get(registration.userID);
                if (!user) return null;

                return {
                    id: registration.$id,
                    odigo: user.userID,
                    name: `${user.firstName} ${user.lastName}`.trim(),
                    email: user.email,
                    registrationDate: new Date(registration.$createdAt).toLocaleString(),
                };
            })
            .filter((voter): voter is PendingVoterType => voter !== null);

        return { success: true, data: pendingVoters };
    } catch (error) {
        console.error("Error fetching pending voters:", error);
        return { success: false, error: "Failed to fetch pending voters" };
    }
}

/**
 * Updates a voter's status for an election
 */
export async function updateVoterStatus(
    electionId: string,
    userId: string,
    status: VoterStatusType
): Promise<ApiResponseType<null>> {
    const { databases } = await createAdminClient();

    try {
        const registrations = await databases.listDocuments<UserElectionDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.USER_ELECTIONS,
            [Query.equal("userID", userId), Query.equal("electionId", electionId)]
        );

        if (registrations.documents.length === 0) {
            return { success: false, error: "Voter registration not found" };
        }

        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.USER_ELECTIONS,
            registrations.documents[0].$id,
            {
                status,
                approvedAt: new Date().toISOString(),
            }
        );

        return { success: true, data: null, message: `Voter status updated to ${status}` };
    } catch (error) {
        console.error("Error updating voter status:", error);
        return { success: false, error: "Failed to update voter status" };
    }
}
