"use client"

import React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Blocks, Lock, Shield, Zap, ExternalLink, ChevronRight } from "lucide-react"
import Layout from "@/components/Layout"
import FlickeringGrid from "@/components/ui/flickering-grid"

interface ChartDataPoint {
  year: string
  users: number
}

const lineChartData: ChartDataPoint[] = [
  { year: '2021', users: 1000 },
  { year: '2022', users: 5000 },
  { year: '2023', users: 20000 },
  { year: '2024', users: 50000 },
]

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="group relative overflow-hidden border-none bg-gradient-to-br from-white to-gray-50 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-8px] transform opacity-5 transition-transform group-hover:translate-x-4">
        <Icon className="h-full w-full" />
      </div>
      <CardContent className="p-6">
        <Icon className="mb-4 h-8 w-8 text-emerald-600 transition-transform group-hover:scale-110" />
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-600">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

interface TimelineItemProps {
  year: string
  title: string
  description: string
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative pl-8"
  >
    <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-emerald-500 to-emerald-100" />
    <motion.div 
      className="absolute left-[-4px] top-0 h-2 w-2 rounded-full bg-emerald-500"
      whileInView={{ scale: [0, 1.5, 1] }}
      viewport={{ once: true }}
    />
    <div className="mb-8">
      <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-600">
        {year}
      </span>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
)

interface MetricCardProps {
  label: string
  value: string
  icon: React.ElementType
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon: Icon }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <Card className="border-none bg-gradient-to-br from-emerald-500 to-emerald-600 text-white transition-shadow hover:shadow-2xl">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-emerald-100">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className="rounded-full bg-white/10 p-3">
          <Icon className="h-8 w-8 text-white" />
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

export default function AboutVotegrity(): JSX.Element {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <Layout>
      <div className="relative min-h-screen bg-[#090909]">
        {/* Hero Section with Simplified Design */}
        <motion.div 
          style={{ opacity, scale }}
          className="relative h-[80vh]"
        >
          <FlickeringGrid
        className="z-0 absolute inset-0"
        squareSize={4}
        gridGap={6}
        color="#059669"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
          <div className="container relative mx-auto flex h-full items-center px-4">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Badge className="mb-4 bg-emerald-100 px-4 py-2 text-emerald-800">
                  Blockchain-Powered Democracy
                </Badge>
                <h1 className="mb-6 text-emerald-700 z-50 bg-clip-text text-6xl font-bold  font-playfair">
                  Revolutionizing Democracy with Blockchain
                </h1>
                <p className="mb-8 text-xl leading-relaxed text-emerald-700">
                  Votegrity combines Ethereum&apos;s security with innovative design to create
                  a transparent and tamper-proof voting system for the future.
                </p>
                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="group bg-white text-emerald-900 hover:bg-emerald-50"
                  >
                    View Demo
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white hover:bg-white/10"
                  >
                    Documentation
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <main className="container mx-auto px-4 py-16">
          {/* Key Metrics */}
          <section className="mb-20">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Total Votes Cast" value="1M+" icon={Blocks} />
              <MetricCard label="Success Rate" value="99.9%" icon={Shield} />
              <MetricCard label="Gas Optimization" value="85%" icon={Zap} />
              <MetricCard label="Security Score" value="A+" icon={Lock} />
            </div>
          </section>

          {/* Features */}
          <section className="mb-20">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-emerald-100 px-4 py-2 text-emerald-800">
                Features
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900">
                Built for Security & Scale
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={Shield}
                title="Blockchain Security"
                description="Leveraging Ethereum's immutable ledger for transparent and tamper-proof voting records"
              />
              <FeatureCard 
                icon={Lock}
                title="Zero-Knowledge Proofs"
                description="Ensuring voter privacy while maintaining complete verification capabilities"
              />
              <FeatureCard 
                icon={Zap}
                title="Gas Optimization"
                description="Advanced smart contract architecture for minimal transaction costs"
              />
            </div>
          </section>

          {/* Growth Chart */}
          <section className="mb-20">
            <Card className="overflow-hidden border-none bg-white shadow-xl">
              <CardHeader className="border-b bg-gray-50/50 px-6 py-4">
                <CardTitle className="text-2xl font-bold">Platform Growth</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#059669"
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#059669' }}
                        activeDot={{ r: 8, fill: '#059669' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Timeline */}
          <section className="mb-20">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-emerald-100 px-4 py-2 text-emerald-800">
                Journey
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900">Our Progress</h2>
            </div>
            <div className="mx-auto max-w-2xl">
              <TimelineItem 
                year="2021"
                title="Project Inception"
                description="Started as a university research project exploring blockchain voting solutions"
              />
              <TimelineItem 
                year="2022"
                title="Alpha Launch"
                description="Successfully deployed first smart contracts on Ethereum testnet"
              />
              <TimelineItem 
                year="2023"
                title="First Major Implementation"
                description="Conducted university student body elections with 10,000+ voters"
              />
              <TimelineItem 
                year="2024"
                title="Scale & Optimize"
                description="Enhanced gas efficiency and implemented zero-knowledge proofs"
              />
            </div>
          </section>

          {/* Team */}
          <section>
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-emerald-100 px-4 py-2 text-emerald-800">
                Team
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="group overflow-hidden border-none bg-white shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <Avatar className="h-16 w-16 ring-2 ring-emerald-500/10">
                        <AvatarImage src="https://github.com/abhisheksharm-3.png" alt="Abhishek Sharma" />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          AS
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Abhishek Sharma</h3>
                        <p className="text-sm text-emerald-600">Solo Developer</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Solidity", "Next.js", "React"].map((skill) => (
                        <Badge 
                          key={skill}
                          variant="secondary" 
                          className="bg-emerald-50 text-emerald-700"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  )
}