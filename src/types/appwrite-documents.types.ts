/**
 * Appwrite document types that extend Models.Document
 * These types represent the raw document structure from Appwrite database
 */

import type { Models } from "node-appwrite";

export type ElectionDocumentType = Models.Document & {
    title: string;
    description: string;
    category: string;
    joinByCode: string;
    candidates: string[];
    startDate: string;
    endDate: string;
    owner: string;
};

export type CandidateDocumentType = Models.Document & {
    candidateId: string;
    electionId: string;
    name: string;
    age?: number;
    gender?: string;
    qualifications?: string;
    pitch?: string;
};

export type RegisteredVoterDocumentType = Models.Document & {
    userID: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    email: string;
    phone: string;
    idType: string;
    idNumber: string;
    idURL?: string;
    citizenship: string;
    termsAccepted: boolean;
};

export type UserElectionDocumentType = Models.Document & {
    userID: string;
    electionId: string;
    status: string;
    approvedAt?: string;
    votedAt?: string;
};

export type VoteDocumentType = Models.Document & {
    userID: string;
    electionId: string;
    candidateId: string;
    timestamp?: string;
};
