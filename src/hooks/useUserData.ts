import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, getWalletAddress } from "@/lib/server/appwrite";
import { User } from "@/lib/types";

export const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState(null);
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
          const data = await getWalletAddress(loggedInUser.$id);
          setWalletAddress(data.walletAddress);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, [router]);

  return { user, walletAddress, isLoading };
};