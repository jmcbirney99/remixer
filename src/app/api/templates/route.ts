import { NextResponse } from 'next/server';
import { supabaseServerClient } from '../../../lib/supabaseServerClient.ts';

export async function GET() {
  try {
    console.log('GET /api/templates - Request received');
    
    const { data, error } = await supabaseServerClient
      .from('templates')
      .select('*');

    if (error) {
      console.error('Error fetching templates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch templates' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in templates GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/templates - Request received');
    
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.structure) {
      return NextResponse.json(
        { error: 'name and structure are required' },
        { status: 400 }
      );
    }

    // Insert the new template
    const { data, error } = await supabaseServerClient
      .from('templates')
      .insert([{
        name: body.name,
        structure: body.structure,
        description: body.description,
        usage_guidelines: body.usage_guidelines
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      return NextResponse.json(
        { error: 'Failed to create template' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error('Error in templates POST route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 