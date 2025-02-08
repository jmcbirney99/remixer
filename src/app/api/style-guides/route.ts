import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '../../../lib/supabaseServerClient.ts';

export async function POST(request: NextRequest) {
  // Parse the request body
  const { title, content } = await request.json();

  // Insert into database
  const { data, error } = await supabaseServerClient
    .from('style_guides')
    .insert({ title, content });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
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