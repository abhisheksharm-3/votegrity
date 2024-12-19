"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CheckCircle, FileText, Vote, BarChart3, ArrowRight, Users, ClipboardList, PenTool, Lock, ChevronLeft } from "lucide-react";
import LayoutWithImage from "@/components/LayoutWithImage";

type View = "main" | "voter" | "organizer";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HowToVote: React.FC = () => {
  const [view, setView] = useState<View>("main");

  return (
    <LayoutWithImage className="min-h-screen overflow-hidden">
      <div className="relative p-6 md:p-12 overflow-y-auto scrollbar-hide">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 to-white/50 backdrop-blur-sm -z-10" />
        <div className="mx-auto max-w-6xl">
          <motion.h1 
            className="text-white font-bold text-6xl lg:text-7xl font-playfair mb-6 text-center bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Votegrity
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16 text-center text-xl text-white/80 font-light max-w-2xl mx-auto"
          >
            Empowering democratic decisions through blockchain technology
          </motion.p>
          
          <AnimatePresence mode="wait">
            {view === "main" && <MainView setView={setView} key="main" />}
            {view === "voter" && <VoterInstructions onBack={() => setView("main")} key="voter" />}
            {view === "organizer" && <OrganizerInstructions onBack={() => setView("main")} key="organizer" />}
          </AnimatePresence>
        </div>
      </div>
    </LayoutWithImage>
  );
};

const MainView: React.FC<{ setView: (view: View) => void }> = ({ setView }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="grid gap-8 md:grid-cols-2"
  >
    <RoleCard
      icon={<Users className="h-20 w-20 text-green-600" />}
      title="I'm a Voter"
      description="Participate in secure, transparent voting events on Votegrity."
      onClick={() => setView("voter")}
    />
    <RoleCard
      icon={<ClipboardList className="h-20 w-20 text-green-600" />}
      title="I'm a Voting Organizer"
      description="Create and manage decentralized voting events with ease."
      onClick={() => setView("organizer")}
    />
  </motion.div>
);

const RoleCard: React.FC<StepProps & { onClick: () => void }> = ({ icon, title, description, onClick }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }} 
    whileTap={{ scale: 0.98 }}
    className="h-full"
  >
    <Card className="h-full transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-white to-green-50 border-none shadow-lg hover:shadow-green-200/50">
      <CardHeader className="flex flex-col items-center text-center p-8">
        <motion.div 
          className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 mb-6 shadow-lg"
          whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
        >
          {React.cloneElement(icon as React.ReactElement, { className: "h-20 w-20 text-white" })}
        </motion.div>
        <CardTitle className="mt-4 text-3xl font-bold text-green-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between p-8 pt-0">
        <CardDescription className="mb-8 text-center text-lg text-green-700">{description}</CardDescription>
        <Button 
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300" 
          onClick={onClick}
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

const VoterInstructions: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <InstructionsView
    title="How to Vote on Votegrity"
    steps={[
      { icon: <Wallet />, title: "Connect Wallet", description: "Securely link your Ethereum wallet to access voting features." },
      { icon: <CheckCircle />, title: "Verify Eligibility", description: "We'll confirm your voting rights based on predefined criteria." },
      { icon: <FileText />, title: "Review Proposals", description: "Examine detailed voting proposals and supporting documents." },
      { icon: <Vote />, title: "Cast Your Vote", description: "Submit your decision securely on the blockchain." },
      { icon: <BarChart3 />, title: "Track Results", description: "Monitor live voting progress and view final outcomes." },
    ]}
    onBack={onBack}
  />
);

const OrganizerInstructions: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <InstructionsView
    title="Organize Voting on Votegrity"
    steps={[
      { icon: <Wallet />, title: "Connect Wallet", description: "Link your Ethereum wallet to access organizer features." },
      { icon: <PenTool />, title: "Draft Proposal", description: "Create a comprehensive voting proposal with multiple options." },
      { icon: <Lock />, title: "Set Parameters", description: "Define voting rules, eligibility, and timeframes." },
      { icon: <Users />, title: "Engage Voters", description: "Invite eligible participants and promote your voting event." },
      { icon: <BarChart3 />, title: "Analyze & Conclude", description: "Monitor voting activity and certify final results." },
    ]}
    onBack={onBack}
  />
);

const InstructionsView: React.FC<{ title: string; steps: StepProps[]; onBack: () => void }> = ({ title, steps, onBack }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
  >
    <Button variant="ghost" className="mb-6 text-green-700 hover:text-green-800 hover:bg-green-100" onClick={onBack}>
      <ChevronLeft className="mr-2 h-5 w-5" />
      Back to Roles
    </Button>
    <h2 className="mb-8 text-4xl font-bold text-green-600">{title}</h2>
    <div className="grid gap-6">
      {steps.map((step, index) => (
        <VoteStep key={index} {...step} index={index} />
      ))}
    </div>
  </motion.div>
);

const VoteStep: React.FC<StepProps & { index: number }> = ({ icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.01 }}
  >
    <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-green-50 border-none shadow-md group">
      <CardHeader className="flex flex-row items-center gap-6 p-6">
        <motion.div 
          className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 shadow-md group-hover:shadow-lg transition-all duration-300"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {React.cloneElement(icon as React.ReactElement, { className: "h-8 w-8 text-white" })}
        </motion.div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold text-green-800">
            <span className="text-green-500 mr-2">0{index + 1}.</span>
            {title}
          </CardTitle>
          <CardDescription className="text-base text-green-700">{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  </motion.div>
);

export default HowToVote;