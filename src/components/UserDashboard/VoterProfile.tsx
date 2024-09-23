import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/types";
import { fadeInUp } from "@/lib/constants";
import { mockUserData } from "@/lib/mockData";

interface VoterProfileProps {
  user: User;
  walletAddress: string | null;
}

export const VoterProfile: React.FC<VoterProfileProps> = ({ user, walletAddress }) => {
  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate">
      <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
        <CardContent className="pt-8">
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 border-4 border-green-500">
              <AvatarImage src="/path-to-avatar-image.jpg" alt={user.name} />
              <AvatarFallback className="text-2xl font-bold text-white bg-gradient-to-br from-green-400 to-blue-500">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-6 text-2xl font-semibold text-white">{user.name}</h2>
            <p className="text-sm text-gray-300">Voter ID: {user.$id}</p>
            <p className="text-sm text-gray-300">
              Wallet:{" "}
              {walletAddress
                ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`
                : "Not set"}
            </p>
            <p className="text-sm text-gray-300">Constituency: {mockUserData.district}</p>
            <Badge variant="outline" className="mt-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
              Status: {mockUserData.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};