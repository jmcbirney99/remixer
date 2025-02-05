import { NextRequest, NextResponse } from 'next/server';
import { supabaseServerClient } from '@/lib/supabaseServerClient';
import { testData, cleanupTestData } from '../../../utils/testUtils';

export async function GET() {
  try {
    // Test queries for each table
    const [styleGuides, audienceGuides, templates, patterns] = await Promise.all([
      supabaseServerClient.from('style_guides').select('count'),
      supabaseServerClient.from('audience_guides').select('count'),
      supabaseServerClient.from('templates').select('count'),
      supabaseServerClient.from('editing_patterns').select('count'),
    ]);

    return NextResponse.json({
      status: 'success',
      counts: {
        styleGuides: styleGuides.count,
        audienceGuides: audienceGuides.count,
        templates: templates.count,
        patterns: patterns.count,
      }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Database connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const testData = {
  styleGuide: {
    style_name: "Test Style Guide",
    key_principle: "Clarity and Conciseness",
    detailed_guide: "Write with clear, simple language."
  },
  audienceGuide: {
    name: "Test Audience",
    description: "Technical professionals",
    preferences: "Detailed technical information",
    considerations: "Assumes technical background"
  },
  template: {
    name: "Test Template",
    structure: "Introduction\nBody\nConclusion",
    description: "Basic article template",
    usage_guideline: "Use for technical articles"
  },
  pattern: {
    pattern_name: "Test Pattern",
    pattern_type: "Grammar",
    pattern_rules: "Use active voice",
    examples: "Good: 'The cat chased the mouse'\nBad: 'The mouse was chased by the cat'",
    priority: 1
  }
};

export async function cleanupTestData() {
  // Clean up test data after tests
  const tables = ['style_guides', 'audience_guides', 'templates', 'editing_patterns'];
  
  for (const table of tables) {
    await supabaseServerClient
      .from(table)
      .delete()
      .like('style_name', 'Test%')
      .like('name', 'Test%')
      .like('pattern_name', 'Test%');
  }
} 