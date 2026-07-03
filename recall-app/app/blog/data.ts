export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "how-spaced-repetition-works",
    title: "How Spaced Repetition Actually Works (And Why Timing Is Everything)",
    description:
      "Most people review things too early or too late. Spaced repetition finds the optimal window — and the science behind it changes how you should think about learning anything.",
    date: "2025-06-12",
    readTime: "5 min read",
    category: "Learning Science",
    excerpt:
      "Most people review things too early or too late. Spaced repetition finds the optimal window — and the science behind it changes how you should think about learning anything.",
    content: [
      {
        type: "p",
        text: "The problem most people have isn't that they don't study — it's that they study at the wrong time. Review something the moment after you've learned it and you're doing almost no work. The memory is fresh; you haven't forgotten anything yet. Review it ten years later and you've forgotten so much that starting over is nearly as much effort as learning it the first time.",
      },
      {
        type: "h2",
        text: "The Spacing Effect",
      },
      {
        type: "p",
        text: "Hermann Ebbinghaus, a 19th-century psychologist, discovered something counterintuitive about memory: the optimal moment to review something is just before you're about to forget it. Study it too early and the review is wasted. Study it too late and the memory has already decayed.",
      },
      {
        type: "p",
        text: "This is the spacing effect, and it's one of the most replicated findings in cognitive science. Distributed practice — spreading reviews out over time — consistently outperforms massed practice (cramming) for long-term retention. The difference isn't small. Studies put the advantage at two to three times better recall after a month.",
      },
      {
        type: "h2",
        text: "How the SM-2 Algorithm Works",
      },
      {
        type: "p",
        text: "The SM-2 algorithm, developed by Piotr Woźniak in the late 1980s, operationalises the spacing effect. Each card in a spaced repetition system has two key properties: an interval (how many days until the next review) and an ease factor (how easy the card is for you specifically).",
      },
      {
        type: "p",
        text: "When you review a card and grade your recall, the algorithm adjusts both values. A card you found easy gets a longer interval — maybe 10 days, then 25, then 60. A card you struggled with gets a shorter interval until it stabilises. Over time, the algorithm builds a personalised review schedule calibrated to your specific memory.",
      },
      {
        type: "p",
        text: "The result is efficient: you're not reviewing easy cards too often, and you're not forgetting hard cards because you reviewed them too late.",
      },
      {
        type: "h2",
        text: "Why Timing Matters More Than You Think",
      },
      {
        type: "p",
        text: "When a memory is strong, reviewing it doesn't do much. The neurological work happens when you have to effortfully retrieve something — when you feel the friction of almost-but-not-quite remembering. That's the consolidation moment. Spaced repetition is engineered to put you in that state repeatedly, across months and years.",
      },
      {
        type: "p",
        text: "This is why passive review — rereading, highlighting, watching the same video again — produces far less durable memory than active retrieval under a spaced schedule. Recognition feels like learning. Effortful recall actually is.",
      },
      {
        type: "h2",
        text: "What This Means in Practice",
      },
      {
        type: "p",
        text: "Most vocabulary apps and flashcard tools ask you to review everything, all at once, whenever you feel like it. That's the wrong model. What works is: review each item at its optimal interval, grade your recall honestly, and trust the system to schedule the next session.",
      },
      {
        type: "p",
        text: "Recall is built around this. Every card has its own timeline. The app surfaces what's due today — not what you feel like reviewing, not the entire deck. Just what your memory needs, right now. That's not magic. It's mathematics applied to how your brain actually works.",
      },
    ],
  },
  {
    slug: "why-you-go-blank-in-conversations",
    title: "Why You Go Blank in Important Conversations — And How to Fix It",
    description:
      "You had the answer. The words were right there. Then someone was watching and they were gone. This isn't a confidence problem — it's a retrieval problem, and there's a specific way to address it.",
    date: "2025-06-19",
    readTime: "6 min read",
    category: "Communication",
    excerpt:
      "You had the answer. The words were right there. Then someone was watching and they were gone. This isn't a confidence problem — it's a retrieval problem, and there's a specific way to address it.",
    content: [
      {
        type: "p",
        text: "You know the feeling. The question lands. The answer is right there — you can almost feel it — and then it's gone. You say something vague, or nothing at all, and the moment passes. Walking home, you find the sentence you should have said.",
      },
      {
        type: "p",
        text: "Most people frame this as a confidence problem. It isn't. It's a retrieval problem. And there's a specific way to fix it.",
      },
      {
        type: "h2",
        text: "Why Pressure Affects Recall",
      },
      {
        type: "p",
        text: "When you're under social pressure — an interview, a pitch, a conversation with someone you want to impress — your brain's threat-detection system activates. Cortisol and adrenaline narrow your attention. Resources that would normally support open-ended thinking get redirected toward monitoring the situation.",
      },
      {
        type: "p",
        text: "This is a feature, not a bug. In an actual emergency, tunnel vision is useful. In a conversation, it works against you. The result is retrieval failure. The knowledge is there, encoded in memory. But the retrieval pathway — the one that runs from 'I want to say something about X' to the actual words — is narrowed by stress.",
      },
      {
        type: "h2",
        text: "Why Practice Helps (But Only the Right Kind)",
      },
      {
        type: "p",
        text: "You can't make yourself less nervous by willing it. What you can do is reduce the cognitive load of the moment so that retrieval still works even when attention is impaired.",
      },
      {
        type: "p",
        text: "That's what deliberate practice does. When you've rehearsed a response to a scenario enough times — not memorised a script, but practiced the shape of an answer — retrieving it under pressure costs less cognitive resources. It's already close to the surface.",
      },
      {
        type: "p",
        text: "The key distinction is between practice that happens in conditions that match the actual situation and practice that doesn't. Rehearsing in your head is fine. Rehearsing out loud, with realistic scenarios, with some kind of feedback, is better by a significant margin.",
      },
      {
        type: "h2",
        text: "What Real Practice Looks Like",
      },
      {
        type: "p",
        text: "Effective preparation for high-stakes conversations has three components: realistic scenarios, honest assessment, and repetition over time.",
      },
      {
        type: "ul",
        items: [
          "Realistic scenarios — because context matters. Your brain encodes memories in context. A retrieval cue (a job interview question, an awkward silence at a networking event) is more likely to activate the right memory if the two were encoded in similar conditions.",
          "Honest assessment — because you can't fix what you don't know is wrong. Feeling like you did fine doesn't mean you did fine. You need someone — or something — to tell you where you hedged, where you lost clarity, where the logic broke down.",
          "Repetition over time — because a single practice session isn't enough. Memory consolidates during sleep. One good practice the night before is worth less than five spread over two weeks.",
        ],
      },
      {
        type: "h2",
        text: "The Room Where You Rehearse",
      },
      {
        type: "p",
        text: "Most people try to manage anxiety before high-stakes moments with breathing techniques or positive self-talk. Those things have their place. But the deeper fix is eliminating the gap between what you know and what you can access under pressure.",
      },
      {
        type: "p",
        text: "You close that gap by practicing — specifically, honestly, and often enough that the retrieval pathways are well-worn before you need them.",
      },
      {
        type: "p",
        text: "The room where you rehearse is the thing that determines how you perform in the room that counts.",
      },
    ],
  },
  {
    slug: "the-forgetting-curve",
    title: "The Forgetting Curve: Why You Lose 70% of New Information Within 24 Hours",
    description:
      "Ebbinghaus discovered in 1885 that we forget most new information within a day. The implications for how you should study, practice, and retain anything are significant.",
    date: "2025-06-26",
    readTime: "4 min read",
    category: "Learning Science",
    excerpt:
      "Ebbinghaus discovered in 1885 that we forget most new information within a day. The implications for how you should study, practice, and retain anything are significant.",
    content: [
      {
        type: "p",
        text: "In 1885, Hermann Ebbinghaus memorised lists of nonsense syllables and then tested his own recall at regular intervals. The results formed what is now called the forgetting curve — and they should make you rethink how you study.",
      },
      {
        type: "h2",
        text: "What the Curve Shows",
      },
      {
        type: "p",
        text: "Within one hour of learning something new, you'll forget roughly 50% of it. Within 24 hours, that figure rises to around 70%. By a week later, without any review, you'll retain less than 25% of what you originally learned.",
      },
      {
        type: "p",
        text: "This isn't a personal failing. It's the default setting of human memory. Information that isn't used, revisited, or connected to existing knowledge gets deprioritised. Your brain treats it as noise, and noise gets cleared.",
      },
      {
        type: "h2",
        text: "Why Passive Review Doesn't Help Much",
      },
      {
        type: "p",
        text: "Re-reading notes feels productive because it's familiar. You recognise the content; the words look right. But recognition and recall are different cognitive processes. Recognition is easy — of course you remember it when you're looking at it. Recall is what happens when the book is closed and you need the information.",
      },
      {
        type: "p",
        text: "Passive review — rereading, highlighting, listening again — produces recognition, not recall. It feels like studying, but it doesn't produce the neurological changes that make information durable.",
      },
      {
        type: "h2",
        text: "What Actually Works",
      },
      {
        type: "p",
        text: "The antidote to the forgetting curve is active retrieval — specifically, attempting to recall information just before you forget it, and spacing those attempts over increasing intervals.",
      },
      {
        type: "p",
        text: "When you attempt retrieval and succeed with some effort — that near-miss feeling of pulling something back from the edge of forgetting — you strengthen the memory trace more than any passive review can. This is called the testing effect, and it's one of the most robust findings in memory research.",
      },
      {
        type: "p",
        text: "Spaced repetition systems operationalise this. They track what you've learned, estimate when you'll forget it, and surface items for review at the optimal moment. The work you do at each review is retrieval, not recognition.",
      },
      {
        type: "h2",
        text: "The Compounding Effect",
      },
      {
        type: "p",
        text: "One of the underappreciated consequences of the forgetting curve is how quickly small losses compound. If you forget 70% of a new language lesson each day and don't review, you retain almost nothing within a week. But if you review each item at the right interval, retention stays above 90% indefinitely — and review sessions get shorter over time as intervals lengthen.",
      },
      {
        type: "p",
        text: "Long-term memory isn't about learning something once and hoping it sticks. It's about creating a system that revisits what you're building, on a schedule that matches how memory actually decays. The curve bends the moment you stop fighting your biology and start working with it.",
      },
    ],
  },
  {
    slug: "how-to-build-vocabulary-that-sticks",
    title: "How to Build Vocabulary That Actually Sticks (It's Not What You Think)",
    description:
      "Reading widely won't build your vocabulary the way most people believe. The gap between passive exposure and active command is larger than almost any learner realises — and there's a better way.",
    date: "2025-07-03",
    readTime: "5 min read",
    category: "Vocabulary",
    excerpt:
      "Reading widely won't build your vocabulary the way most people believe. The gap between passive exposure and active command is larger than almost any learner realises — and there's a better way.",
    content: [
      {
        type: "p",
        text: "Reading widely is good advice. But it won't build your vocabulary the way most people think it will.",
      },
      {
        type: "h2",
        text: "The Passive vs Active Gap",
      },
      {
        type: "p",
        text: "Encountering a new word in context helps you absorb its rough meaning. If you see 'vitiate' used twice in a novel, you'll probably figure out that it means to weaken or impair. But 'figuring it out from context' is surface-level encoding. The word is loosely tethered — available in the context of the book, fragile everywhere else.",
      },
      {
        type: "p",
        text: "The gap between passive exposure and active command is larger than most learners realise. You can understand hundreds of words that you'd never spontaneously reach for in speech or writing. That's because comprehension and production draw on different pathways. Passive recognition builds a reading vocabulary. Active retrieval builds a speaking and writing vocabulary.",
      },
      {
        type: "h2",
        text: "Why Active Recall Changes This",
      },
      {
        type: "p",
        text: "When you see a word in reading, your brain processes it automatically. When you're asked to retrieve the word and its meaning from scratch — before you see it — you do something much harder. You reconstruct it.",
      },
      {
        type: "p",
        text: "That reconstruction process is expensive neurologically, and that expense is exactly the point. The effort of retrieval is what consolidates the memory. Words you've tested yourself on are available differently than words you've merely read — they're faster to access, more likely to surface in the right moment, more reliably at your disposal when it counts.",
      },
      {
        type: "h2",
        text: "Context and Connection",
      },
      {
        type: "p",
        text: "There's a second variable: how a word connects to what you already know. Isolated definitions decay. Words that arrive with a memorable example sentence — especially one that creates a concrete image — attach to existing semantic networks and stay far longer.",
      },
      {
        type: "p",
        text: "This is why the best flashcard practice isn't a word on one side and a bare definition on the other. It's a word, a vivid example, and ideally a personal anchor — a context you can picture.",
      },
      {
        type: "h2",
        text: "Beyond Individual Words",
      },
      {
        type: "p",
        text: "Vocabulary isn't just a list of words. It's a web of associations, collocations (words that travel together), registers (formal vs. informal), and connotations. A word like 'frugal' sits close to 'thrifty' but not to 'cheap' — understanding the difference between them is more useful than knowing what either one means in isolation.",
      },
      {
        type: "p",
        text: "The goal of vocabulary building isn't to increase your word count. It's to increase the precision and range of what you can express. That's a different target, and it shapes how you practice: not drilling isolated words, but building connected, usable knowledge — the kind you can reach for without thinking.",
      },
    ],
  },
  {
    slug: "small-talk-is-a-learnable-skill",
    title: "Small Talk Isn't Small: Why Conversation Fluency Is a Learnable Skill",
    description:
      "Most people who struggle socially believe their problem is confidence. Research suggests the real issue is cognitive load — and that conversation fluency, like any skill, can be deliberately trained.",
    date: "2025-07-10",
    readTime: "6 min read",
    category: "Social Skills",
    excerpt:
      "Most people who struggle socially believe their problem is confidence. Research suggests the real issue is cognitive load — and that conversation fluency, like any skill, can be deliberately trained.",
    content: [
      {
        type: "p",
        text: "Most people who struggle in social situations believe their problem is confidence. The fix they seek is usually something internal: think differently, feel less anxious, project more self-assurance. The problem with that framing is that it misidentifies what's actually hard about conversation.",
      },
      {
        type: "h2",
        text: "What Makes Conversations Hard",
      },
      {
        type: "p",
        text: "Conversation is a real-time, bidirectional cognitive task. You're listening, processing, formulating a response, monitoring tone, tracking how the other person is reacting, and deciding when to speak — all simultaneously.",
      },
      {
        type: "p",
        text: "When any one of those channels is overloaded, the others suffer. For people who find social situations stressful, the monitoring channel tends to run hot. A significant portion of cognitive resources goes toward self-evaluation ('How am I coming across? Was that weird?') at the expense of actually engaging with what the other person is saying. The result feels like a confidence problem. It's actually a load problem.",
      },
      {
        type: "h2",
        text: "The Three Phases",
      },
      {
        type: "p",
        text: "Most conversations have a recognisable structure: an opening, a sustained middle, and a close. Struggles tend to cluster in specific phases.",
      },
      {
        type: "ul",
        items: [
          "Openings — the moment of initiating with a stranger, or knowing what to say first in a group. The blank that arrives when a room expects you to speak.",
          "Sustaining — starting a conversation but not being able to keep it alive past initial pleasantries. Running out of road after the first topic.",
          "Closing — letting conversations trail off awkwardly, or leaving without a natural end. The lingering feeling that the exit was wrong.",
        ],
      },
      {
        type: "p",
        text: "Each of these is a specific skill, not a personality characteristic. And like any skill, each improves with deliberate practice in conditions that match real situations.",
      },
      {
        type: "h2",
        text: "What Practice Actually Requires",
      },
      {
        type: "p",
        text: "Generic social advice — 'ask more questions,' 'listen actively,' 'be genuinely interested' — is correct but not sufficient. The gap between knowing the principle and executing it naturally in the moment is closed by practice, not by understanding.",
      },
      {
        type: "p",
        text: "Effective practice has three qualities: it's realistic (the scenarios resemble real situations you encounter), it involves production (you're not just reading about it), and it includes feedback (something tells you what worked and what didn't). Most people get none of these. They think about what they should have said after the fact. They read articles. They feel anxious. They avoid the situations that would give them practice.",
      },
      {
        type: "h2",
        text: "The Compounding Effect",
      },
      {
        type: "p",
        text: "Conversation skills compound. Each interaction where you successfully open, sustain, or close a conversation builds a small amount of automaticity — a response that required deliberate attention starts requiring less. Over months and years, the load drops. What was effortful becomes background.",
      },
      {
        type: "p",
        text: "This is why people who've spent years in high-social environments — salespeople, teachers, community organisers — seem to effortlessly navigate situations that others find exhausting. They're not a different personality type. They've accumulated more practice at a lower load per interaction.",
      },
      {
        type: "p",
        text: "The skill is learnable. What it requires is structured practice, honest feedback, and enough repetition for fluency to develop. That's not a personality fix. It's a training problem — and training problems have solutions.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
