import { z } from 'zod';

const entryDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const createEntrySchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    // 日付はUIで日だけ扱う。未指定の場合はサーバ側で当日を補完する
    date: entryDateSchema.optional(),
});

export const updateEntrySchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    date: entryDateSchema.optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
