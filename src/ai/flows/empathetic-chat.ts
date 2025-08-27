'use server';

/**
 * @fileOverview Empathetic chat flow for providing mental health support.
 *
 * - empatheticChat - A function that handles the chat process.
 * - EmpatheticChatInput - The input type for the empatheticChat function.
 * - EmpatheticChatOutput - The return type for the empatheticChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmpatheticChatInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
});
export type EmpatheticChatInput = z.infer<typeof EmpatheticChatInputSchema>;

const EmpatheticChatOutputSchema = z.object({
  response: z.string().describe('The empathetic response from the AI.'),
});
export type EmpatheticChatOutput = z.infer<typeof EmpatheticChatOutputSchema>;

export async function empatheticChat(input: EmpatheticChatInput): Promise<EmpatheticChatOutput> {
  return empatheticChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'empatheticChatPrompt',
  input: {schema: EmpatheticChatInputSchema},
  output: {schema: EmpatheticChatOutputSchema},
  prompt: `You are an AI assistant designed to provide empathetic support and understanding to users expressing their mental health concerns. Respond to the following message with empathy and offer helpful advice or resources where appropriate.\n\nMessage: {{{message}}}`,
});

const empatheticChatFlow = ai.defineFlow(
  {
    name: 'empatheticChatFlow',
    inputSchema: EmpatheticChatInputSchema,
    outputSchema: EmpatheticChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
