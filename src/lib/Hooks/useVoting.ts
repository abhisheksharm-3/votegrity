import { useState, useCallback } from 'react';
import { castVote as castVoteAppwrite } from '@/lib/server/appwrite';
import  useVotingStore from "@/lib/store/useVotingStore";

interface UseVotingProps {
  electionId: string;
}

interface VoteError {
  message: string;
  code?: string;
  details?: unknown;
}

interface VotingState {
  selectedCandidate: string;
  isVoting: boolean;
  voteSubmitted: boolean;
  error: VoteError | null;
}

const initialState: VotingState = {
  selectedCandidate: '',
  isVoting: false,
  voteSubmitted: false,
  error: null,
};

export function useVoting({ electionId }: UseVotingProps) {
  const [state, setState] = useState<VotingState>(initialState);
  const {castVoteOnChain} = useVotingStore()

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const setSelectedCandidate = useCallback((candidate: string) => {
    setState(prev => ({
      ...prev,
      selectedCandidate: candidate,
      error: null,
    }));
  }, []);

  const resetVotingState = useCallback(() => {
    setState(initialState);
  }, []);

  const handleVoteSubmit = useCallback(async () => {
    // Validate input
    if (!electionId) {
      setState(prev => ({
        ...prev,
        error: {
          message: 'Election ID is required',
          code: 'MISSING_ELECTION_ID'
        }
      }));
      return;
    }

    if (!state.selectedCandidate) {
      setState(prev => ({
        ...prev,
        error: {
          message: 'Please select a candidate',
          code: 'NO_CANDIDATE_SELECTED'
        }
      }));
      return;
    }

    setState(prev => ({ ...prev, isVoting: true, error: null }));

    try {
      // First attempt blockchain vote
      await castVoteOnChain(electionId, state.selectedCandidate);
      
      // If blockchain vote succeeds, record in backend
      await castVoteAppwrite(electionId, state.selectedCandidate);
      
      setState(prev => ({
        ...prev,
        voteSubmitted: true,
        isVoting: false,
        error: null
      }));
    } catch (error) {
      // Handle both blockchain and backend errors
      const errorMessage = error instanceof Error ? error.message : 'Failed to cast vote';
      
      setState(prev => ({
        ...prev,
        error: {
          message: errorMessage,
          code: 'VOTE_FAILED',
          details: error
        },
        isVoting: false
      }));

      // Attempt to rollback or cleanup if needed
      try {
        // Add any cleanup logic here
        // For example, if blockchain vote succeeded but backend failed
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }
    }
  }, [electionId, state.selectedCandidate]);

  const isValidVote = useCallback(() => {
    return Boolean(electionId && state.selectedCandidate && !state.isVoting);
  }, [electionId, state.selectedCandidate, state.isVoting]);

  return {
    // State
    selectedCandidate: state.selectedCandidate,
    isVoting: state.isVoting,
    voteSubmitted: state.voteSubmitted,
    error: state.error,
    
    // Actions
    setSelectedCandidate,
    handleVoteSubmit,
    resetError,
    resetVotingState,
    
    // Utilities
    isValidVote,
  };
}