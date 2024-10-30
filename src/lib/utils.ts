import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
export const formatDate = (isoDate?: string): string => {
  if (!isoDate) {
    return 'Unknown'; // or any default value
  }
  const date = new Date(isoDate);
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};