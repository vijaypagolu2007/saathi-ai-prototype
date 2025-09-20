'use server';

/**
 * @fileOverview Provides journaling prompts based on the user's mood.
 *
 * - generateJournalPrompt - A function that generates journaling prompts.
 * - JournalPromptInput - The input type for the generateJournalPrompt function.
 * - JournalPromptOutput - The return type for the generateJournalPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JournalPromptInputSchema = z.object({
  mood: z
    .string()
    .describe("The user's current mood (e.g., happy, sad, anxious)."),
});
export type JournalPromptInput = z.infer<typeof JournalPromptInputSchema>;

const JournalPromptOutputSchema = z.object({
  prompt: z.string().describe('A journaling prompt tailored to the user.'),
});
export type JournalPromptOutput = z.infer<typeof JournalPromptOutputSchema>;

export async function generateJournalPrompt(
  input: JournalPromptInput
): Promise<JournalPromptOutput> {
  return journalPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'journalPrompt',
  input: {schema: JournalPromptInputSchema},
  output: {schema: JournalPromptOutputSchema},
  prompt: `You are a mental wellness assistant that provides journaling prompts based on a user's mood.

  Provide a single journaling prompt that encourages reflection on their feelings and experiences related to their current mood.

  Mood: {{{mood}}}

  Prompt:`,
});

const journalPromptFlow = ai.defineFlow(
  {
    name: 'journalPromptFlow',
    inputSchema: JournalPromptInputSchema,
    outputSchema: JournalPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
