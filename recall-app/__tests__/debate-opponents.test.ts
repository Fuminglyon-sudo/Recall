import { OPPONENT_IDS, OPPONENT_LABELS, buildOpponentPrompt } from "@/lib/debate-opponents";

describe("debate opponent registry", () => {
  test("every opponent id has a label", () => {
    for (const id of OPPONENT_IDS) {
      expect(typeof OPPONENT_LABELS[id]).toBe("string");
      expect(OPPONENT_LABELS[id].length).toBeGreaterThan(0);
    }
  });

  test("buildOpponentPrompt returns non-empty prompt text for every id and difficulty", () => {
    const difficulties = ["easy", "medium", "hard"] as const;
    for (const id of OPPONENT_IDS) {
      for (const difficulty of difficulties) {
        const prompt = buildOpponentPrompt(id, difficulty);
        expect(typeof prompt).toBe("string");
        expect(prompt.length).toBeGreaterThan(20);
      }
    }
  });

  test("difficulty modifier text changes the prompt", () => {
    const easy = buildOpponentPrompt("skeptic", "easy");
    const hard = buildOpponentPrompt("skeptic", "hard");
    expect(easy).not.toBe(hard);
    expect(easy).toContain("Easy");
    expect(hard).toContain("Hard");
  });

  test("the base persona text is shared across difficulties for the same opponent", () => {
    const easy = buildOpponentPrompt("idealist", "easy");
    const medium = buildOpponentPrompt("idealist", "medium");
    // Both should start with the same persona description before the
    // difficulty modifier is appended.
    const sharedPrefixLength = 50;
    expect(easy.slice(0, sharedPrefixLength)).toBe(medium.slice(0, sharedPrefixLength));
  });

  test("prompt never leaks a difficulty modifier for a different difficulty", () => {
    const prompt = buildOpponentPrompt("pragmatist", "medium");
    expect(prompt).not.toContain("Easy —");
    expect(prompt).not.toContain("Hard —");
  });
});
