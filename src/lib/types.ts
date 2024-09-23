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