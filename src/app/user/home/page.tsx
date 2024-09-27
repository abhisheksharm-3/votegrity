"use client"
import React from "react";
import { motion } from "framer-motion";
import LoggedInLayout from "@/components/LoggedInLayout";
import { useUserData } from "@/hooks/useUserData";
import { VoterProfile } from "@/components/UserDashboard/VoterProfile";
import { VoterDetails } from "@/components/UserDashboard/VoterDetails";
import { ImportantInformation } from "@/components/UserDashboard/ImportantInformation";
import { UpcomingElections } from "@/components/UserDashboard/UpcomingElections";
import { mockUserData, otherInfo } from "@/lib/mockData";

export default function HomePage() {
  const { user, walletAddress, isLoading } = useUserData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <LoggedInLayout>
      <div className="min-h-screen p-6 md:p-8 space-y-8 container">
        <motion.h1 
          className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your Voter Profile
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <VoterProfile />
          <VoterDetails userData={mockUserData} />
          <ImportantInformation info={otherInfo} />
          <UpcomingElections />
        </div>
      </div>
    </LoggedInLayout>
  );
}