"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoggedInLayout from "@/components/LoggedInLayout";
import { getLoggedInUser, getWalletAddress } from "@/lib/server/appwrite";
import { PieChart, Pie, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { AlertCircle, Users, Clock, StopCircle, ChevronRight, History, TrendingUp, Activity, Zap } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface User {
    name: string;
    $id: string;
}

interface WalletData {
    walletAddress: string | null;
}

const votingData = [
    { name: 'Folayowon Oladapo', value: 46.7, fill: 'hsl(var(--chart-1))' },
    { name: 'Candidate 2', value: 33.5, fill: 'hsl(var(--chart-2))' },
    { name: 'Candidate 3', value: 19.8, fill: 'hsl(var(--chart-3))' },
];

const chartConfig = {
    value: {
        label: "Votes",
    },
    name: {
        label: "Candidate",
    },
};

const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
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

    if (!user) {
        return (
            <LoggedInLayout>
                <div className="flex justify-center items-center h-screen">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold text-white flex items-center"
                    >
                        <Zap className="w-12 h-12 mr-4 animate-pulse text-yellow-400" />
                        Loading Nexus...
                    </motion.div>
                </div>
            </LoggedInLayout>
        );
    }

    return (
        <LoggedInLayout>
            <div className="min-h-screen p-4 sm:p-6 md:p-8 container">
                <motion.h1
                    className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Quantum Admin Nexus
                </motion.h1>
                <AnimatePresence>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                    >
                        {/* User Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-1"
                        >
                            <Card className="overflow-hidden glassmorphism bg-blue-500 bg-opacity-10 border-blue-500">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <Avatar className="w-32 h-32 border-4 border-blue-500">
                                                <AvatarImage src="/path-to-avatar-image.jpg" alt={user.name} />
                                                <AvatarFallback className="text-3xl font-bold text-white bg-gradient-to-br from-blue-500 to-purple-500">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2">
                                                <Zap className="w-6 h-6 text-gray-900" />
                                            </div>
                                        </div>
                                        <h2 className="mt-6 text-3xl font-bold text-white">{user.name}</h2>
                                        <p className="text-sm text-gray-300">Nexus ID: {user.$id}</p>
                                        <p className="text-sm text-gray-300 mt-2">
                                            Quantum Wallet: {walletAddress
                                                ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`
                                                : "Not initialized"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Election History Card */}
                            <Card className="mt-6 glassmorphism bg-purple-500 bg-opacity-10 border-purple-500">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-xl font-bold text-white flex items-center">
                                        <History className="w-6 h-6 mr-2 text-purple-400" />
                                        CHRONOS ARCHIVE
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    {['ACTIVE NEXUS', 'UPCOMING NEXUS', 'TOTAL NEXUS'].map((title, index) => (
                                        <Card key={index} className="glassmorphism bg-gray-600 bg-opacity-30">
                                            <CardContent className="p-4">
                                                <div className="text-sm font-semibold text-gray-300">{title}</div>
                                                <div className="text-3xl font-bold text-white mt-2">{index === 2 ? 8 : index + 1}</div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Main Content Area */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2"
                        >
                            <Card className="glassmorphism bg-green-500 bg-opacity-10 border-green-500">
                                <CardHeader className="flex flex-row items-center pb-2">
                                    <Activity className="w-8 h-8 mr-2 text-green-400" />
                                    <CardTitle className="text-2xl font-bold text-white">Quantum Nexus Pulse</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Presidential Election Card */}
                                        <Card className="glassmorphism bg-purple-400 bg-opacity-10 border-purple-400">
                                            <CardContent className="p-6">
                                                <CardTitle className="text-xl font-bold mb-4 text-white">Nexus Prime</CardTitle>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    {[
                                                        { icon: <Users className="w-6 h-6 text-blue-400" />, title: 'Quantum Sync', value: '2,879' },
                                                        { icon: <Users className="w-6 h-6 text-green-400" />, title: 'Total Flux', value: '2,583' },
                                                        { icon: <Clock className="w-6 h-6 text-yellow-400" />, title: 'Time Dilation', value: '11:33:22' },
                                                        { icon: <StopCircle className="w-6 h-6 text-red-400" />, title: 'HALT FLUX', value: '' },
                                                    ].map((item, index) => (
                                                        <Card key={index} className="glassmorphism bg-gray-600 bg-opacity-30">
                                                            <CardContent className="p-3 flex flex-col items-center justify-center">
                                                                {item.icon}
                                                                <div className="text-xs text-center mt-2 text-gray-300">{item.title}</div>
                                                                <div className="font-bold text-white">{item.value}</div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Voting Stats Card */}
                                        <Card className="glassmorphism bg-blue-400 bg-opacity-10 border-blue-400">
                                            <CardContent className="p-6">
                                                <CardTitle className="text-xl font-bold mb-4 text-white">Quantum Distribution</CardTitle>
                                                <ChartContainer config={chartConfig} className="mx-auto max-h-[250px]">
                                                    <PieChart>
                                                        <ChartTooltip content={<ChartTooltipContent nameKey="value" />} />
                                                        <Pie data={votingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                                                            <LabelList dataKey="name" position="outside" fill="#ffffff" />
                                                            {votingData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                                            ))}
                                                        </Pie>
                                                    </PieChart>
                                                </ChartContainer>
                                                <CardFooter className="flex-col gap-2 text-sm mt-4">
                                                    <div className="flex items-center gap-2 font-medium text-white">
                                                        Quantum flux surge: 5.2% <TrendingUp className="h-5 w-5 text-green-400" />
                                                    </div>
                                                </CardFooter>
                                            </CardContent>
                                        </Card>

                                        {/* Upcoming Elections Card */}
                                        <Card className="glassmorphism bg-yellow-400 bg-opacity-10 border-yellow-400">
                                            <CardContent className="p-6">
                                                <CardTitle className="text-xl font-bold mb-4 flex items-center justify-between text-white">
                                                    Quantum Horizons
                                                    <ChevronRight className="w-5 h-5 text-yellow-400" />
                                                </CardTitle>
                                                <div className="space-y-3">
                                                    {['UP State Nexus', 'Down District Flux'].map((election, index) => (
                                                        <Card key={index} className="glassmorphism bg-gray-600 bg-opacity-30">
                                                            <CardContent className="p-3 flex justify-between items-center">
                                                                <span className="text-white">{election}</span>
                                                                <span className="text-sm text-yellow-300">{index === 0 ? 'FLUX 21:50 HRS' : '24 - 12 - 2022'}</span>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Leading Candidate Card */}
                                        <Card className="glassmorphism bg-green-400 bg-opacity-10 border-green-400">
                                            <CardContent className="p-6">
                                                <CardTitle className="text-xl font-bold mb-4 flex items-center text-white">
                                                    <Users className="w-6 h-6 mr-2 text-green-400" />
                                                    Quantum Frontrunner
                                                </CardTitle>
                                                <div className="text-3xl font-bold text-center text-white mt-4">
                                                    Folayowon Oladapo
                                                </div>
                                                <div className="text-lg text-center text-gray-300 mt-2">
                                                    Leading with 46.7% quantum alignment
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </LoggedInLayout>
    );
}