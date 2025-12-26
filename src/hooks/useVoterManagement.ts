"use client";
/**
 * Voter management hook using React Query and server actions
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchPendingVoters,
    updateVoterStatus,
    checkRegisteredVoter,
    submitVoterRegistration,
} from "@/actions";
import type { PendingVoterType, VoterStatusType, RegisteredVoterType } from "@/types";

const QUERY_KEYS = {
    PENDING_VOTERS: (electionId: string) => ["pendingVoters", electionId] as const,
    REGISTERED_VOTER: (userId: string) => ["registeredVoter", userId] as const,
};

type VoterActionResultType = {
    type: "approve" | "reject" | "vote" | null;
    success: boolean;
    message: string;
};

/**
 * Hook for managing pending voters in an election
 */
export function useVoterManagement(electionId: string) {
    const queryClient = useQueryClient();

    const pendingVotersQuery = useQuery({
        queryKey: QUERY_KEYS.PENDING_VOTERS(electionId),
        queryFn: async (): Promise<PendingVoterType[]> => {
            const result = await fetchPendingVoters(electionId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        enabled: !!electionId,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({
            userId,
            status,
        }: {
            userId: string;
            status: VoterStatusType;
        }): Promise<VoterActionResultType> => {
            const result = await updateVoterStatus(electionId, userId, status);
            const actionType = status === "approved" ? "approve" : status === "rejected" ? "reject" : "vote";

            if (!result.success) {
                return { type: actionType, success: false, message: result.error };
            }

            return { type: actionType, success: true, message: result.message ?? `Voter ${status}` };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.PENDING_VOTERS(electionId),
            });
        },
    });

    function handleUpdateVoter(userId: string, status: VoterStatusType) {
        return updateStatusMutation.mutateAsync({ userId, status });
    }

    function handleRefreshVoters() {
        pendingVotersQuery.refetch();
    }

    return {
        pendingVoters: pendingVotersQuery.data ?? [],
        isLoading: pendingVotersQuery.isLoading,
        error: pendingVotersQuery.error?.message ?? null,
        lastAction: updateStatusMutation.data ?? null,
        isUpdating: updateStatusMutation.isPending,
        handleUpdateVoter,
        handleRefreshVoters,
    };
}

/**
 * Hook for checking if a user is registered as a voter
 */
export function useRegisteredVoter(userId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.REGISTERED_VOTER(userId),
        queryFn: async (): Promise<RegisteredVoterType | null> => {
            const result = await checkRegisteredVoter(userId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        enabled: !!userId,
    });
}

/**
 * Hook for submitting voter registration
 */
export function useVoterRegistration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await submitVoterRegistration(formData);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["registeredVoter"] });
        },
    });
}
