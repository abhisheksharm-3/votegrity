import React from 'react';
import { Control } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormValues } from '@/lib/schemas/formSchema';
import { Calendar } from '@nextui-org/react';
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";

interface ElectionDetailsFieldsProps {
    control: Control<FormValues>;
}

const ElectionDetailsFields: React.FC<ElectionDetailsFieldsProps> = ({ control }) => {
    return (
        <>
            <FormField
                control={control}
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
                control={control}
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
                control={control}
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
                    control={control}
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
                                        aria-label="Start Date"
                                        defaultValue={today(getLocalTimeZone())}
                                        minValue={today(getLocalTimeZone())}
                                        value={field.value ? new CalendarDate(field.value.getFullYear(), field.value.getMonth() + 1, field.value.getDate()) : undefined}
                                        onChange={(date) => {
                                            if (date) {
                                                field.onChange(new Date(date.year, date.month - 1, date.day));
                                            }
                                        }}
                                        showMonthAndYearPickers
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>The start date of your election.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
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
                                        aria-label="End Date"
                                        defaultValue={today(getLocalTimeZone())}
                                        minValue={today(getLocalTimeZone())}
                                        value={field.value ? new CalendarDate(field.value.getFullYear(), field.value.getMonth() + 1, field.value.getDate()) : undefined}
                                        onChange={(date) => {
                                            if (date) {
                                                field.onChange(new Date(date.year, date.month - 1, date.day));
                                            }
                                        }}
                                        showMonthAndYearPickers
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>The end date of your election.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
};

export default ElectionDetailsFields;