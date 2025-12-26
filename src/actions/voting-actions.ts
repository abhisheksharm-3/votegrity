"use server";
/**
 * Voting server actions
 */

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "./appwrite-client";
import { getLoggedInUser } from "./auth-actions";
import { APPWRITE_CONFIG } from "@/lib/constants";
import type {
    ApiResponseType,
    VotingStatusType,
    ElectionStatsType,
    LeadingCandidateType,
    CandidateType,
    VoteDocumentType,
    UserElectionDocumentType,
    ElectionDocumentType,
    CandidateDocumentType,
} from "@/types";

/**
 * Casts a vote for a candidate in an election
 */

export async function castVote(
    electionId: string,
    candidateId: string
): Promise<ApiResponseType<{ voteId: string }>> {
    const user = await getLoggedInUser();
    if (!user) {
        return { success: false, error: "User not authenticated" };
    }

    const { databases } = await createAdminClient();

    try {
        const election = await databases.getDocument<ElectionDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.ELECTIONS,
            electionId
        );

        const currentDate = new Date();
        const startDate = new Date(election.startDate);
        const endDate = new Date(election.endDate);

        if (currentDate < startDate) {
            return { success: false, error: "This election has not started yet" };
        }

        if (currentDate > endDate) {
            return { success: false, error: "This election has ended" };
        }

        const registrations = await databases.listDocuments<UserElectionDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.USER_ELECTIONS,
            [Query.equal("userID", user.$id), Query.equal("electionId", electionId)]
        );

        if (registrations.documents.length === 0) {
            return { success: false, error: "You are not registered for this election" };
        }

        const existingVotes = await databases.listDocuments<VoteDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.VOTES,
            [Query.equal("userID", user.$id), Query.equal("electionId", electionId)]
        );

        if (existingVotes.documents.length > 0) {
            return { success: false, error: "You have already cast your vote in this election" };
        }

        if (!election.candidates.includes(candidateId)) {
            return { success: false, error: "Invalid candidate selection" };
        }

        const voteDocument = await databases.createDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.VOTES,
            ID.unique(),
            {
                userID: user.$id,
                electionId,
                candidateId,
            }
        );

        await databases.updateDocument(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.USER_ELECTIONS,
            registrations.documents[0].$id,
            {
                status: "voted",
                votedAt: new Date().toISOString(),
            }
        );

        return { success: true, data: { voteId: voteDocument.$id } };
    } catch (error) {
        console.error("Error casting vote:", error);
        return { success: false, error: "Failed to cast vote" };
    }
}

/**
 * Gets voting statistics for an election
 */
export async function getVotingStatistics(
    electionId: string
): Promise<ApiResponseType<ElectionStatsType>> {
    const { databases } = await createAdminClient();

    try {
        const [votes, registrations] = await Promise.all([
            databases.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.VOTES,
                [Query.equal("electionId", electionId)]
            ),
            databases.listDocuments(
                APPWRITE_CONFIG.DATABASE_ID,
                APPWRITE_CONFIG.COLLECTIONS.USER_ELECTIONS,
                [Query.equal("electionId", electionId)]
            ),
        ]);

        const totalVotes = votes.documents.length;
        const totalRegistered = registrations.documents.length;
        const turnoutPercentage = totalRegistered > 0 ? (totalVotes / totalRegistered) * 100 : 0;

        return {
            success: true,
            data: {
                totalVotes,
                totalRegistered,
                turnoutPercentage,
            },
        };
    } catch (error) {
        console.error("Error fetching voting statistics:", error);
        return { success: false, error: "Failed to fetch voting statistics" };
    }
}

/**
 * Gets the leading candidate for an election
 */
export async function getLeadingCandidate(
    electionId: string
): Promise<ApiResponseType<LeadingCandidateType>> {
    const { databases } = await createAdminClient();

    try {
        const votes = await databases.listDocuments<VoteDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.VOTES,
            [Query.equal("electionId", electionId)]
        );

        if (votes.documents.length === 0) {
            return {
                success: true,
                data: {
                    totalVotes: 0,
                    leadingCandidate: null,
                    voteCount: 0,
                    votePercentage: 0,
                },
            };
        }

        const voteCounts: Record<string, number> = {};
        for (const vote of votes.documents) {
            voteCounts[vote.candidateId] = (voteCounts[vote.candidateId] || 0) + 1;
        }

        const entries = Object.entries(voteCounts);
        const [leadingCandidateId, leadingVotes] = entries.reduce((a, b) =>
            b[1] > a[1] ? b : a
        );

        const leadingCandidate = await databases.listDocuments<CandidateDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.CANDIDATES,
            [Query.equal("candidateId", leadingCandidateId), Query.equal("electionId", electionId)]
        );

        if (leadingCandidate.documents.length === 0) {
            return { success: false, error: "Leading candidate details not found" };
        }

        const totalVotes = votes.documents.length;
        const votePercentage = (leadingVotes / totalVotes) * 100;

        return {
            success: true,
            data: {
                totalVotes,
                leadingCandidate: {
                    candidateId: leadingCandidateId,
                    name: leadingCandidate.documents[0].name,
                },
                voteCount: leadingVotes,
                votePercentage: Number(votePercentage.toFixed(2)),
            },
        };
    } catch (error) {
        console.error("Error getting leading candidate:", error);
        return { success: false, error: "Failed to get leading candidate" };
    }
}

/**
 * Checks if a user has voted in an election
 */
export async function checkVotingStatus(
    electionId: string,
    userId: string
): Promise<ApiResponseType<VotingStatusType>> {
    const { databases } = await createAdminClient();

    try {
        const votes = await databases.listDocuments<VoteDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.VOTES,
            [Query.equal("userID", userId), Query.equal("electionId", electionId), Query.limit(1)]
        );

        if (votes.documents.length > 0) {
            return {
                success: true,
                data: {
                    hasVoted: true,
                    votedAt: votes.documents[0].timestamp,
                    voteId: votes.documents[0].$id,
                },
            };
        }

        return { success: true, data: { hasVoted: false } };
    } catch (error) {
        console.error(`Error checking voting status:`, error);
        return { success: true, data: { hasVoted: false } };
    }
}

/**
 * Gets candidate details
 */
export async function getCandidateDetails(
    candidateId: string,
    electionId: string
): Promise<ApiResponseType<CandidateType>> {
    const { databases } = await createAdminClient();

    try {
        const candidate = await databases.listDocuments<CandidateDocumentType>(
            APPWRITE_CONFIG.DATABASE_ID,
            APPWRITE_CONFIG.COLLECTIONS.CANDIDATES,
            [Query.equal("candidateId", candidateId), Query.equal("electionId", electionId)]
        );

        if (candidate.documents.length === 0) {
            return { success: false, error: "Candidate not found" };
        }

        const doc = candidate.documents[0];
        return {
            success: true,
            data: {
                candidateId: doc.candidateId,
                name: doc.name,
            },
        };
    } catch (error) {
        console.error("Error fetching candidate:", error);
        return { success: false, error: "Failed to fetch candidate" };
    }
}
