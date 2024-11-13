export interface User {
    name: string;
    $id: string;
  }

  export interface WalletData {
    walletAddress: string | null;
  }
  
  export interface MockUserData {
    district: string;
    status: string;
    address: string;
    year: string;
    gender: string;
    religion: string;
    bloodGroup: string;
  }

  export interface UserData {
    city: string;
    state: string;
    address: string;
    year: string;
    gender: string;
    dateOfBirth: string,
  }

  export interface Election {
    id: string
    title: string
    description: string
    category: string
    startDate: Date
    endDate: Date
    candidates: Candidate[]
    joinByCode: string
    owner: string
  }
  
  export interface PendingVoter {
    id: number
    name: string
    email: string
    registrationDate: string
  }

  export interface RegistrationState {
    isSubmitting: boolean;
    error: string | null;
    isSuccess: boolean;
  }
  
  export interface FileValidationOptions {
    maxSize: number;
    allowedTypes: string[];
  }
  export class RegistrationError extends Error {
    constructor(message: string, public code?: string) {
      super(message);
      this.name = 'RegistrationError';
    }
  }

  export interface AppwriteDocument {
    $id: string;
    name: string;
    title?: string;
    age?: number;
    gender?: string;
    qualifications?: string;
    pitch?: string;
  }
  
  export interface Candidate {
    candidateId: string;
    name: string;
    age?: number;
    gender?: string;
    qualifications?: string;
    pitch?: string;
  }
  
  export interface CandidateSelectionProps {
    selectedCandidate: string;
    setSelectedCandidate: (candidate: string) => void;
    isVoting: boolean;
    handleVoteSubmit: () => void;
    electionId: string;
  }

  export type ElectionDetailsResponse = 
  | { success: true; election: AppwriteDocument; candidates: AppwriteDocument[] }
  | { success: false; message: string; error: string };