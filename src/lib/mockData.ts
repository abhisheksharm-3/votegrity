import { MockUserData, PendingVoter } from "./types";

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


// Mock pending voters data
const mockPendingVoters: Record<number, PendingVoter[]> = {
  1: [
    {
      id: 101,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      registrationDate: "2024-10-25"
    },
    {
      id: 102,
      name: "Michael Chen",
      email: "m.chen@example.com",
      registrationDate: "2024-10-26"
    },
    {
      id: 103,
      name: "Emma Wilson",
      email: "emma.w@example.com",
      registrationDate: "2024-10-27"
    }
  ],
  2: [
    {
      id: 201,
      name: "David Brown",
      email: "d.brown@example.com",
      registrationDate: "2024-10-24"
    },
    {
      id: 202,
      name: "Lisa Garcia",
      email: "l.garcia@example.com",
      registrationDate: "2024-10-25"
    }
  ]
};

// Function to fetch pending voters for an election
export const fetchPendingVoters = async (electionId: number): Promise<PendingVoter[]> => {
  // Simulate network delay (300-800ms)
  const delay = Math.random() * 500 + 300;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate potential errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch pending voters');
  }

  // Return mock data for the specified election
  return mockPendingVoters[electionId] || [];
};

// Function to approve or reject a voter
export const approveRejectVoter = async (
  electionId: number,
  voterId: number,
  approved: boolean
): Promise<void> => {
  // Simulate network delay (200-500ms)
  const delay = Math.random() * 300 + 200;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate potential errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error(`Failed to ${approved ? 'approve' : 'reject'} voter`);
  }

  // In a real implementation, this would make an API call
  console.log(`Voter ${voterId} ${approved ? 'approved' : 'rejected'} for election ${electionId}`);

  // Remove the voter from the mock pending voters list
  if (mockPendingVoters[electionId]) {
    mockPendingVoters[electionId] = mockPendingVoters[electionId].filter(
      voter => voter.id !== voterId
    );
  }
};