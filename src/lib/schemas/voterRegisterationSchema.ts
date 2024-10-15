import { z } from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required.",
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  address: z.string().min(10, { message: "Please enter a valid address." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Please enter a valid ZIP code." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit phone number." }),
  idType: z.enum(["driverLicense", "stateID", "passport"], {
    required_error: "Please select an ID type.",
  }),
  idNumber: z.string().min(5, { message: "Please enter a valid ID number." }),
  citizenship: z.enum(["citizen", "permanentResident"], {
    required_error: "Please select your citizenship status.",
  }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

export type FormValues = z.infer<typeof formSchema>;

export type IdType = 'driverLicense' | 'stateID' | 'passport';
export type CitizenshipStatus = 'citizen' | 'permanentResident';