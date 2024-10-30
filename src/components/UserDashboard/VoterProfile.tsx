import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeInUp } from "@/lib/constants";
import { useUserData } from "@/hooks/useUserData";
import { formatDate } from "@/lib/utils";

export const VoterProfile = () => {
  const { user, walletAddress, isLoading, registeredVoterData, isRegisteredVoter } = useUserData();

  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate">
      <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
        <CardContent className="pt-8">
          <div className="flex flex-col items-center">
            {isLoading ? (
              <Skeleton className="w-32 h-32 rounded-full" />
            ) : (
              <Avatar className="w-32 h-32 border-4 border-green-500">
                <AvatarFallback className="text-2xl font-bold text-white bg-gradient-to-br from-green-400 to-blue-500">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            )}
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-48 mt-6" />
                <Skeleton className="h-4 w-32 mt-2" />
                <Skeleton className="h-4 w-40 mt-2" />
                <Skeleton className="h-4 w-36 mt-2" />
                <Skeleton className="h-6 w-24 mt-2" />
              </>
            ) : (
              <>
                <h2 className="mt-6 text-2xl font-semibold text-white">{user?.name}</h2>
                {isRegisteredVoter && (
                  <>
                    <p className="text-sm text-gray-300">Voter ID: {user?.$id}</p>
                    <p className="text-sm text-gray-300">
                      Wallet: {walletAddress ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}` : "Not set"}
                    </p>
                    <p className="text-sm text-gray-300">Date of Birth: {formatDate(registeredVoterData?.dateOfBirth)}</p>
                    <Badge variant="outline" className="mt-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                      Joined: {formatDate(registeredVoterData?.$createdAt)}
                    </Badge>
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};