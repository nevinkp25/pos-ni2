'use server';

/**
 * @fileOverview Summarizes table availability (blocked, available, booked) for a selected date.
 *
 * - summarizeTableAvailability - A function that generates the summary.
 * - SummarizeTableAvailabilityInput - The input type for the summarizeTableAvailability function.
 * - SummarizeTableAvailabilityOutput - The return type for the summarizeTableAvailability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTableAvailabilityInputSchema = z.object({
  date: z.string().describe('The date for which to summarize table availability (YYYY-MM-DD).'),
  restaurantId: z.string().describe('The ID of the restaurant.'),
  floorId: z.string().describe('The ID of the floor.'),
  blockedTables: z.array(z.string()).describe('List of table IDs that are blocked.'),
  availableTables: z.array(z.string()).describe('List of table IDs that are available.'),
  bookedTables: z.array(z.string()).describe('List of table IDs that are booked.'),
});
export type SummarizeTableAvailabilityInput = z.infer<typeof SummarizeTableAvailabilityInputSchema>;

const SummarizeTableAvailabilityOutputSchema = z.object({
  summary: z.string().describe('A summary of table availability (blocked, available, booked) for the specified date.'),
});
export type SummarizeTableAvailabilityOutput = z.infer<typeof SummarizeTableAvailabilityOutputSchema>;

export async function summarizeTableAvailability(input: SummarizeTableAvailabilityInput): Promise<SummarizeTableAvailabilityOutput> {
  return summarizeTableAvailabilityFlow(input);
}

const summarizeTableAvailabilityPrompt = ai.definePrompt({
  name: 'summarizeTableAvailabilityPrompt',
  input: {schema: SummarizeTableAvailabilityInputSchema},
  output: {schema: SummarizeTableAvailabilityOutputSchema},
  prompt: `You are a restaurant administrator. Generate a concise summary of table availability for the selected date, floor, and restaurant.

  Date: {{{date}}}
  Restaurant ID: {{{restaurantId}}}
  Floor ID: {{{floorId}}}
  Blocked Tables: {{#each blockedTables}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Available Tables: {{#each availableTables}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Booked Tables: {{#each bookedTables}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Summary: `,
});

const summarizeTableAvailabilityFlow = ai.defineFlow(
  {
    name: 'summarizeTableAvailabilityFlow',
    inputSchema: SummarizeTableAvailabilityInputSchema,
    outputSchema: SummarizeTableAvailabilityOutputSchema,
  },
  async input => {
    const {output} = await summarizeTableAvailabilityPrompt(input);
    return output!;
  }
);
