import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeInUp } from "@/lib/constants";
import { useUserData } from "@/hooks/useUserData";
import { formatDate } from "@/lib/utils";

const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <motion.p 
    variants={{
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 }
    }}
    className="text-sm text-gray-300 flex items-center gap-2"
  >
    <span className="text-gray-400">{label}:</span>
    <span className="font-medium">{value}</span>
  </motion.p>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="w-32 h-32 rounded-full mx-auto" />
    <div className="space-y-2">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-32 mx-auto" />
      <Skeleton className="h-4 w-40 mx-auto" />
      <Skeleton className="h-4 w-36 mx-auto" />
      <div className="flex justify-center">
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  </div>
);

export const VoterProfile = () => {
  const { 
    user, 
    walletAddress, 
    isLoading, 
    registeredVoterData, 
    isRegisteredVoter 
  } = useUserData();

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
        <CardContent className="pt-8">
          <div className="flex flex-col items-center">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <motion.div 
                className="flex flex-col items-center space-y-4"
                initial="initial"
                animate="animate"
                variants={{
                  animate: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Avatar className="w-32 h-32 border-4 border-green-500 ring-2 ring-white/20 ring-offset-2 ring-offset-transparent">
                    <AvatarFallback className="text-2xl font-bold text-white bg-gradient-to-br from-green-400 to-blue-500">
                      {user?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <motion.h2 
                  variants={fadeInUp}
                  className="mt-6 text-2xl font-semibold text-white"
                >
                  {user?.name}
                </motion.h2>

                {isRegisteredVoter && (
                  <motion.div 
                    className="space-y-2 text-center"
                    variants={{
                      initial: { opacity: 0 },
                      animate: { opacity: 1 }
                    }}
                  >
                    <ProfileField 
                      label="Voter ID" 
                      value={user?.$id|| "Not set"} 
                    />
                    <ProfileField 
                      label="Wallet" 
                      value={walletAddress ? 
                        `${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}` : 
                        "Not set"
                      } 
                    />
                    <ProfileField 
                      label="Date of Birth" 
                      value={formatDate(registeredVoterData?.dateOfBirth)} 
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Badge 
                        variant="outline" 
                        className="mt-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/30"
                      >
                        Joined: {formatDate(registeredVoterData?.$createdAt)}
                      </Badge>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};