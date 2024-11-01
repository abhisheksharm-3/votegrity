"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import LoggedInLayout from '@/components/LoggedInLayout';
import { formSchema, FormValues } from '@/lib/schemas/formSchema';
import ElectionDetailsFields from '@/components/Voting/ElectionDetailsFields';
import CandidateFields from '@/components/Voting/CandidateFields';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { ID } from 'node-appwrite';
import { useUserData } from "@/hooks/useUserData";
import useVotingStore from '@/lib/store/useVotingStore';
import { createElectionInDB } from '@/lib/server/appwrite';

interface ElectionState {
    isSubmitting: boolean;
    error: string | null;
    isSuccess: boolean;
}

const SUBMISSION_TIMEOUT = 30000;

export default function CreateElection() {
    const [state, setState] = useState<ElectionState>({
        isSubmitting: false,
        error: null,
        isSuccess: false
    });

    const router = useRouter();
    const { user } = useUserData();
    const { createElection } = useVotingStore();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            candidates: [{ name: '', age: 18, gender: '', qualifications: '', pitch: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "candidates",
    });

    const submitElection = useCallback(async (
        electionData: FormValues & { electionId: string, candidates: Array<any> }
    ) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), SUBMISSION_TIMEOUT);

        try {
            const success = await createElectionInDB(electionData, electionData.electionId);
            clearTimeout(timeout);
            
            if (!success) {
                setState(prev => ({ ...prev, isSubmitting: false }));
                return null;
            }
            
            return success;
        } catch (error) {
            clearTimeout(timeout);
            toast.error("Network Error", {
                description: "Failed to connect to the server. Please check your connection."
            });
            return null;
        }
    }, []);

    const handleTryAgain = useCallback((): void => {
        setState(prev => ({ ...prev, error: null, isSuccess: false }));
    }, []);

    async function onSubmit(values: FormValues) {
        setState(prev => ({ ...prev, isSubmitting: true, error: null }));

        try {
            if (!user?.$id) {
                toast.error("Authentication Error", {
                    description: "User session expired. Please login again."
                });
                router.push("/login");
                return;
            }

            const electionId = ID.unique();
            const candidatesWithIds = values.candidates.map(candidate => ({
                ...candidate,
                candidateId: ID.unique()
            }));

            const electionData = {
                ...values,
                electionId,
                candidates: candidatesWithIds,
                createdBy: user.$id,
                createdAt: new Date().toISOString()
            };

            const candidateIds = candidatesWithIds.map(candidate => candidate.candidateId);
            const startTime = Math.floor(new Date(values.startDate).getTime() / 1000);
            const endTime = Math.floor(new Date(values.endDate).getTime() / 1000);

            // Create election on blockchain
            try {
                await createElection(
                    electionId,
                    values.title,
                    startTime,
                    endTime,
                    candidateIds
                );
            } catch (error) {
                console.error("Blockchain election creation error:", error);
                toast.error("Blockchain Error", {
                    description: "Failed to create election on blockchain. Please try again."
                });
                setState(prev => ({ ...prev, isSubmitting: false }));
                return;
            }

            // Submit to database
            const response = await submitElection(electionData);
            if (!response) {
                setState(prev => ({ ...prev, isSubmitting: false }));
                return;
            }

            // Update state and show success message
            setState(prev => ({ ...prev, isSuccess: true, isSubmitting: false }));
            
            // Show success toast
            toast.success("Election Created", {
                description: "Your election has been created successfully."
            });

            // Redirect after a short delay
            setTimeout(() => {
                router.push("/user/manage-elections");
            }, 2000);

        } catch (error) {
            console.error("Election creation error:", {
                error,
                timestamp: new Date().toISOString()
            });

            toast.error("Unexpected Error", {
                description: "An unexpected error occurred. Please try again."
            });
            
            setState(prev => ({
                ...prev,
                isSubmitting: false,
                error: "Failed to create election. Please try again."
            }));
        }
    }

    return (
        <LoggedInLayout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-black/70 font-medium text-4xl lg:text-5xl font-playfair mb-8">
                            Create New Election
                        </CardTitle>
                        <CardDescription>Set up your election details and add candidates</CardDescription>
                    </CardHeader>
                    
                    {state.error && (
                        <Alert variant="destructive" className="mx-6 mb-6">
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
                        <Alert className="mx-6 mb-6 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-600">Success!</AlertTitle>
                            <AlertDescription className="text-green-700">
                                Your election has been created successfully.
                                Redirecting to election management...
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <ScrollArea className="h-[60vh] pr-4">
                                            <ElectionDetailsFields control={form.control} />
                                            <Separator className="my-8" />
                                            <CandidateFields 
                                                fields={fields} 
                                                append={append} 
                                                remove={remove} 
                                                control={form.control} 
                                            />
                                        </ScrollArea>
                                    </form>
                                </Form>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    size="lg" 
                                    onClick={form.handleSubmit(onSubmit)}
                                    disabled={state.isSubmitting}
                                >
                                    {state.isSubmitting ? "Creating Election..." : "Create Election"}
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>
        </LoggedInLayout>
    );
}