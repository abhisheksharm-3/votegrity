import { useState, useEffect } from 'react';
import { getElectionDetails } from '@/lib/server/appwrite';
import type { AppwriteDocument, Candidate, ElectionDetailsResponse } from '../types';

interface ElectionDataState {
  candidates: Candidate[];
  electionData: AppwriteDocument | null;
  isLoading: boolean;
  error: string | null;
}

export function useElectionData(electionId: string) {
  const [state, setState] = useState<ElectionDataState>({
    candidates: [],
    electionData: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchElectionData = async () => {
      if (!electionId) return;

      try {
        const response = await getElectionDetails(electionId) as ElectionDetailsResponse;
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch candidates');
        }

        const transformedCandidates: Candidate[] = response.candidates.map(doc => ({
          candidateId: doc.$id,
          name: doc.name,
          age: doc.age,
          gender: doc.gender,
          qualifications: doc.qualifications,
          pitch: doc.pitch
        }));

        setState({
          candidates: transformedCandidates,
          electionData: response.election,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load candidates'
        }));
      }
    };

    fetchElectionData();
  }, [electionId]);

  return state;
}