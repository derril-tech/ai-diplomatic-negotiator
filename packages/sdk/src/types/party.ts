import { z } from 'zod';

export const PartyRoleSchema = z.enum([
  'mediator',
  'delegate',
  'analyst',
  'observer'
]);

export const PartySchema = z.object({
  id: z.string(),
  name: z.string(),
  role: PartyRoleSchema,
  country: z.string().optional(),
  organization: z.string().optional(),
  email: z.string().email().optional(),
});

export type PartyRole = z.infer<typeof PartyRoleSchema>;
export type Party = z.infer<typeof PartySchema>;
