"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Variants, motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import LoggedInLayout from "@/components/LoggedInLayout";
import { getLoggedInUser, getWalletAddress } from "@/lib/server/appwrite";
import { ChevronRight, ChevronDown, Users, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@nextui-org/react";

interface User {
  name: string;
  $id: string;
}

interface WalletData {
  walletAddress: string | null;
}

const votingData = [
  { name: 'Candidate 1', value: 65.7, color: '#4CAF50' },
  { name: 'Candidate 2', value: 34.3, color: '#2196F3' },
];

const totalVoters = 2879;
const totalVotes = 1213;

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function WinnerPage() {
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const loggedInUser = await getLoggedInUser();
      if (!loggedInUser) {
        router.push("/login");
      } else {
        setUser(loggedInUser);
        const data = await getWalletAddress(loggedInUser.$id);
        setWalletAddress(data.walletAddress);
      }
    }
    fetchUserData();
  }, [router]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
<LoggedInLayout>
      <div className="p-6 md:p-8 space-y-8 container mx-auto">
        <motion.h1 
          className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Winner Panel
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="md:col-span-2"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-600/90 to-blue-600/90 text-white py-6 px-8">
                <CardTitle className="text-2xl font-semibold flex items-center">
                  <Users className="mr-3" size={28} />
                  Election Winner: Abhishek Sharma
                </CardTitle>
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
                    alt="Vote Received" 
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
                  <h2 className="text-3xl font-bold mb-2">Abhishek Sharma</h2>
                  <p className="text-lg opacity-80">Visionary Leader, Ready to Serve</p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div 
            className="md:col-span-1"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
              <CardContent className="pt-8">
                <div className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Avatar className="w-40 h-40 border-4 border-purple-500 shadow-lg">
                      <AvatarImage src="/path-to-avatar-image.jpg" alt={user.name} />
                      <AvatarFallback className="text-3xl font-bold text-white bg-gradient-to-br from-pink-400 to-purple-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <h2 className="mt-6 text-3xl font-semibold text-white">{user.name}</h2>
                  <p className="text-sm text-gray-300">Voter ID: {user.$id}</p>
                  <motion.p 
                    className="text-sm text-gray-300 mt-2 bg-purple-500/20 px-3 py-1 rounded-full"
                    whileHover={{ scale: 1.05 }}
                  >
                    Wallet:{" "}
                    {walletAddress
                      ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`
                      : "Not set"}
                  </motion.p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6 bg-gradient-to-br from-green-500/80 to-blue-500/80 border-green-300/50 overflow-hidden rounded-2xl shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-semibold text-white">Voting Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-4">
                  <div className="text-sm text-gray-300">
                    Accredited Voters: {totalVoters.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Total Votes: {totalVotes.toLocaleString()}
                  </div>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  <Progress value={(totalVotes / totalVoters) * 100} className="mb-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500" />
                </motion.div>
                <div className="flex items-center">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={votingData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                        >
                          {votingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2">
                    {votingData.map((entry, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center mb-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                        <div className="text-sm text-white">{entry.name}: {entry.value}%</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </LoggedInLayout>
  );
}