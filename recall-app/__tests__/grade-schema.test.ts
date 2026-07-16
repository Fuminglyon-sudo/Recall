import { gradeSchema } from "@/lib/grade-schema";

// Regression coverage for C4: gradeCard() used to do
// Number(formData.get("grade") ?? 0) with no bounds check, so a
// non-numeric grade became NaN and blew up the SM-2 date math deep
// inside a transaction. gradeSchema.safeParse() is what now stands
// between raw FormData and that math.

describe("gradeSchema", () => {
  test("accepts a valid integer grade as a string (FormData values are always strings)", () => {
    const result = gradeSchema.safeParse({ cardId: "card1", grade: "3" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.grade).toBe(3);
  });

  test("accepts the full valid range 0-5", () => {
    for (const g of [0, 1, 2, 3, 4, 5]) {
      const result = gradeSchema.safeParse({ cardId: "card1", grade: String(g) });
      expect(result.success).toBe(true);
    }
  });

  test("rejects a non-numeric grade instead of producing NaN", () => {
    const result = gradeSchema.safeParse({ cardId: "card1", grade: "not-a-number" });
    expect(result.success).toBe(false);
  });

  test("an empty string grade coerces to 0, not NaN", () => {
    // Number("") is 0, not NaN, so z.coerce.number() treats a blank grade
    // as a valid "blackout" grade rather than rejecting it — this is safe
    // either way since it can never reach the SM-2 math as NaN.
    const result = gradeSchema.safeParse({ cardId: "card1", grade: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.grade).toBe(0);
  });

  test("rejects a grade above the maximum", () => {
    const result = gradeSchema.safeParse({ cardId: "card1", grade: "6" });
    expect(result.success).toBe(false);
  });

  test("rejects a negative grade", () => {
    const result = gradeSchema.safeParse({ cardId: "card1", grade: "-1" });
    expect(result.success).toBe(false);
  });

  test("rejects a non-integer grade", () => {
    const result = gradeSchema.safeParse({ cardId: "card1", grade: "3.5" });
    expect(result.success).toBe(false);
  });

  test("rejects a missing cardId", () => {
    const result = gradeSchema.safeParse({ grade: "3" });
    expect(result.success).toBe(false);
  });

  test("rejects an empty cardId", () => {
    const result = gradeSchema.safeParse({ cardId: "", grade: "3" });
    expect(result.success).toBe(false);
  });

  test("association is optional", () => {
    const result = gradeSchema.safeParse({ cardId: "card1", grade: "3" });
    expect(result.success).toBe(true);
  });

  test("association beyond max length is rejected", () => {
    const result = gradeSchema.safeParse({
      cardId: "card1",
      grade: "3",
      association: "x".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  test("association at the max length is accepted", () => {
    const result = gradeSchema.safeParse({
      cardId: "card1",
      grade: "3",
      association: "x".repeat(1000),
    });
    expect(result.success).toBe(true);
  });
});
