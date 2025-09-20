// This file uses server-side code.
'use server';

/**
 * @fileOverview Detects crisis-related keywords in text and offers access to helpline resources.
 *
 * - detectCrisis - A function that analyzes text for crisis keywords.
 * - CrisisDetectionInput - The input type for the detectCrisis function.
 * - CrisisDetectionOutput - The return type for the detectCrisis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrisisDetectionInputSchema = z.object({
  text: z.string().describe('The text to analyze for crisis-related keywords.'),
});
export type CrisisDetectionInput = z.infer<typeof CrisisDetectionInputSchema>;

const CrisisDetectionOutputSchema = z.object({
  isCrisis: z.boolean().describe('Whether the text indicates a crisis situation.'),
  confidence: z.number().describe('The confidence level of the crisis detection (0-1).'),
});
export type CrisisDetectionOutput = z.infer<typeof CrisisDetectionOutputSchema>;

export async function detectCrisis(input: CrisisDetectionInput): Promise<CrisisDetectionOutput> {
  return detectCrisisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crisisDetectionPrompt',
  input: {schema: CrisisDetectionInputSchema},
  output: {schema: CrisisDetectionOutputSchema},
  prompt: `You are a crisis detection AI.  Your job is to determine, based on the text provided, whether the user is in a crisis situation.  A crisis situation includes thoughts of self-harm, suicide, or violence against others.

  Analyze the following text:

  {{text}}

  Return a JSON object with the following format:
  {
    "isCrisis": true|false,
    "confidence": confidence level (0-1)
  }

  Consider these keywords:
  - suicide
  - self-harm
  - kill myself
  - want to die
  - violence
  - abuse
  - rape
  - assault
  - crisis
  - emergency
  - help
  - hurting myself

  However, do not trigger on these words alone.  Consider the context of the entire text.
`,
});

const detectCrisisFlow = ai.defineFlow(
  {
    name: 'detectCrisisFlow',
    inputSchema: CrisisDetectionInputSchema,
    outputSchema: CrisisDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
