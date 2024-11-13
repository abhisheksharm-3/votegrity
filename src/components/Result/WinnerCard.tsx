import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Award, ThumbsUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Candidate } from "@/lib/types";
import useVotingStore from "@/lib/store/useVotingStore";

interface WinnerCardProps {
  winnerDetails?: Candidate;
  electionId: string;
  isLoading?: boolean;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ winnerDetails, electionId, isLoading = false }) => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'verified' | 'failed'>('idle');
  const [onChainVotes, setOnChainVotes] = useState<number | null>(null);
  const {getWinningCandidate} = useVotingStore();

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTitle = (qualifications?: string) => {
    if (!qualifications) return "Elected Candidate";
    if (qualifications.length > 30) {
      return qualifications.slice(0, 30) + "...";
    }
    return qualifications;
  };

  const verifyWinner = async () => {
    try {
      setVerificationStatus('loading');
      const result = await getWinningCandidate(electionId);
      
      if (result.winningCandidateId === winnerDetails?.candidateId) {
        setVerificationStatus('verified');
        setOnChainVotes(result.winningVoteCount);
      } else {
        setVerificationStatus('failed');
      }
    } catch (error) {
      console.error('Failed to verify winner:', error);
      setVerificationStatus('failed');
    }
  };

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="flex items-center space-x-2 text-white/80">
            <Loader2 className="animate-spin" size={16} />
            <span>Verifying on-chain...</span>
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle size={16} />
            <span>Verified on-chain • {onChainVotes} votes</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center space-x-2 text-red-400">
            <XCircle size={16} />
            <span>Verification failed</span>
          </div>
        );
      default:
        return null;
    }
  };

  const LoadingContent = () => (
    <>
      <CardHeader className="bg-gradient-to-r from-green-600/90 to-blue-600/90 text-white py-6 px-8">
        <CardTitle className="text-2xl font-semibold flex items-center">
          <Award className="mr-3" size={28} />
          Election Winner
        </CardTitle>
        <CardDescription className="text-white/80">
          <Skeleton className="h-4 w-48 bg-white/20" />
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center mb-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="ml-4 space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-10 w-48" />
        </div>
      </CardContent>
    </>
  );

  const Content = () => (
    <>
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
              <AvatarImage src="/api/placeholder/80/80" alt={winnerDetails?.name} />
              <AvatarFallback>{getInitials(winnerDetails?.name || '')}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h2 className="text-3xl font-bold">{winnerDetails?.name}</h2>
              <p className="text-lg opacity-80">{getTitle(winnerDetails?.qualifications)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-4 flex-wrap gap-y-2">
            {winnerDetails?.age && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                Age: {winnerDetails.age}
              </Badge>
            )}
            {winnerDetails?.gender && (
              <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/50">
                {winnerDetails.gender}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
              <Users className="mr-1" size={16} /> 
              ID: {winnerDetails?.candidateId}
            </Badge>
          </div>
          <p className="text-white/90 mb-4">
            {winnerDetails?.pitch || "Committed to serving the community with dedication and integrity."}
          </p>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={verifyWinner} 
              disabled={verificationStatus === 'loading'}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <CheckCircle className="mr-2" size={16} />
              Verify Winner On-chain
            </Button>
            {renderVerificationStatus()}
          </div>
        </motion.div>
      </CardContent>
    </>
  );

  return (
    <Card className="bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
      {isLoading ? <LoadingContent /> : <Content />}
    </Card>
  );
};

export default WinnerCard;