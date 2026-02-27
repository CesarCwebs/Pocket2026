'use server';
/**
 * @fileOverview A Genkit flow for generating a daily operational summary of critical KPIs and urgent alerts.
 *
 * - getOperationalDashboardSummary - A function that generates the operational summary.
 * - AiOperationalDashboardSummaryInput - The input type for the getOperationalDashboardSummary function.
 * - AiOperationalDashboardSummaryOutput - The return type for the getOperationalDashboardSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiOperationalDashboardSummaryInputSchema = z.object({
  equipmentSummary: z.object({
    available: z.number().describe('Number of available equipment units.'),
    inMaintenance: z.number().describe('Number of equipment units currently in maintenance.'),
    decommissioned: z.number().describe('Number of decommissioned equipment units.'),
  }).describe('Summary of equipment status.'),
  stockAlerts: z.array(z.object({
    sku: z.string().describe('Stock Keeping Unit.'),
    description: z.string().describe('Description of the item.'),
    currentStock: z.number().describe('Current stock level.'),
    minStock: z.number().describe('Minimum required stock level.'),
  })).describe('List of items currently below minimum stock levels.').optional().default([]),
  workOrderSummary: z.object({
    open: z.number().describe('Number of open work orders.'),
    inProgress: z.number().describe('Number of work orders currently in progress.'),
    overdue: z.number().describe('Number of overdue work orders.'),
  }).describe('Summary of work order status.'),
  logisticsAlerts: z.array(z.object({
    documentId: z.string().describe('ID of the logistics document.'),
    type: z.enum(['delivery', 'pickup']).describe('Type of logistics operation.'),
    status: z.string().describe('Status indicating warning or critical issue (e.g., "Warning", "Critical").'),
    description: z.string().describe('Brief description of the alert.'),
  })).describe('List of logistics operations with warning or critical issues.').optional().default([]),
  generalKpis: z.object({
    inventoryValue: z.number().describe('Total monetary value of current inventory.'),
    equipmentDowntimeRate: z.number().describe('Percentage of equipment downtime.'),
    activeOrders: z.number().describe('Number of currently active customer orders.'),
  }).describe('General key performance indicators.'),
}).describe('Input data for generating the operational dashboard summary.');

export type AiOperationalDashboardSummaryInput = z.infer<typeof AiOperationalDashboardSummaryInputSchema>;

const AiOperationalDashboardSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise AI-generated summary of critical operational KPIs and urgent alerts.'),
}).describe('Output containing the AI-generated operational summary.');

export type AiOperationalDashboardSummaryOutput = z.infer<typeof AiOperationalDashboardSummaryOutputSchema>;

export async function getOperationalDashboardSummary(input: AiOperationalDashboardSummaryInput): Promise<AiOperationalDashboardSummaryOutput> {
  return aiOperationalDashboardSummaryFlow(input);
}

const aiOperationalDashboardSummaryPrompt = ai.definePrompt({
  name: 'aiOperationalDashboardSummaryPrompt',
  input: { schema: AiOperationalDashboardSummaryInputSchema },
  output: { schema: AiOperationalDashboardSummaryOutputSchema },
  prompt: `You are an AI assistant tasked with generating a daily operational summary for a manager.
Your goal is to provide a concise overview of critical KPIs and urgent alerts from the ERP system, helping the manager quickly understand the system's status and prioritize their focus.

Focus on actionable insights and highlight any items that require immediate attention.

Here is the operational data:

Equipment Summary:
- Available: {{{equipmentSummary.available}}}
- In Maintenance: {{{equipmentSummary.inMaintenance}}}
- Decommissioned: {{{equipmentSummary.decommissioned}}}

Stock Alerts (items below minimum stock):
{{#if stockAlerts}}
{{#each stockAlerts}}
- SKU: {{{sku}}}, Description: {{{description}}}, Current Stock: {{{currentStock}}}, Minimum Stock: {{{minStock}}}
{{/each}}
{{else}}
None
{{/if}}

Work Order Summary:
- Open: {{{workOrderSummary.open}}}
- In Progress: {{{workOrderSummary.inProgress}}}
- Overdue: {{{workOrderSummary.overdue}}}

Logistics Alerts (deliveries/pickups with warnings or critical issues):
{{#if logisticsAlerts}}
{{#each logisticsAlerts}}
- Document ID: {{{documentId}}}, Type: {{{type}}}, Status: {{{status}}}, Description: {{{description}}}
{{/each}}
{{else}}
None
{{/if}}

General KPIs:
- Total Inventory Value: \${{{generalKpis.inventoryValue}}}
- Equipment Downtime Rate: {{{generalKpis.equipmentDowntimeRate}}}%
- Active Orders: {{{generalKpis.activeOrders}}}

Please provide a summary highlighting critical operational KPIs and urgent alerts. Keep it concise and focus on what's most important for a manager to know at a glance. Start directly with the summary, without any introductory phrases like "Here is your summary." or "Daily Operational Summary:".`,
});

const aiOperationalDashboardSummaryFlow = ai.defineFlow(
  {
    name: 'aiOperationalDashboardSummaryFlow',
    inputSchema: AiOperationalDashboardSummaryInputSchema,
    outputSchema: AiOperationalDashboardSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await aiOperationalDashboardSummaryPrompt(input);
    return output!;
  }
);
