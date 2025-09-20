'use server';

/**
 * @fileOverview Generates a short, calming mindfulness exercise or positive affirmation.
 *
 * - generateMindfulMoment - A function that generates a mindful moment.
 * - MindfulMomentOutput - The return type for the generateMindfulMoment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MindfulMomentOutputSchema = z.object({
  moment: z
    .string()
    .describe(
      'A short, calming mindfulness exercise or a positive affirmation, written in the second person (e.g., "Take a deep breath...").'
    ),
});
export type MindfulMomentOutput = z.infer<typeof MindfulMomentOutputSchema>;

export async function generateMindfulMoment(): Promise<MindfulMomentOutput> {
  return mindfulMomentFlow();
}

const prompt = ai.definePrompt({
  name: 'mindfulMomentPrompt',
  output: {schema: MindfulMomentOutputSchema},
  prompt: `You are a mental wellness assistant. Generate a single, short, and calming mindfulness exercise or a positive affirmation.

The response should be 2-3 sentences long.
It should be written in a gentle, supportive, and direct second-person voice (addressing "you").

Examples:
- "Close your eyes for a moment. Take a deep breath in, hold it for a count of three, and slowly release it. Feel the tension leaving your body with your breath."
- "Think of one thing you are grateful for right now, no matter how small. Hold that feeling of gratitude in your heart for a moment."
- "You are capable and resilient. Acknowledge one small success you've had today and allow yourself to feel proud."

Generate a new mindful moment now.`,
});

const mindfulMomentFlow = ai.defineFlow(
  {
    name: 'mindfulMomentFlow',
    outputSchema: MindfulMomentOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
