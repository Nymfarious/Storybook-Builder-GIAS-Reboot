export interface CognitiveSettings {
  lexicalLevel: 1 | 2 | 3 | 4 | 5;
  conceptualLevel: 1 | 2 | 3 | 4 | 5;
}

export interface StoryBeatAnalysis {
  estimatedReadingAge: string;
  lexicalScore: number;
  conceptualScore: number;
  suggestions: string[];
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
}

const LEXICAL_DESCRIPTIONS: Record<number, string> = {
  1: 'Sight words only. Use CVC words (cat, dog, run). Max 3-4 letters.',
  2: 'Early reader vocabulary. Simple compound words (sunlight, bedroom).',
  3: 'Elementary vocabulary. Common adjectives and adverbs.',
  4: 'Middle school vocabulary. Domain-specific terms, multi-syllable words.',
  5: 'Advanced vocabulary. SAT-level words, technical jargon, idioms.',
};

const CONCEPTUAL_DESCRIPTIONS: Record<number, string> = {
  1: 'Object permanence. What do you see? Name things. Cause and effect.',
  2: 'Simple emotions. Happy, sad, scared. Basic wants and needs.',
  3: 'Social dynamics. Friendship, sharing, fairness. Simple motivations.',
  4: 'Complex emotions. Jealousy, pride, guilt. Multiple perspectives.',
  5: 'Abstract concepts. Moral ambiguity, symbolism, unreliable narrators.',
};

export function generateRewritePrompt(
  originalText: string,
  settings: CognitiveSettings
): string {
  const lexicalDesc = LEXICAL_DESCRIPTIONS[settings.lexicalLevel];
  const conceptualDesc = CONCEPTUAL_DESCRIPTIONS[settings.conceptualLevel];

  let focusInstruction = '';
  
  if (settings.lexicalLevel <= 2 && settings.conceptualLevel <= 2) {
    focusInstruction = `
Focus on: "What do you see?"
- Use short sentences (3-6 words)
- Repetition is good ("The fox ran. The fox ran fast.")
- Concrete nouns only
- Present tense`;
  } else if (settings.lexicalLevel >= 4 && settings.conceptualLevel >= 4) {
    focusInstruction = `
Focus on: "Why did they do that?"
- Use complex sentence structures with subordinate clauses
- Include metaphors and figurative language
- Explore character motivations and internal conflict
- Show moral complexity`;
  } else {
    focusInstruction = `
Balance between showing and explaining:
- Mix simple and compound sentences
- Include some descriptive language
- Characters can have relatable emotions`;
  }

  return `Rewrite the following story text for a specific reading level.

LEXICAL LEVEL (${settings.lexicalLevel}/5): ${lexicalDesc}
CONCEPTUAL LEVEL (${settings.conceptualLevel}/5): ${conceptualDesc}

${focusInstruction}

ORIGINAL TEXT:
"""
${originalText}
"""

Rewritten version:`;
}

export function analyzeStoryBeat(text: string): StoryBeatAnalysis {
  // Mock analysis - in production this would call an AI service
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const wordCount = words.length;
  const sentenceCount = Math.max(1, sentences.length);
  const avgWordsPerSentence = wordCount / sentenceCount;
  
  // Simple heuristic scoring
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / Math.max(1, wordCount);
  
  let lexicalScore = Math.min(5, Math.max(1, Math.round(avgWordLength / 1.5)));
  let conceptualScore = Math.min(5, Math.max(1, Math.round(avgWordsPerSentence / 5)));
  
  const suggestions: string[] = [];
  
  if (avgWordsPerSentence > 15) {
    suggestions.push('Consider breaking up longer sentences for younger readers.');
  }
  if (avgWordLength > 6) {
    suggestions.push('Some words may be challenging. Consider simpler synonyms.');
  }
  if (wordCount < 20) {
    suggestions.push('Short passage - analysis may be less accurate.');
  }
  
  const readingAges = ['Pre-K', 'K-1st', '2nd-3rd', '4th-6th', '7th+'];
  const ageIndex = Math.round((lexicalScore + conceptualScore) / 2) - 1;
  
  return {
    estimatedReadingAge: readingAges[Math.max(0, Math.min(4, ageIndex))],
    lexicalScore,
    conceptualScore,
    suggestions,
    wordCount,
    sentenceCount,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
  };
}
