import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { fadeInUp } from "@/lib/constants";
import { mockUserData } from "@/lib/mockData";
import { MockUserData } from "@/lib/types";

interface VoterDetailsProps {
  userData: MockUserData;
}

export const VoterDetails: React.FC<VoterDetailsProps> = ({ userData }) => {
  return (
    <motion.div className="md:col-span-2" variants={fadeInUp} initial="initial" animate="animate">
      <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Voter Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {Object.entries(userData).map(([key, value]) => (
                <TableRow key={key} className="border-b border-white/10">
                  <TableCell className="font-medium capitalize text-gray-300">{key}</TableCell>
                  <TableCell className="text-white">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};