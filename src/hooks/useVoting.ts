"use client";
/**
 * Voting hook using React Query and server actions
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import {
    castVote,
    getVotingStatistics,
    getLeadingCandidate,
    checkVotingStatus,
} from "@/actions";
import useVotingStore from "@/lib/store/useVotingStore";
import type { VotingStatusType, ElectionStatsType, VoteErrorType } from "@/types";

const QUERY_KEYS = {
    VOTING_STATUS: (electionId: string, userId: string) => ["votingStatus", electionId, userId] as const,
    VOTING_STATS: (electionId: string) => ["votingStats", electionId] as const,
    LEADING_CANDIDATE: (electionId: string) => ["leadingCandidate", electionId] as const,
};

/**
 * Hook for managing the voting process
 */
export function useVoting(electionId: string) {
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [error, setError] = useState<VoteErrorType | null>(null);
    const queryClient = useQueryClient();
    const { castVoteOnChain } = useVotingStore();

    const voteMutation = useMutation({
        mutationFn: async (candidateId: string) => {
            await castVoteOnChain(electionId, candidateId);
            const result = await castVote(electionId, candidateId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.VOTING_STATS(electionId),
            });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.LEADING_CANDIDATE(electionId),
            });
        },
        onError: (error: Error) => {
            setError({ message: error.message, code: "VOTE_FAILED" });
        },
    });

    const handleVoteSubmit = useCallback(() => {
        if (!electionId) {
            setError({ message: "Election ID is required", code: "MISSING_ELECTION_ID" });
            return;
        }

        if (!selectedCandidate) {
            setError({ message: "Please select a candidate", code: "NO_CANDIDATE_SELECTED" });
            return;
        }

        setError(null);
        voteMutation.mutate(selectedCandidate);
    }, [electionId, selectedCandidate, voteMutation]);

    const handleSelectCandidate = useCallback((candidate: string) => {
        setSelectedCandidate(candidate);
        setError(null);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const resetVotingState = useCallback(() => {
        setSelectedCandidate("");
        setError(null);
    }, []);

    const isValidVote = Boolean(electionId && selectedCandidate && !voteMutation.isPending);

    return {
        selectedCandidate,
        isVoting: voteMutation.isPending,
        isVoteSubmitted: voteMutation.isSuccess,
        error,
        handleSelectCandidate,
        handleVoteSubmit,
        resetError,
        resetVotingState,
        isValidVote,
    };
}

/**
 * Hook for fetching voting status
 */
export function useVotingStatus(electionId: string, userId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.VOTING_STATUS(electionId, userId),
        queryFn: async (): Promise<VotingStatusType> => {
            const result = await checkVotingStatus(electionId, userId);
            if (!result.success) {
                return { hasVoted: false };
            }
            return result.data;
        },
        enabled: !!electionId && !!userId,
    });
}

/**
 * Hook for fetching voting statistics
 */
export function useVotingStatistics(electionId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.VOTING_STATS(electionId),
        queryFn: async (): Promise<ElectionStatsType> => {
            const result = await getVotingStatistics(electionId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        enabled: !!electionId,
    });
}

/**
 * Hook for fetching leading candidate
 */
export function useLeadingCandidate(electionId: string) {
    return useQuery({
        queryKey: QUERY_KEYS.LEADING_CANDIDATE(electionId),
        queryFn: async () => {
            const result = await getLeadingCandidate(electionId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        enabled: !!electionId,
    });
}
