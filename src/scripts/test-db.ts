import { supabaseServerClient } from '../lib/supabaseServerClient';

// Test data
const testData = {
  styleGuide: {
    style_name: "Test Style Guide",
    key_principle: "Clarity and Conciseness",
    detailed_guide: "Write with clear, simple language."
  }
};

async function runTests() {
  console.log('Starting database tests...');

  try {
    // Test 1: Insert data
    const styleGuideResult = await supabaseServerClient
      .from('style_guides')
      .insert(testData.styleGuide)
      .select();

    console.log('Style guide insert test:', 
      styleGuideResult.error ? '❌ Failed' : '✅ Passed');

    // Test 2: Read data
    const { data, error } = await supabaseServerClient
      .from('style_guides')
      .select()
      .like('style_name', 'Test%')
      .single();

    console.log('Style guide read test:', 
      error ? '❌ Failed' : '✅ Passed');

    // Clean up
    await supabaseServerClient
      .from('style_guides')
      .delete()
      .like('style_name', 'Test%');
      
    console.log('Test cleanup completed');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run tests
runTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
  }); 