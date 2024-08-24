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
      <div className="p-6 md:p-12 overflow-y-auto scrollbar-hide">
        <div className="mx-auto max-w-5xl">
          <motion.h1 
            className="text-green-600 font-bold text-5xl lg:text-6xl font-playfair mb-8 text-center"
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
            className="mb-12 text-center text-xl text-green-700 font-light"
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
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Card className="h-full transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm border-green-200">
      <CardHeader className="flex flex-col items-center text-center">
        <div className="rounded-full bg-green-100 p-6 mb-4">
          {icon}
        </div>
        <CardTitle className="mt-4 text-3xl font-bold text-green-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between">
        <CardDescription className="mb-6 text-center text-lg text-green-700">{description}</CardDescription>
        <Button className="w-full bg-green-600 text-white hover:bg-green-700 text-lg py-6" onClick={onClick}>
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
  >
    <Card className="transition-all duration-300 hover:shadow-lg bg-white/80 backdrop-blur-sm border-green-200">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="rounded-full bg-green-100 p-3">
          {React.cloneElement(icon as React.ReactElement, { className: "h-10 w-10 text-green-600" })}
        </div>
        <CardTitle className="text-2xl font-bold text-green-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-lg text-green-700">{description}</CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);

export default HowToVote;