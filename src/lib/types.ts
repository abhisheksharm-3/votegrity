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
    id: number
    title: string
    description: string
    status: 'Active' | 'Upcoming' | 'Completed'
    startDate: Date
    endDate: Date
    voters: number
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