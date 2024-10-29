"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import LoggedInLayout from "@/components/LoggedInLayout";
import { FormValues } from "@/lib/schemas/voterRegisterationSchema";
import VoterRegistrationForm from "@/components/Voting/VoterRegisterationForm";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/useUserData";
import useVotingStore from "@/lib/store/useVotingStore";
import { FileValidationOptions, RegistrationState } from "@/lib/types";

const FILE_VALIDATION_CONFIG: FileValidationOptions = {
  maxSize: 10 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png", "application/pdf"]
};

const REGISTRATION_TIMEOUT = 100000;

const RegisterVoter: React.FC = () => {
  const [state, setState] = useState<RegistrationState>({
    isSubmitting: false,
    error: null,
    isSuccess: false
  });
  
  const router = useRouter();
  const { user } = useUserData();
  const { registerUser } = useVotingStore();

  const validateFile = useCallback((file: File | null): boolean => {
    if (!file) {
      toast.error("Validation Error", {
        description: "ID document is required"
      });
      return false;
    }

    if (file.size > FILE_VALIDATION_CONFIG.maxSize) {
      toast.error("Validation Error", {
        description: "ID document must be less than 10MB"
      });
      return false;
    }

    if (!FILE_VALIDATION_CONFIG.allowedTypes.includes(file.type)) {
      toast.error("Validation Error", {
        description: "ID document must be JPEG, PNG, or PDF"
      });
      return false;
    }

    return true;
  }, []);

  const createFormData = useCallback((
    values: FormValues,
    idDocument: File | null
  ): FormData => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value != null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === 'string' || typeof value === 'number') {
          formData.append(key, value.toString());
        }
      }
    });

    if (idDocument) {
      formData.append("idDocument", idDocument);
    }

    return formData;
  }, []);

  const submitRegistration = useCallback(async (
    formData: FormData
  ): Promise<Response | null> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REGISTRATION_TIMEOUT);

    try {
      const response = await fetch("/api/user/voter/register", {
        method: "POST",
        body: formData,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error("Registration Error", {
          description: data.error || "Failed to register voter"
        });
        return null;
      }

      return response;
    } catch (error) {
      toast.error("Network Error", {
        description: "Failed to connect to the server. Please check your connection."
      });
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }, []);

  const handleSubmit = async (values: FormValues, idDocument: File | null): Promise<void> => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      if (!user?.$id) {
        toast.error("Authentication Error", {
          description: "User session expired. Please login again."
        });
        router.push("/login");
        return;
      }

      if (!validateFile(idDocument)) {
        setState(prev => ({ ...prev, isSubmitting: false }));
        return;
      }

      try {
        await registerUser(user.$id);
      } catch (error) {
        console.error("Blockchain registration error:", error);
        toast.error("Blockchain Error", {
          description: "Failed to register on blockchain. Please try again."
        });
        setState(prev => ({ ...prev, isSubmitting: false }));
        return;
      }

      const formData = createFormData(values, idDocument);
      const response = await submitRegistration(formData);
      
      if (!response) {
        setState(prev => ({ ...prev, isSubmitting: false }));
        return;
      }

      setState(prev => ({ ...prev, isSuccess: true }));
      toast.success("Registration Successful", {
        description: "Your voter registration has been submitted successfully.",
        duration: 5000,
      });

      setTimeout(() => {
        router.push("/user/dashboard");
      }, 3000);

    } catch (error) {
      console.error("Registration error:", {
        error,
        timestamp: new Date().toISOString()
      });

      toast.error("Unexpected Error", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleTryAgain = useCallback((): void => {
    setState(prev => ({ ...prev, error: null, isSuccess: false }));
  }, []);

  return (
    <LoggedInLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8">
          Voter Registration
        </h1>

        {state.error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {state.error}
              <Button
                variant="outline"
                className="mt-2"
                onClick={handleTryAgain}
                type="button"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {state.isSuccess ? (
          <Alert className="mb-6 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">Success!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your voter registration has been submitted successfully.
              Redirecting to dashboard...
            </AlertDescription>
          </Alert>
        ) : (
          <VoterRegistrationForm
            onSubmit={handleSubmit}
            disabled={state.isSubmitting}
          />
        )}
      </div>
    </LoggedInLayout>
  );
};

export default RegisterVoter;