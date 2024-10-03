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