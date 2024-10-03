"use client"
import React from 'react';
import LoggedInLayout from '@/components/LoggedInLayout';
import { FormValues } from '@/lib/schemas/voterRegisterationSchema';
import VoterRegistrationForm from '@/components/Voting/VoterRegisterationForm';

const RegisterVoter: React.FC = () => {
  const handleSubmit = (values: FormValues, idDocument: File | null) => {
    console.log(values);
    console.log("ID Document:", idDocument);
    // Here you would typically send the data to your backend
    alert("Voter registration submitted successfully!");
  };

  return (
    <LoggedInLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8">
          Voter Registration
        </h1>
        <VoterRegistrationForm onSubmit={handleSubmit} />
      </div>
    </LoggedInLayout>
  );
};

export default RegisterVoter;