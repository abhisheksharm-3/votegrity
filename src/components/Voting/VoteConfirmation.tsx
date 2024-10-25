import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export default function VoteConfirmation() {
  return (
    <Card className="bg-primary/5 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="relative h-[600px] overflow-hidden"
        >
          <img 
            src="/images/thanks.svg" 
            alt="Vote Received" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-6"
            >
              <Badge variant="secondary" className="px-4 py-2 text-lg font-semibold">
                Leading Candidate: Folayowon Oladapo
              </Badge>
              <div className="space-y-2">
                <p className="text-xl font-medium text-primary-foreground/80">WE RECEIVED YOUR VOTE</p>
                <h2 className="text-7xl font-bold font-playfair mb-8">Thank you!</h2>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="text-green-400 w-24 h-24 mx-auto" />
              </motion.div>
              <p className="text-xl text-primary-foreground/90 max-w-md mx-auto">
                Your voice matters in shaping our future. We appreciate your participation in this important process.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}