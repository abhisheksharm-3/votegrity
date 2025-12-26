"use client";
/**
 * Elections hook using React Query and server actions
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchOwnedElections,
    getUserElections,
    getElectionDetails,
    joinElectionByCode,
    createElection,
} from "@/actions";
import { ID } from "node-appwrite";
import type { ElectionType, CreateElectionInputType } from "@/types";

const QUERY_KEYS = {
    OWNED_ELECTIONS: ["ownedElections"] as const,
    USER_ELECTIONS: ["userElections"] as const,
    ELECTION_DETAILS: (id: string) => ["election", id] as const,
};

/**
 * Hook for fetching elections owned by the current user
 */
export function useOwnedElections() {
    return useQuery({
        queryKey: QUERY_KEYS.OWNED_ELECTIONS,
        queryFn: async () => {
            const result = await fetchOwnedElections();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
    });
}

/**
 * Hook for fetching elections the user is registered for
 */
export function useUserElections() {
    return useQuery({
        queryKey: QUERY_KEYS.USER_ELECTIONS,
        queryFn: async () => {
            const result = await getUserElections();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
    });
}

/**
 * Hook for fetching details of a specific election
 */
export function useElectionDetails(electionId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.ELECTION_DETAILS(electionId),
        queryFn: async () => {
            const result = await getElectionDetails(electionId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        enabled: !!electionId,
    });
}

type JoinElectionResultType = {
    success: boolean;
    electionId?: string;
    error?: string;
};

/**
 * Hook for joining an election by code
 */
export function useJoinElection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (joinCode: string): Promise<JoinElectionResultType> => {
            const result = await joinElectionByCode(joinCode);
            if (!result.success) {
                return { success: false, error: result.error };
            }
            return { success: true, electionId: result.data.electionId };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_ELECTIONS });
        },
    });
}

type CreateElectionResultType = {
    success: boolean;
    electionId?: string;
    joinCode?: string;
    error?: string;
};

/**
 * Hook for creating a new election
 */
export function useCreateElection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: CreateElectionInputType): Promise<CreateElectionResultType> => {
            const electionId = ID.unique();
            const result = await createElection(electionId, values);
            if (!result.success) {
                return { success: false, error: result.error };
            }
            return {
                success: true,
                electionId: result.data.electionId,
                joinCode: result.data.joinCode,
            };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.OWNED_ELECTIONS });
        },
    });
}
