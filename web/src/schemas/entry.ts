import { z } from 'zod';

const entryDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const createEntrySchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    date: entryDateSchema,
});

export const updateEntrySchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    date: entryDateSchema.optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;

export interface JournalEntry {
    id: string;
    title: string | null;
    content: string;
    date: string;
    registeredAt: string;
    createdAt: string;
    updatedAt: string;
}
