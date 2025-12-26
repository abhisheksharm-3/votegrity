/**
 * Constants for the Votegrity application
 */

export const SESSION_COOKIE_NAME = "votegrity-session";

export const APPWRITE_CONFIG = {
  ENDPOINT: process.env.APPWRITE_ENDPOINT!,
  PROJECT: process.env.APPWRITE_PROJECT!,
  KEY: process.env.APPWRITE_KEY!,
  DATABASE_ID: process.env.APPWRITE_DATABASE_ID!,
  COLLECTIONS: {
    USERS: process.env.APPWRITE_COLLECTION_ID!,
    REGISTERED_VOTERS: process.env.REGISTERED_USER_DETAILS!,
    ELECTIONS: process.env.ELECTIONS_COLLECTION_ID!,
    CANDIDATES: process.env.CANDIDATES_COLLECTION_ID!,
    VOTES: process.env.VOTES_COLLECTION_ID!,
    USER_ELECTIONS: process.env.REGISTERED_USER_ELECTIONS!,
  },
  BUCKETS: {
    ID_DOCUMENTS: process.env.ID_DOCUMENT_BUCKET!,
  },
} as const;

export const VOTING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS!;

export const JOIN_CODE_LENGTH = 8;
export const JOIN_CODE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const MAX_JOIN_CODE_ATTEMPTS = 50;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/user/auth/login",
    REGISTER: "/api/user/auth/register",
    LOGOUT: "/api/logout",
    STATUS: "/api/user/auth/status",
  },
} as const;

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  USER: {
    HOME: "/user/home",
    CREATE_PROPOSAL: "/user/create-proposal",
    VOTE: "/user/vote",
    MANAGE_ELECTIONS: "/user/manage-elections",
    SETTINGS: "/user/settings",
    REGISTER_VOTER: "/user/register-voter",
  },
} as const;

export const GENDER_OPTIONS = ["male", "female", "other"] as const;
export const ID_TYPE_OPTIONS = ["driverLicense", "stateID", "passport"] as const;
export const CITIZENSHIP_OPTIONS = ["citizen", "permanentResident"] as const;
export const VOTER_STATUS_OPTIONS = ["pending", "approved", "rejected", "voted"] as const;

/**
 * Animation variants for framer-motion
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};
