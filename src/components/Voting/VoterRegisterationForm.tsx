import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { FormValues, formSchema, IdType, CitizenshipStatus } from '@/lib/schemas/voterRegisterationSchema';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CalendarIcon,
  User,
  Mail,
  Phone,
  MapPin,
  FileCheck,
  CheckCircle2,
  Flag
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Calendar } from '@nextui-org/react';
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";

interface VoterRegistrationFormProps {
  onSubmit: (values: FormValues, idDocument: File | null) => void;
}

const VoterRegistrationForm: React.FC<VoterRegistrationFormProps> = ({ onSubmit }) => {
  const [idDocument, setIdDocument] = React.useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      address: "",
      city: "",
      state: "",
      zipCode: "",
      email: "",
      phone: "",
      idType: undefined,
      idNumber: "",
      citizenship: undefined,
      termsAccepted: false,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values, idDocument);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIdDocument(event.target.files[0]);
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Voter Registration Form
        </CardTitle>
        <CardDescription className="text-center">
          Complete this form to register as a voter. All fields marked with <span className="text-red-500">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input className="bg-background" placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input className="bg-background" placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth <span className="text-red-500">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-[240px] pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
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
                          defaultValue={today(getLocalTimeZone())}
                          minValue={new CalendarDate(1900, 1, 1)}
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
                    <FormDescription>
                      You must be at least 18 years old to register
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="driverLicense">Male</SelectItem>
                        <SelectItem value="stateID">Female</SelectItem>
                        <SelectItem value="passport">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Address Details</h3>
              </div>
              <Separator />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your full address"
                        className="resize-none bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input className="bg-background" placeholder="Enter your city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input className="bg-background" placeholder="Enter your state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input className="bg-background" placeholder="Enter your ZIP code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Contact Information</h3>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="email" className="bg-background" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="tel" className="bg-background" placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Identification</h3>
              </div>
              <Separator />

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="idType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Type <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select an ID type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="driverLicense">Driver&apos;s License</SelectItem>
                          <SelectItem value="stateID">State ID</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Number <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input className="bg-background" placeholder="Enter your ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="idDocument">Upload ID Document <span className="text-red-500">*</span></Label>
                  <Input
                    id="idDocument"
                    type="file"
                    onChange={handleFileChange}
                    className="bg-background"
                  />
                  {idDocument && (
                    <Badge variant="secondary" className="mt-2">
                      File selected: {idDocument.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Citizenship Status</h3>
              </div>
              <Separator />

              <FormField
                control={form.control}
                name="citizenship"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Citizenship Status <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="citizen" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Indian Citizen
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="permanentResident" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Permanent Resident
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Terms and Conditions <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormDescription>
                      By checking this box, you agree to our Terms of Service and Privacy Policy.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button variant="outline" type="button">
          Save Draft
        </Button>
        <Button
          type="submit"
          onClick={form.handleSubmit(handleSubmit)}
          className="bg-primary"
        >
          Submit Registration
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VoterRegistrationForm;