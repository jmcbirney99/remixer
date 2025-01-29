import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';

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