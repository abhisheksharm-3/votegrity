import { NextRequest, NextResponse } from "next/server";
import { submitVoterRegistration } from "@/lib/server/appwrite";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Check if request is multipart/form-data
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content type must be multipart/form-data" },
        { status: 415 }
      );
    }

    // Get session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("votegrity-session");
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse the multipart form data
    const formData = await request.formData();
    
    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "address",
      "city",
      "state",
      "zipCode",
      "email",
      "phone",
      "idType",
      "idNumber",
      "citizenship",
    ];

    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Submit voter registration using the Appwrite function
    const result = await submitVoterRegistration(formData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        data: result.data,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("API route error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}