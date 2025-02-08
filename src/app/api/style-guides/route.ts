import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '../../../lib/supabaseServerClient.ts';

export async function POST(request: Request) {
  try {
    console.log('POST /api/style-guides - Request received');
    
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.style_name || !body.key_principle) {
      return NextResponse.json(
        { error: 'style_name and key_principle are required' },
        { status: 400 }
      );
    }

    // Insert the new style guide
    const { data, error } = await supabaseServerClient
      .from('style_guides')
      .insert([{
        style_name: body.style_name,
        key_principle: body.key_principle,
        detailed_guidelines: body.detailed_guidelines
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating style guide:', error);
      return NextResponse.json(
        { error: 'Failed to create style guide' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error('Error in style guides POST route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('GET /api/style-guides - Request received');
    
    const { data, error } = await supabaseServerClient
      .from('style_guides')
      .select('*');

    if (error) {
      console.error('Error fetching style guides:', error);
      return NextResponse.json(
        { error: 'Failed to fetch style guides' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in style guides GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 