// Database table interfaces
export interface AudienceGuide {
  id: number;
  created_at: string;
  name: string | null;
  description: string | null;
  preferences: string | null;
  considerations: string | null;
}

export interface StyleGuide {
  id: number;
  created_at: string;
  style_name: string | null;
  key_principle: string | null;
  detailed_guide: string | null;
}

export interface Template {
  id: number;
  created_at: string;
  name: string | null;
  structure: string | null;
  description: string | null;
  usage_guideline: string | null;
}

export interface EditingPattern {
  id: number;
  created_at: string;
  pattern_name: string | null;
  pattern_type: string | null;
  pattern_rules: string | null;
  examples: string | null;
  priority: number;
}

// Input processing interfaces
export interface RawInput {
  text: string;
  contentType?: 'article' | 'blog' | 'social' | 'email' | 'documentation' | 'other';
  targetAudience?: string;
  tone?: 'formal' | 'casual' | 'technical' | 'friendly' | 'professional';
  stylePreference?: string;
}

export interface ContentAnalysis {
  purpose: string;
  keyTopics: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedLength: 'short' | 'medium' | 'long';
  suggestedPatterns: string[];
}

export interface AnalyzedInput extends RawInput {
  analysis: ContentAnalysis;
  matchedGuides: {
    styleGuideIds: number[];
    audienceGuideIds: number[];
    templateIds: number[];
    patternIds: number[];
  };
}

export interface ProcessedContent {
  original: string;
  processed: string;
  appliedPatterns: EditingPattern[];
}

export interface StructuredPrompt {
  originalInput: RawInput;
  analysis: ContentAnalysis;
  guidelines: {
    style: StyleGuide | null;
    audience: AudienceGuide | null;
    template: Template | null;
  };
  systemInstructions: {
    styleGuidelines: string;
    audienceConsiderations: string;
    templateStructure: string | null;
  };
  userPrompt: string;
} 