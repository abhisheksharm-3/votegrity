import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/useUserData";
import { fadeInUp } from "@/lib/constants";

export const UpcomingElections: React.FC = () => {
  const { elections, isRegisteredVoter } = useUserData();

  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate">
      <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Upcoming Elections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {elections.length > 0 ? (
            elections.map((election) => (
              <Button
                key={election.detail.$id}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 transition-all duration-300"
              >
                {election.detail.title}
              </Button>
            ))
          ) : (
            <div className="text-white font-semibold py-3">
              {isRegisteredVoter
                ? "No upcoming elections found"
                : "You are not registered to vote in any elections"}
            </div>
          )}
          {!isRegisteredVoter && (
            <Button
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 transition-all duration-300"
              onClick={() => {
                // Redirect to voter registration page
              }}
            >
              Register to Vote
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};