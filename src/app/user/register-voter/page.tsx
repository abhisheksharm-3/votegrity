"use client"
import React, { useState } from 'react';
import LoggedInLayout from '@/components/LoggedInLayout';
import { FormValues } from '@/lib/schemas/voterRegisterationSchema';
import VoterRegistrationForm from '@/components/Voting/VoterRegisterationForm';

const RegisterVoter: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: FormValues, idDocument: File | null) => {
    try {
      setIsSubmitting(true);
      setError(null);
  
      // Create FormData to handle file upload
      const formData = new FormData();
      
      // Append form values
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value as string);
        }
      });
  
      // Append ID document if provided
      if (idDocument) {
        formData.append('idDocument', idDocument);
      }
  
      const response = await fetch('/api/user/voter/register', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register voter');
      }
  
      alert("Voter registration submitted successfully!");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      alert(err instanceof Error ? err.message : 'Failed to register voter');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoggedInLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8">
          Voter Registration
        </h1>
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}
        <VoterRegistrationForm 
          onSubmit={handleSubmit} 
          disabled={isSubmitting}
        />
      </div>
    </LoggedInLayout>
  );
};

export default RegisterVoter;