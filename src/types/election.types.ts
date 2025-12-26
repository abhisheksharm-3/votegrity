/**
 * Election and candidate related types
 */

import { GENDER_OPTIONS } from "@/lib/constants";

export type GenderType = (typeof GENDER_OPTIONS)[number];

export type CandidateType = {
    candidateId: string;
    name: string;
    age?: number;
    gender?: GenderType;
    qualifications?: string;
    pitch?: string;
};

export type ElectionType = {
    id: string;
    title: string;
    description: string;
    category: string;
    startDate: Date;
    endDate: Date;
    candidates: CandidateType[];
    joinByCode: string;
    owner: string;
};

export type ElectionStatusType = "upcoming" | "active" | "ended";

export type CreateElectionInputType = {
    title: string;
    description: string;
    category: string;
    startDate: Date;
    endDate: Date;
    candidates: Omit<CandidateType, "candidateId">[];
};

export type ElectionDetailsResponseType = {
    election: ElectionType;
    candidates: CandidateType[];
};

export type BlockchainElectionType = {
    electionId: string;
    creator: string;
    title: string;
    startTime: number;
    endTime: number;
    isActive: boolean;
    totalVotes: number;
    candidateIds: string[];
    winningCandidateId: string;
    resultsTallied: boolean;
};
