import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeInUp } from "@/lib/constants";

interface ImportantInformationProps {
  info: string;
}

export const ImportantInformation: React.FC<ImportantInformationProps> = ({ info }) => {
  return (
    <motion.div className="md:col-span-2" variants={fadeInUp} initial="initial" animate="animate">
      <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Important Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300 leading-relaxed">{info}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};