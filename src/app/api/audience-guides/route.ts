import { NextResponse } from 'next/server';
import { supabaseServerClient } from '../../../lib/supabaseServerClient.ts';

export async function GET() {
  try {
    console.log('GET /api/audience-guides - Request received');
    
    const { data, error } = await supabaseServerClient
      .from('audience_guides')
      .select('*');

    if (error) {
      console.error('Error fetching audience guides:', error);
      return NextResponse.json(
        { error: 'Failed to fetch audience guides' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in audience guides GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/audience-guides - Request received');
    
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'name and description are required' },
        { status: 400 }
      );
    }

    // Insert the new audience guide
    const { data, error } = await supabaseServerClient
      .from('audience_guides')
      .insert([{
        name: body.name,
        description: body.description,
        preferences: body.preferences,
        considerations: body.considerations
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating audience guide:', error);
      return NextResponse.json(
        { error: 'Failed to create audience guide' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error('Error in audience guides POST route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 