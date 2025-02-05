import { NextRequest, NextResponse } from 'next/server';
import { analyzeInput, createStructuredPrompt } from '@/lib/services/inputProcessor';
import { RawInput } from '@/types/pipeline';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const input: RawInput = await request.json();

    // Input validation
    if (!input.text || input.text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Input text is required' },
        { status: 400 }
      );
    }

    // Validate content type if provided
    if (input.contentType && !['article', 'blog', 'social', 'email', 'documentation', 'other'].includes(input.contentType)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Validate tone if provided
    if (input.tone && !['formal', 'casual', 'technical', 'friendly', 'professional'].includes(input.tone)) {
      return NextResponse.json(
        { error: 'Invalid tone' },
        { status: 400 }
      );
    }

    // Process the input
    const analyzedInput = await analyzeInput(input);
    const structuredPrompt = await createStructuredPrompt(analyzedInput);

    return NextResponse.json({
      success: true,
      data: structuredPrompt,
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing input:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process input',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
} 