import { supabaseServerClient } from '@/lib/supabaseServerClient';
import {
  RawInput,
  AnalyzedInput,
  StructuredPrompt,
  ContentAnalysis,
  StyleGuide,
  AudienceGuide,
  Template,
  EditingPattern,
} from '@/types/pipeline';

export async function analyzeInput(input: RawInput): Promise<AnalyzedInput> {
  // Perform content analysis
  const analysis = analyzeContent(input.text);
  
  // Find matching guides and patterns
  const matchedGuides = await findRelevantGuides(input, analysis);

  return {
    ...input,
    analysis,
    matchedGuides,
  };
}

function analyzeContent(text: string): ContentAnalysis {
  // Basic content analysis
  const words = text.split(/\s+/);
  const keyTopics = extractKeyTopics(text);
  
  return {
    purpose: inferPurpose(text),
    keyTopics,
    complexity: determineComplexity(text),
    estimatedLength: determineLength(words.length),
    suggestedPatterns: suggestPatterns(text),
  };
}

function extractKeyTopics(text: string): string[] {
  // Simple keyword extraction - in production, use NLP
  return text
    .toLowerCase()
    .split(/[.,!?\s]+/)
    .filter(word => word.length > 4)
    .slice(0, 5);
}

function inferPurpose(text: string): string {
  // Simple purpose inference - in production, use ML
  if (text.includes('how to') || text.includes('guide')) return 'instructional';
  if (text.includes('announce') || text.includes('introducing')) return 'announcement';
  return 'informational';
}

function determineComplexity(text: string): 'simple' | 'moderate' | 'complex' {
  const words = text.split(/\s+/);
  const avgWordLength = words.join('').length / words.length;
  
  if (avgWordLength < 5) return 'simple';
  if (avgWordLength < 7) return 'moderate';
  return 'complex';
}

function determineLength(wordCount: number): 'short' | 'medium' | 'long' {
  if (wordCount < 100) return 'short';
  if (wordCount < 500) return 'medium';
  return 'long';
}

function suggestPatterns(text: string): string[] {
  const patterns: string[] = [];
  
  if (text.includes('?')) patterns.push('question-answer');
  if (text.split('.').length > 10) patterns.push('paragraph-break');
  if (text.includes('first') || text.includes('second')) patterns.push('sequential');
  
  return patterns;
}

async function findRelevantGuides(input: RawInput, analysis: ContentAnalysis) {
  const topicsQuery = analysis.keyTopics.join(' | ');

  // Query style guides
  const { data: styleGuides } = await supabaseServerClient
    .from('style_guides')
    .select('id')
    .textSearch('detailed_guide', topicsQuery)
    .limit(3);

  // Query audience guides
  const { data: audienceGuides } = await supabaseServerClient
    .from('audience_guides')
    .select('id')
    .textSearch('description', input.targetAudience || '')
    .limit(2);

  // Query templates
  const { data: templates } = await supabaseServerClient
    .from('templates')
    .select('id')
    .textSearch('description', input.contentType || '')
    .limit(1);

  // Query editing patterns
  const { data: patterns } = await supabaseServerClient
    .from('editing_patterns')
    .select('id')
    .in('pattern_type', analysis.suggestedPatterns)
    .order('priority', { ascending: false })
    .limit(3);

  return {
    styleGuideIds: styleGuides?.map(guide => guide.id) || [],
    audienceGuideIds: audienceGuides?.map(guide => guide.id) || [],
    templateIds: templates?.map(template => template.id) || [],
    patternIds: patterns?.map(pattern => pattern.id) || [],
  };
}

export async function createStructuredPrompt(
  analyzedInput: AnalyzedInput
): Promise<StructuredPrompt> {
  // Fetch full guide details
  const [styleGuide, audienceGuide, template] = await Promise.all([
    fetchGuide<StyleGuide>('style_guides', analyzedInput.matchedGuides.styleGuideIds[0]),
    fetchGuide<AudienceGuide>('audience_guides', analyzedInput.matchedGuides.audienceGuideIds[0]),
    fetchGuide<Template>('templates', analyzedInput.matchedGuides.templateIds[0]),
  ]);

  // Generate system instructions
  const systemInstructions = {
    styleGuidelines: generateStyleGuidelines(styleGuide),
    audienceConsiderations: generateAudienceConsiderations(audienceGuide),
    templateStructure: template?.structure || null,
  };

  return {
    originalInput: analyzedInput,
    analysis: analyzedInput.analysis,
    guidelines: {
      style: styleGuide,
      audience: audienceGuide,
      template: template,
    },
    systemInstructions,
    userPrompt: generateUserPrompt(analyzedInput, systemInstructions),
  };
}

async function fetchGuide<T>(table: string, id: number | undefined): Promise<T | null> {
  if (!id) return null;

  const { data } = await supabaseServerClient
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  return data as T;
}

function generateStyleGuidelines(guide: StyleGuide | null): string {
  if (!guide) return 'Use clear, concise language with proper grammar and punctuation.';
  
  return `Follow these style guidelines:
- Key Principle: ${guide.key_principle || 'Not specified'}
- Detailed Guidelines: ${guide.detailed_guide || 'Use standard writing conventions'}`;
}

function generateAudienceConsiderations(guide: AudienceGuide | null): string {
  if (!guide) return 'Write for a general audience with clear explanations.';
  
  return `Consider these audience factors:
- Preferences: ${guide.preferences || 'Not specified'}
- Key Considerations: ${guide.considerations || 'Keep content accessible and engaging'}`;
}

function generateUserPrompt(
  input: AnalyzedInput,
  instructions: { templateStructure: string | null }
): string {
  return `Please help create ${input.contentType || 'content'} with the following specifications:

Content: ${input.text}
Purpose: ${input.analysis.purpose}
Complexity Level: ${input.analysis.complexity}
${instructions.templateStructure ? `\nFollow this structure:\n${instructions.templateStructure}` : ''}

Please maintain appropriate tone and style while following the provided guidelines.`;
} 