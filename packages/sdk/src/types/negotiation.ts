import { z } from 'zod';

export const NegotiationStatusSchema = z.enum([
  'draft',
  'active',
  'paused',
  'completed',
  'cancelled'
]);

export const NegotiationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: NegotiationStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  parties: z.array(z.string()),
  issues: z.array(z.string()),
});

export type NegotiationStatus = z.infer<typeof NegotiationStatusSchema>;
export type Negotiation = z.infer<typeof NegotiationSchema>;
