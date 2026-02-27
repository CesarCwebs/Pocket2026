
'use server';
/**
 * @fileOverview A Genkit flow for generating a daily operational summary of critical KPIs and urgent alerts.
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

const prompt = ai.definePrompt({
  name: 'aiOperationalDashboardSummaryPrompt',
  input: { schema: AiOperationalDashboardSummaryInputSchema },
  output: { schema: AiOperationalDashboardSummaryOutputSchema },
  prompt: `Generate a concise daily summary of the following ERP data. Focus on critical alerts and key performance metrics.

Data Overview:
- Equipment: {{equipmentSummary.available}} available, {{equipmentSummary.inMaintenance}} in maintenance.
- KPIs: Inventory value is {{generalKpis.inventoryValue}}, downtime rate is {{generalKpis.equipmentDowntimeRate}}%.
- Orders: {{generalKpis.activeOrders}} active orders.

Provide a high-level summary for management.`,
});

export async function getOperationalDashboardSummary(input: AiOperationalDashboardSummaryInput): Promise<AiOperationalDashboardSummaryOutput> {
  const { output } = await prompt(input);
  return output!;
}
