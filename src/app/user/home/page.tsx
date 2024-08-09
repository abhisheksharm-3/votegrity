"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Variants, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoggedInLayout from "@/components/LoggedInLayout";
import { getLoggedInUser, getWalletAddress } from "@/lib/server/appwrite";

interface User {
  name: string;
  $id: string;
}

interface WalletData {
  walletAddress: string | null;
}

interface MockUserData {
  district: string;
  status: string;
  address: string;
  year: string;
  gender: string;
  religion: string;
  bloodGroup: string;
}

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function HomePage() {
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

  const mockUserData: MockUserData = {
    district: "Mumbai Suburban",
    status: "Not voted",
    address: "Flat 302, Sai Krupa Society, Andheri East, Mumbai 400069",
    year: "2024",
    gender: "Male",
    religion: "Hindu",
    bloodGroup: "B+",
  };

  const otherInfo = "As per the Election Commission of India, voting is a fundamental right and duty of every eligible citizen. Your participation strengthens our democracy. Please ensure your voter ID is up to date and exercise your franchise in all upcoming elections. Remember, every vote counts in shaping the future of our great nation.";

  if (!user) {
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

          <motion.div className="md:col-span-2" variants={fadeInUp} initial="initial" animate="animate">
            <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Voter Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {Object.entries(mockUserData).map(([key, value]) => (
                      <TableRow key={key} className="border-b border-white/10">
                        <TableCell className="font-medium capitalize text-gray-300">{key}</TableCell>
                        <TableCell className="text-white">{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="md:col-span-2" variants={fadeInUp} initial="initial" animate="animate">
            <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Important Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 leading-relaxed">{otherInfo}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Elections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 transition-all duration-300">
                  Lok Sabha Election 2024
                </Button>
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 transition-all duration-300">
                  Maharashtra State Assembly Election
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-semibold py-3 transition-all duration-300">
                  Mumbai Municipal Corporation Election
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </LoggedInLayout>
  );
}