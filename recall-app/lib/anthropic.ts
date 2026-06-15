import Anthropic from "@anthropic-ai/sdk";

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

function extractText(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((item): item is Anthropic.TextBlock => item.type === "text")
    .map((item) => item.text)
    .join("\n");
}

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

export type FounderBatchRequest = {
  product: "japa-reality" | "sharpen" | "custom";
  context: string;
  deckName: string;
};

export type FounderBatchCard = {
  front: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  hook: string;
  synonyms: string[];
  sourceContext: string;
};

export async function transcribeFounderAudio(file: File): Promise<string> {
  if (!client) {
    return "Audio transcription is unavailable without an Anthropic API key. Please paste a short founder context manually.";
  }

  return `Audio received: ${file.name}. Automatic transcription is not enabled in the current Anthropic messages setup yet, so please paste or lightly edit the spoken founder context manually before generating cards.`;
}

export async function generateCardDraft(input: DraftRequest): Promise<DraftResponse> {
  if (!client) return fallbackDraft(input);

  const prompt = `You are helping one person save a memory or vocabulary card. Return strict JSON with keys definition, partOfSpeech, example, hook, synonyms. The front of the card is: ${input.front}. The deck is ${input.deckName}. Optional deck context: ${input.deckDescription ?? "none"}. Keep tone plain, concrete, and warm. If this is founder/product language, explain it so the user can articulate what they built.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    temperature: 0.4,
    system: "Return only valid JSON. No markdown.",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(extractText(response.content)) as DraftResponse;
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

export async function generateFounderBatch(input: FounderBatchRequest): Promise<FounderBatchCard[]> {
  if (!client) return fallbackFounderBatch(input);

  const prompt = `You are helping a solo founder build practical vocabulary for speeches, product demos, investor conversations, networking, and founder storytelling. Return strict JSON as an array of 3 to 5 objects with keys front, definition, partOfSpeech, example, hook, synonyms, sourceContext. The product focus is ${input.product}. The target deck is ${input.deckName}. Use this context: ${input.context}. Choose words or short phrases that are useful in real conversation, not obscure academic vocabulary. Keep definitions plain-English and examples spoken, natural, and founder-relevant.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1400,
    temperature: 0.5,
    system: "Return only valid JSON. No markdown.",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(extractText(response.content)) as FounderBatchCard[];
    if (!Array.isArray(parsed)) return fallbackFounderBatch(input);

    return parsed.slice(0, 5).map((card) => ({
      front: card.front?.trim() || "Founder term",
      definition: card.definition?.trim() || "Definition to be completed.",
      partOfSpeech: card.partOfSpeech ?? "",
      example: card.example ?? "",
      hook: card.hook ?? "",
      synonyms: Array.isArray(card.synonyms) ? card.synonyms : [],
      sourceContext: card.sourceContext ?? input.context,
    }));
  } catch {
    return fallbackFounderBatch(input);
  }
}

export type PitchGradeRequest = {
  app: "japa-reality" | "sharpen" | "both";
  scenario: string;
  question: string;
  answer: string;
};

export type PitchGradeResponse = {
  score: number;
  strongPoints: string[];
  improvements: string[];
  modelAnswer: string;
};

export async function gradePitchAnswer(input: PitchGradeRequest): Promise<PitchGradeResponse> {
  if (!client) return fallbackGrade();

  const appContext =
    input.app === "japa-reality"
      ? 'Japa Reality is an app that helps Nigerians and Africans navigate the process of relocating abroad. "Japa" is Nigerian slang for leaving/escaping. The app covers visa processes, housing, jobs, community connections, and life abroad.'
      : input.app === "sharpen"
      ? "Sharpen is a vocabulary and professional-skills learning app that uses spaced repetition to help users retain and deploy words confidently in real conversations."
      : 'The founder is building two apps: Japa Reality (helps Africans navigate relocation abroad) and Sharpen (a spaced-repetition vocabulary and skills app).';

  const prompt = `You are evaluating a founder's spoken pitch answer. Context about their products: ${appContext}

Scenario setting: ${input.scenario}
Question asked: ${input.question}
Founder's answer: ${input.answer}

Score the answer on: clarity, specificity, confidence, differentiation, and memorability.

Return strict JSON with these exact keys:
- score: integer 1 to 10 (10 = polished, investor-ready; 1 = unclear or very incomplete)
- strongPoints: array of 1 to 3 short strings describing what they did well (be specific, cite their words)
- improvements: array of 1 to 4 short strings describing what to sharpen (be constructive and direct)
- modelAnswer: a 4 to 6 sentence model answer that is natural, confident, specific, and founder-authentic — write it in first person as if the founder is speaking`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 700,
    temperature: 0.4,
    system: "Return only valid JSON. No markdown. No preamble.",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(extractText(response.content)) as PitchGradeResponse;
    return {
      score: Math.min(10, Math.max(1, Math.round(Number(parsed.score)))),
      strongPoints: Array.isArray(parsed.strongPoints) ? parsed.strongPoints : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      modelAnswer: parsed.modelAnswer ?? "",
    };
  } catch {
    return fallbackGrade();
  }
}

function fallbackGrade(): PitchGradeResponse {
  return {
    score: 5,
    strongPoints: ["You gave an answer — that takes practice and courage."],
    improvements: [
      "Open with the specific problem you solve, not the product name.",
      "Add one concrete detail: a number, a user story, or a clear before/after.",
      "Close with a memorable hook or a statement of momentum.",
    ],
    modelAnswer:
      "We build [product] for [specific person] who is frustrated by [specific problem]. What makes us different is [key differentiator]. We have already [early traction or proof]. The reason I built this is [personal conviction or insight].",
  };
}

export async function phraseInVoice(text: string, tone: string): Promise<string> {
  if (!client) return text;

  const systemPrompt = tone
    ? `You are a ghostwriter who matches a person's exact voice. Return only the rephrased text — no explanations, no quotes, no preamble, no markdown.\n\nHere is how they sound:\n${tone}`
    : "You are a ghostwriter. Rephrase the text to be clear, direct, and confident. Return only the rephrased text — no explanations, no quotes, no preamble.";

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    temperature: 0.6,
    system: systemPrompt,
    messages: [{ role: "user", content: text }],
  });

  return extractText(response.content).trim();
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

function fallbackFounderBatch(input: FounderBatchRequest): FounderBatchCard[] {
  const label = input.product === "japa-reality" ? "Japa Reality" : input.product === "sharpen" ? "Sharpen" : "your founder context";

  return [
    {
      front: "positioning",
      definition: "How you clearly place your product in the mind of the listener so they understand what it is, who it is for, and why it matters.",
      partOfSpeech: "noun",
      example: `When I explain ${label}, I lead with clear positioning so people quickly understand the value.`,
      hook: "Positioning is the mental shelf your product occupies.",
      synonyms: ["framing", "market placement"],
      sourceContext: input.context,
    },
    {
      front: "traction",
      definition: "Evidence that people are responding to the product in a meaningful way, such as usage, retention, revenue, or strong interest.",
      partOfSpeech: "noun",
      example: `I talk about traction to show that the product is not just an idea but something users are actually leaning into.`,
      hook: "Traction means the wheels are gripping the road.",
      synonyms: ["momentum", "adoption"],
      sourceContext: input.context,
    },
    {
      front: "credibility",
      definition: "The quality of sounding trustworthy, grounded, and believable when describing what you built and why it works.",
      partOfSpeech: "noun",
      example: `Specific examples and clear product language increase my credibility when I speak about the company.`,
      hook: "Credibility is earned clarity.",
      synonyms: ["trustworthiness", "authority"],
      sourceContext: input.context,
    },
  ];
}
