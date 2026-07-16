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
  | { type: "final"; score: number; strongPoints: string[]; improvements: string[]; modelAnswer: string; modelConversation?: Array<{ role: "speaker" | "listener"; content: string }> };

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
  practiceGoal?: string;
};

export type SocialConversationStep =
  | { type: "response"; message: string }
  | {
      type: "feedback";
      score: number;
      strongPoints: string[];
      improvements: string[];
      powerMove: string;
      turningPoint?: string;
      modelConversation?: Array<{ role: "user" | "character"; content: string }>;
      modelOptions?: string[][];
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
${input.practiceGoal ? `Their practice focus for this session: ${input.practiceGoal}. Weight your feedback and scoring toward this skill.\n` : ""}Evaluate across: how they opened, showed genuine curiosity, kept it going naturally, built rapport, and came across as confident and interesting.

Return strict JSON with ALL of these fields:
{
  "type": "feedback",
  "score": integer 1-10 (1 = very uncomfortable, 10 = effortlessly natural),
  "strongPoints": ["1-2 items — each must cite a specific phrase or moment from the conversation that showed strong social skill. Format: quote the phrase or describe the moment, then one sentence on why it worked."],
  "improvements": ["1-2 items — each must: (1) quote or describe the specific phrase or moment that weakened the connection, (2) say briefly what went wrong, (3) give a revised version showing how it could have played better"],
  "powerMove": "one concrete technique or phrase they can try next time — make it specific to what actually happened in this conversation, not generic advice",
  "turningPoint": "one sentence identifying the exact exchange or moment where the conversation either clicked or fell flat — be specific about what was said and why it shifted things",
  "modelConversation": only include this field if score is 8 or below — an array of message objects showing how this conversation could have ideally gone from start to finish. Write the user lines showing confident, natural, curious conversation. Write the character lines as they would realistically respond to those better inputs. Keep each message 1-3 sentences. Aim for 4-8 exchanges total showing a natural arc. Format: [{ "role": "user", "content": "..." }, { "role": "character", "content": "..." }, ...]. If score is 9 or 10, omit this field entirely.
  "modelOptions": only include if modelConversation is included — for each user turn in modelConversation (one entry per user turn, in order), provide exactly 3 alternative phrasings the user could have said, each with a slightly different tone or approach (e.g., warmer, more direct, more curious). These let the user pick whichever sounds most like them for a guided replay. Format: array of arrays, one per user turn: [["option A", "option B", "option C"], ["option A", "option B", "option C"], ...]. Each option 1-2 sentences. Include the same number of inner arrays as there are user turns in modelConversation. Omit entirely if modelConversation is omitted.
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
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
        turningPoint?: string;
        modelConversation?: Array<{ role: "user" | "character"; content: string }>;
        modelOptions?: unknown[][];
      };
      const score = Math.min(10, Math.max(1, Math.round(Number(parsed.score))));
      const modelConversation =
        score <= 8 && Array.isArray(parsed.modelConversation)
          ? (parsed.modelConversation as Array<{ role: string; content: string }>).map((m) => ({
              role: (m.role === "user" ? "user" : "character") as "user" | "character",
              content: typeof m.content === "string" ? m.content : "",
            }))
          : undefined;
      return {
        type: "feedback",
        score,
        strongPoints: Array.isArray(parsed.strongPoints) ? parsed.strongPoints : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        powerMove:
          parsed.powerMove ??
          "Try the observation + question formula: make a genuine comment about something in the shared moment, then ask one open question that can't be answered with just yes or no.",
        turningPoint: typeof parsed.turningPoint === "string" ? parsed.turningPoint : undefined,
        modelConversation,
        modelOptions:
          modelConversation && Array.isArray(parsed.modelOptions)
            ? parsed.modelOptions.map((opts) =>
                Array.isArray(opts)
                  ? opts.filter((o): o is string => typeof o === "string").slice(0, 3)
                  : []
              )
            : undefined,
      };
    } catch {
      return {
        type: "feedback",
        score: 5,
        strongPoints: ["You engaged with the scenario — that is always the first step."],
        improvements: [
          "Try showing genuine curiosity by asking one open question about the other person.",
        ],
        powerMove:
          "Try the observation + question formula: make a genuine comment about something in the shared moment, then ask one open question that can't be answered with just yes or no.",
      };
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
  practiceGoal?: string;
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

  const goalBlock = input.practiceGoal
    ? `\nTheir practice focus this session: ${input.practiceGoal}. Weight your feedback toward this skill.\n`
    : "";

  const prompt = `You are this person: ${input.personaPrompt}

Scenario: ${input.scenario}

How you behave: ${difficultyGuide}
${goalBlock}
Conversation so far:
${history}

${decisionBlock}

Return strict JSON only:

Continuing: { "type": "followup", "followupQuestion": "your natural response or question — stay in character, keep it short" }

Wrapping up:
{
  "type": "final",
  "score": integer 1–10 (rate: clarity, authenticity, specificity, confidence, emotional resonance),
  "strongPoints": ["1–2 items — each must cite a specific phrase from their answer that worked. Format: quote the phrase in quotation marks, then one sentence explaining why it landed."],
  "improvements": ["1–2 items — each must: (1) quote the specific phrase that weakened their response in quotation marks, (2) say briefly what was weak about it, (3) give a revised version of that exact phrase showing how it could land better"],
  "modelAnswer": "3–5 sentence ideal version of how they could have answered the original question — natural, human, specific, memorable",
  "modelConversation": only include if score is 7 or below — an array showing how this conversation could have gone from start to finish if they had been at their best. Write speaker lines as confident, clear, and specific. Write listener lines as they would naturally react to those stronger inputs. Keep each turn 2–4 sentences. Aim for 3–6 exchanges. Format: [{"role":"speaker","content":"..."},{"role":"listener","content":"..."},...]. Omit entirely if score is 8 or above.
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1400,
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
    const p = parsed as { type: "final"; score: number; strongPoints: string[]; improvements: string[]; modelAnswer: string; modelConversation?: Array<{ role: "speaker" | "listener"; content: string }> };
    const score = Math.min(10, Math.max(1, Math.round(Number(p.score))));
    return {
      type: "final",
      score,
      strongPoints: Array.isArray(p.strongPoints) ? p.strongPoints : [],
      improvements: Array.isArray(p.improvements) ? p.improvements : [],
      modelAnswer: p.modelAnswer ?? "",
      modelConversation: score <= 7 && Array.isArray(p.modelConversation) ? p.modelConversation : undefined,
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

// ─── Debate Lab ────────────────────────────────────────────────────────────

export type DebateMessage = { role: "user" | "opponent"; content: string };

export type DebateRequest = {
  motion: string;
  position: "for" | "against";
  opponentType: string;
  opponentPrompt: string;
  messages: DebateMessage[];
  exchangeCount: number;
  forceEnd?: boolean;
};

export type DebateStep =
  | { type: "response"; message: string; audienceReaction: number }
  | {
      type: "feedback";
      score: number;
      strongPoints: string[];
      improvements: string[];
      keyFallacy: string | null;
      missedArg: string;
      modelRebuttal: string;
    };

function fallbackDebateStep(exchangeCount: number): DebateStep {
  if (exchangeCount < 5) {
    return {
      type: "response",
      message:
        "That's an interesting point, but I'm not convinced. Can you back that up with something more concrete?",
      audienceReaction: 0,
    };
  }
  return {
    type: "feedback",
    score: 5,
    strongPoints: ["You engaged with the motion — committing to a position is the first step."],
    improvements: ["Try to lead each argument with a clear claim before explaining it."],
    keyFallacy: null,
    missedArg: "The strongest counterpoint went unaddressed — always name your opponent's best argument before rebutting it.",
    modelRebuttal: "A sharp rebuttal names the opponent's claim, concedes what's true in it, then pivots to the key flaw: 'You're right that X, but that ignores Y, which means...'",
  };
}

export async function conductDebate(input: DebateRequest): Promise<DebateStep> {
  if (!client) return fallbackDebateStep(input.exchangeCount);

  const opponentPosition = input.position === "for" ? "against" : "for";
  const history = input.messages
    .map((m) =>
      m.role === "user"
        ? `Debater (${input.position}): ${m.content}`
        : `You (${opponentPosition}): ${m.content}`
    )
    .join("\n\n");

  const mustEnd = input.forceEnd === true || input.exchangeCount >= 5;

  if (mustEnd) {
    const prompt = `You were debating the following motion: "${input.motion}"
You argued: ${opponentPosition.toUpperCase()} the motion
The debater argued: ${input.position.toUpperCase()} the motion

Full debate:
${history}

Now step out of the debate and give expert coaching on how the debater performed.

Evaluate: clarity of claims, use of evidence and reasoning, quality of rebuttals, logical consistency, and ability to handle pressure.

Return strict JSON with ALL of these fields:
{
  "type": "feedback",
  "score": integer 1-10 (1 = weak/confused arguments, 10 = sharp, evidence-backed, hard to counter),
  "strongPoints": ["1-2 items — each must quote or describe a specific moment where their argument was sharp or their reasoning was solid. Say what worked and why."],
  "improvements": ["1-2 items — each must: (1) identify a specific moment where their argument was weak or their logic slipped, (2) say briefly what went wrong, (3) show a stronger version"],
  "keyFallacy": "One logical fallacy they committed (e.g. ad hominem, strawman, false dichotomy, appeal to emotion) — describe it and quote the moment. If none, return null.",
  "missedArg": "The strongest counterpoint they either failed to make or failed to address. Be specific — name the argument and why it mattered.",
  "modelRebuttal": "Show how a skilled debater would have responded to the single hardest challenge the opponent posed. Write it as actual debate language, 2-4 sentences, sharp and specific."
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
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
        keyFallacy: string | null;
        missedArg: string;
        modelRebuttal: string;
      };
      const score = Math.min(10, Math.max(1, Math.round(Number(parsed.score))));
      return {
        type: "feedback",
        score,
        strongPoints: Array.isArray(parsed.strongPoints) ? parsed.strongPoints : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        keyFallacy: typeof parsed.keyFallacy === "string" ? parsed.keyFallacy : null,
        missedArg:
          typeof parsed.missedArg === "string"
            ? parsed.missedArg
            : "Address your opponent's strongest argument directly before rebutting it.",
        modelRebuttal:
          typeof parsed.modelRebuttal === "string"
            ? parsed.modelRebuttal
            : "Acknowledge what's true in their point, then pivot: 'You're right that X — but that actually supports my case, because...'",
      };
    } catch {
      return fallbackDebateStep(input.exchangeCount);
    }
  }

  // ── Ongoing exchange ───────────────────────────────────────────────────────
  const prompt = `You are debating the motion: "${input.motion}"
You are arguing ${opponentPosition.toUpperCase()} this motion.
${input.opponentPrompt}

Debate so far:
${history}

Respond now as the opponent. Keep your reply to 2-4 sentences. Be direct and specific — react to exactly what they just said. Push back hard but stay on topic. Do not concede the whole argument, but you may acknowledge a point if it genuinely lands.

Also rate how the audience is responding to the debater's most recent argument. audienceReaction is an integer from -3 to 3:
  -3 = audience clearly swaying against the debater (weak, confused, or fallacious argument)
  -1 to -2 = audience slightly unmoved or leaning away
  0 = neutral / too early to tell
  1 to 2 = audience leaning toward the debater
  3 = audience clearly persuaded by this argument (strong evidence, sharp logic)

Return strict JSON: { "message": "your in-character rebuttal", "audienceReaction": integer }`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 350,
    temperature: 0.7,
    system:
      "Return only valid JSON with keys message and audienceReaction. No markdown. No preamble.",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(extractText(response.content)) as { message?: string; audienceReaction?: number };
    return {
      type: "response",
      message: parsed.message?.trim() || "Interesting — but I need a stronger argument than that. What's your evidence?",
      audienceReaction: typeof parsed.audienceReaction === "number" ? Math.max(-3, Math.min(3, Math.round(parsed.audienceReaction))) : 0,
    };
  } catch {
    return {
      type: "response",
      message: "Interesting — but I need a stronger argument than that. What's your evidence?",
      audienceReaction: 0,
    };
  }
}

// ─── Debate Prep Room ──────────────────────────────────────────────────────

export type DebatePrepRequest = {
  motion: string;
  position: "for" | "against";
  opponentType: string;
};

export type DebatePrepResult = {
  keyArguments: string[];
  likelyCounters: Array<{ attack: string; rebuttal: string }>;
  watchOut: string;
};

export async function generateDebatePrep(input: DebatePrepRequest): Promise<DebatePrepResult> {
  if (!client) return fallbackDebatePrep(input);

  const prompt = `You are a debate coach preparing someone to argue ${input.position.toUpperCase()} the motion: "${input.motion}"
Their opponent is: ${input.opponentType}

Return strict JSON with exactly these fields:
{
  "keyArguments": ["3 strong arguments they should make, each 1-2 sentences. Concrete, specific, defensible."],
  "likelyCounters": [
    { "attack": "The most likely challenge this opponent will make", "rebuttal": "How to answer it effectively in 1-2 sentences" },
    { "attack": "Second most likely challenge", "rebuttal": "How to answer it" }
  ],
  "watchOut": "One-sentence warning about the most common mistake people make arguing this side of this motion — and how to avoid it"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    temperature: 0.45,
    system: "Return only valid JSON. No markdown. No preamble.",
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const parsed = JSON.parse(extractText(response.content)) as DebatePrepResult;
    return {
      keyArguments: Array.isArray(parsed.keyArguments) ? parsed.keyArguments.slice(0, 3) : fallbackDebatePrep(input).keyArguments,
      likelyCounters: Array.isArray(parsed.likelyCounters) ? parsed.likelyCounters.slice(0, 2) : fallbackDebatePrep(input).likelyCounters,
      watchOut: typeof parsed.watchOut === "string" ? parsed.watchOut : fallbackDebatePrep(input).watchOut,
    };
  } catch {
    return fallbackDebatePrep(input);
  }
}

function fallbackDebatePrep(input: DebatePrepRequest): DebatePrepResult {
  return {
    keyArguments: [
      `Make a clear claim about what arguing ${input.position} the motion means in practice.`,
      "Back it up with one concrete real-world example or data point.",
      "Pre-empt the strongest counterargument and show why it doesn't outweigh your position.",
    ],
    likelyCounters: [
      { attack: "Your opponent will challenge your core evidence or example.", rebuttal: "Acknowledge any limitations, then explain why the evidence still supports your case on balance." },
      { attack: "Your opponent will reframe the motion to make it harder to argue.", rebuttal: "Bring it back to the plain meaning of the motion and show why their reframe is a distraction." },
    ],
    watchOut: `Avoid making sweeping generalisations when arguing ${input.position} — ground every claim in something specific and provable.`,
  };
}
