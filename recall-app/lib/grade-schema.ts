import { z } from "zod";

// Shared with app/today/actions.ts — split out because "use server" files
// may only export async functions, so the schema can't live (or be tested)
// there directly.
export const gradeSchema = z.object({
  cardId: z.string().min(1),
  grade: z.coerce.number().int().min(0).max(5),
  association: z.string().max(1000).optional(),
});
