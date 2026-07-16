import { PERSONA_IDS, PERSONA_LABELS, getPersonaPrompt } from "@/lib/speak-up-personas";

describe("speak-up persona registry", () => {
  test("every persona id has a label", () => {
    for (const id of PERSONA_IDS) {
      expect(typeof PERSONA_LABELS[id]).toBe("string");
      expect(PERSONA_LABELS[id].length).toBeGreaterThan(0);
    }
  });

  test("every persona id has a non-empty prompt", () => {
    for (const id of PERSONA_IDS) {
      const prompt = getPersonaPrompt(id);
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(20);
    }
  });

  test("prompts are distinct per persona", () => {
    const prompts = PERSONA_IDS.map((id) => getPersonaPrompt(id));
    expect(new Set(prompts).size).toBe(PERSONA_IDS.length);
  });
});
