import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, getWalletAddress, checkRegisteredVoter } from "@/lib/server/appwrite";
import { User } from "@/lib/types";
import { Models } from "node-appwrite";

export const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [registeredVoterData, setRegisteredVoterData] = useState<Models.Document | null>(null);
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
    isRegisteredVoter: registeredVoterData !== null, 
    isLoading 
  };
};