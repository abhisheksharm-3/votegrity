import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const votingData = [
  { name: 'Candidate 1', value: 65.7, color: '#4CAF50' },
  { name: 'Candidate 2', value: 34.3, color: '#2196F3' },
];

const totalVoters = 2879;
const totalVotes = 1213;

const VotingStatistics: React.FC = () => {
  return (
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
  );
};

export default VotingStatistics;