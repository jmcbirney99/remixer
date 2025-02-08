import { NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';

export async function GET() {
  try {
    // Query each table for row count
    const {
      data: styleGuidesData,
      count: styleGuidesCount,
      error: styleGuidesError
    } = await supabaseServerClient
      .from('style_guides')
      .select('*', { count: 'exact', head: true });

    if (styleGuidesError) {
      // Explicitly handle or throw the error
      throw new Error(`Error fetching style guides: ${styleGuidesError.message}`);
    }

    const {
      data: audienceGuidesData,
      count: audienceGuidesCount,
      error: audienceGuidesError
    } = await supabaseServerClient
      .from('audience_guides')
      .select('*', { count: 'exact', head: true });

    if (audienceGuidesError) {
      throw new Error(`Error fetching audience guides: ${audienceGuidesError.message}`);
    }

    const {
      data: templatesData,
      count: templatesCount,
      error: templatesError
    } = await supabaseServerClient
      .from('templates')
      .select('*', { count: 'exact', head: true });

    if (templatesError) {
      throw new Error(`Error fetching templates: ${templatesError.message}`);
    }

    const {
      data: patternsData,
      count: patternsCount,
      error: patternsError
    } = await supabaseServerClient
      .from('editing_patterns')
      .select('*', { count: 'exact', head: true });

    if (patternsError) {
      throw new Error(`Error fetching editing patterns: ${patternsError.message}`);
    }

    return NextResponse.json({
      status: 'success',
      counts: {
        styleGuides: styleGuidesCount,
        audienceGuides: audienceGuidesCount,
        templates: templatesCount,
        patterns: patternsCount,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}