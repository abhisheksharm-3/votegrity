import { useState, useEffect } from 'react';
import { getElectionDetails } from '@/lib/server/appwrite';
import type { AppwriteDocument, Candidate, Election, ElectionDetailsResponse } from '../types';

export interface ElectionDataState {
  candidates: Candidate[];
  electionData: Election | null;
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
    interface ElectionDocument {
      $id: string;
      title: string;
      description: string;
      category: string;
      startDate: string;
      endDate: string;
      owner: string;
      joinByCode: string;
    }



    const transformCandidate = (doc: AppwriteDocument): Candidate => ({
      candidateId: doc.$id,
      name: doc.name,
      age: doc.age,
      gender: doc.gender,
      qualifications: doc.qualifications,
      pitch: doc.pitch
    });
    const transformElection = (doc: ElectionDocument): Election => ({
      id: doc.$id,
      title: doc.title || "",
      description: doc.description,
      category: doc.category,
      startDate: new Date(doc.startDate),
      endDate: new Date(doc.endDate),
      owner: doc.owner,
      candidates: [],
      joinByCode: doc.joinByCode
    });

    const fetchElectionData = async () => {
      if (!electionId) return;

      try {
        const response = await getElectionDetails(electionId) as ElectionDetailsResponse;
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch election details');
        }

        const transformedElection = transformElection(response.election as unknown as ElectionDocument);
        const transformedCandidates = response.candidates.map(transformCandidate);

        setState({
          candidates: transformedCandidates,
          electionData: transformedElection,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load election details'
        }));
      }
    };
    

    fetchElectionData();
  }, [electionId]);

  return state;
}