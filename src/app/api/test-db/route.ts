import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';

export async function GET() {
  try {
    // Query each table for row count
    const styleGuidesQuery = await supabaseServerClient
      .from('style_guides')
      .select('*', { count: 'exact', head: true });

    const audienceGuidesQuery = await supabaseServerClient
      .from('audience_guides')
      .select('*', { count: 'exact', head: true });

    const templatesQuery = await supabaseServerClient
      .from('templates')
      .select('*', { count: 'exact', head: true });

    const patternsQuery = await supabaseServerClient
      .from('editing_patterns')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      status: 'success',
      counts: {
        styleGuides: styleGuidesQuery.count,
        audienceGuides: audienceGuidesQuery.count,
        templates: templatesQuery.count,
        patterns: patternsQuery.count,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}