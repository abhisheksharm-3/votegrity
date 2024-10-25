// app/api/user/voter/register/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the FormData
    const formData = await request.formData();
    
    // Extract the fields
    const formFields: Record<string, any> = {};
    formData.forEach((value, key) => {
      // Handle file separately
      if (value instanceof File) {
        formFields[key] = {
          name: value.name,
          type: value.type,
          size: value.size
        };
      } else {
        formFields[key] = value;
      }
    });

    // Log the received data (for development)
    console.log('Received voter registration:', formFields);

    // Here you would typically:
    // 1. Validate the input
    // 2. Process the ID document
    // 3. Store the data in your database
    // 4. Handle any additional business logic

    return NextResponse.json(
      { 
        success: true, 
        message: 'Voter registration received successfully',
        data: formFields  // In production, you might want to limit what you send back
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Voter registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process voter registration' 
      },
      { status: 500 }
    );
  }
}