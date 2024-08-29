"use client"
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, PlusCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LoggedInLayout from '@/components/LoggedInLayout';

const candidateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    age: z.number().min(18, "Candidate must be at least 18 years old."),
    gender: z.string().min(1, "Please select a gender."),
    qualifications: z.string().min(10, "Please provide qualifications."),
    pitch: z.string().min(20, "Pitch must be at least 20 characters."),
});

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    category: z.string({ required_error: "Please select a category." }),
    startDate: z.date({ required_error: "Start date is required." }),
    endDate: z.date({ required_error: "End date is required." }),
    candidates: z.array(candidateSchema).min(2, "At least two candidates are required."),
});

type FormValues = z.infer<typeof formSchema>;

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
        alert("Election created successfully!");
    }

    return (
        <LoggedInLayout>    <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className=" h-full w-full bg-green-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-70 text-card-foreground">
                <CardHeader>
                    <CardTitle className="text-white/70 font-medium text-4xl lg:text-5xl font-playfair mb-8">Create New Election</CardTitle>
                    <CardDescription>Set up your election details and add candidates</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Election Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter election title" {...field} />
                                        </FormControl>
                                        <FormDescription>The main title of your election.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Provide a detailed description of the election"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Explain the purpose and context of this election.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="local">Local Government</SelectItem>
                                                <SelectItem value="national">National Government</SelectItem>
                                                <SelectItem value="corporate">Corporate</SelectItem>
                                                <SelectItem value="education">Education</SelectItem>
                                                <SelectItem value="nonprofit">Non-Profit</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Choose the category that best fits your election.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Start Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>The start date of your election.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>End Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>The end date of your election.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div>
                                <FormLabel>Candidates</FormLabel>
                                <FormDescription className="mb-4">Add the candidates for this election.</FormDescription>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {fields.map((field, index) => (
                                        <AccordionItem value={`item-${index}`} key={field.id}>
                                            <AccordionTrigger className="text-left">
                                                Candidate {index + 1}: {form.watch(`candidates.${index}.name`) || 'Unnamed'}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <Card className="p-4 mt-2">
                                                    <div className="space-y-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`candidates.${index}.name`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Name</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`candidates.${index}.age`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Age</FormLabel>
                                                                    <FormControl>
                                                                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`candidates.${index}.gender`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Gender</FormLabel>
                                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                        <FormControl>
                                                                            <SelectTrigger>
                                                                                <SelectValue placeholder="Select gender" />
                                                                            </SelectTrigger>
                                                                        </FormControl>
                                                                        <SelectContent>
                                                                            <SelectItem value="male">Male</SelectItem>
                                                                            <SelectItem value="female">Female</SelectItem>
                                                                            <SelectItem value="other">Other</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`candidates.${index}.qualifications`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Qualifications</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`candidates.${index}.pitch`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Pitch</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        {index > 0 && (
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                className="mt-2"
                                                                onClick={() => remove(index)}
                                                            >
                                                                <X className="mr-2 h-4 w-4" />
                                                                Remove Candidate
                                                            </Button>
                                                        )}
                                                    </div>
                                                </Card>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => append({ name: '', age: 18, gender: '', qualifications: '', pitch: '' })}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Candidate
                                </Button>
                            </div>

                            <Button type="submit" className="w-full">Create Election</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div></LoggedInLayout>
    );
}