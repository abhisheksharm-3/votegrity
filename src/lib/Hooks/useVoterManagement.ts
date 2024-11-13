import { useState, useEffect, useCallback } from 'react';
import { fetchPendingVoters, updateVoterStatus } from '../server/appwrite';

interface PendingVoter {
  id: string;
  userId: string;
  name: string;
  email: string;
  registrationDate: string;
}

interface VoterManagementState {
  pendingVoters: PendingVoter[];
  isLoading: boolean;
  error: string | null;
  lastAction: {
    type: 'approve' | 'reject' | 'vote' | null;
    success: boolean;
    message: string;
  };
}

type VoterStatus = 'approved' | 'rejected' | 'voted';
type ActionType = 'approve' | 'reject' | 'vote';

// Helper function to convert status to action type
const statusToActionType = (status: VoterStatus): ActionType => {
  const mapping: Record<VoterStatus, ActionType> = {
    'approved': 'approve',
    'rejected': 'reject',
    'voted': 'vote'
  };
  return mapping[status];
};

export function useVoterManagement(electionId: string) {
  const [state, setState] = useState<VoterManagementState>({
    pendingVoters: [],
    isLoading: true,
    error: null,
    lastAction: {
      type: null,
      success: false,
      message: ''
    }
  });

  const fetchVoters = useCallback(async () => {
    if (!electionId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const voters = await fetchPendingVoters(electionId);
      setState(prev => ({
        ...prev,
        pendingVoters: voters,
        isLoading: false,
        error: null
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch pending voters'
      }));
    }
  }, [electionId]);

  const updateVoter = useCallback(async (
    userId: string,
    status: VoterStatus
  ) => {
    if (!electionId) return;

    setState(prev => ({
      ...prev,
      isLoading: true,
      lastAction: { type: null, success: false, message: '' }
    }));

    try {
      const result = await updateVoterStatus(electionId, userId, status);

      if (result.success) {
        // Refresh the voters list after successful update
        await fetchVoters();
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        lastAction: {
          type: statusToActionType(status),
          success: result.success,
          message: result.message
        }
      }));

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update voter status';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        lastAction: {
          type: statusToActionType(status),
          success: false,
          message: errorMessage
        }
      }));

      return {
        success: false,
        message: errorMessage
      };
    }
  }, [electionId, fetchVoters]);

  // Initial fetch of pending voters
  useEffect(() => {
    fetchVoters();
  }, [fetchVoters]);

  return {
    ...state,
    refreshVoters: fetchVoters,
    updateVoter,
  };
}