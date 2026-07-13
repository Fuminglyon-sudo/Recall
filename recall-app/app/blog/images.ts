// Cover image for each blog post, used on the listing grid and OG metadata.
// Images are sourced from existing app assets — no additional uploads needed.
export const POST_IMAGES: Record<string, string> = {
  "how-spaced-repetition-works":        "/deck_learning.png",
  "why-you-go-blank-in-conversations":  "/scenerios/speak-up-awkward-question.webp",
  "the-forgetting-curve":               "/today_card.png",
  "how-to-build-vocabulary-that-sticks":"/cards_new.png",
  "small-talk-is-a-learnable-skill":    "/scenerios/lab-networking.webp",
  "how-to-stop-saying-um":              "/scenerios/speak-up-cold-start.webp",
  "the-elevator-pitch-formula":         "/scenerios/lab-elevator.webp",
  "how-to-think-on-your-feet":          "/scenerios/speak-up-big-decision.webp",
  "vocabulary-and-speaking-confidence": "/scenerios/speak-up-share-opinion.webp",
  "how-to-practice-speaking-alone":     "/scenerios/speak-up-idea-pitch.webp",
  "how-to-rescue-a-dying-conversation": "/scenerios/lab-dinner-party.webp",
  "imposter-syndrome-at-work":          "/scenerios/speak-up-career-pivot.webp",
  "how-to-make-new-words-stick":        "/scenerios/lab-coffee.webp",
  "ten-minutes-to-sharper-communication":"/dashboard.png",
  "what-your-voice-reveals":            "/scenerios/speak-up-interview-intro.webp",
};

export const CATEGORY_STYLES: Record<string, { color: string; bg: string }> = {
  "Learning Science":    { color: "#6ee7b7", bg: "rgba(52,211,153,0.12)"  },
  "Communication":       { color: "#93c5fd", bg: "rgba(147,197,253,0.12)" },
  "Vocabulary":          { color: "#c4b5fd", bg: "rgba(196,181,253,0.12)" },
  "Social Skills":       { color: "#fcd34d", bg: "rgba(252,211,77,0.12)"  },
  "Speaking Confidence": { color: "#fda4af", bg: "rgba(253,164,175,0.12)" },
  "Career & Confidence": { color: "#67e8f9", bg: "rgba(103,232,249,0.12)" },
  "Conversation Skills": { color: "#86efac", bg: "rgba(134,239,172,0.12)" },
};
