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