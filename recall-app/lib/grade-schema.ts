import { z } from "zod";

// Shared with app/today/actions.ts — split out because "use server" files
// may only export async functions, so the schema can't live (or be tested)
// there directly.
export const gradeSchema = z.object({
  cardId: z.string().min(1),
  grade: z.coerce.number().int().min(0).max(5),
  association: z.string().max(1000).optional(),
  // Minutes from new Date().getTimezoneOffset() in the reviewer's browser —
  // lets the server compute "today" against the user's local calendar day
  // instead of its own (see lib/date.ts's startOfLocalDay). Defaults to 0
  // (UTC) so older clients that don't send it still work as before.
  tzOffsetMinutes: z.coerce.number().int().min(-720).max(840).optional().default(0),
});
