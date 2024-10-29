import { MockUserData } from "./types";

export const mockUserData: MockUserData = {
  district: "Mumbai Suburban",
  status: "Not voted",
  address: "Flat 302, Sai Krupa Society, Andheri East, Mumbai 400069",
  year: "2024",
  gender: "Male",
  religion: "Hindu",
  bloodGroup: "B+",
};

export const otherInfo = "As per the Election Commission of India, voting is a fundamental right and duty of every eligible citizen. Your participation strengthens our democracy. Please ensure your voter ID is up to date and exercise your franchise in all upcoming elections. Remember, every vote counts in shaping the future of our great nation.";

import { Election } from '@/lib/types'

const mockElections: Record<string, Election> = {
  '1': {
    id: 1,
    title: 'Board Member Election 2024',
    description: 'Annual election for the board of directors',
    status: 'Upcoming',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-15'),
    voters: 150
  },
  '2': {
    id: 2,
    title: 'Community Project Selection',
    description: 'Vote for the next community improvement project',
    status: 'Active',
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-12-31'),
    voters: 300
  },
  '3': {
    id: 3,
    title: 'Previous Budget Approval',
    description: 'Annual budget approval voting',
    status: 'Completed',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-15'),
    voters: 275
  }
};

const fetchElection = async (id: string): Promise<Election | null> => {
  // Simulate API call delay (between 500ms and 1500ms)
  const delay = Math.random() * 1000 + 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate potential errors (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Failed to fetch election data');
  }

  // Return mock data if it exists
  const election = mockElections[id];
  if (!election) {
    return null;
  }

  return election;
};

export default fetchElection;