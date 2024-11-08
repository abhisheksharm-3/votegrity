import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Award, ThumbsUp } from 'lucide-react';
import { Candidate } from "@/lib/types"; // Adjust import path as needed

interface WinnerCardProps {
  winnerDetails: Candidate;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ winnerDetails }) => {
  // Get initials for Avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to generate a title based on qualifications or default
  const getTitle = (qualifications?: string) => {
    if (!qualifications) return "Elected Candidate";
    if (qualifications.length > 30) {
      return qualifications.slice(0, 30) + "...";
    }
    return qualifications;
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-green-600/90 to-blue-600/90 text-white py-6 px-8">
        <CardTitle className="text-2xl font-semibold flex items-center">
          <Award className="mr-3" size={28} />
          Election Winner
        </CardTitle>
        <CardDescription className="text-white/80">
          Results verified and confirmed
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 relative h-[600px] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="absolute inset-0"
        >
          <img 
            src="/images/winner.svg" 
            alt="Winner Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 p-8 text-white"
        >
          <div className="flex items-center mb-4">
            <Avatar className="h-20 w-20 border-4 border-white/50">
              <AvatarImage src="/api/placeholder/80/80" alt={winnerDetails.name} />
              <AvatarFallback>{getInitials(winnerDetails.name)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h2 className="text-3xl font-bold">{winnerDetails.name}</h2>
              <p className="text-lg opacity-80">{getTitle(winnerDetails.qualifications)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-4 flex-wrap gap-y-2">
            {winnerDetails.age && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                Age: {winnerDetails.age}
              </Badge>
            )}
            {winnerDetails.gender && (
              <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/50">
                {winnerDetails.gender}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
              <Users className="mr-1" size={16} /> 
              ID: {winnerDetails.candidateId}
            </Badge>
          </div>
          <p className="text-white/90">
            {winnerDetails.pitch || "Committed to serving the community with dedication and integrity."}
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default WinnerCard;