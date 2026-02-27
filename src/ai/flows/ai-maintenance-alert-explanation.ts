'use server';
/**
 * @fileOverview An AI agent that explains maintenance alerts and suggests next steps.
 *
 * - explainMaintenanceAlert - A function that handles the explanation process for maintenance alerts.
 * - AiMaintenanceAlertExplanationInput - The input type for the explainMaintenanceAlert function.
 * - AiMaintenanceAlertExplanationOutput - The return type for the explainMaintenanceAlert function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiMaintenanceAlertExplanationInputSchema = z.object({
  equipmentId: z.string().describe('The unique identifier of the equipment.'),
  equipmentName: z.string().describe('The name of the equipment.'),
  alertType: z.string().describe('The type of maintenance alert (e.g., \'High Temperature\', \'Unusual Vibration\', \'Usage Threshold Exceeded\').'),
  alertDetails: z.string().describe('Detailed information about the alert, including relevant sensor readings, usage statistics, or historical context.'),
  suggestedMaintenanceHistory: z.array(z.string()).optional().describe('Optional: A list of recent maintenance activities or relevant history for context.'),
});
export type AiMaintenanceAlertExplanationInput = z.infer<typeof AiMaintenanceAlertExplanationInputSchema>;

const AiMaintenanceAlertExplanationOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of the alert and its potential implications.'),
  nextSteps: z.array(z.string()).describe('A list of concrete, actionable next steps or preventive measures.'),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('The severity level of the alert.'),
});
export type AiMaintenanceAlertExplanationOutput = z.infer<typeof AiMaintenanceAlertExplanationOutputSchema>;

export async function explainMaintenanceAlert(input: AiMaintenanceAlertExplanationInput): Promise<AiMaintenanceAlertExplanationOutput> {
  return aiMaintenanceAlertExplanationFlow(input);
}

const aiMaintenanceAlertExplanationPrompt = ai.definePrompt({
  name: 'aiMaintenanceAlertExplanationPrompt',
  input: { schema: AiMaintenanceAlertExplanationInputSchema },
  output: { schema: AiMaintenanceAlertExplanationOutputSchema },
  prompt: `You are an expert maintenance analyst for a large enterprise. Your task is to provide clear, actionable explanations and recommendations for AI-driven equipment maintenance alerts.

Here is the information about the alert:
Equipment ID: {{{equipmentId}}}
Equipment Name: {{{equipmentName}}}
Alert Type: {{{alertType}}}
Alert Details: {{{alertDetails}}}

{{#if suggestedMaintenanceHistory}}
Recent Maintenance History:
{{#each suggestedMaintenanceHistory}}
- {{{this}}}
{{/each}}
{{/if}}

Based on the provided alert details, explain the reasoning behind the alert, its potential impact on the equipment, and provide concrete next steps or preventive actions. Also, assess the severity of this alert. The response should be structured as a JSON object with 'explanation', 'nextSteps' (an array of strings), and 'severity' (one of 'Low', 'Medium', 'High', 'Critical').`,
});

const aiMaintenanceAlertExplanationFlow = ai.defineFlow(
  {
    name: 'aiMaintenanceAlertExplanationFlow',
    inputSchema: AiMaintenanceAlertExplanationInputSchema,
    outputSchema: AiMaintenanceAlertExplanationOutputSchema,
  },
  async (input) => {
    const { output } = await aiMaintenanceAlertExplanationPrompt(input);
    return output!;
  }
);
