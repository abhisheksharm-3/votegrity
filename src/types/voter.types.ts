/**
 * Voter registration and voting related types
 */

import { ID_TYPE_OPTIONS, CITIZENSHIP_OPTIONS, VOTER_STATUS_OPTIONS } from "@/lib/constants";

export type IdTypeType = (typeof ID_TYPE_OPTIONS)[number];
export type CitizenshipStatusType = (typeof CITIZENSHIP_OPTIONS)[number];
export type VoterStatusType = (typeof VOTER_STATUS_OPTIONS)[number];

export type RegisteredVoterType = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    email: string;
    phone: string;
    idType: IdTypeType;
    idNumber: string;
    idDocumentUrl?: string;
    citizenship: CitizenshipStatusType;
    termsAccepted: boolean;
};

export type VoterRegistrationInputType = {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    email: string;
    phone: string;
    idType: IdTypeType;
    idNumber: string;
    citizenship: CitizenshipStatusType;
    termsAccepted: boolean;
};

export type PendingVoterType = {
    id: string;
    odigo: string;
    name: string;
    email: string;
    registrationDate: string;
};

export type VotingStatusType = {
    hasVoted: boolean;
    votedAt?: string;
    voteId?: string;
};

export type ElectionStatsType = {
    totalVotes: number;
    totalRegistered: number;
    turnoutPercentage: number;
};

export type VoteResultType = {
    success: boolean;
    message?: string;
    voteId?: string;
};

export type LeadingCandidateType = {
    totalVotes: number;
    leadingCandidate: {
        candidateId: string;
        name: string;
    } | null;
    voteCount: number;
    votePercentage: number;
};

export type CandidateSelectionPropsType = {
    selectedCandidate: string;
    onSelectCandidate: (candidate: string) => void;
    isVoting: boolean;
    onVoteSubmit: () => void;
    electionId: string;
};

export type RegistrationStateType = {
    isSubmitting: boolean;
    error: string | null;
    isSuccess: boolean;
};

export type FileValidationOptionsType = {
    maxSize: number;
    allowedTypes: string[];
};

export type UserDataType = {
    city: string;
    state: string;
    address: string;
    year: string;
    gender: string;
    dateOfBirth: string;
};

