"use client"
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoggedInLayout from '@/components/LoggedInLayout';
import { formSchema, FormValues } from '@/lib/schemas/formSchema';
import ElectionDetailsFields from '@/components/Voting/ElectionDetailsFields';
import CandidateFields from '@/components/Voting/CandidateFields';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

export default function CreateElection() {
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

    function onSubmit(values: FormValues) {
        console.log(values);
        toast("Election created successfully!");
    }

    return (
        <LoggedInLayout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card className="bg-card">
                <CardHeader>
                        <CardTitle className="text-black/70 font-medium text-4xl lg:text-5xl font-playfair mb-8">Create New Election</CardTitle>
                        <CardDescription>Set up your election details and add candidates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <ScrollArea className="h-[60vh] pr-4">
                                    <ElectionDetailsFields control={form.control} />
                                    <Separator className="my-8" />
                                    <CandidateFields fields={fields} append={append} remove={remove} control={form.control} />
                                </ScrollArea>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" size="lg" onClick={form.handleSubmit(onSubmit)}>
                            Create Election
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </LoggedInLayout>
    );
}