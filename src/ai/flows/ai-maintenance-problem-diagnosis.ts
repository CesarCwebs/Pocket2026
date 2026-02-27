'use server';
/**
 * @fileOverview An AI agent that suggests probable causes and troubleshooting steps for equipment issues.
 *
 * - aiMaintenanceProblemDiagnosis - A function that handles the diagnosis process.
 * - EquipmentSymptomsInput - The input type for the aiMaintenanceProblemDiagnosis function.
 * - MaintenanceProblemDiagnosisOutput - The return type for the aiMaintenanceProblemDiagnosis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EquipmentSymptomsInputSchema = z.object({
  equipmentType: z.string().describe('The type of equipment experiencing the issue, e.g., "forklift", "CNC machine".'),
  symptoms: z.string().describe('A detailed description of the symptoms observed for the equipment issue.'),
});
export type EquipmentSymptomsInput = z.infer<typeof EquipmentSymptomsInputSchema>;

const MaintenanceProblemDiagnosisOutputSchema = z.object({
  probableCauses: z.array(z.string()).describe('A list of probable causes for the reported equipment symptoms.'),
  troubleshootingSteps: z.array(z.string()).describe('A list of potential troubleshooting steps to diagnose and resolve the issue.'),
});
export type MaintenanceProblemDiagnosisOutput = z.infer<typeof MaintenanceProblemDiagnosisOutputSchema>;

export async function aiMaintenanceProblemDiagnosis(input: EquipmentSymptomsInput): Promise<MaintenanceProblemDiagnosisOutput> {
  return maintenanceProblemDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'maintenanceProblemDiagnosisPrompt',
  input: { schema: EquipmentSymptomsInputSchema },
  output: { schema: MaintenanceProblemDiagnosisOutputSchema },
  prompt: `You are an expert maintenance technician specializing in diagnosing equipment issues.
Given the equipment type and reported symptoms, provide a list of probable causes and a list of troubleshooting steps.

Equipment Type: {{{equipmentType}}}
Symptoms: {{{symptoms}}}

Provide your response in a structured JSON format with two fields: 'probableCauses' as an array of strings, and 'troubleshootingSteps' as an array of strings.`,
});

const maintenanceProblemDiagnosisFlow = ai.defineFlow(
  {
    name: 'maintenanceProblemDiagnosisFlow',
    inputSchema: EquipmentSymptomsInputSchema,
    outputSchema: MaintenanceProblemDiagnosisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
