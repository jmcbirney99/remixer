// src/utils/testUtils.ts
import { supabaseServerClient } from '@/lib/supabaseServerClient';

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