import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import { getLeadingCandidate } from '@/lib/server/appwrite';

// Animation variants to reduce inline objects
const containerVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, type: "spring", stiffness: 200 }
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.3, duration: 0.5 }
};

const checkMarkVariants = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { delay: 0.6, type: "spring", stiffness: 200 }
};

// Memoized background image component
const BackgroundImage = memo(() => (
  <img 
    src="/images/thanks.svg" 
    alt="Vote Received" 
    className="w-full h-full object-cover"
    loading="eager"
  />
));

// Memoized leading candidate badge
const LeadingCandidateBadge = memo(({ candidate }: { candidate: string }) => (
  <Badge variant="secondary" className="px-4 py-2 text-lg font-semibold">
    Leading Candidate: {candidate}
  </Badge>
));

// Memoized thank you message
const ThankYouMessage = memo(() => (
  <div className="space-y-2">
    <p className="text-xl font-medium text-primary-foreground/80">WE RECEIVED YOUR VOTE</p>
    <h2 className="text-7xl font-bold font-playfair mb-8">Thank you!</h2>
  </div>
));

// Memoized footer message
const FooterMessage = memo(() => (
  <p className="text-xl text-primary-foreground/90 max-w-md mx-auto">
    Your voice matters in shaping our future. We appreciate your participation in this important process.
  </p>
));

const VoteConfirmation = ({ electionId }: { electionId: string }) => {
  const [leadCandidate, setLeadCandidate] = useState("Loading...");
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchLeadCandidate = async () => {
      try {
        const response = await getLeadingCandidate(electionId);
        if (isMounted) {
          setLeadCandidate(response.name);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching lead candidate:", error);
          setLeadCandidate("Unable to load candidate");
        }
      }
    };

    fetchLeadCandidate();
    
    return () => {
      isMounted = false;
    };
  }, [electionId]); // Added electionId to dependency array

  return (
    <Card className="bg-primary/5 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-0">
        <motion.div
          {...containerVariants}
          className="relative h-[600px] overflow-hidden"
        >
          <BackgroundImage />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground text-center p-8">
            <motion.div
              {...contentVariants}
              className="space-y-6"
            >
              <LeadingCandidateBadge candidate={leadCandidate} />
              <ThankYouMessage />
              <motion.div {...checkMarkVariants}>
                <CheckCircle className="text-green-400 w-24 h-24 mx-auto" />
              </motion.div>
              <FooterMessage />
            </motion.div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default memo(VoteConfirmation);