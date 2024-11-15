"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Shield, Lock, Zap, ChevronRight, Github, Twitter, LucideIcon, ArrowRight, Check } from "lucide-react"
import Layout from "@/components/Layout"
import Link from "next/link"
import FlickeringGrid from "@/components/ui/flickering-grid"

const lineChartData = [
  { year: '2021', users: 1000 },
  { year: '2022', users: 5000 },
  { year: '2023', users: 20000 },
  { year: '2024', users: 50000 },
]

interface TechBadgeProps {
  children: React.ReactNode
}

const TechBadge: React.FC<TechBadgeProps> = ({ children }) => (
  <Badge 
    variant="secondary" 
    className="bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 transition-colors duration-200 backdrop-blur-sm"
  >
    {children}
  </Badge>
)

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  benefits: string[]
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, benefits }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Card 
      className="group relative h-full border border-emerald-100 bg-white/80 backdrop-blur-sm hover:border-emerald-200 transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6 flex flex-col h-full">
        <div className="mb-auto">
          <Icon className="h-6 w-6 mb-4 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm leading-relaxed text-gray-600 mb-4">{description}</p>
        </div>
        <AnimatePresence>
          {isHovered && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center text-sm text-gray-600"
                >
                  <Check className="h-4 w-4 mr-2 text-emerald-500 flex-shrink-0" />
                  {benefit}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

const GrowthChart: React.FC = () => (
  <div className="h-[300px] mt-12">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={lineChartData}>
        <defs>
          <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
        <XAxis 
          dataKey="year" 
          stroke="#374151"
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#374151"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value.toLocaleString()}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            color: '#1f2937'
          }}
          formatter={(value: number) => [value.toLocaleString(), 'Users']}
        />
        <Line
          type="monotone"
          dataKey="users"
          stroke="#059669"
          strokeWidth={2}
          dot={{ r: 4, fill: '#059669' }}
          activeDot={{ r: 6, fill: '#059669' }}
          fill="url(#userGradient)"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

const MinimalVotegrity: React.FC = () => {
  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden">
        
        {/* Content wrapper */}
        <div className="relative">
          {/* Hero Section */}
          <section className="container mx-auto px-4 pt-24 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <Badge className="mb-6 bg-emerald-100/80 text-emerald-700 hover:bg-emerald-200 transition-colors duration-200 backdrop-blur-sm px-4 py-2">
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Blockchain Voting Platform
                  </span>
                </Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl font-light text-gray-900 mb-6 tracking-tight leading-tight"
              >
                The Future of{' '}
                <span className="text-emerald-600 font-normal">
                  Digital Democracy
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 mb-10 leading-relaxed"
              >
                Experience secure, transparent, and decentralized voting powered by
                cutting-edge blockchain technology
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-4"
              >
                <Button 
                  className="bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/register" className="flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all duration-200 px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/how-to-vote">How to Vote</Link>
                </Button>
              </motion.div>
            </motion.div>
          </section>

          {/* Features Section */}
          <section className="container mx-auto px-4 py-20">
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={Shield}
                  title="Military-Grade Security"
                  description="End-to-end encryption with immutable blockchain records"
                  benefits={[
                    'Multi-factor authentication',
                    'Quantum-resistant encryption',
                    'Automated security audits'
                  ]}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={Lock}
                  title="Zero-Knowledge Privacy"
                  description="Advanced cryptographic proofs protect voter identity"
                  benefits={[
                    'Anonymous voting',
                    'Verifiable results',
                    'GDPR compliant'
                  ]}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={Zap}
                  title="Lightning Fast"
                  description="Optimized smart contracts for minimal transaction times"
                  benefits={[
                    'Sub-second confirmation',
                    'Scalable architecture',
                    'Real-time results'
                  ]}
                />
              </motion.div>
            </div>
            <GrowthChart />
          </section>

          {/* About & Tech Stack Section */}
          <section className="container mx-auto px-4 py-20 border-t border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex items-center gap-6 mb-10">
                <Avatar className="h-20 w-20 ring-4 ring-emerald-100 ring-offset-2">
                  <AvatarImage src="https://github.com/abhisheksharm-3.png" alt="Abhishek Sharma" />
                  <AvatarFallback className="bg-emerald-50 text-emerald-600 text-xl">AS</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-medium text-gray-900 mb-2">Built by Abhishek Sharma</h2>
                  <div className="flex gap-3 mt-3">
                    <a 
                      href="https://github.com/abhisheksharm-3" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Github className="h-5 w-5 mr-2" />
                        GitHub
                      </Button>
                    </a>
                    <a 
                      href="https://twitter.com/abhisheks031" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Twitter className="h-5 w-5 mr-2" />
                        Twitter
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Next.js 14', 'React', 'TypeScript', 'Tailwind CSS', 'Solidity', 'Hardhat', 'Ethers.js', 'IPFS'].map((tech) => (
                      <TechBadge key={tech}>{tech}</TechBadge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">About the Project</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Votegrity represents the convergence of blockchain security and modern web interfaces. 
                    Built with a relentless focus on transparency and user privacy, it leverages zero-knowledge 
                    proofs and smart contracts to ensure tamper-proof, verifiable voting processes while 
                    maintaining an intuitive user experience.
                  </p>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default MinimalVotegrity