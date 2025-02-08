import dotenv from 'dotenv';
dotenv.config();

import { supabaseServerClient } from '../lib/supabaseServerClient';

// Test data for all tables
const testData = {
  styleGuide: {
    style_name: "Test Style Guide",
    key_principle: "Clarity and Conciseness",
    detailed_guidelines: "Write with clear, simple language."
  },
  audienceGuide: {
    name: "Test Audience Guide",
    description: "Technical professionals",
    preferences: "Detailed technical information",
    considerations: "Assumes technical background"
  },
  template: {
    name: "Test Template",
    structure: "Introduction\nBody\nConclusion",
    description: "Basic article template",
    usage_guidelines: "Use for technical articles"
  },
  editing_patterns: {
    pattern_name: "Test Pattern",
    pattern_type: "Grammar",
    pattern_rules: "Use active voice",
    examples: "Good: 'The cat chased the mouse'\nBad: 'The mouse was chased by the cat'",
    priority: 1
  }
};

async function runTests() {
  console.log('Starting database tests...');

  try {
    // Test 1: Style Guides
    console.log('\nTesting Style Guides:');
    const styleGuideResult = await supabaseServerClient
      .from('style_guides')
      .insert(testData.styleGuide)
      .select();
    console.log('Style guide insert test:', styleGuideResult.error ? '❌ Failed' : '✅ Passed');
    if (styleGuideResult.error) console.error('Insert error:', styleGuideResult.error);

    // Test 2: Audience Guides
    console.log('\nTesting Audience Guides:');
    const audienceGuideResult = await supabaseServerClient
      .from('audience_guides')
      .insert(testData.audienceGuide)
      .select();
    console.log('Audience guide insert test:', audienceGuideResult.error ? '❌ Failed' : '✅ Passed');
    if (audienceGuideResult.error) console.error('Insert error:', audienceGuideResult.error);

    // Test 3: Templates
    console.log('\nTesting Templates:');
    const templateResult = await supabaseServerClient
      .from('templates')
      .insert(testData.template)
      .select();
    console.log('Template insert test:', templateResult.error ? '❌ Failed' : '✅ Passed');
    if (templateResult.error) console.error('Insert error:', templateResult.error);

    // Test 4: Editing Patterns
    console.log('\nTesting Editing Patterns:');
    const patternResult = await supabaseServerClient
      .from('editing_patterns')
      .insert(testData.editing_patterns)
      .select();
    console.log('Pattern insert test:', patternResult.error ? '❌ Failed' : '✅ Passed');
    if (patternResult.error) console.error('Insert error:', patternResult.error);

    // Clean up
    console.log('\nCleaning up test data...');
    await Promise.all([
      supabaseServerClient
        .from('style_guides')
        .delete()
        .like('style_name', 'Test%'),
      supabaseServerClient
        .from('audience_guides')
        .delete()
        .like('name', 'Test%'),
      supabaseServerClient
        .from('templates')
        .delete()
        .like('name', 'Test%'),
      supabaseServerClient
        .from('editing_patterns')
        .delete()
        .like('pattern_name', 'Test%')
    ]);
    
    console.log('Test cleanup completed');

  } catch (err) {
    console.error('Test failed:', err);
  }
}

runTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
  }); 