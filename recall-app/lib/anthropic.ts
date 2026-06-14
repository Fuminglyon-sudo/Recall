import Anthropic from "@anthropic-ai/sdk";

export type DraftRequest = {
  front: string;
  deckName: string;
  deckDescription?: string | null;
};

export type DraftResponse = {
  definition: string;
  partOfSpeech: string;
  example: string;
  hook: string;
  synonyms: string[];
};

export async function generateCardDraft(input: DraftRequest): Promise<DraftResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return fallbackDraft(input);
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = `You are helping one person save a memory or vocabulary card. Return strict JSON with keys definition, partOfSpeech, example, hook, synonyms. The front of the card is: ${input.front}. The deck is ${input.deckName}. Optional deck context: ${input.deckDescription ?? "none"}. Keep tone plain, concrete, and warm. If this is founder/product language, explain it so the user can articulate what they built.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    temperature: 0.4,
    system: "Return only valid JSON. No markdown.",
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((item): item is Anthropic.TextBlock => item.type === "text")
    .map((item) => item.text)
    .join("\n");

  try {
    const parsed = JSON.parse(text) as DraftResponse;
    return {
      definition: parsed.definition ?? "",
      partOfSpeech: parsed.partOfSpeech ?? "",
      example: parsed.example ?? "",
      hook: parsed.hook ?? "",
      synonyms: Array.isArray(parsed.synonyms) ? parsed.synonyms : [],
    };
  } catch {
    return fallbackDraft(input);
  }
}

function fallbackDraft(input: DraftRequest): DraftResponse {
  return {
    definition: `A clear explanation of ${input.front} in simple language.`,
    partOfSpeech: input.deckName === "People I care about" ? "memory" : "noun",
    example: `I can explain ${input.front} naturally when it comes up in conversation.`,
    hook: `Link ${input.front} to a recent moment so it is easier to recall later.`,
    synonyms: input.deckName === "People I care about" ? [] : ["related idea", "plain meaning"],
  };
}
