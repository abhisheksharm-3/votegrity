import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeInUp } from "@/lib/constants";
import { useUserData } from "@/hooks/useUserData";
import { UserData } from "@/lib/types";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const VoterDetails: React.FC = () => {
  const { registeredVoterData, isRegisteredVoter, isLoading } = useUserData();

  const renderSkeleton = () => (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="w-full h-12" />
      ))}
    </div>
  );

  return (
    <motion.div className="md:col-span-2" variants={fadeInUp} initial="initial" animate="animate">
      <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Voter Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            renderSkeleton()
          ) : isRegisteredVoter && registeredVoterData ? (
            <Table>
              <TableBody>
                <TableRow className="border-b border-white/10">
                  <TableCell className="font-medium capitalize text-gray-300">Location</TableCell>
                  <TableCell className="text-white">{registeredVoterData.city}, {registeredVoterData.state}</TableCell>
                </TableRow>
                <TableRow className="border-b border-white/10">
                  <TableCell className="font-medium capitalize text-gray-300">Phone</TableCell>
                  <TableCell className="text-white">{registeredVoterData.phone}</TableCell>
                </TableRow>
                <TableRow className="border-b border-white/10">
                  <TableCell className="font-medium capitalize text-gray-300">Gender</TableCell>
                  <TableCell className="text-white">{registeredVoterData.gender
                      .split(' ')
                      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}</TableCell>
                </TableRow>
                <TableRow className="border-b border-white/10">
                  <TableCell className="font-medium capitalize text-gray-300">ID</TableCell>
                  <TableCell className="text-white">
                    {registeredVoterData.idNumber} (
                      {registeredVoterData.idType
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str: string) => str.toUpperCase())
                      }
                    )
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-white/10">
                  <TableCell className="font-medium capitalize text-gray-300">Citizenship</TableCell>
                  <TableCell className="text-white">
                    {registeredVoterData.citizenship
                      .split(' ')
                      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <div className="text-center">
              <p className="text-white mb-4">You are not registered as a voter yet.</p>
              <Button variant="default" asChild><Link href="/user/register-voter">Register as Voter</Link></Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};