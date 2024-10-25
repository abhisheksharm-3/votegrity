import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/constants";


export const UpcomingElections: React.FC = () => {
  return (
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
  );
};