import * as z from 'zod';

const candidateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    age: z.number().min(18, "Candidate must be at least 18 years old."),
    gender: z.string().min(1, "Please select a gender."),
    qualifications: z.string().min(10, "Please provide qualifications."),
    pitch: z.string().min(20, "Pitch must be at least 20 characters."),
});

export const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    category: z.string({ required_error: "Please select a category." }),
    startDate: z.date({ required_error: "Start date is required." }),
    endDate: z.date({ required_error: "End date is required." }),
    candidates: z.array(candidateSchema).min(2, "At least two candidates are required."),
});

export type FormValues = z.infer<typeof formSchema>;