/**
 * Authentication related types
 */

export type UserType = {
    $id: string;
    name: string;
    email?: string;
    avatar?: string;
};

export type SessionType = {
    $id: string;
    userId: string;
    secret: string;
    expire: string;
};

export type WalletDataType = {
    walletAddress: string | null;
};

export type LoginCredentialsType = {
    email: string;
    password: string;
    walletAddress: string;
};

export type RegisterCredentialsType = {
    name: string;
    email: string;
    password: string;
    walletAddress: string;
};

export type AuthResultType = {
    success: boolean;
    user?: UserType;
    session?: SessionType;
    error?: string;
};
