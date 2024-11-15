import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, AlertCircle } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

export const UpcomingElections = () => {
  const { elections, isRegisteredVoter } = useUserData();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="max-w-2xl"
    >
      <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
        <CardHeader className="space-y-2">
          <motion.div variants={item}>
            <CardTitle className="text-2xl font-bold text-white">
              Upcoming Elections
            </CardTitle>
            {!isRegisteredVoter && (
              <div className="flex items-center gap-2 mt-2 text-green-400">
                <AlertCircle size={16} />
                <span className="text-sm">Action required: Register to vote</span>
              </div>
            )}
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {elections.length > 0 ? (
            <motion.div variants={container} className="space-y-3">
              {elections.map((election) => (
                <motion.div key={election.detail.$id} variants={item}>
                  <Button
                    variant="ghost"
                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white border border-white/10 rounded-lg p-4 space-y-2 transition-all duration-300 h-auto"
                  >
                    <div className="flex flex-col w-full text-left space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-lg font-semibold">
                          {election.detail.title}
                        </span>
                        <span className="text-xs px-2 py-1 bg-white/20 rounded-full">
                          Upcoming
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>Date: {election.detail.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>Location: {election.detail.location}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <Users size={14} />
                          <span>Type: {election.detail.type}</span>
                        </div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              variants={item}
              className="text-center py-8 text-white/80"
            >
              {isRegisteredVoter ? (
                <div className="space-y-2">
                  <Calendar size={40} className="mx-auto text-white/60" />
                  <p>No upcoming elections at this time</p>
                  <p className="text-sm text-white/60">Check back later for updates</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AlertCircle size={40} className="mx-auto text-green-400" />
                  <p>You are not registered to vote in any elections</p>
                </div>
              )}
            </motion.div>
          )}
          
          {!isRegisteredVoter && (
            <motion.div variants={item}>
              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-6 rounded-lg shadow-lg transition-all duration-300"
                onClick={() => {
                  // Redirect to voter registration page
                }}
              >
                <div className="flex flex-col items-center">
                  <span>Register to Vote</span>
                  <span className="text-xs text-white/90 mt-1">
                    Takes only a few minutes
                  </span>
                </div>
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};