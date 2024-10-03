"use client"
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Check, AlertTriangle } from "lucide-react"
import LoggedInLayout from "@/components/LoggedInLayout"

const MotionCard = motion(Card)

export default function UserSettings() {
    const [username, setUsername] = useState("johndoe")
    const [email, setEmail] = useState("johndoe@example.com")
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const [votingPreference, setVotingPreference] = useState("blockchain")
    const [currentTab, setCurrentTab] = useState("account")
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

    const handleSave = (tab: string) => {
        setSaveStatus("saving")
        setTimeout(() => {
            setSaveStatus("success")
            setTimeout(() => setSaveStatus("idle"), 3000)
        }, 1500)
    }

    return (
        <LoggedInLayout>
            <div className="p-6">
                <div className="mx-auto max-w-4xl">
                    <motion.h1 
                        className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        User Settings
                    </motion.h1>
                    <Tabs defaultValue="account" className="w-full" onValueChange={(value) => setCurrentTab(value)}>
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="voting">Voting Preferences</TabsTrigger>
                        </TabsList>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <TabsContent value="account">
                                    <MotionCard>
                                        <CardHeader>
                                            <CardTitle>Account Information</CardTitle>
                                            <CardDescription>Manage your account details and preferences</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="h-24 w-24">
                                                    <AvatarImage src="/placeholder.svg" alt={username} />
                                                    <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <Button>Change Avatar</Button>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="username">Username</Label>
                                                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="notifications"
                                                    checked={notificationsEnabled}
                                                    onCheckedChange={setNotificationsEnabled}
                                                />
                                                <Label htmlFor="notifications">Enable email notifications</Label>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button onClick={() => handleSave("account")}>
                                                {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                                            </Button>
                                            {saveStatus === "success" && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="ml-4 text-green-600 flex items-center"
                                                >
                                                    <Check className="mr-2" /> Saved successfully
                                                </motion.span>
                                            )}
                                        </CardFooter>
                                    </MotionCard>
                                </TabsContent>
                                <TabsContent value="security">
                                    <MotionCard>
                                        <CardHeader>
                                            <CardTitle>Security Settings</CardTitle>
                                            <CardDescription>Manage your account security and authentication methods</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-password">Current Password</Label>
                                                <Input id="current-password" type="password" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password">New Password</Label>
                                                <Input id="new-password" type="password" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                                <Input id="confirm-password" type="password" />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="two-factor"
                                                    checked={twoFactorEnabled}
                                                    onCheckedChange={setTwoFactorEnabled}
                                                />
                                                <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                                            </div>
                                            {twoFactorEnabled && (
                                                <Alert>
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertTitle>Two-Factor Authentication Enabled</AlertTitle>
                                                    <AlertDescription>
                                                        Please ensure you have set up your preferred 2FA method before logging out.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </CardContent>
                                        <CardFooter>
                                            <Button onClick={() => handleSave("security")}>Update Security Settings</Button>
                                        </CardFooter>
                                    </MotionCard>
                                </TabsContent>
                                <TabsContent value="voting">
                                    <MotionCard>
                                        <CardHeader>
                                            <CardTitle>Voting Preferences</CardTitle>
                                            <CardDescription>Customize your voting experience on Votegrity</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="voting-method">Preferred Voting Method</Label>
                                                <Select value={votingPreference} onValueChange={setVotingPreference}>
                                                    <SelectTrigger id="voting-method">
                                                        <SelectValue placeholder="Select voting method" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="blockchain">Blockchain-based</SelectItem>
                                                        <SelectItem value="encrypted">End-to-end Encrypted</SelectItem>
                                                        <SelectItem value="traditional">Traditional (for non-critical votes)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="delegate-address">Delegate Address (Optional)</Label>
                                                <Input id="delegate-address" placeholder="0x..." />
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Enter an Ethereum address to delegate your voting power</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Switch id="public-votes" />
                                                <Label htmlFor="public-votes">Make my votes public (when applicable)</Label>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button onClick={() => handleSave("voting")}>Save Voting Preferences</Button>
                                        </CardFooter>
                                    </MotionCard>
                                </TabsContent>
                            </motion.div>
                        </AnimatePresence>
                    </Tabs>
                </div>
            </div>
        </LoggedInLayout>
    )
}