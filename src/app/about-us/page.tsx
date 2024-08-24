"use client"
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Users, Zap, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import Layout from "@/components/Layout"

const lineChartData = [
  { year: '2021', users: 1000 },
  { year: '2022', users: 5000 },
  { year: '2023', users: 20000 },
  { year: '2024', users: 50000 },
]

const pieChartData = [
  { name: 'Governance', value: 400 },
  { name: 'Elections', value: 300 },
  { name: 'Proposals', value: 200 },
  { name: 'Surveys', value: 100 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const FeatureCard = ({ icon, title }: any) => (
  <Card className="flex flex-col items-center p-6 text-center transition-all duration-300 hover:shadow-lg hover:scale-105">
    <div className="mb-4 rounded-full bg-green-100 p-4 text-green-600">{icon}</div>
    <h3 className="text-xl font-semibold text-green-800">{title}</h3>
  </Card>
)

const MilestoneCard = ({ year, event } : any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div layout className="flex items-center space-x-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white font-bold">
        {year}
      </div>
      <ChevronRight className="h-6 w-6 text-green-600" />
      <Card className="flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{event}</CardTitle>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardHeader>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CardContent>
                <p className="text-green-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

const TeamMemberCard = ({ name, role, image } : any) => (
  <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{name.split(' ').map((n: any[]) => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2 mb-4">
        {["Ethereum", "Voting", "Blockchain"].map((skill, skillIndex) => (
          <Badge key={skillIndex} variant="secondary">
            {skill}
          </Badge>
        ))}
      </div>
      <Button variant="outline" className="w-full">View Profile</Button>
    </CardContent>
  </Card>
)

export default function AboutVotegrity() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        <header className="bg-green-800 py-16 text-white">
          <div className="container mx-auto px-4">
            <motion.h1 
              className="mb-4 text-5xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About Votegrity
            </motion.h1>
            <motion.p 
              className="text-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Empowering secure and transparent decentralized voting
            </motion.p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <section className="mb-20">
            <motion.h2 
              className="mb-8 text-4xl font-bold text-green-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our Mission
            </motion.h2>
            <motion.p 
              className="mb-8 text-xl text-green-700 leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Votegrity aims to revolutionize the voting process by leveraging blockchain technology to ensure
              transparency, security, and accessibility in democratic decision-making. We believe that every voice
              matters and should be heard in a secure and verifiable manner.
            </motion.p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <Shield className="h-10 w-10" />, title: "Secure" },
                { icon: <Lock className="h-10 w-10" />, title: "Private" },
                { icon: <Users className="h-10 w-10" />, title: "Inclusive" },
                { icon: <Zap className="h-10 w-10" />, title: "Efficient" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <h2 className="mb-8 text-4xl font-bold text-green-800">Our Growth</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">User Growth Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#059669" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-20">
            <h2 className="mb-8 text-4xl font-bold text-green-800">Voting Categories</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Distribution of Voting Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-20">
            <h2 className="mb-8 text-4xl font-bold text-green-800">Our Journey</h2>
            <div className="space-y-8">
              {[
                { year: "2021", event: "Votegrity concept developed" },
                { year: "2022", event: "Alpha version launched" },
                { year: "2023", event: "First major election conducted on Votegrity" },
                { year: "2024", event: "Global expansion and partnerships" },
              ].map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MilestoneCard {...milestone} />
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-8 text-4xl font-bold text-green-800">Our Team</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Alice Johnson", role: "Founder & CEO", image: "/placeholder.svg?height=100&width=100" },
                { name: "Bob Smith", role: "CTO", image: "/placeholder.svg?height=100&width=100" },
                { name: "Carol Williams", role: "Head of Security", image: "/placeholder.svg?height=100&width=100" },
                { name: "David Brown", role: "Lead Developer", image: "/placeholder.svg?height=100&width=100" },
                { name: "Eva Martinez", role: "UX Designer", image: "/placeholder.svg?height=100&width=100" },
                { name: "Frank Lee", role: "Blockchain Specialist", image: "/placeholder.svg?height=100&width=100" },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TeamMemberCard {...member} />
                </motion.div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  )
}