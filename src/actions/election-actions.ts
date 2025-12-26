"use server";
/**
 * Election management server actions
 */

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "./appwrite-client";
import { getLoggedInUser } from "./auth-actions";
import { APPWRITE_CONFIG, JOIN_CODE_LENGTH, JOIN_CODE_CHARSET, MAX_JOIN_CODE_ATTEMPTS } from "@/lib/constants";
import type { ApiResponseType, ElectionType, CandidateType, CreateElectionInputType, ElectionDocumentType, CandidateDocumentType } from "@/types";

/**
 * Generates a cryptographically secure join code
 */
function generateJoinCode(): string {
    let result = "";
    const charsetLength = JOIN_CODE_CHARSET.length;
    const randomValues = new Uint32Array(JOIN_CODE_LENGTH);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < JOIN_CODE_LENGTH; i++) {
        result += JOIN_CODE_CHARSET[randomValues[i] % charsetLength];
    }
    return result;
}

/**
 * Creates a new election with candidates
 */

export async function createElection(
    electionId: string,
    values: CreateElectionInputType
): Promise<ApiResponseType<{ electionId: string; joinCode: string }>> {
    const user = await getLoggedInUser();
    if (!user) {
        return { success: false, error: "User not authenticated" };
    }

    const { databases } = await createAdminClient();

    try {
        let joinByCode = generateJoinCode();
        let isCodeUnique = false;
        let attempts = 0;

        while (!isCodeUnique && attempts < MAX_JOIN_CODE_ATTEMPTS) {
            const existing = await databases.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.ELECTIONS,
                [Query.equal("joinByCode", joinByCode)]
            );

            if (existing.documents.length === 0) {
                isCodeUnique = true;
            } else {
                joinByCode = generateJoinCode();
                attempts++;
            }
        }

        if (!isCodeUnique) {
            return { success: false, error: "Unable to generate unique join code" };
        }

        const candidateIds = values.candidates.map(() => ID.unique());

        await databases.createDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.ELECTIONS,
            electionId,
            {
                title: values.title,
                description: values.description,
                category: values.category,
                joinByCode,
                candidates: candidateIds,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                owner: user.$id,
            }
        );

        const candidatePromises = values.candidates.map((candidate, index) =>
            databases.createDocument(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.CANDIDATES,
                ID.unique(),
                {
                    candidateId: candidateIds[index],
                    electionId,
                    name: candidate.name,
                    age: candidate.age,
                    gender: candidate.gender,
                    qualifications: candidate.qualifications,
                    pitch: candidate.pitch,
                }
            )
        );

        await Promise.all(candidatePromises);

        return { success: true, data: { electionId, joinCode: joinByCode } };
    } catch (error) {
        console.error("Error creating election:", error);
        return { success: false, error: "Failed to create election" };
    }
}

/**
 * Fetches elections owned by the current user
 */
export async function fetchOwnedElections(): Promise<ApiResponseType<ElectionType[]>> {
    const user = await getLoggedInUser();
    if (!user) {
        return { success: false, error: "User not authenticated" };
    }

    const { databases } = await createAdminClient();

    try {
        const elections = await databases.listDocuments<ElectionDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.ELECTIONS,
            [Query.orderDesc("startDate"), Query.equal("owner", user.$id)]
        );

        const transformed = elections.documents.map((doc) => ({
            id: doc.$id,
            title: doc.title,
            description: doc.description,
            category: doc.category,
            startDate: new Date(doc.startDate),
            endDate: new Date(doc.endDate),
            joinByCode: doc.joinByCode,
            owner: doc.owner,
            candidates: [],
        }));

        return { success: true, data: transformed };
    } catch (error) {
        console.error("Error fetching owned elections:", error);
        return { success: false, error: "Failed to fetch elections" };
    }
}

/**
 * Gets detailed information about an election including candidates
 */
export async function getElectionDetails(
    electionId: string
): Promise<ApiResponseType<{ election: ElectionType; candidates: CandidateType[] }>> {
    const { databases } = await createAdminClient();

    try {
        const election = await databases.getDocument<ElectionDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.ELECTIONS,
            electionId
        );

        const candidateDocs = await databases.listDocuments<CandidateDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.CANDIDATES,
            [Query.equal("electionId", electionId)]
        );

        const candidates: CandidateType[] = candidateDocs.documents.map((doc) => ({
            candidateId: doc.candidateId,
            name: doc.name,
            age: doc.age,
            gender: doc.gender as CandidateType["gender"],
            qualifications: doc.qualifications,
            pitch: doc.pitch,
        }));


        return {
            success: true,
            data: {
                election: {
                    id: election.$id,
                    title: election.title,
                    description: election.description,
                    category: election.category,
                    startDate: new Date(election.startDate),
                    endDate: new Date(election.endDate),
                    joinByCode: election.joinByCode,
                    owner: election.owner,
                    candidates,
                },
                candidates,
            },
        };
    } catch (error) {
        console.error("Error fetching election details:", error);
        return { success: false, error: "Failed to fetch election details" };
    }
}

/**
 * Joins an election using a join code
 */
export async function joinElectionByCode(
    joinCode: string
): Promise<ApiResponseType<{ electionId: string }>> {
    const user = await getLoggedInUser();
    if (!user) {
        return { success: false, error: "User not authenticated" };
    }

    const { databases } = await createAdminClient();

    try {
        const elections = await databases.listDocuments<ElectionDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.ELECTIONS,
            [Query.equal("joinByCode", joinCode)]
        );

        if (elections.documents.length === 0) {
            return { success: false, error: "Invalid join code" };
        }

        const election = elections.documents[0];
        const currentDate = new Date();
        const startDate = new Date(election.startDate);
        const endDate = new Date(election.endDate);

        if (currentDate > endDate) {
            return { success: false, error: "This election has already ended" };
        }

        if (currentDate > startDate) {
            return { success: false, error: "This election has already started" };
        }

        const existingEnrollments = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.USER_ELECTIONS,
            [Query.equal("userID", user.$id), Query.equal("electionId", election.$id)]
        );

        if (existingEnrollments.documents.length > 0) {
            return { success: false, error: "You are already enrolled in this election" };
        }

        await databases.createDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.USER_ELECTIONS,
            ID.unique(),
            {
                userID: user.$id,
                electionId: election.$id,
                status: "pending",
            }
        );

        return { success: true, data: { electionId: election.$id } };
    } catch (error) {
        console.error("Error joining election:", error);
        return { success: false, error: "Failed to join election" };
    }
}

/**
 * Gets elections the current user is registered for
 */
export async function getUserElections(): Promise<ApiResponseType<ElectionType[]>> {
    const user = await getLoggedInUser();
    if (!user) {
        return { success: false, error: "User not authenticated" };
    }

    const { databases } = await createAdminClient();

    try {
        const userElections = await databases.listDocuments(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.USER_ELECTIONS,
            [Query.equal("userID", user.$id)]
        );

        if (userElections.documents.length === 0) {
            return { success: true, data: [] };
        }

        const electionIds = userElections.documents.map((doc) => doc.electionId);
        const electionsPromises = electionIds.map((id) =>
            databases.getDocument<ElectionDocumentType>(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.ELECTIONS,
                id
            )
        );

        const elections = await Promise.all(electionsPromises);

        const transformed = elections.map((doc) => ({
            id: doc.$id,
            title: doc.title,
            description: doc.description,
            category: doc.category,
            startDate: new Date(doc.startDate),
            endDate: new Date(doc.endDate),
            joinByCode: doc.joinByCode,
            owner: doc.owner,
            candidates: [],
        }));

        return { success: true, data: transformed };
    } catch (error) {
        console.error("Error fetching user elections:", error);
        return { success: false, error: "Failed to fetch user elections" };
    }
}
