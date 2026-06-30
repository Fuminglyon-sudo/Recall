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

function pitchAppContext(app: "japa-reality" | "sharpen" | "both"): string {
  if (app === "japa-reality")
    return 'Japa Reality is an app that helps Nigerians and Africans navigate the process of relocating abroad. "Japa" is Nigerian slang for leaving or escaping. The app covers visa processes, housing, jobs, community connections, and life abroad.';
  if (app === "sharpen")
    return "Sharpen is a vocabulary and professional-skills learning app that uses spaced repetition to help users retain and deploy words confidently in real conversations.";
  return "The founder is building two apps: Japa Reality (helps Africans navigate relocation abroad) and Sharpen (a spaced-repetition vocabulary and skills app).";
}

export type ConversationMessage = {
  role: "interviewer" | "founder";
  content: string;
};

export type ConversationRequest = {
  app: "japa-reality" | "sharpen" | "both";
  scenario: string;
  messages: ConversationMessage[];
  exchangeCount: number;
  forceEnd?: boolean;
};

export type ConversationStep =
  | { type: "followup"; followupQuestion: string }
  | { type: "final"; score: number; strongPoints: string[]; improvements: string[]; modelAnswer: string };

export async function conductPitchConversation(input: ConversationRequest): Promise<ConversationStep> {
  if (!client) return fallbackStep(input.exchangeCount);

  const appContext = pitchAppContext(input.app);
  const history = input.messages
    .map((m) => `${m.role === "interviewer" ? "Interviewer" : "Founder"}: ${m.content}`)
    .join("\n\n");

  const mustEnd = input.forceEnd === true || input.exchangeCount >= 5;

  const decisionBlock = mustEnd
    ? `This is the final exchange. You must return type "final" with a full evaluation.`
    : `Exchange count so far: ${input.exchangeCount} of 5 maximum.

Decide whether to ask ONE follow-up question or wrap up and evaluate.
Ask a follow-up if the last founder answer:
  - contained a vague or unsubstantiated claim worth probing ("we help people" — who exactly?)
  - skipped a key topic: the problem, differentiation, traction, or how it actually works
  - invited a natural "tell me more" (e.g., mentioned a feature without explaining the impact)

Do NOT ask a follow-up if:
  - the answer was specific, clear, and covered the topic well
  - you have already asked 3 or more follow-ups
  - the conversation feels naturally complete`;

  const prompt = `You are the person described in this scenario: ${input.scenario}

Product context for evaluation: ${appContext}

Conversation so far:
${history}

${decisionBlock}

Return strict JSON. Include ALL fields relevant to your chosen type:

If type is "followup":
  { "type": "followup", "followupQuestion": "short direct question you would naturally ask next, staying in character" }

If type is "final":
  {
    "type": "final",
    "score": integer 1–10 based on the WHOLE conversation (clarity, specificity, confidence, differentiation, memorability),
    "strongPoints": array of 1–3 short strings citing specific things they did well,
    "improvements": array of 1–4 short strings on what to sharpen,
    "modelAnswer": "4–6 sentence first-person model answer showing how the opening question could have been answered ideally, incorporating the best threads from the conversation"
  }`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 700,
    temperature: 0.5,
    system: "Return only valid JSON. No markdown. No preamble.",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(extractText(response.content)) as ConversationStep;
    if (!mustEnd && parsed.type === "followup") {
      const q = (parsed as { type: "followup"; followupQuestion: string }).followupQuestion;
      return { type: "followup", followupQuestion: q ?? "Tell me more about that." };
    }
    const p = parsed as { type: "final"; score: number; strongPoints: string[]; improvements: string[]; modelAnswer: string };
    return {
      type: "final",
      score: Math.min(10, Math.max(1, Math.round(Number(p.score)))),
      strongPoints: Array.isArray(p.strongPoints) ? p.strongPoints : [],
      improvements: Array.isArray(p.improvements) ? p.improvements : [],
      modelAnswer: p.modelAnswer ?? "",
    };
  } catch {
    return fallbackStep(input.exchangeCount);
  }
}

function fallbackStep(exchangeCount: number): ConversationStep {
  if (exchangeCount < 2) {
    return {
      type: "followup",
      followupQuestion: "That's interesting — can you tell me more specifically who your core user is and what they struggle with before finding your app?",
    };
  }
  return {
    type: "final",
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

// ── Sentence challenge ────────────────────────────────────────────────────────

export type SentenceScenario = { scenario: string };

export type SentenceGrade = {
  score: number;
  correct: boolean;
  feedback: string;
  betterSentence: string;
};

export async function generateSentenceScenario(
  word: string,
  definition: string
): Promise<SentenceScenario> {
  if (!client) {
    return { scenario: `You are in a professional conversation where using the word "${word}" would fit naturally.` };
  }

  const prompt = `Write a 2-3 sentence realistic scenario (a professional or social situation) where someone would naturally use the word "${word}" (meaning: ${definition}). The scenario should feel grounded — like an investor pitch, networking event, product meeting, or startup conversation. End with one short prompt asking the person to write a sentence using "${word}". Return strict JSON: { "scenario": "..." }`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    temperature: 0.6,
    system: "Return only valid JSON. No markdown.",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(extractText(response.content)) as SentenceScenario;
    return { scenario: parsed.scenario ?? `Use "${word}" naturally in a sentence below.` };
  } catch {
    return { scenario: `You are explaining your product to a potential partner. Use the word "${word}" in your explanation.` };
  }
}

export async function gradeSentenceUsage(input: {
  word: string;
  definition: string;
  scenario: string;
  userSentence: string;
}): Promise<SentenceGrade> {
  if (!client) {
    return { score: 3, correct: true, feedback: "Your sentence looks reasonable. Keep practising.", betterSentence: `A strong sentence would use "${input.word}" clearly and in natural context.` };
  }

  const prompt = `Grade how well this person used the word "${input.word}" (definition: ${input.definition}).

Scenario given to them:
${input.scenario}

Their sentence:
"${input.userSentence}"

Evaluate: correct meaning, natural fit in the scenario, confidence and clarity of usage.

Return strict JSON:
{
  "score": integer 1-5 (1 = incorrect, 3 = correct but awkward, 5 = excellent natural usage),
  "correct": boolean (true if the core meaning is used correctly),
  "feedback": "1-2 sentences: what they did well or what went wrong",
  "betterSentence": "a model sentence showing ideal usage of the word in this scenario"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    temperature: 0.3,
    system: "Return only valid JSON. No markdown.",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(extractText(response.content)) as SentenceGrade;
    return {
      score: Math.min(5, Math.max(1, Math.round(Number(parsed.score)))),
      correct: Boolean(parsed.correct),
      feedback: parsed.feedback ?? "Good attempt.",
      betterSentence: parsed.betterSentence ?? `A strong sentence uses "${input.word}" with clear intent.`,
    };
  } catch {
    return { score: 3, correct: true, feedback: "Your sentence looks reasonable.", betterSentence: `Use "${input.word}" clearly in context to show command of the word.` };
  }
}

// ── Social skills conversation ────────────────────────────────────────────────

export type SocialMessage = {
  role: "user" | "character";
  content: string;
};

export type SocialConversationRequest = {
  scenarioContext: string;
  characterType: string;
  characterPrompt: string;
  messages: SocialMessage[];
  exchangeCount: number;
  forceEnd?: boolean;
};

export type SocialConversationStep =
  | { type: "response"; message: string }
  | {
      type: "feedback";
      score: number;
      strongPoints: string[];
      improvements: string[];
      powerMove: string;
      modelConversation?: Array<{ role: "user" | "character"; content: string }>;
    };

export async function conductSocialConversation(
  input: SocialConversationRequest
): Promise<SocialConversationStep> {
  if (!client) return fallbackSocialStep(input.exchangeCount);

  const history = input.messages
    .map((m) =>
      m.role === "user"
        ? `Person practicing: ${m.content}`
        : `You (${input.characterType}): ${m.content}`
    )
    .join("\n\n");

  const mustEnd = input.forceEnd === true || input.exchangeCount >= 7;

  if (mustEnd) {
    const prompt = `You were playing this character in a social scenario.

Character: ${input.characterType}
Character traits: ${input.characterPrompt}
Scenario: ${input.scenarioContext}

Full conversation:
${history}

Now break character and give coaching feedback on how the person handled this social interaction.
Evaluate across: how they opened, showed genuine curiosity, kept it going naturally, built rapport, and came across as confident and interesting.

Return strict JSON with ALL of these fields:
{
  "type": "feedback",
  "score": integer 1-10 (1 = very uncomfortable, 10 = effortlessly natural),
  "strongPoints": ["1-3 specific things they did well in this conversation"],
  "improvements": ["1-3 specific things to work on"],
  "powerMove": "one concrete technique or phrase they can try next time to immediately level up their conversation game",
  "modelConversation": only include this field if score is 8 or below — an array of message objects showing how this conversation could have ideally gone from start to finish. Write the user lines showing confident, natural, curious conversation. Write the character lines as they would realistically respond to those better inputs. Keep each message 1-3 sentences. Aim for 4-8 exchanges total showing a natural arc. Format: [{ "role": "user", "content": "..." }, { "role": "character", "content": "..." }, ...]. If score is 9 or 10, omit this field entirely.
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1600,
      temperature: 0.4,
      system: "Return only valid JSON. No markdown. No preamble.",
      messages: [{ role: "user", content: prompt }],
    });

    try {
      const parsed = JSON.parse(extractText(response.content)) as {
        type: "feedback";
        score: number;
        strongPoints: string[];
        improvements: string[];
        powerMove: string;
        modelConversation?: Array<{ role: "user" | "character"; content: string }>;
      };
      const score = Math.min(10, Math.max(1, Math.round(Number(parsed.score))));
      return {
        type: "feedback",
        score,
        strongPoints: Array.isArray(parsed.strongPoints) ? parsed.strongPoints : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        powerMove:
          parsed.powerMove ??
          "Try the observation + question formula: make a genuine comment about something in the shared moment, then ask one open question that can't be answered with just yes or no.",
        modelConversation:
          score <= 8 && Array.isArray(parsed.modelConversation)
            ? parsed.modelConversation
            : undefined,
      };
    } catch {
      return fallbackSocialStep(input.exchangeCount);
    }
  }

  const prompt = `You are playing this character in a social scenario.

Character type: ${input.characterType}
Your personality: ${input.characterPrompt}
Scenario: ${input.scenarioContext}

Conversation so far:
${history}

Respond naturally as this character would right now.
- Keep your reply to 1-3 sentences
- Be realistic — not overly helpful or warm unless that is your character
- React specifically to what was just said, not generically
- Occasionally ask a natural follow-up question back (real conversations go both ways)
- Remember: this person is a stranger to you

Return strict JSON: { "type": "response", "message": "your in-character reply" }`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    temperature: 0.7,
    system: "Return only valid JSON. No markdown. No preamble.",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(extractText(response.content)) as { type: "response"; message: string };
    return { type: "response", message: parsed.message ?? "Mm. Interesting." };
  } catch {
    return { type: "response", message: "Interesting. Tell me more." };
  }
}

function fallbackSocialStep(exchangeCount: number): SocialConversationStep {
  if (exchangeCount < 7) {
    return { type: "response", message: "That's interesting. What brings you here?" };
  }
  return {
    type: "feedback",
    score: 6,
    strongPoints: ["You initiated the conversation — that is always the hardest step."],
    improvements: [
      "Ask open questions that invite more than a yes or no answer.",
      "Find a natural reason to share something about yourself after asking about them.",
    ],
    powerMove:
      "Try the observation + question formula: make a genuine comment about something in the shared moment, then ask one open question about the other person.",
  };
}

// ── Speak Up (everyday communication practice) ───────────────────────────────

export type SpeakUpRequest = {
  scenario: string;
  personaPrompt: string;
  difficulty: "easy" | "medium" | "hard";
  messages: Array<{ role: "speaker" | "listener"; content: string }>;
  exchangeCount: number;
  forceEnd?: boolean;
};

export async function conductSpeakUpConversation(input: SpeakUpRequest): Promise<ConversationStep> {
  if (!client) return speakUpFallback(input.exchangeCount);

  const difficultyGuide = {
    easy: "Be warm and receptive. Accept their first answer and gently invite them to say more. Be encouraging.",
    medium: "Be engaged but honest. If something is vague or unclear, ask for a bit more. Push gently when the answer could be stronger.",
    hard: "Be discerning. You need specifics and authenticity to be satisfied. Push back when answers are too vague or feel rehearsed. Not harsh — just real.",
  }[input.difficulty];

  const history = input.messages
    .map((m) => `${m.role === "speaker" ? "Them" : "You"}: ${m.content}`)
    .join("\n\n");

  const mustEnd = input.forceEnd === true || input.exchangeCount >= 4;

  const decisionBlock = mustEnd
    ? `This is the final exchange. Return type "final" with a complete evaluation.`
    : `Exchange ${input.exchangeCount} of 4 maximum.

Decide: respond naturally (type "followup") OR wrap up with feedback (type "final").
Ask a follow-up if their answer was vague, skipped the core point, or could go deeper with one more prompt.
Wrap up if they gave a clear, genuine, specific answer — or if you have asked 2+ follow-ups already.`;

  const prompt = `You are this person: ${input.personaPrompt}

Scenario: ${input.scenario}

How you behave: ${difficultyGuide}

Conversation so far:
${history}

${decisionBlock}

Return strict JSON only:

Continuing: { "type": "followup", "followupQuestion": "your natural response or question — stay in character, keep it short" }

Wrapping up:
{
  "type": "final",
  "score": integer 1–10 (rate: clarity, authenticity, specificity, confidence, emotional resonance),
  "strongPoints": ["1–3 things that landed well — be specific"],
  "improvements": ["1–3 concrete things to sharpen"],
  "modelAnswer": "3–5 sentence ideal version of how they could have answered the original question — natural, human, specific, memorable"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 650,
    temperature: 0.55,
    system: "Return only valid JSON. No markdown. No preamble.",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(extractText(response.content)) as ConversationStep;
    if (!mustEnd && parsed.type === "followup") {
      const q = (parsed as { type: "followup"; followupQuestion: string }).followupQuestion;
      return { type: "followup", followupQuestion: q ?? "Tell me more about that." };
    }
    const p = parsed as { type: "final"; score: number; strongPoints: string[]; improvements: string[]; modelAnswer: string };
    return {
      type: "final",
      score: Math.min(10, Math.max(1, Math.round(Number(p.score)))),
      strongPoints: Array.isArray(p.strongPoints) ? p.strongPoints : [],
      improvements: Array.isArray(p.improvements) ? p.improvements : [],
      modelAnswer: p.modelAnswer ?? "",
    };
  } catch {
    return speakUpFallback(input.exchangeCount);
  }
}

function speakUpFallback(exchangeCount: number): ConversationStep {
  if (exchangeCount < 2) {
    return { type: "followup", followupQuestion: "That's interesting — can you tell me a bit more about that?" };
  }
  return {
    type: "final",
    score: 5,
    strongPoints: ["You gave an answer — that takes courage."],
    improvements: [
      "Open with something specific — a detail, a number, or a real moment.",
      "Make the other person feel something, not just understand something.",
      "End on the thing you most want them to remember.",
    ],
    modelAnswer:
      "I [brief specific context about who I am / what I do / what happened]. The reason I [did it / feel this way / made this choice] is [genuine honest reason]. What I've learned from it is [one real insight]. I'd say the thing I want people to understand most is [core message].",
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
