import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, getWalletAddress, checkRegisteredVoter, getUserElections } from "@/lib/server/appwrite";
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

          const userElections = await getUserElections(loggedInUser.$id);
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

  return { 
    user, 
    walletAddress, 
    registeredVoterData, 
    elections,
    isRegisteredVoter: registeredVoterData !== null, 
    isLoading 
  };
};