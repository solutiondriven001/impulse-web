'use server';

/**
 * @fileOverview An AI agent that suggests tasks to the user to earn more coins.
 *
 * - suggestTasks - A function that suggests tasks to the user.
 * - SuggestTasksInput - The input type for the suggestTasks function.
 * - SuggestTasksOutput - The return type for the suggestTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTasksInputSchema = z.object({
  currentCoins: z
    .number()
    .describe('The number of coins the user currently has.'),
  level: z.number().describe('The current level of the user.'),
});
export type SuggestTasksInput = z.infer<typeof SuggestTasksInputSchema>;

const SuggestTasksOutputSchema = z.object({
  tasks: z
    .array(z.string())
    .describe(
      'A list of tasks that the user can complete to earn more coins.'
    ),
});
export type SuggestTasksOutput = z.infer<typeof SuggestTasksOutputSchema>;

export async function suggestTasks(input: SuggestTasksInput): Promise<SuggestTasksOutput> {
  return suggestTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: {schema: SuggestTasksInputSchema},
  output: {schema: SuggestTasksOutputSchema},
  prompt: `You are a game master in CoinQuest.

  Suggest tasks to the user that will help them earn more coins and progress in the game.

  The user currently has {{currentCoins}} coins and is at level {{level}}.

  Suggest tasks appropriate for their current level and coin balance, that helps them progress in the game more efficiently.

  The tasks should be diverse and engaging, focusing on different aspects of the game.
  Provide the output as a numbered list.`,
});

const suggestTasksFlow = ai.defineFlow(
  {
    name: 'suggestTasksFlow',
    inputSchema: SuggestTasksInputSchema,
    outputSchema: SuggestTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
