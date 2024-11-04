// src/lib/server/appwrite.js
"use server";
import { Client, Account, ID, Databases, Models, Storage, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { FormValues } from "../schemas/voterRegisterationSchema";
import { FormValues as ElectionFormValues } from "../schemas/formSchema";
import {generateJoinCode} from "@/lib/utils"

// Create a base client
const createBaseClient = () => {
  return new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT!);
};

// Create a session client
export async function createSessionClient() {
  const client = createBaseClient();
  const session = cookies().get("votegrity-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }
  client.setSession(session.value);
  return { account: new Account(client) };
}

// Create an admin client
export async function createAdminClient() {
  const client = createBaseClient().setKey(process.env.APPWRITE_KEY!);
  return { 
    client,
    account: new Account(client),
    databases: new Databases(client)
  };
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const walletAddress = formData.get("walletAddress") as string;

  const { account, databases } = await createAdminClient();

  try {
    const user = await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("votegrity-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      user.$id,
      { walletAddress }
    );

    return { success: true, user, session };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed", details: error };
  }
}

export async function signOut() {
  try {
    const { account } = await createSessionClient();
    cookies().delete("votegrity-session");
    await account.deleteSession("current");
    return { success: true, message: "Signed out successfully" };
  } catch (error) {
    return { error: "Sign out failed", details: error };
  }
}

export async function getWalletAddress(userId: string) {
  const { databases } = await createAdminClient();

  try {
    const document = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      userId
    );
    return { success: true, walletAddress: document.walletAddress };
  } catch (error) {
    console.error("Error fetching wallet address:", error);
    return { error: "Failed to fetch wallet address", details: error };
  }
}

export async function loginWithEmailAndWallet(email: string, password: string, walletAddress: string) {
  const { account, databases } = await createAdminClient();
  try {
    const session = await account.createEmailPasswordSession(email, password);
    cookies().set("votegrity-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const document = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_COLLECTION_ID!,
      session.userId
    );

    if (document.walletAddress !== walletAddress) {
      return { error: "Wallet address mismatch" };
    }

    return { success: true, session };
  } catch (error) {
    console.error('Login error:', error);
    return { error: "Login failed", details: error };
  }
}

export async function checkRegisteredVoter(userId: string): Promise<Models.Document | null> {
  const { databases } = await createAdminClient();

  try {
    const document = await databases.listDocuments<Models.Document>(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.REGISTERED_USER_DETAILS!,
      [
        Query.equal('userID', userId),
        Query.limit(1)
      ]
    );
    return document.documents.length > 0 ? document.documents[0] : null;
    
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 404) {
      return null;
    }
    console.error("Error checking registered user:", error);
    throw error;
  }
}

export async function submitVoterRegistration(
  formData: FormData
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }
    const { databases, client } = await createAdminClient();
    const idDocument = formData.get("idDocument") as File;
    const storage = new Storage(client);
    let idDocumentUrl = null;
    if (idDocument) {
      const uploadResponse = await storage.createFile(
        process.env.ID_DOCUMENT_BUCKET!,
        user.$id,
        idDocument
      );
      
      idDocumentUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.ID_DOCUMENT_BUCKET}/files/${uploadResponse.$id}/view?project=${process.env.APPWRITE_PROJECT}`;
    }
    const formValues: FormValues = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dateOfBirth: new Date(formData.get("dateOfBirth") as string),
      gender: formData.get("gender") as FormValues["gender"],
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zipCode") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      idType: formData.get("idType") as FormValues["idType"],
      idNumber: formData.get("idNumber") as string,
      citizenship: formData.get("citizenship") as FormValues["citizenship"],
      termsAccepted: formData.get("termsAccepted") === "true",
    };

    const registrationDocument = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.REGISTERED_USER_DETAILS!,
      ID.unique(),
      {
        userID: user.$id,
        ...formValues,
        dateOfBirth: formValues.dateOfBirth.toISOString(),
        idURL: idDocumentUrl,
      }
    );

    return {
      success: true,
      message: "Voter registration submitted successfully",
      data: registrationDocument,
    };

  } catch (error) {
    console.error("Voter registration error:", error);
    
    if (error instanceof Error) {
      return {
        success: false,
        message: `Registration failed: ${error.message}`,
      };
    }
    
    return {
      success: false,
      message: "An unexpected error occurred during registration",
    };
  }
}

export async function fetchOwnedElections(): Promise<Models.Document[]> {
  const { databases } = await createAdminClient();

  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const elections = await databases.listDocuments<Models.Document>(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.ELECTIONS_COLLECTION_ID!,
      [
        Query.orderDesc('startDate'),
        Query.equal('owner', user.$id)
      ]
    );

    return elections.documents;
  } catch (error) {
    console.error("Error fetching all elections:", error);
    throw error;
  }
}

export async function getUserElections(): Promise<Models.Document[]> {
  const { databases } = await createAdminClient();
  const user = await getLoggedInUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  try {
    // First, get all user's election registrations
    const userElections = await databases.listDocuments<Models.Document>(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.REGISTERED_USER_ELECTIONS!,
      [
        Query.equal('userID', user.$id),
      ]
    );

    // Fetch full election details for each registration
    const enrichedElections = await Promise.all(
      userElections.documents.map(async (userElection) => {
        try {
          const electionDetails = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID!,
            process.env.ELECTIONS_COLLECTION_ID!,
            userElection.electionId
          );

          // Merge the election details with the user's registration info
          return {
            ...userElection,
            detail: {
              title: electionDetails.title,
              description: electionDetails.description,
              category: electionDetails.category,
              joinByCode: electionDetails.joinByCode,
              candidates: electionDetails.candidates,
              startDate: electionDetails.startDate,
              endDate: electionDetails.endDate,
              owner: electionDetails.owner,
              $id: electionDetails.$id,
              $createdAt: electionDetails.$createdAt,
              $updatedAt: electionDetails.$updatedAt,
            }
          };
        } catch (error) {
          console.error(`Error fetching details for election ${userElection.electionId}:`, error);
          // Return the original userElection if we can't fetch the details
          return userElection;
        }
      })
    );

    return enrichedElections;
  } catch (error) {
    console.error("Error fetching user elections:", error);
    throw error;
  }
}

export async function createElectionInDB(values: ElectionFormValues, electionId: string) {
    try {
      const user = await getLoggedInUser();
      if (!user) {
        throw new Error("User not authenticated");}
      const { databases } = await createAdminClient();
                // Generate a unique join code
                let joinByCode = generateJoinCode();
                let isCodeUnique = false;
                let attempts = 0;
                const maxAttempts = 50;
        
                // Keep generating new codes until we find a unique one or hit max attempts
                while (!isCodeUnique && attempts < maxAttempts) {
                    try {
                        // Try to find an existing election with this code
                        const existing = await databases.listDocuments(
                            process.env.APPWRITE_DATABASE_ID!,
                            process.env.ELECTIONS_COLLECTION_ID!,
                            [
                                // Query to check if code exists
                                Query.equal('joinByCode', joinByCode)
                            ]
                        );
        
                        if (existing.documents.length === 0) {
                            isCodeUnique = true;
                        } else {
                            joinByCode = generateJoinCode();
                            attempts++;
                        }
                    } catch (error) {
                        console.error('Error checking join code uniqueness:', error);
                        // If there's an error checking uniqueness, generate a new code and continue
                        joinByCode = generateJoinCode();
                        attempts++;
                    }
                }
        
                if (!isCodeUnique) {
                    throw new Error('Unable to generate unique join code after maximum attempts');
                }
        const election = await databases.createDocument(
          process.env.APPWRITE_DATABASE_ID!,
            process.env.ELECTIONS_COLLECTION_ID!,
            electionId,
            {
                title: values.title,
                description: values.description,
                category: values.category,
                joinByCode: joinByCode,
                candidates: values.candidates.map(candidate => candidate.candidateId),
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                owner: user.$id
            }
        );
        const candidatePromises = values.candidates.map(candidate =>
            databases.createDocument(
              process.env.APPWRITE_DATABASE_ID!,
              process.env.CANDIDATES_COLLECTION_ID!,
                ID.unique(),
                {
                    candidateId: candidate.candidateId,
                    electionId: electionId,
                    name: candidate.name,
                    age: candidate.age,
                    gender: candidate.gender,
                    qualifications: candidate.qualifications,
                    pitch: candidate.pitch,
                }
            )
        );
        await Promise.all(candidatePromises);

        return {
            success: true,
            electionId: electionId,
            message: 'Election created successfully'
        };

    } catch (error) {
        console.error('Error creating election:', error);
        throw new Error('Failed to create election');
    }
}

export async function joinElectionByCode(joinCode: string) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { databases } = await createAdminClient();

    const elections = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.ELECTIONS_COLLECTION_ID!,
      [Query.equal('joinByCode', joinCode)]
    );

    if (elections.documents.length === 0) {
      return {
        success: false,
        message: "Invalid join code"
      };
    }

    const election = elections.documents[0];

    // Check if user is already enrolled
    const existingEnrollments = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.REGISTERED_USER_ELECTIONS!,
      [
        Query.equal('userID', user.$id),
        Query.equal('electionId', election.$id)
      ]
    );

    if (existingEnrollments.documents.length > 0) {
      return {
        success: false,
        message: "You are already enrolled in this election"
      };
    }
    const currentDate = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (currentDate > endDate) {
      return {
        success: false,
        message: "This election has already ended"
      };
    } else if(currentDate > startDate) {
      return {
        success: false,
        message: "This election has already started"
      };
    }

    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.REGISTERED_USER_ELECTIONS!,
      ID.unique(),
      {
        userID: user.$id,
        electionId: election.$id,
        status: "pending"
      }
    );

    return {
      success: true,
      message: "Successfully joined the election",
      election: election
    };

  } catch (error) {
    console.error("Error joining election:", error);
    return {
      success: false,
      message: "Failed to join election",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function castVote(electionId: string, candidateId: string) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { databases } = await createAdminClient();

    // 1. Verify election exists and is active
    const election = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.ELECTIONS_COLLECTION_ID!,
      electionId
    );

    const currentDate = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (currentDate < startDate) {
      return {
        success: false,
        message: "This election has not started yet"
      };
    }

    if (currentDate > endDate) {
      return {
        success: false,
        message: "This election has ended"
      };
    }

    // 2. Verify user is registered for this election
    const registrations = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.REGISTERED_USER_ELECTIONS!,
      [
        Query.equal('userID', user.$id),
        Query.equal('electionId', electionId)
      ]
    );

    if (registrations.documents.length === 0) {
      return {
        success: false,
        message: "You are not registered for this election"
      };
    }

    // 3. Check if user has already voted
    const existingVotes = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.VOTES_COLLECTION_ID!,
      [
        Query.equal('userID', user.$id),
        Query.equal('electionId', electionId)
      ]
    );

    if (existingVotes.documents.length > 0) {
      return {
        success: false,
        message: "You have already cast your vote in this election"
      };
    }

    // 4. Verify candidate is valid for this election
    if (!election.candidates.includes(candidateId)) {
      return {
        success: false,
        message: "Invalid candidate selection"
      };
    }

    // 5. Record the vote
    const voteDocument = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.VOTES_COLLECTION_ID!,
      ID.unique(),
      {
        userID: user.$id,
        electionId: electionId,
        candidateId: candidateId,
        // Store a hash of the vote for verification
        // voteHash: await generateVoteHash(user.$id, electionId, candidateId)
      }
    );

    // 6. Update user's election registration status
    await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.REGISTERED_USER_ELECTIONS!,
      registrations.documents[0].$id,
      {
        status: "voted",
        votedAt: new Date().toISOString()
      }
    );

    return {
      success: true,
      message: "Vote cast successfully",
      voteId: voteDocument.$id
    };

  } catch (error) {
    console.error("Error casting vote:", error);
    return {
      success: false,
      message: "Failed to cast vote",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function getVotingStatistics(electionId: string) {
  try {
    const { databases } = await createAdminClient();
    
    const votes = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.VOTES_COLLECTION_ID!,
      [Query.equal('electionId', electionId)]
    );

    const registrations = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.REGISTERED_USER_ELECTIONS!,
      [Query.equal('electionId', electionId)]
    );

    return {
      success: true,
      totalVotes: votes.documents.length,
      totalRegistered: registrations.documents.length,
      turnoutPercentage: (votes.documents.length / registrations.documents.length) * 100
    };

  } catch (error) {
    console.error("Error fetching voting statistics:", error);
    return {
      success: false,
      message: "Failed to fetch voting statistics",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}