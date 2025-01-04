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

interface DetailRowProps {
  label: string;
  value: string;
  delay?: number;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, delay = 0 }) => (
  <motion.tr 
    className="border-b border-white/10"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <TableCell className="font-medium capitalize text-gray-300">{label}</TableCell>
    <TableCell className="text-white">{value}</TableCell>
  </motion.tr>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: i * 0.1 }}
      >
        <Skeleton className="w-full h-12" />
      </motion.div>
    ))}
  </div>
);

const formatValue = (value: string, type: 'general' | 'id' = 'general') => {
  if (type === 'id') {
    return value.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }
  return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const VoterDetails: React.FC = () => {
  const { registeredVoterData, isRegisteredVoter, isLoading } = useUserData();

  const NotRegistered = () => (
    <motion.div 
      className="text-center py-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.p 
        className="text-white mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        You are not registered as a voter yet.
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          variant="default" 
          asChild
          className="hover:scale-105 transition-transform"
        >
          <Link href="/user/register-voter">Register as Voter</Link>
        </Button>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div 
      className="md:col-span-2" 
      variants={fadeInUp} 
      initial="initial" 
      animate="animate"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/10 backdrop-blur-md shadow-xl rounded-lg overflow-hidden border border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Voter Details
            </motion.span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton />
          ) : isRegisteredVoter && registeredVoterData ? (
            <Table>
              <TableBody>
                <DetailRow 
                  label="Location" 
                  value={`${registeredVoterData.city}, ${registeredVoterData.state}`}
                  delay={0.1}
                />
                <DetailRow 
                  label="Phone" 
                  value={registeredVoterData.phone}
                  delay={0.2}
                />
                <DetailRow 
                  label="Gender" 
                  value={formatValue(registeredVoterData.gender)}
                  delay={0.3}
                />
                <DetailRow 
                  label="ID" 
                  value={`${registeredVoterData.idNumber} (${formatValue(registeredVoterData.idType, 'id')})`}
                  delay={0.4}
                />
                <DetailRow 
                  label="Citizenship" 
                  value={formatValue(registeredVoterData.citizenship)}
                  delay={0.5}
                />
              </TableBody>
            </Table>
          ) : (
            <NotRegistered />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};