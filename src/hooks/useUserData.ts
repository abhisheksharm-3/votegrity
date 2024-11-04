import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, getWalletAddress, checkRegisteredVoter, getUserElections, joinElectionByCode } from "@/lib/server/appwrite";
import { User } from "@/lib/types";
import { Models } from "node-appwrite";

//TODO: Change this from hook to zustand store

export const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [registeredVoterData, setRegisteredVoterData] = useState<Models.Document | null>(null);
  const [elections, setElections] = useState<Models.Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
          router.push("/login");
        } else {
          setUser(loggedInUser);
          const walletData = await getWalletAddress(loggedInUser.$id);
          setWalletAddress(walletData.walletAddress);
          
          const voterData = await checkRegisteredVoter(loggedInUser.$id);
          setRegisteredVoterData(voterData);

          const userElections = await getUserElections();
          setElections(userElections);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, [router]);

  const joinElection = async (joinCode: string) => {
    try {
      const result = await joinElectionByCode(joinCode);
      if (result.success) {
        // Refresh elections list after successful join
        const updatedElections = await getUserElections();
        setElections(updatedElections);
      }
      return result;
    } catch (error) {
      console.error("Error joining election:", error);
      return {
        success: false,
        message: "Failed to join election",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  };

  return { 
    user, 
    walletAddress, 
    registeredVoterData, 
    elections,
    isRegisteredVoter: registeredVoterData !== null, 
    isLoading, 
    joinElection
  };
};