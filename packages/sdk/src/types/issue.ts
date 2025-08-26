import { z } from 'zod';

export const IssueTypeSchema = z.enum([
  'distributive',
  'integrative',
  'linked'
]);

export const IssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: IssueTypeSchema,
  weight: z.number().min(0).max(100),
  minValue: z.number(),
  maxValue: z.number(),
  unit: z.string().optional(),
});

export type IssueType = z.infer<typeof IssueTypeSchema>;
export type Issue = z.infer<typeof IssueSchema>;
