'use server';

/**
 * @fileOverview Generates an empathetic summary for a user's journal entry.
 *
 * - summarizeJournalEntry - A function that creates a summary.
 * - SummarizeEntryInput - The input type for the function.
 * - SummarizeEntryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEntryInputSchema = z.object({
  content: z.string().describe("The user's journal entry content."),
});
export type SummarizeEntryInput = z.infer<typeof SummarizeEntryInputSchema>;

const SummarizeEntryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A short, empathetic summary (2-3 sentences) of the journal entry.'
    ),
});
export type SummarizeEntryOutput = z.infer<typeof SummarizeEntryOutputSchema>;

export async function summarizeJournalEntry(
  input: SummarizeEntryInput
): Promise<SummarizeEntryOutput> {
  return summarizeEntryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEntryPrompt',
  input: {schema: SummarizeEntryInputSchema},
  output: {schema: SummarizeEntryOutputSchema},
  prompt: `You are a compassionate wellness assistant. Read the following journal entry and provide a short, empathetic summary of the key themes and feelings expressed.

The summary should be gentle, non-judgmental, and about 2-3 sentences long.

Journal Entry:
{{{content}}}
`,
});

const summarizeEntryFlow = ai.defineFlow(
  {
    name: 'summarizeEntryFlow',
    inputSchema: SummarizeEntryInputSchema,
    outputSchema: SummarizeEntryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
