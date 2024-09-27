import React, { useMemo } from 'react';
import { Control, UseFieldArrayAppend, UseFieldArrayRemove, FieldArrayWithId, useWatch } from 'react-hook-form';
import { PlusCircle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FormValues } from '@/lib/schemas/formSchema';

interface CandidateFieldsProps {
    fields: FieldArrayWithId<FormValues, "candidates", "id">[];
    append: UseFieldArrayAppend<FormValues, "candidates">;
    remove: UseFieldArrayRemove;
    control: Control<FormValues>;
}

const CandidateFields: React.FC<CandidateFieldsProps> = ({ fields, append, remove, control }) => {
    const candidateNames = useWatch({
        control,
        name: "candidates",
        defaultValue: fields.map(() => ({ name: '', age: 0, gender: '', qualifications: '', pitch: '' })),
      });
    
      const memoizedCandidateNames = useMemo(() => 
        candidateNames.map((candidate, index) => 
          candidate.name || `Unnamed Candidate ${index + 1}`
        ),
        [candidateNames]
      );
    return (
        <div>
            <FormLabel>Candidates</FormLabel>
            <FormMessage>Add the candidates for this election.</FormMessage>
            <Accordion type="single" collapsible className="w-full space-y-4">
                {fields.map((field, index) => (
                    <AccordionItem value={`item-${index}`} key={field.id}>
                        <AccordionTrigger className="text-left">
                        Candidate {index + 1}: {memoizedCandidateNames[index]}
                        </AccordionTrigger>
                        <AccordionContent>
                            <Card className="p-4 mt-2">
                                <div className="space-y-4">
                                    <FormField
                                        control={control}
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
                                        control={control}
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
                                        control={control}
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
                                        control={control}
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
                                        control={control}
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
    );
};

export default CandidateFields;