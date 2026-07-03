export type StarterCard = {
  front: string;
  back: string;
  partOfSpeech: string;
  example: string;
  hook: string;
  synonyms: string;
};

export type StarterDeck = {
  id: string;
  name: string;
  description: string;
  cards: StarterCard[];
};

export const STARTER_DECKS: StarterDeck[] = [
  {
    id: "power-words",
    name: "Power Words",
    description: "High-value vocabulary for professionals. Words that signal precision and confidence.",
    cards: [
      { front: "Articulate", back: "Expressing ideas clearly and effectively; able to speak fluently.", partOfSpeech: "adjective / verb", example: "She was so articulate in the meeting that even the skeptics came around.", hook: "Art of making words land.", synonyms: "eloquent, fluent, lucid, expressive" },
      { front: "Concise", back: "Giving a lot of information clearly and in few words.", partOfSpeech: "adjective", example: "His concise summary saved the team 20 minutes.", hook: "Con + precise — cutting to the point.", synonyms: "brief, succinct, terse, pithy" },
      { front: "Candid", back: "Truthful and straightforward; not afraid of saying difficult things.", partOfSpeech: "adjective", example: "I appreciated her candid feedback — it was exactly what I needed.", hook: "Candy-coated truth — no filter.", synonyms: "frank, honest, direct, forthright" },
      { front: "Nuanced", back: "Accounting for subtle distinctions; not black and white.", partOfSpeech: "adjective", example: "His nuanced take on the policy showed he'd actually thought it through.", hook: "Seeing the shade between black and white.", synonyms: "subtle, layered, complex, refined" },
      { front: "Pragmatic", back: "Dealing with things sensibly based on practical considerations, not ideology.", partOfSpeech: "adjective", example: "She took a pragmatic approach — what would actually work, not what sounded best.", hook: "Pragma (Greek: deed) — about doing, not theorising.", synonyms: "practical, realistic, sensible, down-to-earth" },
      { front: "Leverage", back: "Use something to maximum advantage; the power gained from a lever.", partOfSpeech: "verb / noun", example: "We can leverage the existing network instead of building from scratch.", hook: "A lever multiplies force — leverage multiplies results.", synonyms: "exploit, utilise, capitalise on" },
      { front: "Calibrate", back: "Carefully adjust or assess a situation; fine-tune to get it right.", partOfSpeech: "verb", example: "You need to calibrate your message to the audience before you walk in.", hook: "Like tuning an instrument before a performance.", synonyms: "adjust, fine-tune, gauge, align" },
      { front: "Credibility", back: "The quality of being trusted and believed.", partOfSpeech: "noun", example: "She built credibility by always following through on what she said.", hook: "Cred = belief — the currency of trust.", synonyms: "trustworthiness, authority, reliability, standing" },
      { front: "Poise", back: "Graceful composure, especially in difficult situations.", partOfSpeech: "noun", example: "He answered the tough question with remarkable poise — unhurried, clear.", hook: "The opposite of flailing.", synonyms: "composure, equanimity, self-possession, calm" },
      { front: "Synthesise", back: "Combine elements into a coherent whole; turn separate ideas into one clear point.", partOfSpeech: "verb", example: "Can you synthesise the three reports into one clear recommendation?", hook: "Synthesis = putting things together to create something new.", synonyms: "integrate, combine, consolidate, distil" },
    ],
  },
  {
    id: "speak-up-words",
    name: "Speak Up Vocabulary",
    description: "Words that help you hold your position, push back clearly, and navigate high-stakes conversations.",
    cards: [
      { front: "Assert", back: "State a fact or belief confidently and forcefully.", partOfSpeech: "verb", example: "She asserted her position without aggression — clear and grounded.", hook: "As + sert (to put in) — putting your point firmly into the conversation.", synonyms: "declare, maintain, contend, affirm" },
      { front: "Deferential", back: "Showing respect by giving way to someone else's wishes or authority.", partOfSpeech: "adjective", example: "His deferential tone made him seem less confident than his ideas deserved.", hook: "When deference becomes a habit, authority notices.", synonyms: "submissive, yielding, compliant, respectful" },
      { front: "Reframe", back: "Present or think about something in a new or different way.", partOfSpeech: "verb", example: "Instead of defending the mistake, she reframed it as a learning that changed the approach.", hook: "The frame changes what you see inside it.", synonyms: "reposition, recast, reconceptualise, shift" },
      { front: "Hedge", back: "Qualify a statement to avoid committing fully; speak vaguely to reduce risk.", partOfSpeech: "verb", example: "He hedged so much that nobody knew what he actually thought.", hook: "A hedge in a garden blurs the boundary. Same in speech.", synonyms: "qualify, equivocate, prevaricate, soften" },
      { front: "Forthright", back: "Direct and outspoken; saying things plainly and without hesitation.", partOfSpeech: "adjective", example: "A forthright answer earned more respect than a carefully managed one.", hook: "Forth + right — moving right forward, not sideways.", synonyms: "direct, candid, blunt, outspoken" },
      { front: "Substantiate", back: "Provide evidence to support a claim; back something up.", partOfSpeech: "verb", example: "If you're going to challenge that number, you need to substantiate your alternative.", hook: "Sub + stance + iate — give it substance.", synonyms: "support, validate, corroborate, back up" },
      { front: "Mitigate", back: "Lessen the severity or seriousness of something.", partOfSpeech: "verb", example: "The new policy doesn't solve the problem but it mitigates the worst outcomes.", hook: "Make the damage smaller — not gone, but smaller.", synonyms: "reduce, lessen, alleviate, temper" },
      { front: "Compelling", back: "Evoking strong interest or attention; convincing.", partOfSpeech: "adjective", example: "The most compelling argument in the room was also the shortest.", hook: "Compel = force — a compelling argument moves you.", synonyms: "persuasive, powerful, convincing, forceful" },
      { front: "Equivocate", back: "Use ambiguous language to avoid committing to a position.", partOfSpeech: "verb", example: "Stop equivocating — tell me what you actually think.", hook: "Equi + vocal — equal voice for both sides, committing to neither.", synonyms: "hedge, waffle, prevaricate, stall" },
      { front: "Undermine", back: "Erode or weaken something, usually gradually and from within.", partOfSpeech: "verb", example: "Agreeing in the meeting then disagreeing in the corridor undermines your credibility.", hook: "Mining under the foundation — the building falls later, not now.", synonyms: "weaken, erode, subvert, sabotage" },
    ],
  },
  {
    id: "sharp-thinking",
    name: "Sharp Thinking",
    description: "Vocabulary for reasoning clearly, evaluating arguments, and thinking out loud with precision.",
    cards: [
      { front: "Fallacy", back: "A mistaken belief or flawed reasoning; a deceptive or unsound argument.", partOfSpeech: "noun", example: "Pointing out the fallacy in his logic defused the whole debate.", hook: "False + acy — the flavour of false.", synonyms: "error, misconception, flaw, sophism" },
      { front: "Premise", back: "A statement assumed to be true as the basis for an argument.", partOfSpeech: "noun", example: "Before we argue, let's agree on the premise — are we even solving the right problem?", hook: "The premise is the ground you're standing on.", synonyms: "assumption, basis, starting point, axiom" },
      { front: "Ambiguous", back: "Open to more than one interpretation; not clearly defined.", partOfSpeech: "adjective", example: "The brief was so ambiguous that three teams built three different things.", hook: "Ambi = both — going in two directions at once.", synonyms: "unclear, vague, equivocal, nebulous" },
      { front: "Infer", back: "Deduce or conclude from evidence rather than from explicit statement.", partOfSpeech: "verb", example: "From the silence in the room, she inferred that nobody actually agreed.", hook: "Reading between the lines.", synonyms: "deduce, conclude, derive, gather" },
      { front: "Extrapolate", back: "Extend known data to an unknown situation; project beyond available evidence.", partOfSpeech: "verb", example: "We can extrapolate from the pilot data, but the assumptions need to be named.", hook: "Extra + polate (from poll = end point) — reaching beyond the data edge.", synonyms: "project, extend, infer, forecast" },
      { front: "Paradox", back: "A seemingly contradictory statement that may nonetheless be true.", partOfSpeech: "noun", example: "The paradox of choice: more options often lead to worse decisions.", hook: "Para (beyond) + doxa (belief) — beyond what seems believable.", synonyms: "contradiction, irony, oxymoron" },
      { front: "Correlation", back: "A mutual relationship or connection between two things (not the same as causation).", partOfSpeech: "noun", example: "There's a correlation between the two, but that doesn't mean one causes the other.", hook: "Correlation vs causation — the most important distinction in data.", synonyms: "relationship, association, connection, link" },
      { front: "Scrutinise", back: "Examine or inspect closely and thoroughly.", partOfSpeech: "verb", example: "The assumptions behind that model haven't been scrutinised nearly enough.", hook: "Scrute (Latin: trash) — originally sorting through rubbish for useful things.", synonyms: "examine, inspect, analyse, dissect" },
      { front: "Iterative", back: "Involving repetition of a process with the goal of improvement each time.", partOfSpeech: "adjective", example: "The product got better through an iterative process — not by getting it right the first time.", hook: "Iter (Latin: journey) — a journey taken again and again.", synonyms: "incremental, repeated, progressive, stepwise" },
      { front: "Cognitive", back: "Relating to mental processes of knowing, learning, and understanding.", partOfSpeech: "adjective", example: "The cognitive load of the meeting was exhausting — too many open threads.", hook: "Cogito ergo sum — I think, therefore I am.", synonyms: "mental, intellectual, psychological, rational" },
    ],
  },
];
