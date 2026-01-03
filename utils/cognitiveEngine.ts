export interface CognitiveSettings {
  lexicalLevel: number; // 1-5: Vocabulary and Sentence Structure
  conceptualLevel: number; // 1-5: Abstraction and Themes
}

export interface CognitiveAnalysis {
  lexicalScore: number;
  conceptualScore: number;
  wordCount: number;
  readabilityLabel: string;
}

const LEXICAL_GUIDES: Record<number, string> = {
  1: "Use only Dolch sight words and CVC (consonant-vowel-consonant) words. Max sentence length: 5 words. Use repetition.",
  2: "Use simple sentences. Focus on high-frequency verbs. Avoid compound sentences.",
  3: "Use compound sentences (and, but). Introduce descriptive adjectives. Paragraphs can have 3-4 sentences.",
  4: "Use varied sentence structures. Introduce specific vocabulary (e.g., 'sprinted' instead of 'ran').",
  5: "Use complex sentence structures, including dependent clauses. Use sophisticated vocabulary suitable for Junior High level."
};

const CONCEPTUAL_GUIDES: Record<number, string> = {
  1: "Focus strictly on concrete objects (what can be seen/touched). No internal monologue. Focus on 'What is happening now?'",
  2: "Focus on simple cause and effect. Basic emotions (happy, sad, mad).",
  3: "Introduce sequences of events. Explore motivation (Why did they do it?). Focus on friends/family dynamics.",
  4: "Explore internal conflict. Characters solve problems using logic. distinct character voices.",
  5: "Explore abstract themes (betrayal, hope, irony). Focus on moral ambiguity and 'Why is the world like this?' Use metaphors."
};

/**
 * Generates a structured prompt for the AI to rewrite text based on cognitive load settings.
 */
export const generateRewritePrompt = (originalText: string, settings: CognitiveSettings): string => {
  // Clamp values between 1 and 5
  const lex = Math.max(1, Math.min(5, settings.lexicalLevel));
  const con = Math.max(1, Math.min(5, settings.conceptualLevel));

  const instructions = `
You are a Cognitive Editor. Rewrite the story text below to match the following specific reading level criteria:

TARGET AUDIENCE PROFILE:
1. LEXICAL LEVEL (${lex}/5): ${LEXICAL_GUIDES[lex]}
2. CONCEPTUAL LEVEL (${con}/5): ${CONCEPTUAL_GUIDES[con]}

ORIGINAL TEXT:
"${originalText}"

OUTPUT REQUIREMENT:
Provide ONLY the rewritten text. Do not add explanations.
`;

  return instructions.trim();
};

/**
 * Analyzes text to provide a mock cognitive score.
 * In a real implementation, this would use NLP libraries like 'syllable' or 'flesch-kincaid'.
 */
export const analyzeStoryBeat = (text: string): CognitiveAnalysis => {
  const cleanText = text.trim();
  if (!cleanText) {
    return { lexicalScore: 0, conceptualScore: 0, wordCount: 0, readabilityLabel: 'Empty' };
  }

  const words = cleanText.split(/\s+/);
  const wordCount = words.length;
  
  // Heuristic: Average word length for Lexical Score
  const totalChars = words.reduce((acc, word) => acc + word.length, 0);
  const avgWordLength = totalChars / wordCount;
  
  // Heuristic: Average sentence length for Conceptual Score
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.length > 0);
  const avgSentenceLength = wordCount / (sentences.length || 1);

  // Map heuristics to 1-5 scale (Mock logic)
  // Avg word len: <4 (1), 4-5 (2), 5-6 (3), 6-7 (4), >7 (5)
  let lexicalScore = 1;
  if (avgWordLength > 7) lexicalScore = 5;
  else if (avgWordLength > 6) lexicalScore = 4;
  else if (avgWordLength > 5) lexicalScore = 3;
  else if (avgWordLength > 4) lexicalScore = 2;

  // Avg sentence len: <6 (1), 6-10 (2), 10-15 (3), 15-20 (4), >20 (5)
  let conceptualScore = 1;
  if (avgSentenceLength > 20) conceptualScore = 5;
  else if (avgSentenceLength > 15) conceptualScore = 4;
  else if (avgSentenceLength > 10) conceptualScore = 3;
  else if (avgSentenceLength > 6) conceptualScore = 2;

  let label = 'Early Reader';
  if (lexicalScore + conceptualScore > 8) label = 'Young Adult';
  else if (lexicalScore + conceptualScore > 5) label = 'Middle Grade';

  return {
    lexicalScore,
    conceptualScore,
    wordCount,
    readabilityLabel: label
  };
};