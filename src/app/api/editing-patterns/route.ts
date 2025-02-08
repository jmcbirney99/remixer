import { NextResponse } from 'next/server';
import { supabaseServerClient } from '../../../lib/supabaseServerClient.ts';

export async function GET() {
  try {
    console.log('GET /api/editing-patterns - Request received');
    
    const { data, error } = await supabaseServerClient
      .from('editing_patterns')
      .select('*');

    if (error) {
      console.error('Error fetching editing patterns:', error);
      return NextResponse.json(
        { error: 'Failed to fetch editing patterns' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in editing patterns GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/editing-patterns - Request received');
    
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.pattern_name || !body.pattern_type || !body.pattern_rules) {
      return NextResponse.json(
        { error: 'pattern_name, pattern_type, and pattern_rules are required' },
        { status: 400 }
      );
    }

    // Insert the new editing pattern
    const { data, error } = await supabaseServerClient
      .from('editing_patterns')
      .insert([{
        pattern_name: body.pattern_name,
        pattern_type: body.pattern_type,
        pattern_rules: body.pattern_rules,
        examples: body.examples,
        priority: body.priority || 1  // Default priority if not provided
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating editing pattern:', error);
      return NextResponse.json(
        { error: 'Failed to create editing pattern' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error('Error in editing patterns POST route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 