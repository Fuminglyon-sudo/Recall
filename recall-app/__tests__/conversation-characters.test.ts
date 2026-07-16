import { CHARACTER_IDS, CHARACTER_LABELS, buildCharacterPrompt } from "@/lib/conversation-characters";

describe("conversation character registry", () => {
  test("every character id has a label", () => {
    for (const id of CHARACTER_IDS) {
      expect(typeof CHARACTER_LABELS[id]).toBe("string");
      expect(CHARACTER_LABELS[id].length).toBeGreaterThan(0);
    }
  });

  test("buildCharacterPrompt returns non-empty text for every id and difficulty", () => {
    const difficulties = ["easy", "medium", "hard"] as const;
    for (const id of CHARACTER_IDS) {
      for (const difficulty of difficulties) {
        const prompt = buildCharacterPrompt(id, difficulty);
        expect(typeof prompt).toBe("string");
        expect(prompt.length).toBeGreaterThan(20);
      }
    }
  });

  test("difficulty modifier text changes the prompt", () => {
    const easy = buildCharacterPrompt("introvert", "easy");
    const hard = buildCharacterPrompt("introvert", "hard");
    expect(easy).not.toBe(hard);
    expect(easy).toContain("Easy");
    expect(hard).toContain("Hard");
  });

  test("tension is appended when provided, omitted when not", () => {
    const withTension = buildCharacterPrompt("guarded", "medium", "They just found out you were late on purpose.");
    const withoutTension = buildCharacterPrompt("guarded", "medium");
    expect(withTension).toContain("They just found out you were late on purpose.");
    expect(withoutTension).not.toContain("hidden context");
  });

  test("prompts are distinct per character", () => {
    const prompts = CHARACTER_IDS.map((id) => buildCharacterPrompt(id, "medium"));
    expect(new Set(prompts).size).toBe(CHARACTER_IDS.length);
  });
});
