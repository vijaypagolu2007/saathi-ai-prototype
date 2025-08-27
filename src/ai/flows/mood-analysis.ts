'use server';

/**
 * @fileOverview Analyzes the mood of a journal entry.
 *
 * - analyzeMood - A function that analyzes the mood of a journal entry.
 * - MoodAnalysisInput - The input type for the analyzeMood function.
 * - MoodAnalysisOutput - The return type for the analyzeMood function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MoodAnalysisInputSchema = z.object({
  text: z
    .string()
    .describe('The journal entry text to be analyzed for mood.'),
});
export type MoodAnalysisInput = z.infer<typeof MoodAnalysisInputSchema>;

const MoodAnalysisOutputSchema = z.object({
  mood: z
    .string()
    .describe(
      "The primary mood detected in the text (e.g., Happy, Sad, Anxious, Calm, Angry, Neutral)."
    ),
  valence: z
    .number()
    .min(-1)
    .max(1)
    .describe(
      'A score from -1 (very negative) to 1 (very positive) representing the emotional valence.'
    ),
  energy: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'A score from 0 (low energy) to 1 (high energy) representing the arousal level.'
    ),
});
export type MoodAnalysisOutput = z.infer<typeof MoodAnalysisOutputSchema>;

export async function analyzeMood(
  input: MoodAnalysisInput
): Promise<MoodAnalysisOutput> {
  return moodAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodAnalysisPrompt',
  input: { schema: MoodAnalysisInputSchema },
  output: { schema: MoodAnalysisOutputSchema },
  prompt: `You are a mood analysis expert. Analyze the following journal entry and determine the primary mood, emotional valence, and energy level.

The primary mood must be one of the following: Happy, Sad, Anxious, Calm, Angry, Neutral.

Valence is a score from -1 (very negative) to 1 (very positive).
Energy is a score from 0 (low energy) to 1 (high energy).

For example:
- "I'm so excited about my new project!" -> mood: Happy, valence: 0.9, energy: 0.8
- "I feel so down and tired today." -> mood: Sad, valence: -0.8, energy: 0.2
- "I'm worried about the upcoming exam." -> mood: Anxious, valence: -0.6, energy: 0.6
- "Just sitting by the lake, so peaceful." -> mood: Calm, valence: 0.7, energy: 0.1
- "I'm furious about what happened." -> mood: Angry, valence: -0.7, energy: 0.9
- "Just a regular day, nothing special to report." -> mood: Neutral, valence: 0.0, energy: 0.4


Journal Entry:
{{{text}}}
`,
});

const moodAnalysisFlow = ai.defineFlow(
  {
    name: 'moodAnalysisFlow',
    inputSchema: MoodAnalysisInputSchema,
    outputSchema: MoodAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
