
'use server';
/**
 * @fileOverview A Genkit flow for generating a daily operational summary of critical KPIs and urgent alerts.
 *
 * - getOperationalDashboardSummary - A function that handles the generation of the summary.
 * - AiOperationalDashboardSummaryInput - The input type for the summary flow.
 * - AiOperationalDashboardSummaryOutput - The return type for the summary flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiOperationalDashboardSummaryInputSchema = z.object({
  equipmentSummary: z.object({
    available: z.number(),
    inMaintenance: z.number(),
    decommissioned: z.number(),
  }),
  stockAlerts: z.array(z.object({
    sku: z.string(),
    description: z.string(),
    currentStock: z.number(),
    minStock: z.number(),
  })).optional().default([]),
  workOrderSummary: z.object({
    open: z.number(),
    inProgress: z.number(),
    overdue: z.number(),
  }),
  logisticsAlerts: z.array(z.object({
    documentId: z.string(),
    type: z.enum(['delivery', 'pickup']),
    status: z.string(),
    description: z.string(),
  })).optional().default([]),
  generalKpis: z.object({
    inventoryValue: z.number(),
    equipmentDowntimeRate: z.number(),
    activeOrders: z.number(),
  }),
});

export type AiOperationalDashboardSummaryInput = z.infer<typeof AiOperationalDashboardSummaryInputSchema>;

const AiOperationalDashboardSummaryOutputSchema = z.object({
  summary: z.string(),
});

export type AiOperationalDashboardSummaryOutput = z.infer<typeof AiOperationalDashboardSummaryOutputSchema>;

const aiOperationalDashboardSummaryPrompt = ai.definePrompt({
  name: 'aiOperationalDashboardSummaryPrompt',
  input: { schema: AiOperationalDashboardSummaryInputSchema },
  output: { schema: AiOperationalDashboardSummaryOutputSchema },
  prompt: `You are an expert operations manager. Analyze the following ERP data and generate a concise daily operational summary.

Focus on:
1. Equipment Status: Mention availability and maintenance needs.
2. Inventory/Stock Alerts: Highlight critical low-stock items.
3. Work Orders: Summary of open and in-progress tasks.
4. Logistics: Urgent delivery or pickup alerts.
5. General KPIs: Inventory value and downtime rates.

Data Summary:
- Equipment: {{equipmentSummary.available}} available, {{equipmentSummary.inMaintenance}} in maintenance.
- Work Orders: {{workOrderSummary.open}} open, {{workOrderSummary.inProgress}} in progress.
- Active Orders: {{generalKpis.activeOrders}}

General KPIs:
- Total Inventory Value: \${{{generalKpis.inventoryValue}}}
- Equipment Downtime Rate: {{{generalKpis.equipmentDowntimeRate}}}%

Please provide a summary highlighting critical operational KPIs and urgent alerts. Keep it concise and focus on what's most important for a manager to know at a glance. Start directly with the summary, without any introductory phrases.`,
});

export async function getOperationalDashboardSummary(input: AiOperationalDashboardSummaryInput): Promise<AiOperationalDashboardSummaryOutput> {
  const { output } = await aiOperationalDashboardSummaryPrompt(input);
  return output!;
}
